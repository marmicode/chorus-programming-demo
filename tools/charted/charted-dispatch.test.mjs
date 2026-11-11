import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  exampleDoc,
  markWaypointDone,
  parallelRootsDoc,
} from './charted-fixtures.mjs';
import { applyDispatch, planDispatch } from './charted-dispatch.mjs';

const path = 'design-docs/001-meal-plan.md';

test('plans only the first waypoint of a fresh design doc', () => {
  const waypoints = planDispatch({
    docs: [{ path, markdown: exampleDoc }],
    existingBranches: new Set(),
  });

  assert.deepEqual(waypoints, [
    {
      designDocPath: path,
      waypoint: 1,
      waypointCount: 3,
      title: 'List recipes',
      branch: '001-meal-plan-waypoint-1',
      action: 'create',
    },
  ]);
});

test('plans the waypoints unblocked by a done waypoint', () => {
  const waypoints = planDispatch({
    docs: [{ path, markdown: markWaypointDone(exampleDoc, 1) }],
    existingBranches: new Set(),
  });

  assert.deepEqual(
    waypoints.map(({ waypoint, action }) => ({ waypoint, action })),
    [
      { waypoint: 2, action: 'create' },
      { waypoint: 3, action: 'create' },
    ],
  );
});

test('plans every root of a diagram with parallel waypoints', () => {
  const waypoints = planDispatch({
    docs: [
      {
        path: 'design-docs/001-recipe-pagination.md',
        markdown: parallelRootsDoc,
      },
    ],
    existingBranches: new Set(),
  });

  assert.deepEqual(
    waypoints.map(({ waypoint, action }) => ({ waypoint, action })),
    [
      { waypoint: 1, action: 'create' },
      { waypoint: 2, action: 'create' },
    ],
  );
});

test('skips waypoints whose branch already exists', () => {
  const waypoints = planDispatch({
    docs: [{ path, markdown: exampleDoc }],
    existingBranches: new Set(['001-meal-plan-waypoint-1']),
  });

  assert.equal(waypoints[0].action, 'skip');
});

test('creates a branch with a start commit and a draft pull request', () => {
  const calls = [];
  const gh = (args) => {
    calls.push(args);
    if (args[1] === 'repos/acme/kitchen/git/ref/heads/main')
      return 'base-sha\n';
    if (args[1] === 'repos/acme/kitchen/git/commits/base-sha')
      return 'tree-sha\n';
    if (args[1] === 'repos/acme/kitchen/git/commits') return 'start-sha\n';
    if (args[0] === 'pr') return 'https://github.com/acme/kitchen/pull/7\n';
    return '';
  };

  const [waypoint] = applyDispatch({
    waypoints: planDispatch({
      docs: [{ path, markdown: exampleDoc }],
      existingBranches: new Set(),
    }),
    repo: 'acme/kitchen',
    base: 'main',
    gh,
  });

  assert.equal(waypoint.action, 'created');
  assert.equal(waypoint.prUrl, 'https://github.com/acme/kitchen/pull/7');
  assert.ok(
    calls.some((args) =>
      args.includes(
        'message=refactor: 🛠️ start waypoint 1 - List recipes\n\nCharted-Loop: dispatch',
      ),
    ),
  );
  assert.ok(
    calls.some(
      (args) =>
        args.includes('ref=refs/heads/001-meal-plan-waypoint-1') &&
        args.includes('sha=start-sha'),
    ),
  );
  const prCreate = calls.find(
    (args) => args[0] === 'pr' && args.includes('--draft'),
  );
  assert.equal(
    prCreate[prCreate.indexOf('--title') + 1],
    'refactor: 🛠️ [001 · 1/3] List recipes',
  );
});

test('does not call GitHub when there is nothing to create', () => {
  const waypoints = [{ waypoint: 1, action: 'skip' }];

  assert.deepEqual(
    applyDispatch({
      waypoints,
      repo: 'acme/kitchen',
      base: 'main',
      gh: () => assert.fail('unexpected gh call'),
    }),
    waypoints,
  );
});
