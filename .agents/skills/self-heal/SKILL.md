---
name: self-heal
description: Repairs a branch whose Test GitHub Actions workflow failed by finding the root cause and pushing a minimal fix to that same branch. Use when CI fails on a branch, when the charted loop routine dispatches the self-heal job, or when the user asks to self-heal or fix a failing CI run.
---

# Self heal

The **Test** workflow failed on a branch. Find the root cause and push a minimal fix to that same branch.

Inputs:

- `branch`: the branch whose CI failed. Never `main`: if it is, stop and explain.
- `message`: run context such as the failed Actions run URL, run id and head SHA, when present.

Skills (read and follow when relevant):

- `angular-developer` for Angular code and its conventions.
- `wallaby-cli` to run and investigate tests (fall back to `pnpm test` when Wallaby is unavailable).

## Investigation

1. Check out `branch`.
2. Inspect the failed run with `gh run view <run id>` and its failed job logs (`gh run view <run id> --log-failed`). Without `gh`, reproduce locally with `pnpm install` then `pnpm test`.
3. Identify the root cause; prefer minimal, targeted fixes.

## Repair

1. Apply the fix following the skills above.
2. Run the tests again and make sure they pass.
3. If the failure is environmental, flaky, or not fixable in the repository, stop with a short explanation and do not publish any change.

Never mask test failures, skip tests, or weaken assertions to make CI green.

## Publish

1. Commit with a `fix: 🐞` subject describing the fix, and end the commit message with this trailer line, after a blank line:

   ```
   Charted-Loop: self-heal
   ```

   The trailer keeps the charted loop from healing or resuming on its own commits.

2. Push to `branch` (`git push origin HEAD:<branch>`). Never force-push and do not open a pull request.
