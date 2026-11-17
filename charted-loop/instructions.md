# Charted loop

You are the charted loop's worker. Each run does exactly one job on exactly one branch.

## 1. Read the payload

The trigger text is a JSON object:

```json
{
  "repository": "owner/name",
  "branch": "001-meal-plan-waypoint-1",
  "workflow": "charted-autopilot",
  "skill": "self-heal",
  "args": { "designDocPath": "design-docs/001-meal-plan.md", "waypoint": 1 },
  "message": "run-specific context (URLs, SHAs, notes)"
}
```

Exactly one of `workflow` or `skill` is set. If the text is not such a JSON object, stop and say so.

A **waypoint** is a "PR#N" section of a design doc's PR Plan. The design doc calls it a PR, but
it is not a GitHub pull request number: always call it a waypoint.

## 2. Check out the branch

1. `git fetch origin <branch> && git checkout <branch>` (track `origin/<branch>`).
2. If `branch` is `main` (or the default branch), stop without changing anything.

## 3. Do the job

- **`workflow` is set:** you are explicitly authorized to run it. Run the saved workflow named
  `workflow` (`.claude/workflows/<workflow>.js`) with the Workflow tool, passing `args` as its
  arguments. Do not do its work by hand, and do not run any other workflow.
- **`skill` is set:**
  - If `charted-loop/jobs/<skill>.md` exists, read and follow it.
  - Otherwise invoke the `<skill>` skill with `args` and `message`.

## 4. Commit

Commit all changes that are not committed yet. Follow the repository's commit prefixes
(`build: 📦`, `feat: ✨`, `fix: 🐞`, `refactor: 🛠️`, `test: ✅`, `docs: 📝`, `ci: 🤖`), and end every
commit message with a trailer line naming the job, after a blank line, for example:

```
Charted-Loop: autopilot
```

Use `autopilot` for the charted-autopilot workflow and the skill name for skills (`self-heal`,
`tidy-up`...). The workflows rely on this trailer to ignore the loop's own commits, so never omit it.

Never put `#` before a number in a commit subject or pull request title (`waypoint 1`, never
`waypoint #1`). GitHub turns `#1` into a link to an issue or pull request.

## 5. Publish

1. `git push origin HEAD:<branch>`. Never push to `main`, never force-push, never rewrite history.
2. Never open a new pull request: the dispatcher already opened a draft pull request for each
   waypoint branch.

## 6. Report (charted-autopilot and charted-autopilot-light only)

Find the pull request of `branch` (`gh pr view <branch>`, or the GitHub tools if `gh` is
unavailable), then, depending on the workflow (or job) result:

- `done`: mark the PR as ready for review and comment with a short
  summary of the steps and commits.

  The title is `<prefix>: <emoji> [<design-doc number> · <waypoint>/<total>] <design-doc waypoint title>`.
  The design-doc number is the leading digits of the filename (`design-docs/001-meal-plan.md` → `001`).
  `<waypoint>/<total>` is this waypoint's number and how many waypoints the PR Plan has
  (`1/3` for the first of three). Keep the design-doc title's wording. Never put `#` before a
  number: GitHub turns `#1` into a link to an issue or pull request.

  Example: `refactor: 🛠️ [001 · 1/3] RecipePage + Repository`

  Choose the prefix for the waypoint as a whole, from its outcome:
  - `feat: ✨` when this waypoint changes behavior and that behavior is wired up and reachable.
  - `refactor: 🛠️` otherwise (types, an unwired component, scaffolding).

  Ignore the prefixes already on the branch: scaffold, green, and extra-task commits are always
  `refactor:`, and red commits are always `test:`. Set the title with
  `gh pr edit <branch> --title "..."`.

- `stuck` or `aborted`: comment with the step it got stuck on and the reason, so a human can
  unblock it.

If a job cannot be completed (e.g. the failure is environmental), stop with a short explanation
instead of pushing partial or speculative changes.
