#!/usr/bin/env node
/**
 * GitHub Actions entry point of the charted dispatch (.github/workflows/charted-dispatch.yml).
 *
 * Usage: node charted-dispatch-github.mjs
 *
 * - On push: only the design docs changed by the pushed commit are considered.
 *   On any other event (e.g. workflow_dispatch): every design doc.
 * - Opens a branch + draft pull request for each unblocked waypoint (see charted-dispatch.mjs).
 * - Writes a summary table to GITHUB_STEP_SUMMARY and the created waypoints, as a JSON array,
 *   to the "created" step output.
 *
 * Requires GH_TOKEN (a PAT: refs and pull requests created with GITHUB_TOKEN would not trigger
 * the Test workflow), GITHUB_REPOSITORY, GITHUB_EVENT_NAME, GITHUB_OUTPUT and GITHUB_STEP_SUMMARY.
 */
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import {
  applyDispatch,
  listBranches,
  loadDesignDocs,
  planDispatch,
  runGh,
} from './charted-dispatch.mjs';

/** Design docs changed by the HEAD commit (e.g. a merged pull request). */
export function changedDesignDocs() {
  return execFileSync(
    'git',
    ['diff', '--name-only', 'HEAD^', 'HEAD', '--', 'design-docs/*.md'],
    { encoding: 'utf8' },
  )
    .split('\n')
    .filter(Boolean);
}

export function formatSummary(waypoints) {
  return [
    '### Charted dispatch',
    '',
    ...(waypoints.length
      ? [
          '| Waypoint | Branch | Action | Pull request |',
          '| --- | --- | --- | --- |',
          ...waypoints.map(
            ({ designDocPath, waypoint, title, branch, action, prUrl }) =>
              `| ${designDocPath} #${waypoint} - ${title} | ${branch} | ${action} | ${prUrl ?? ''} |`,
          ),
        ]
      : ['No waypoint is ready to be worked on.']),
    '',
  ].join('\n');
}

function main() {
  const {
    GH_TOKEN,
    GITHUB_REPOSITORY: repo,
    GITHUB_EVENT_NAME: eventName,
    GITHUB_OUTPUT,
    GITHUB_STEP_SUMMARY,
  } = process.env;
  if (!GH_TOKEN) {
    throw new Error('Missing repository secret CHARTED_DISPATCH_TOKEN');
  }

  const setCreated = (waypoints) =>
    appendFileSync(GITHUB_OUTPUT, `created=${JSON.stringify(waypoints)}\n`);

  let paths = [];
  if (eventName === 'push') {
    paths = changedDesignDocs();
    if (paths.length === 0) {
      console.log('No design doc changed by this push.');
      setCreated([]);
      return;
    }
  }

  const waypoints = applyDispatch({
    waypoints: planDispatch({
      docs: loadDesignDocs('.', paths),
      existingBranches: listBranches({ repo, gh: runGh }),
    }),
    repo,
    base: 'main',
    gh: runGh,
  });

  console.log(JSON.stringify({ waypoints }, null, 2));
  appendFileSync(GITHUB_STEP_SUMMARY, formatSummary(waypoints));
  setCreated(waypoints.filter(({ action }) => action === 'created'));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
