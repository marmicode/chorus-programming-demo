# Review

Review the pull request this run was fired for. Do not change the repository.

Inputs:

- `branch`: the pull request head. Never the default branch: if it is, stop and explain.
- `args.pr`: the pull request number.
- `message`: the pull request URL, head SHA, and why this run fired.

Skills (read and follow):

- `code-review`, the bundled Claude Code skill. Run it as `/code-review high --comment <pr>`. The levels are `low`, `medium`, `high`, `xhigh`, `max`, and `ultra`. `high` is the skill's default pipeline; omitting a level reuses the last level typed in Claude Code, or the session effort if none was ever typed, so pass `high` explicitly. Do not pass `--fix`. Do not use `ultra`.

## Code review

Run `code-review` on pull request `args.pr` at the current head. It posts its own findings. Do not restate them and do not edit files to address them.

## Design doc sync

Only when this pull request is a charted coding waypoint. Run:

```sh
node tools/charted/charted-resume.mjs --branch "<branch>"
```

If `matched` is not true, skip this section.

Otherwise `designDocPath` and `waypoint` name the design doc section this branch implements. Compare the whole pull request, `origin/<base>...HEAD` (the base is `gh pr view <pr> --json baseRefName`), not only the latest commit.

The two diffs are in sync when all of these hold:

1. Design doc edits are only progress markers for this waypoint: `- [ ]` flipped to `- [x]`, and `🚧` flipped to `✅`, inside this waypoint's Tasks, Testing Strategy, and its own PR Plan entry. Rewording, another waypoint, or any other design doc edit is out of sync.
2. Every task checked off, and every test flipped to `✅`, is implemented in the code diff. A test marked `✅` has a real `it(...)` whose title matches, not only `it.todo`. A checked task's behavior is present in the code.
3. Code that completes a task or test of this waypoint still left unchecked or `🚧` in the branch's design doc is out of sync.
4. The waypoint heading is `✅` only when every task and test of that waypoint is checked off. A heading left `🚧` while something under it remains open is fine. A `✅` heading with anything still open is out of sync.

A commit that only fixes already-checked work, and does not claim new design doc progress, stays in sync.

When the diffs are out of sync, comment on the pull request with the mismatches (`gh pr comment <pr> --body "..."`). When they are in sync, do not add a comment. Do not edit the design doc or the code to force them into sync.

## Publish

Do not commit, push, or open a pull request. Commenting is the whole result.
