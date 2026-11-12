# Tidy up

Skills (read and follow):

- `.claude/skills/angular-developer`
- `.cursor/skills/angular-testing`
- `.agents/skills/workspace-conventions` (when it exists)

## Context

This branch added one or more `// TIDYUP` markers compared to the repository's default branch, `main` (unless the dispatcher `message` names a different base). Complete the deferred cleanup each marker describes, then remove every `// TIDYUP` comment.

## Steps

1. Find all `// TIDYUP` comments introduced on this branch (diff against the base branch).
2. Apply each cleanup.
3. Capture conventions (below) from the cleanups you just applied.
4. If there are no file changes after cleanup, stop without pushing.

## Capture conventions

A `// TIDYUP` marker is a human telling the agent "this is not how we do it here". When the cleanup it asks for is a **reusable convention** rather than a one-off fix, persist it so future sessions apply it without being told again.

### Decide whether a cleanup generalizes

For each applied cleanup, look at the marker text **and** the before → after code you wrote. State the rule from the code pattern, not from the marker's wording.

Keep it only when, generalized, it would help **future** work on this repo beyond the spot it was found in:

- Coding conventions, API or decorator choices (“use X instead of Y”), naming, file layout
- Architecture or testing expectations that apply beyond one file
- Tool, workflow, or review habits

Drop it when it is specific to that spot:

- Renaming one variable, fixing a typo, moving one hardcoded value, deleting dead code
- Anything that only makes sense with the surrounding feature's context
- Something a skill already listed above says (it was a lapse, not a new convention)

When unsure, drop it. Prefer no change over a low-quality or redundant convention.

### Generalize

- Write imperative, testable instructions (“Do X”, “Never Y”, “Prefer Z”).
- Replace specific paths and names with patterns when the rule is broader (“in Angular components under `apps/`…”).
- Remove branch names, design doc numbers, and waypoint details.
- Preserve the intent of the marker; do not invent policies it does not imply.
- Never store secrets, tokens, or private personal data.

### Where it goes

All conventions go into one umbrella skill, **`.agents/skills/workspace-conventions/`**. Never create a separate skill directory per convention.

Skip a convention that duplicates or nearly duplicates one already in `references/` or in the hub's Index. Extend the existing reference instead when the topic matches, and update its Triggers in the Index.

When there is at least one convention to persist and the skill does not exist yet:

1. Copy [`charted-loop/jobs/tidy-up/assets/workspace-conventions/SKILL.template.md`](tidy-up/assets/workspace-conventions/SKILL.template.md) to `.agents/skills/workspace-conventions/SKILL.md`.
2. Link it for Claude Code like the other skills: `ln -s ../../.agents/skills/workspace-conventions .claude/skills/workspace-conventions`.

Add each new convention as `references/<domain>/<slug>.md` (kebab-case domain such as `angular/`, `testing/`, `workflow/`; slug stable, max 64 chars), from [`charted-loop/jobs/tidy-up/assets/workspace-conventions/reference.template.md`](tidy-up/assets/workspace-conventions/reference.template.md) (no frontmatter), and add a row to the Index with a path relative to the skill root.

Commit convention changes separately from the cleanup, with `docs: 📝 capture workspace conventions` (plus the `Charted-Loop: tidy-up` trailer). List the captured conventions in the commit body.

## Publish

Work on the payload `branch` only.

1. Commit with a clear message; suffix or prefix with `refactor: 🛠️ tidy up` when appropriate.
2. Push to that branch. Do not open a pull request.

Do not leave `// TIDYUP` markers in the tree when you finish.
