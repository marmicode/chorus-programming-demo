export const meta = {
  name: "charted-autopilot",
  description:
    "Loops the Charted Coding scaffold/red/green/extra task cycle, committing after each phase, until the design doc (or the given waypoint) is fully done or the loop is stuck",
  phases: [
    { title: "Progress", detail: "deterministic design doc parsing" },
    { title: "Next step", detail: "scaffold, red, green, extra task, or done" },
  ],
};

// Workflow scripts have no filesystem access, so the design doc is parsed by this script.
// Paths are relative to the repository root.
const PROGRESS_SCRIPT = "tools/charted/charted-progress.mjs";
const SKILLS_DIR = ".agents/skills";

// Lets the charted loop tell its own commits apart from the ones it should resume after.
const COMMIT_TRAILER = "Charted-Loop: autopilot";

// A phase that runs twice in a row without moving the design doc forward means we are stuck.
const MAX_ATTEMPTS_PER_STEP = 2;

const designDocPath = args?.designDocPath;
// Optional: only work on this waypoint instead of the whole design doc.
// A waypoint is a "PR#N" section of the design doc's PR Plan, not a GitHub pull request.
const rawPr = String(args?.waypoint ?? "").trim();

async function main() {
  validateArgs();
  const onlyPrNumber = rawPr ? parsePrNumber(rawPr) : null;

  let progress = await computeProgress("initial");
  logProgress(progress);

  const steps = [];
  let current = null;
  let iteration = 0;

  while (true) {
    iteration++;

    const pr = findNextPr(progress, onlyPrNumber);
    if (!pr) {
      log(
        onlyPrNumber === null
          ? `Design doc fully done ✅`
          : `Waypoint #${onlyPrNumber} done ✅`,
      );
      return { status: "done", steps };
    }

    const next = await computeNextStep(pr);
    if (!next) {
      return { status: "aborted", steps };
    }
    log(`Waypoint #${pr.number} — next step: ${next.step} (${next.reason})`);

    // "extra task" legitimately repeats, one task at a time: only count attempts that checked nothing off.
    const isSameAsCurrent =
      current?.waypoint === pr.number &&
      current.step === next.step &&
      current.checkedOff === countCheckedOff(pr);
    if (isSameAsCurrent && current.attempt >= MAX_ATTEMPTS_PER_STEP) {
      log(
        `Stuck on ${phaseTitle(next.step, pr)} after ${current.attempt} attempts: ${next.reason}`,
      );
      return { status: "stuck", stuckOn: current, reason: next.reason, steps };
    }
    current = {
      waypoint: pr.number,
      step: next.step,
      attempt: isSameAsCurrent ? current.attempt + 1 : 1,
      checkedOff: countCheckedOff(pr),
    };

    if (next.step === "done") {
      // The design doc is the source of truth: keep spinning on this PR until it agrees (or we are stuck).
      log(
        `Waypoint #${pr.number} has nothing left to do but the design doc does not mark it as done — checking again`,
      );
    } else {
      const result = await runPhase(next.step, pr, next.testFiles);
      if (result?.failed?.length) {
        log(
          `Waypoint #${pr.number} — ${next.step} left ${result.failed.length} test(s) behind: ${result.failed.map((failure) => failure.testTitle).join(", ")}`,
        );
      }
      const commit = await commitPhase(next.step, pr, result);
      steps.push({ ...current, ...result, commit });
    }

    // Scaffold and red never edit the design doc.
    if (next.step !== "scaffold" && next.step !== "red") {
      progress = await computeProgress(`after-iteration-${iteration}`);
      logProgress(progress);
    }
  }
}

function validateArgs() {
  if (!designDocPath) {
    throw new Error("charted-autopilot: args.designDocPath is required");
  }
  if (rawPr && !Number.isInteger(parsePrNumber(rawPr))) {
    throw new Error(
      `charted-autopilot: args.waypoint must be a waypoint number or omitted (whole design doc), got ${JSON.stringify(args?.waypoint)}`,
    );
  }
}

