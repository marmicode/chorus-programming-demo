import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  exampleDoc,
  markWaypointDone,
  parallelRootsDoc,
} from './charted-fixtures.mjs';
import { parseDesignDoc } from './charted-progress.mjs';
import {
  isUnblocked,
  parseWaypointBranch,
  parseWaypointDependencies,
  waypointBranch,
} from './charted-waypoints.mjs';

test('parses waypoint dependencies from the PR Plan mermaid diagram', () => {
  assert.deepEqual(
    parseWaypointDependencies(exampleDoc),
    new Map([
      [2, [1]],
      [3, [1]],
    ]),
  );
});

test('ignores mermaid diagrams outside of the PR Plan', () => {
  const markdown = '# Design\n\n```mermaid\nflowchart TD\n  PR1 --> PR2\n```\n';
  assert.deepEqual(parseWaypointDependencies(markdown), new Map());
});

test('unblocks waypoints whose dependencies are done', () => {
  const dependencies = parseWaypointDependencies(exampleDoc);
  const progress = parseDesignDoc(markWaypointDone(exampleDoc, 1));

  assert.equal(isUnblocked(2, dependencies, progress), true);
  assert.equal(isUnblocked(3, dependencies, progress), true);
});

test('blocks waypoints whose dependencies are not done', () => {
  const dependencies = parseWaypointDependencies(exampleDoc);
  const progress = parseDesignDoc(exampleDoc);

  assert.equal(isUnblocked(1, dependencies, progress), true);
  assert.equal(isUnblocked(2, dependencies, progress), false);
});

test('unblocks every root when the diagram has parallel waypoints', () => {
  const dependencies = parseWaypointDependencies(parallelRootsDoc);
  const progress = parseDesignDoc(parallelRootsDoc);

  assert.equal(isUnblocked(1, dependencies, progress), true);
  assert.equal(isUnblocked(2, dependencies, progress), true);
  assert.equal(isUnblocked(3, dependencies, progress), false);
});

test('without explicit edges, waits for every lower-numbered waypoint', () => {
  const progress = {
    prs: [
      { number: 1, done: true },
      { number: 2, done: false },
      { number: 3, done: false },
    ],
  };

  assert.equal(isUnblocked(2, new Map(), progress), true);
  assert.equal(isUnblocked(3, new Map(), progress), false);
});

test('round-trips waypoint branch names', () => {
  const branch = waypointBranch('design-docs/001-meal-plan.md', 2);

  assert.equal(branch, '001-meal-plan-waypoint-2');
  assert.deepEqual(parseWaypointBranch(branch), {
    designDocStem: '001-meal-plan',
    waypoint: 2,
  });
  assert.equal(parseWaypointBranch('main'), null);
});
