---
name: tag-commits
description: Tags every commit of the current PR/branch with git-compass using layer, change-type and risk labels. Use when the user asks to tag, label, classify or categorize the commits of a PR or branch, or runs a charted loop job that ends with commit tagging.
---

# Goal

Classify each commit of the PR so reviewers can scan history by nature and risk instead of reading every diff.

# Steps

1. List the PR's commits, oldest first: `git log --reverse --format=%H main..HEAD` (use the PR's base branch if it is not `main`).
2. For each commit, read `git show --stat <id>` and the diff, then pick tags from the criteria below.
3. Apply each tag with `git-compass tag <commit-id> <tag>` (one call per tag).

# Criteria

Use the bare value as the tag (`ui`, not `layer:ui`).

| Criterion   | Values                                    | Pick                                                                                                                                                                                                                                           |
| ----------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| layer       | `ui` / `infra` / `core` / `test`          | one or more, based on the files changed: `ui` = purely presentational components, `infra` = e.g. services making HTTP requests, `core` = models and business logic, `test` = tests changed                                                    |
| change type | `structural` / `behavioral`               | one or both: `structural` = no behavior introduced (refactoring, WIP scaffold/boilerplate), `behavioral` = changes the behavior of production code                                                                                             |
| risk        | `low` / `medium` / `high`                 | exactly one                                                                                                                                                                                                                                    |

# Rules

- Judge the change itself, not the commit message: a `refactor:` commit that alters behavior is `behavioral`.
- A test-only commit gets `test` and `structural` (production behavior is untouched).
- Tag only commits of the PR; never rewrite or amend history.
