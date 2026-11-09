import assert from 'node:assert/strict';
import { test } from 'node:test';
import { exampleDoc, markWaypointDone } from './charted-fixtures.mjs';
import { resumeStatus } from './charted-resume.mjs';

test('does not match branches that are not waypoint branches', () => {
  assert.deepEqual(resumeStatus({ branch: 'main', docsDir: 'design-docs' }), {
    matched: false,
  });
});

test('reports an unfinished waypoint', () => {
  const readDoc = (path) =>
    path === 'design-docs/001-meal-plan.md' ? exampleDoc : null;

  assert.deepEqual(
    resumeStatus({
      branch: '001-meal-plan-waypoint-1',
      docsDir: 'design-docs',
      readDoc,
    }),
    {
      matched: true,
      designDocPath: 'design-docs/001-meal-plan.md',
      waypoint: 1,
      done: false,
    },
  );
});

test('reports a finished waypoint', () => {
  const status = resumeStatus({
    branch: '001-meal-plan-waypoint-1',
    docsDir: 'design-docs',
    readDoc: () => markWaypointDone(exampleDoc, 1),
  });

  assert.equal(status.done, true);
});

test('does not match an unknown design doc or waypoint', () => {
  assert.equal(
    resumeStatus({
      branch: '001-meal-plan-waypoint-9',
      docsDir: 'design-docs',
      readDoc: () => exampleDoc,
    }).matched,
    false,
  );
  assert.equal(
    resumeStatus({
      branch: '002-unknown-waypoint-1',
      docsDir: 'design-docs',
      readDoc: () => null,
    }).matched,
    false,
  );
});
