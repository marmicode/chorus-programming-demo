/** Test fixtures shared by the charted loop script tests. */
import { readFileSync } from 'node:fs';

export const exampleDoc = readFileSync(
  new URL(
    '../../.agents/skills/charted-design/resources/example-design-doc.md',
    import.meta.url,
  ),
  'utf8',
);

/** Two roots (PR#1, PR#2) that both block PR#3. */
export const parallelRootsDoc = `# PR Plan

\`\`\`mermaid
flowchart LR
  PR1["PR#1<br>RecipePage + Repository"]
  PR2["PR#2<br>Paginator component"]
  PR3["PR#3<br>RecipeSearch wiring"]

  PR1 --> PR3
  PR2 --> PR3
\`\`\`

<details>
<summary>🚧 PR#1 — RecipePage + Repository</summary>

## Tasks

- [ ] Add RecipePage.

</details>

<details>
<summary>🚧 PR#2 — Paginator component</summary>

## Tasks

- [ ] Create Paginator.

</details>

<details>
<summary>🚧 PR#3 — RecipeSearch wiring</summary>

## Tasks

- [ ] Wire Paginator.

</details>
`;

export function markWaypointDone(markdown, waypoint) {
  return markdown.replace(
    `<summary>🚧 PR#${waypoint} `,
    `<summary>✅ PR#${waypoint} `,
  );
}
