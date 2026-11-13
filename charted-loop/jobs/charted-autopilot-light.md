# Charted autopilot (light)

Does the same work as the `charted-autopilot` workflow, in this single agent and without the
Workflow tool or subagents: loop the scaffold, red, green, and extra task steps on one waypoint,
committing and pushing after each step, until the waypoint is done or the loop is stuck.

Inputs:

- `branch`: the waypoint branch (already checked out).
- `args.designDocPath`: the design doc, e.g. `design-docs/001-meal-plan.md`. Required: if it is
  missing, stop and say so.
- `args.waypoint`: the waypoint number (the design doc's `PR#N` section, not a GitHub pull
  request). When omitted, work on the first waypoint that is not done, then the next one, until
  the whole design doc is done.
- `message`: why this run fired.

Skills (invoke with the Skill tool; if one is unavailable, read `.agents/skills/<name>/SKILL.md`
and follow it exactly):

- `charted-scaffold`, `charted-red`, `charted-green`: one per step, below.
- `wallaby-cli` (or the `mcp__wallaby__*` tools, load via ToolSearch if deferred) to run tests.
  Fall back to the project's normal test command only if Wallaby is unavailable.

The design doc is the single source of truth. Never reword, reorder, add, or remove anything in
it other than the progress markers the skills tell you to flip.

## Loop

Repeat until a stop condition below is reached.

### 1. Progress

Run `node tools/charted/charted-progress.mjs "<designDocPath>"`. It prints JSON with one entry
per waypoint (`number`, `title`, `done`, `tasks.pending`, `tests[].done`). Read the progress
from this output, not by parsing the design doc yourself. If it lists no waypoint, stop
(`aborted`).

Pick the waypoint: `args.waypoint` when given (stop with `aborted` if it is not listed), or else
the first waypoint whose `done` is false. If that waypoint is done (or every waypoint is, without
`args.waypoint`), stop with `done`.

Pending tests are the waypoint's `tests` with `done: false`; unchecked tasks are its
`tasks.pending`.

### 2. Next step

Read the waypoint's `PR#N` section (Tasks and Testing Strategy), inspect the code, and pick the
first step that applies:

1. **scaffold**: a pending test has no matching `it.todo("<title>", ...)` or `it("<title>", ...)`
   in any test file (case-insensitive), or a production file, class, function, or component the
   Tasks require does not exist yet.
2. **red**: at least one pending test is an `it.todo` whose body is empty or holds only
   step-by-step comments.
3. **green**: every pending test has real test code (still `it.todo`, or already `it(...)` but not
   yet checked off in the design doc).
4. **extra task**: there is no pending test and at least one Task is still unchecked.
5. **done**: no pending test and no unchecked Task, but the design doc does not mark the
   waypoint `✅` yet. Go back to step 1 of the loop; this counts as an attempt (see Stuck).

### 3. Run the step

Each step covers the whole waypoint, not one test: keep applying the skill until the step is
complete, then commit once.

- **scaffold**: `charted-scaffold` with the design doc and the waypoint number. Scaffold every WIP
  production item the Tasks require and one `it.todo` per Testing Strategy scenario. No real test
  code, no behavior.
- **red**: `charted-red` with the design doc, once per pending test, file by file, until every
  pending test of the waypoint has real test code. Keep every test `it.todo`, never touch
  production code or the design doc. Re-read the test files before moving on.
- **green**: `charted-green` with the design doc, file by file, until every pending test of the
  waypoint is green: activate tests strictly one at a time (`it.todo` → `it`), implement just
  enough to pass, flip its design doc markers per the skill. Only touch this waypoint's tests.
- **extra task**: complete the first unchecked task only (take the smallest group of tasks only
  when one cannot be done without the others). If it is already done, verify it and just check
  it off. Implement only what the task asks, remove the wiprecation
  (`@deprecated 🚧 work in progress`) from items now done and safe to use, keep every test
  passing, then flip `- [ ]` to `- [x]` for each completed task, and flip the waypoint's `🚧` to
  `✅` in its `PR#N` title when all its Tasks and tests are checked off.

### 4. Commit

If `git status --porcelain` prints nothing, skip to the next iteration. Otherwise `git add -A` and
create one commit whose subject is exactly (`<title>` is the waypoint title with its first letter
lower-cased and any trailing period dropped):

| Step       | Subject                                                              |
| ---------- | -------------------------------------------------------------------- |
| scaffold   | `refactor: 🛠️ scaffold waypoint <n> - <title>`                       |
| red        | `test: ✅ add tests for waypoint <n> - <title>`                      |
| green      | `refactor: 🛠️ implement waypoint <n> - <title>`                      |
| extra task | `refactor: 🛠️ complete task of waypoint <n> - <first completed task>` |

For extra task, lower-case the task's first letter and append ` (+<k> more)` when you completed
more than one. End every commit message with this trailer, after a blank line:

```
Charted-Loop: charted-autopilot-light
```

### 5. Push

After every commit, not only at the end:

1. If the current branch is `main`, `master`, or `HEAD`, stop (`aborted`).
2. `git fetch origin`, then, if `origin/<branch>` exists,
   `git pull --rebase --autostash origin "<branch>"`. On a conflict, `git rebase --abort` and stop
   (`aborted`).
3. `git push origin "HEAD:<branch>"`. If it is rejected, stop (`aborted`). Never force-push.

### Stuck

Track the last step: waypoint, step, and how many tests plus tasks were checked off when it
started. When the same step comes up again on the same waypoint with the same checked-off count,
that is a second attempt. Stop with `stuck` instead of a third attempt. Extra task legitimately
repeats, as long as each run checks something off.

## Finish

The commits are already pushed, so skip the charted loop's Commit and Publish steps unless
something is left uncommitted. Then follow the charted loop's "Report" section with this run's
result: `done`, `stuck` (with the step and reason), or `aborted` (with the reason).
