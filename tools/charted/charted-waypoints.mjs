/**
 * Waypoint helpers shared by the charted loop scripts.
 *
 * A waypoint is a "PR#N" section of a design doc's PR Plan. It is called a waypoint
 * to avoid confusing it with GitHub pull request numbers.
 */
import { basename } from 'node:path';

const MERMAID_EDGE = /\bPR(\d+)\b\s*-->\s*\bPR(\d+)\b/gi;
const WAYPOINT_BRANCH = /^(.+)-waypoint-(\d+)$/;

/**
 * Reads the first mermaid block after "# PR Plan" and returns, for each waypoint,
 * the waypoints it depends on (e.g. "PR1 --> PR2" means 2 depends on 1).
 *
 * @returns {Map<number, number[]>}
 */
export function parseWaypointDependencies(markdown) {
  const dependencies = new Map();
  const planIndex = markdown.search(/^#\s+PR Plan\s*$/m);
  if (planIndex === -1) {
    return dependencies;
  }

  const mermaid = markdown
    .slice(planIndex)
    .match(/```mermaid\s*\n([\s\S]*?)```/);
  if (!mermaid) {
    return dependencies;
  }

  for (const [, from, to] of mermaid[1].matchAll(MERMAID_EDGE)) {
    const deps = dependencies.get(Number(to)) ?? [];
    deps.push(Number(from));
    dependencies.set(Number(to), deps);
  }
  return dependencies;
}

/**
 * A waypoint is unblocked when all its explicit dependencies are done.
 * Without explicit edges, every lower-numbered waypoint must be done.
 *
 * @param {number} waypoint
 * @param {Map<number, number[]>} dependencies
 * @param {{prs: Array<{number: number, done: boolean}>}} progress output of parseDesignDoc
 */
export function isUnblocked(waypoint, dependencies, progress) {
  const doneWaypoints = new Set(
    progress.prs.filter((pr) => pr.done).map((pr) => pr.number),
  );
  const prerequisites =
    dependencies.get(waypoint) ??
    progress.prs.map((pr) => pr.number).filter((number) => number < waypoint);
  return prerequisites.every((number) => doneWaypoints.has(number));
}

/** e.g. "design-docs/001-meal-plan.md", 2 -> "001-meal-plan-waypoint-2" */
export function waypointBranch(designDocPath, waypoint) {
  return `${basename(designDocPath, '.md')}-waypoint-${waypoint}`;
}

/** e.g. "001-meal-plan-waypoint-2" -> {designDocStem: "001-meal-plan", waypoint: 2} */
export function parseWaypointBranch(branch) {
  const match = branch.match(WAYPOINT_BRANCH);
  return match ? { designDocStem: match[1], waypoint: Number(match[2]) } : null;
}
