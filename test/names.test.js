'use strict';

// Plain node tests for finding a task by name: `npm test`
const assert = require('assert');
const { findByName } = require('../lib/names');

const items = [
  { id: 'a', name: 'Dishwasher', tasks: [{ id: 't1', name: 'Clean filter' }, { id: 't2', name: 'Descale' }] },
  { id: 'b', name: 'CV-ketel / warmtepomp', tasks: [{ id: 't3', name: 'Onderhoudsbeurt' }] },
];
assert.strictEqual(findByName(items, 'Dishwasher', 'Clean filter').task.id, 't1');
assert.strictEqual(findByName(items, '  dishwasher ', 'CLEAN  FILTER').task.id, 't1');
assert.strictEqual(findByName(items, 'Dishwasher/Descale', '').task.id, 't2');
assert.strictEqual(findByName(items, 'Dishwasher: Descale').task.id, 't2');
assert.strictEqual(findByName(items, 'CV-ketel / warmtepomp', 'Onderhoudsbeurt').task.id, 't3');
assert.strictEqual(findByName(items, 'CV-ketel / warmtepomp/Onderhoudsbeurt', '').task.id, 't3');
assert.deepStrictEqual([findByName(items, 'Fridge', 'x').error, findByName(items, 'Fridge', 'x').name], ['item', 'Fridge']);
assert.deepStrictEqual([findByName(items, 'Dishwasher', 'Polish').error, findByName(items, 'Dishwasher', 'Polish').name], ['task', 'Polish']);

console.log('names tests ok');
