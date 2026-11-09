#!/usr/bin/env node
/**
 * Tells whether a waypoint branch still has work left, so the charted loop can resume it.
 *
 * Usage: node charted-resume.mjs --branch <branch> [--docs-dir design-docs]
 *
 * Prints {matched, designDocPath?, waypoint?, done?}: matched is false when the branch
 * is not a waypoint branch or its design doc / waypoint cannot be found.
 */
import { existsSync, readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { parseDesignDoc } from './charted-progress.mjs';
import { parseWaypointBranch } from './charted-waypoints.mjs';

/**
 * @param {{branch: string, docsDir: string, readDoc?: (path: string) => string | null}} options
 */
export function resumeStatus({ branch, docsDir, readDoc = readIfExists }) {
  const parsed = parseWaypointBranch(branch);
  if (!parsed) {
    return { matched: false };
  }

  const designDocPath = `${docsDir}/${parsed.designDocStem}.md`;
  const markdown = readDoc(designDocPath);
  const pr = markdown
    ? parseDesignDoc(markdown).prs.find((pr) => pr.number === parsed.waypoint)
    : undefined;
  if (!pr) {
    return { matched: false, designDocPath, waypoint: parsed.waypoint };
  }

  return {
    matched: true,
    designDocPath,
    waypoint: parsed.waypoint,
    done: pr.done,
  };
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { values } = parseArgs({
    options: {
      branch: { type: 'string' },
      'docs-dir': { type: 'string', default: 'design-docs' },
    },
  });
  if (!values.branch) {
    console.error(
      'Usage: charted-resume.mjs --branch <branch> [--docs-dir design-docs]',
    );
    process.exit(1);
  }
  console.log(
    JSON.stringify(
      resumeStatus({ branch: values.branch, docsDir: values['docs-dir'] }),
    ),
  );
}