// Accepts 3, "3", "#3", "PR#3", "PR 3"... and rejects anything without a number.
function parsePrNumber(value) {
  const match = String(value ?? "").match(/\d+/);
  return match ? Number(match[0]) : NaN;
}

async function computeProgress(label) {
  const progress = await agent(
    `Run exactly this command and nothing else:\n\nnode ${PROGRESS_SCRIPT} ${JSON.stringify(designDocPath)}\n\nIt prints a single JSON object. Report that JSON object verbatim as your structured output — do not read the design doc yourself, and do not add, drop, reorder, or reword anything. If the command fails, stop and report the error instead of guessing.`,
    {
      schema: PROGRESS_SCHEMA,
      effort: "low",
      phase: "Progress",
      label: `progress:${label}`,
    },
  );
  if (!progress?.prs?.length) {
    throw new Error(
      `charted-autopilot: no waypoint (PR#N) sections found in ${designDocPath}`,
    );
  }
  return progress;
}

function logProgress(progress) {
  log(
    progress.prs
      .map(
        (pr) =>
          `${pr.done ? "✅" : "🚧"} Waypoint #${pr.number} — ${pr.title} (tests ${pr.tests.filter((test) => test.done).length}/${pr.tests.length}, tasks ${pr.tasks.done}/${pr.tasks.total})`,
      )
      .join("\n"),
  );
}

function findNextPr(progress, onlyPrNumber) {
  if (onlyPrNumber === null) {
    return progress.prs.find((pr) => !pr.done);
  }

  const pr = progress.prs.find((pr) => pr.number === onlyPrNumber);
  if (!pr) {
    throw new Error(
      `charted-autopilot: waypoint #${onlyPrNumber} not found in ${designDocPath} (found: ${progress.prs.map((pr) => pr.number).join(", ")})`,
    );
  }
  return pr.done ? undefined : pr;
}

function countCheckedOff(pr) {
  return pr.tests.filter((test) => test.done).length + pr.tasks.done;
}

async function computeNextStep(pr) {
  const pending = pendingTests(pr);
  return await agent(
    `Design doc: ${designDocPath}. You are deciding the next Charted Coding step for ${waypointName(pr)}. This is a READ-ONLY investigation: do not edit, create, or run anything.

Read the PR#${pr.number} section of the design doc (its Tasks and Testing Strategy), then inspect the codebase.

Tests still pending (🚧) in the design doc:
${pending.length ? bullets(pending) : "(none — this PR has no pending test)"}

Tasks still unchecked (- [ ]) in the design doc:
${pr.tasks.pending.length ? bullets(pr.tasks.pending) : "(none — this PR has no unchecked task)"}

Pick exactly one step, checking in this order:

1. "scaffold" — scaffolding is not done: a pending test has no matching it.todo("{test_title}", ...) or it("{test_title}", ...) in any test file (titles match case-insensitively), or a production file/class/function/component that the Tasks require does not exist yet.
2. "red" — scaffolding is done and AT LEAST ONE pending test is an it.todo whose body is empty or contains only step-by-step comments (no executable test code).
3. "green" — scaffolding is done and EVERY pending test has real test code (still it.todo, or already it(...) but not yet checked off in the design doc).
4. "extra task" — scaffolding is done, there is no pending test, and at least one Task is still unchecked.
5. "done" — there is no pending test and no unchecked Task.

Report the step, a one-line reason, and testFiles: the paths of every test file holding tests of this waypoint (empty if none exist yet).`,
    {
      schema: STEP_SCHEMA,
      phase: "Next step",
      label: `next-step:waypoint${pr.number}`,
    },
  );
}

async function runPhase(step, pr, testFiles) {
  return await agent(phasePrompt(step, pr, testFiles), {
    schema: PHASE_RESULT_SCHEMA,
    phase: phaseTitle(step, pr),
    label: `${step}:waypoint${pr.number}`,
  });
}

