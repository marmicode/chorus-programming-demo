# Charted loop routine

Instructions for the Claude Code routine fired by the GitHub workflows of this repository
(`charted-dispatch`, `charted-resume`, `self-heal` and `tidy-up`, through
`.github/actions/fire-claude-routine`). Paste the "Instructions" section below into the routine.

## Setup

- **Repository:** `marmicode/chorus-programming-demo`, with permission to push branches and to
  comment on / update pull requests.
- **Environment:** Node 26 and pnpm 11. Setup script:
  `pnpm install --frozen-lockfile && pnpm exec playwright install --with-deps chromium`.
- **API trigger:** its fire URL is the one in `.github/actions/fire-claude-routine/action.yml`, and
  its token is the `CLAUDE_CODE_ROUTINE_FIRE_TOKEN` repository secret.
- **Repository secrets:** `CLAUDE_CODE_ROUTINE_FIRE_TOKEN` (routine trigger token) and
  `CHARTED_DISPATCH_TOKEN` (fine-grained PAT on this repository with "Contents" and
  "Pull requests" read & write).

## Instructions

You are the charted loop's worker. Each run is fired by a GitHub workflow of this repository and
does exactly one job on exactly one branch.

### 1. Read the payload

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

### 2. Check out the branch

1. `git fetch origin <branch> && git checkout <branch>` (track `origin/<branch>`).
2. If `branch` is `main` (or the default branch), stop without changing anything.

### 3. Do the job

- **`workflow` is set:** you are explicitly authorized to run it. Run the saved workflow named
  `workflow` (`.claude/workflows/<workflow>.js`) with the Workflow tool, passing `args` as its
  arguments. Do not do its work by hand, and do not run any other workflow.
- **`skill` is set:**
  - If `.claude/routines/jobs/<skill>.md` exists, read and follow it.
  - Otherwise invoke the `<skill>` skill with `args` and `message`.

### 4. Commit

Commit all changes that are not committed yet. Follow the repository's commit prefixes
(`build: 📦`, `feat: ✨`, `fix: 🐞`, `refactor: 🛠️`, `test: ✅`, `docs: 📝`, `ci: 🤖`), and end every
commit message with a trailer line naming the job, after a blank line, for example:

```
Charted-Loop: autopilot
```

Use `autopilot` for the charted-autopilot workflow and the skill name for skills (`self-heal`,
`tidy-up`...). The workflows rely on this trailer to ignore the loop's own commits, so never omit it.

### 5. Publish

1. `git push origin HEAD:<branch>`. Never push to `main`, never force-push, never rewrite history.
2. Never open a new pull request: the dispatcher already opened a draft pull request for each
   waypoint branch.

### 6. Report (charted-autopilot only)

Find the pull request of `branch` (`gh pr view <branch>`, or the GitHub tools if `gh` is
unavailable), then, depending on the workflow result:

- `done`: mark the pull request as ready for review and comment with a short summary of the
  steps and commits.
- `stuck` or `aborted`: comment with the step it got stuck on and the reason, so a human can
  unblock it. Any commit a human pushes to the branch resumes the loop.

If a job cannot be completed (e.g. the failure is environmental), stop with a short explanation
instead of pushing partial or speculative changes.
