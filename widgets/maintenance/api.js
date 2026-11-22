'use strict';

const ORDER = ['ok', 'soon', 'due', 'overdue'];

module.exports = {

  // All tasks of all items, most urgent first.
  async getTasks({ homey }) {
    const tasks = [];
    for (const item of await homey.app.items.evaluate()) {
      const iconUri = await homey.app.iconFor(item);
      for (const task of item.tasks) {
        tasks.push({
          itemId: item.id,
          item: item.name,
          iconUri,
          taskId: task.id,
          task: task.name,
          status: task.status,
          days: task.days,
          dueDate: task.dueDate,
          progress: task.progress,
          type: task.type,
          // Signal tasks: what the device reports now (e.g. salt 20 %), instead of a progress percentage.
          value: task.source && task.source.metric === 'signal' && task.track && typeof task.track.last === 'number'
            ? `${task.track.last}${task.source.units ? ` ${task.source.units}` : ''}` : null,
        });
      }
    }
    return tasks.sort((a, b) => ORDER.indexOf(b.status) - ORDER.indexOf(a.status)
      || (a.days ?? 99999) - (b.days ?? 99999)
      || (b.progress ?? 0) - (a.progress ?? 0));
  },

  async markDone({ homey, body }) {
    await homey.app.items.markDone(body.itemId, body.taskId);
    return true;
  },

};
