#!/usr/bin/env node
/**
 * Deterministically parses a Charted Coding design doc and prints its progress as JSON.
 *
 * Usage: node charted-progress.mjs <designDocPath>
 *
 * Used by .claude/workflows/charted-autopilot.js (workflow scripts have no filesystem access)
 * and by the charted loop dispatch/resume scripts.
 */
import { readFileSync } from "node:fs";

// "<summary>🚧 PR#1 — List recipes</summary>" or "# 🚧 PR#1 - List recipes"
const PR_RE =
  /^(?:(#{1,6})\s+|(?:<details>\s*)?<summary>\s*)(🚧|✅)?\s*PR\s*#\s*(\d+)\s*(?:[—–:-]\s*)?(.*?)\s*(?:<\/summary>)?\s*$/u;
const HEADING_RE = /^(#{1,6})\s+(.*?)\s*$/;
const STATUS_RE = /^(🚧|✅)\s*(.*)$/u;
const CHECKBOX_RE = /^[-*]\s+\[( |x|X)\]\s*(.*)$/;

export function parseDesignDoc(markdown) {
  const prs = [];
  let inFence = false;
  let pr = null;
  let section = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();

    // Skip fenced code blocks (e.g. the mermaid PR dependency diagram mentions "PR#1").
    if (/^(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) {
      continue;
    }

    const prMatch = line.match(PR_RE);
    if (prMatch) {
      const [, hashes, status, number, title] = prMatch;
      pr = {
        number: Number(number),
        title,
        status: status ?? null,
        level: hashes ? hashes.length : null,
        tasks: { total: 0, done: 0, pending: [] },
        tests: [],
      };
      prs.push(pr);
      section = null;
      continue;
    }
    if (!pr) {
      continue;
    }

    if (pr.level === null && line.startsWith("</details>")) {
      pr = null;
      section = null;
      continue;
    }

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      const level = headingMatch[1].length;
      if (pr.level !== null && level <= pr.level) {
        pr = null;
        section = null;
        continue;
      }
      if (section && level <= section.level) {
        section = null;
      }

      const [, status, text] = headingMatch[2].match(STATUS_RE) ?? [
        null,
        null,
        headingMatch[2],
      ];
      if (!section) {
        if (/^tasks?$/i.test(text)) {
          section = { kind: "tasks", level };
        } else if (/^(testing strategy|tests)$/i.test(text)) {
          section = { kind: "tests", level };
        }
      } else if (section.kind === "tests" && status) {
        // Headings without a status marker are component groups, not tests.
        pr.tests.push({ title: text, done: status === "✅" });
      }
      continue;
    }

    const checkboxMatch = section?.kind === "tasks" && line.match(CHECKBOX_RE);
    if (checkboxMatch) {
      pr.tasks.total++;
      if (checkboxMatch[1] !== " ") {
        pr.tasks.done++;
      } else {
        pr.tasks.pending.push(checkboxMatch[2]);
      }
    }
  }

  const result = prs
    .sort((a, b) => a.number - b.number)
    .map(({ number, title, status, tasks, tests }) => ({
      number,
      title,
      done: _isDone({ status, tasks, tests }),
      tasks,
      tests,
    }));

  return {
    prs: result,
    nextPrNumber: result.find((pr) => !pr.done)?.number ?? null,
  };
}

function _isDone({ status, tasks, tests }) {
  if (status === "✅") {
    return true;
  }
  // A PR without any test or task can never be checked off: leave that to its status marker.
  return (
    tests.length + tasks.total > 0 &&
    tests.every((test) => test.done) &&
    tasks.done === tasks.total
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const designDocPath = process.argv[2];
  if (!designDocPath) {
    console.error("Usage: charted-progress.mjs <designDocPath>");
    process.exit(1);
  }
  console.log(JSON.stringify(parseDesignDoc(readFileSync(designDocPath, "utf8"))));
}
