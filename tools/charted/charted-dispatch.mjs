#!/usr/bin/env node
/**
 * Decides which waypoints of the design docs are ready to be worked on and, with "apply",
 * opens a branch + draft pull request for each of them.
 *
 * Usage: node charted-dispatch.mjs plan|apply [--repo owner/name] [--base main] [designDocPaths...]
 *
 * Without design doc paths, every design-docs/*.md file is considered.
 * Prints {waypoints: [{designDocPath, waypoint, waypointCount, title, branch, action, prUrl?}]} where action is
 * "create" (plan), "created" (apply) or "skip" (the branch already exists).
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { parseDesignDoc } from './charted-progress.mjs';
import {
  isUnblocked,
  parseWaypointDependencies,
  waypointBranch,
  waypointPullRequestTitle,
} from './charted-waypoints.mjs';

const DESIGN_DOCS_DIR = 'design-docs';

/**
 * @param {{docs: Array<{path: string, markdown: string}>, existingBranches: Set<string>}} options
 */
export function planDispatch({ docs, existingBranches }) {
  return docs.flatMap(({ path, markdown }) => {
    const progress = parseDesignDoc(markdown);
    const dependencies = parseWaypointDependencies(markdown);

    return progress.prs
      .filter(
        (pr) => !pr.done && isUnblocked(pr.number, dependencies, progress),
      )
      .map((pr) => {
        const branch = waypointBranch(path, pr.number);
        return {
          designDocPath: path,
          waypoint: pr.number,
          waypointCount: progress.prs.length,
          title: pr.title,
          branch,
          action: existingBranches.has(branch) ? 'skip' : 'create',
        };
      });
  });
}

/**
 * Creates each planned branch with an empty "start" commit on top of the base branch
 * and opens a draft pull request for it.
 *
 * @param {{waypoints: ReturnType<typeof planDispatch>, repo: string, base: string, gh: (args: string[]) => string}} options
 */
export function applyDispatch({ waypoints, repo, base, gh }) {
  const toCreate = waypoints.filter(({ action }) => action === 'create');
  if (toCreate.length === 0) {
    return waypoints;
  }

  const baseSha = gh([
    'api',
    `repos/${repo}/git/ref/heads/${base}`,
    '--jq',
    '.object.sha',
  ]).trim();
  const treeSha = gh([
    'api',
    `repos/${repo}/git/commits/${baseSha}`,
    '--jq',
    '.tree.sha',
  ]).trim();

  return waypoints.map((item) => {
    if (item.action !== 'create') {
      return item;
    }

    const name = `waypoint ${item.waypoint} - ${item.title}`;
    // Drafts stay refactor until the loop marks the pull request ready and
    // retitles a waypoint whose behavior is wired up to feat. The badge stays.
    const title = waypointPullRequestTitle({
      prefix: 'refactor: 🛠️',
      designDocPath: item.designDocPath,
      waypoint: item.waypoint,
      waypointCount: item.waypointCount,
      title: item.title,
    });
    const commitSha = gh([
      'api',
      `repos/${repo}/git/commits`,
      '--method',
      'POST',
      '-f',
      `message=refactor: 🛠️ start ${name}\n\nCharted-Loop: dispatch`,
      '-f',
      `tree=${treeSha}`,
      '-f',
      `parents[]=${baseSha}`,
      '--jq',
      '.sha',
    ]).trim();
    gh([
      'api',
      `repos/${repo}/git/refs`,
      '--method',
      'POST',
      '-f',
      `ref=refs/heads/${item.branch}`,
      '-f',
      `sha=${commitSha}`,
    ]);
    const prUrl = gh([
      'pr',
      'create',
      '--repo',
      repo,
      '--draft',
      '--base',
      base,
      '--head',
      item.branch,
      '--title',
      title,
      '--body',
      `Implements waypoint ${item.waypoint} ("${item.title}") of [${item.designDocPath}](https://github.com/${repo}/blob/${base}/${item.designDocPath}).\n\nDriven by the charted loop: the \`charted-autopilot\` workflow runs on this branch.`,
    ]).trim();

    return { ...item, action: 'created', prUrl };
  });
}

/** Design docs to consider: the given paths (ignoring deleted ones) or every design-docs/*.md file. */
export function loadDesignDocs(root, paths) {
  const candidates = paths.length
    ? paths
    : existsSync(join(root, DESIGN_DOCS_DIR))
      ? readdirSync(join(root, DESIGN_DOCS_DIR))
          .filter((file) => file.endsWith('.md'))
          .sort()
          .map((file) => `${DESIGN_DOCS_DIR}/${file}`)
      : [];

  return candidates
    .filter((path) => existsSync(join(root, path)))
    .map((path) => ({ path, markdown: readFileSync(join(root, path), 'utf8') }))
    .filter(({ markdown }) => parseDesignDoc(markdown).prs.length > 0);
}

/** Names of the branches of the repository. */
export function listBranches({ repo, gh }) {
  return new Set(
    gh(['api', `repos/${repo}/branches`, '--paginate', '--jq', '.[].name'])
      .split('\n')
      .filter(Boolean),
  );
}

export function runGh(args) {
  return execFileSync('gh', args, { encoding: 'utf8' });
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      repo: { type: 'string', default: process.env.GITHUB_REPOSITORY },
      base: { type: 'string', default: 'main' },
      root: { type: 'string', default: '.' },
      // Skips the GitHub lookup of existing branches (e.g. for dry runs).
      'existing-branches': { type: 'string' },
    },
  });
  const [command, ...paths] = positionals;
  if (command !== 'plan' && command !== 'apply') {
    throw new Error(
      'Usage: charted-dispatch.mjs plan|apply [--repo owner/name] [--base main] [designDocPaths...]',
    );
  }

  const existingBranches =
    values['existing-branches'] !== undefined
      ? new Set(values['existing-branches'].split(',').filter(Boolean))
      : listBranches({ repo: values.repo, gh: runGh });

  let waypoints = planDispatch({
    docs: loadDesignDocs(values.root, paths),
    existingBranches,
  });
  if (command === 'apply') {
    waypoints = applyDispatch({
      waypoints,
      repo: values.repo,
      base: values.base,
      gh: runGh,
    });
  }

  console.log(JSON.stringify({ waypoints }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
