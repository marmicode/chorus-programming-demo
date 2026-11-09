import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatSummary } from './charted-dispatch-github.mjs';

test('summarizes dispatched waypoints as a table', () => {
  const summary = formatSummary([
    {
      designDocPath: 'design-docs/001-meal-plan.md',
      waypoint: 1,
      title: 'List recipes',
      branch: '001-meal-plan-waypoint-1',
      action: 'created',
      prUrl: 'https://github.com/acme/kitchen/pull/7',
    },
    {
      designDocPath: 'design-docs/001-meal-plan.md',
      waypoint: 2,
      title: 'Filter recipes',
      branch: '001-meal-plan-waypoint-2',
      action: 'skip',
    },
  ]);

  assert.equal(
    summary,
    `### Charted dispatch

| Waypoint | Branch | Action | Pull request |
| --- | --- | --- | --- |
| design-docs/001-meal-plan.md #1 - List recipes | 001-meal-plan-waypoint-1 | created | https://github.com/acme/kitchen/pull/7 |
| design-docs/001-meal-plan.md #2 - Filter recipes | 001-meal-plan-waypoint-2 | skip |  |
`,
  );
});

test('says so when no waypoint is ready', () => {
  assert.match(formatSummary([]), /No waypoint is ready to be worked on\./);
});