function phasePrompt(step, pr, testFiles) {
  const files = testFiles.length
    ? `Test files of this waypoint:\n${bullets(testFiles)}`
    : `Locate the test files of this waypoint yourself.`;
  const pending = bullets(pendingTests(pr));

  switch (step) {
    case "scaffold":
      return `${skill("charted-scaffold")} with designDocPath=${designDocPath} and prNumber=${pr.number} — the design doc's PR#${pr.number} section, i.e. ${waypointName(pr)}, not a GitHub pull request number. Scaffold the whole waypoint: every WIP production item its Tasks require, and one it.todo per scenario of its Testing Strategy. Do not write real test code and do not implement any behavior. Report success, the scaffolded test titles (tests), and a one-line summary.`;
    case "red":
      return `${skill("charted-red")} with designDocPath=${designDocPath}, for ${waypointName(pr)}.

The skill handles one test of one file at a time: apply it repeatedly, for each test file, until EVERY pending test of this waypoint has real test code. Do not stop after the first test or the first file.

Pending tests of this waypoint:
${pending}

${files}

Keep every test as it.todo (never enable one), never write or change production code, and never edit the design doc. Before finishing, re-read the test files and confirm no pending test is left empty or comment-only. Report success (true only if all of them are implemented), the titles you implemented (tests), any you could not implement with reasons (failed), and a one-line summary.`;
    case "green":
      return `${skill("charted-green")} with designDocPath=${designDocPath}, for ${waypointName(pr)}.

Apply it to each test file in turn until EVERY pending test of this waypoint is green: activate the tests strictly one at a time (it.todo -> it), implement just enough for that test to pass, flip its design doc markers per the skill's rules, then move to the next one. Do not stop after the first test or the first file.

Pending tests of this waypoint:
${pending}

${files}

Only touch tests that belong to this waypoint. Use the wallaby-cli skill or the Wallaby MCP tools (mcp__wallaby__*, load via ToolSearch if deferred) to run tests; fall back to the project's normal test command only if Wallaby is unavailable. Report success (true only if all pending tests are green), the titles that turned green (tests), any that could not be made to pass with reasons (failed), and a one-line summary.`;
    case "extra task":
      return `Design doc: ${designDocPath} — the single source of truth. Every test of ${waypointName(pr)} is green, but some of its Tasks are still unchecked.

Unchecked tasks of this waypoint, in design doc order:
${bullets(pr.tasks.pending)}

Complete the NEXT remaining task — the first one of that list — and only that one. Take more than one only if it is impossible to complete it on its own (e.g. tasks that cannot compile, pass, or make sense without each other), and then take the smallest group that works. Leave every other task for a later run.

- If the task turns out to be already done, verify it and just check it off.
- Implement only what the task and the design doc ask for, nothing more.
- Remove the wiprecation (@deprecated 🚧 work in progress) from the items that are now done and safe to use.
- Keep every existing test passing. Use the wallaby-cli skill or the Wallaby MCP tools (mcp__wallaby__*, load via ToolSearch if deferred) to run tests; fall back to the project's normal test command only if Wallaby is unavailable.
- Then update the design doc: flip \`- [ ]\` to \`- [x]\` for each task you completed, and flip this waypoint's \`🚧\` to \`✅\` in its PR#${pr.number} title if all its Tasks and Testing Strategy items are now checked off. Never reword, reorder, add, or remove anything else in the design doc.

Report success (true only if at least one task is completed and checked off), the completed tasks exactly as written in the design doc (tasks), and a one-line summary.`;
  }
}

function waypointName(pr) {
  return `waypoint #${pr.number} — "${pr.title}" (the design doc's PR#${pr.number} section)`;
}

function skill(name) {
  return `Use the \`${name}\` skill (invoke it via the Skill tool; if it is unavailable, read ${SKILLS_DIR}/${name}/SKILL.md and follow it exactly)`;
}

function pendingTests(pr) {
  return pr.tests.filter((test) => !test.done).map((test) => test.title);
}

function bullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

