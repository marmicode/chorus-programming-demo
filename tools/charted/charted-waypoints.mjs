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
 * A waypoint with no incoming edges is unblocked immediately.
 * When the diagram has no edges at all, every lower-numbered waypoint must be done.
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
    (dependencies.size === 0
      ? progress.prs
          .map((pr) => pr.number)
          .filter((number) => number < waypoint)
      : []);
  return prerequisites.every((number) => doneWaypoints.has(number));
}

/** e.g. "design-docs/001-meal-plan.md", 2 -> "001-meal-plan-waypoint-2" */
export function waypointBranch(designDocPath, waypoint) {
  return `${basename(designDocPath, '.md')}-waypoint-${waypoint}`;
}

/** e.g. "design-docs/001-meal-plan.md" -> "001" */
export function designDocNumber(designDocPath) {
  const match = basename(designDocPath, '.md').match(/^(\d+)/);
  if (!match) {
    throw new Error(
      `Design doc path must start with a number: ${designDocPath}`,
    );
  }
  return match[1];
}

/**
 * e.g. prefix "refactor: 🛠️", doc 001, waypoint 1 of 3, "RecipePage + Repository"
 * -> "refactor: 🛠️ [001 · 1/3] RecipePage + Repository"
 *
 * The badge stays clear of "#", which GitHub would turn into an issue link.
 */
export function waypointPullRequestTitle({
  prefix,
  designDocPath,
  waypoint,
  waypointCount,
  title,
}) {
  const number = designDocNumber(designDocPath);
  return `${prefix} [${number} · ${waypoint}/${waypointCount}] ${title}`;
}

/** e.g. "001-meal-plan-waypoint-2" -> {designDocStem: "001-meal-plan", waypoint: 2} */
export function parseWaypointBranch(branch) {
  const match = branch.match(WAYPOINT_BRANCH);
  return match ? { designDocStem: match[1], waypoint: Number(match[2]) } : null;
}
