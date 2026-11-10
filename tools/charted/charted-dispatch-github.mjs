#!/usr/bin/env node
/**
 * GitHub Actions entry point of the charted dispatch (.github/workflows/charted-dispatch.yml).
 *
 * Usage: node charted-dispatch-github.mjs
 *
 * - Considers every design doc under design-docs/, whatever triggered the run (push or
 *   workflow_dispatch): a waypoint can be unblocked by a change outside its own design doc.
 * - Opens a branch + draft pull request for each unblocked waypoint (see charted-dispatch.mjs).
 * - Writes a summary table to GITHUB_STEP_SUMMARY and the created waypoints, as a JSON array,
 *   to the "created" step output.
 *
 * Requires GH_TOKEN (a PAT: refs and pull requests created with GITHUB_TOKEN would not trigger
 * the Test workflow), GITHUB_REPOSITORY, GITHUB_OUTPUT and GITHUB_STEP_SUMMARY.
 */
import { appendFileSync } from 'node:fs';
import {
  applyDispatch,
  listBranches,
  loadDesignDocs,
  planDispatch,
  runGh,
} from './charted-dispatch.mjs';

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
    GITHUB_OUTPUT,
    GITHUB_STEP_SUMMARY,
  } = process.env;
  if (!GH_TOKEN) {
    throw new Error('Missing repository secret CHARTED_DISPATCH_GITHUB_TOKEN');
  }

  const waypoints = applyDispatch({
    waypoints: planDispatch({
      docs: loadDesignDocs('.', []),
      existingBranches: listBranches({ repo, gh: runGh }),
    }),
    repo,
    base: 'main',
    gh: runGh,
  });

  console.log(JSON.stringify({ waypoints }, null, 2));
  appendFileSync(GITHUB_STEP_SUMMARY, formatSummary(waypoints));
  appendFileSync(
    GITHUB_OUTPUT,
    `created=${JSON.stringify(waypoints.filter(({ action }) => action === 'created'))}\n`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