async function commitPhase(step, pr, phaseResult) {
  const subject = COMMIT_SUBJECTS[step](pr, phaseResult);
  const result = await agent(
    `Run \`git status --porcelain\`. If it prints nothing, report committed=false and stop. Otherwise stage everything (\`git add -A\`, untracked files included) and create ONE commit whose subject line is exactly the following JSON string's value, character for character (do not reword it, do not add a scope or a body):\n\n${JSON.stringify(subject)}\n\nThe commit message must end with this trailer line, after a blank line (alongside the usual attribution trailer if any):\n\n${COMMIT_TRAILER}\n\nDo not push. Report committed and the short sha.`,
    {
      schema: COMMIT_SCHEMA,
      effort: "low",
      phase: phaseTitle(step, pr),
      label: `commit:${step}:waypoint${pr.number}`,
    },
  );
  log(
    result?.committed
      ? `Committed ${result.sha ?? ""} — ${subject}`
      : `Nothing to commit after ${step} of waypoint #${pr.number}`,
  );
  return result?.committed ? subject : null;
}

const COMMIT_SUBJECTS = {
  scaffold: (pr) =>
    `refactor: 🛠️ scaffold waypoint #${pr.number} - ${describe(pr)}`,
  red: (pr) =>
    `test: ✅ add tests for waypoint #${pr.number} - ${describe(pr)}`,
  green: (pr) =>
    `refactor: 🛠️ implement waypoint #${pr.number} - ${describe(pr)}`,
  "extra task": (pr, result) =>
    `refactor: 🛠️ complete task of waypoint #${pr.number} - ${describeTasks(result?.tasks) ?? describe(pr)}`,
};

function describe(pr) {
  return lowerFirst(pr.title);
}

function describeTasks(tasks) {
  if (!tasks?.length) {
    return null;
  }
  const others = tasks.length > 1 ? ` (+${tasks.length - 1} more)` : "";
  return lowerFirst(tasks[0]) + others;
}

function lowerFirst(text) {
  const trimmed = text.trim().replace(/\.$/, "");
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
}

// e.g. "#1 - scaffold", "#1 - red", "#1 - green", "#1 - extra task"
function phaseTitle(step, pr) {
  return `#${pr.number} - ${step}`;
}

const PROGRESS_SCHEMA = {
  type: "object",
  properties: {
    prs: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "number" },
          title: { type: "string" },
          done: { type: "boolean" },
          tasks: {
            type: "object",
            properties: {
              total: { type: "number" },
              done: { type: "number" },
              pending: { type: "array", items: { type: "string" } },
            },
            required: ["total", "done", "pending"],
          },
          tests: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                done: { type: "boolean" },
              },
              required: ["title", "done"],
            },
          },
        },
        required: ["number", "title", "done", "tasks", "tests"],
      },
    },
    nextPrNumber: { type: ["number", "null"] },
  },
  required: ["prs", "nextPrNumber"],
};

const STEP_SCHEMA = {
  type: "object",
  properties: {
    step: { type: "string", enum: ["scaffold", "red", "green", "extra task", "done"] },
    reason: { type: "string" },
    testFiles: { type: "array", items: { type: "string" } },
  },
  required: ["step", "reason", "testFiles"],
};

const PHASE_RESULT_SCHEMA = {
  type: "object",
  properties: {
    success: { type: "boolean" },
    tests: { type: "array", items: { type: "string" } },
    tasks: { type: "array", items: { type: "string" } },
    failed: {
      type: "array",
      items: {
        type: "object",
        properties: {
          testTitle: { type: "string" },
          reason: { type: "string" },
        },
        required: ["testTitle", "reason"],
      },
    },
    summary: { type: "string" },
  },
  required: ["success", "summary"],
};

const COMMIT_SCHEMA = {
  type: "object",
  properties: {
    committed: { type: "boolean" },
    sha: { type: "string" },
  },
  required: ["committed"],
};

// Kept last: the constants above must be initialized before main() runs.
return await main();
