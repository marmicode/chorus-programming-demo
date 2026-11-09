/** Test fixtures shared by the charted loop script tests. */
import { readFileSync } from 'node:fs';

export const exampleDoc = readFileSync(
  new URL(
    '../../.agents/skills/charted-design/resources/example-design-doc.md',
    import.meta.url,
  ),
  'utf8',
);

export function markWaypointDone(markdown, waypoint) {
  return markdown.replace(
    `<summary>🚧 PR#${waypoint} `,
    `<summary>✅ PR#${waypoint} `,
  );
}
