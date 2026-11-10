'use strict';

// Find an item and task by their names, for Flow cards that take text or tags (pure function, easy to test).
// Matching ignores case and extra spaces. When no task name is given, "Item / Task" or "Item: Task" in the item
// field is split (the last separator wins, so item names may contain one themselves).
const norm = s => String(s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

function splitCombined(itemName, taskName) {
  if (norm(taskName)) return [itemName, taskName];
  const text = String(itemName ?? '');
  const at = Math.max(text.lastIndexOf('/'), text.lastIndexOf(':'));
  return at > 0 ? [text.slice(0, at), text.slice(at + 1)] : [itemName, taskName];
}

/** Returns { item, task } or { error: 'item' | 'task', item?, name } */
function findByName(items, itemName, taskName) {
  const [iName, tName] = splitCombined(itemName, taskName);
  const item = items.find(i => norm(i.name) === norm(iName));
  if (!item) return { error: 'item', name: String(iName ?? '').trim() };
  const task = item.tasks.find(t => norm(t.name) === norm(tName));
  if (!task) return { error: 'task', item, name: String(tName ?? '').trim() };
  return { item, task };
}

module.exports = { findByName };
