import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const registry = JSON.parse(await readFile(new URL('../registry/woc-blocks.json', import.meta.url), 'utf8'));
const stages = ['built', 'tested', 'integrated', 'deployable', 'deployed'];

test('ieder WOC-blok toont alle vijf bewijsstappen', () => {
  for (const block of registry.blocks) {
    assert.deepEqual(Object.keys(block.lifecycle), stages);
    for (const stage of stages) {
      assert.equal(typeof block.lifecycle[stage].passed, 'boolean');
      if (block.lifecycle[stage].passed) assert.ok(block.lifecycle[stage].evidence);
    }
  }
});

test('inzetbaarheid vereist bouw, tests en integratie; deployment vereist inzetbaarheid', () => {
  for (const block of registry.blocks) {
    if (block.lifecycle.deployable.passed) assert.equal(['built', 'tested', 'integrated'].every(stage => block.lifecycle[stage].passed), true);
    if (block.lifecycle.deployed.passed) assert.equal(block.lifecycle.deployable.passed, true);
  }
});

test('iedere geregistreerde afnemer heeft gebruiksduur en bewijs', () => {
  for (const block of registry.blocks) for (const consumer of block.consumers) {
    assert.ok(consumer.applicationId && consumer.name && consumer.type && consumer.environment && consumer.version && consumer.evidence);
    assert.equal(Number.isNaN(Date.parse(consumer.since)), false);
    assert.equal(Number.isNaN(Date.parse(consumer.lastVerifiedAt)), false);
  }
});
