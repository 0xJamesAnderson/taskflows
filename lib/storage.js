const fs = require('fs');
const path = require('path');
const os = require('os');

class TaskStorage {
  constructor() {
    this.dataDir = path.join(os.homedir(), '.taskflows');
    this.dataFile = path.join(this.dataDir, 'tasks.json');
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataFile)) {
      this.saveTasks([]);
    }
  }

  loadTasks() {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  saveTasks(tasks) {
    fs.writeFileSync(this.dataFile, JSON.stringify(tasks, null, 2));
  }

  addTask(text, priority = 'medium') {
    const tasks = this.loadTasks();
    const newTask = {
      id: Date.now(),
      text,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  getTasks() {
    return this.loadTasks();
  }

  completeTask(taskId) {
    const tasks = this.loadTasks();
    const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
    
    if (taskIndex === -1) {
      return null;
    }

    tasks[taskIndex].status = 'completed';
    tasks[taskIndex].completedAt = new Date().toISOString();
    this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  removeTask(taskId) {
    const tasks = this.loadTasks();
    const filteredTasks = tasks.filter(t => t.id !== parseInt(taskId));
    
    if (filteredTasks.length === tasks.length) {
      return null;
    }

    this.saveTasks(filteredTasks);
    return true;
  }

  clearCompleted() {
    const tasks = this.loadTasks();
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const completedCount = tasks.length - pendingTasks.length;
    
    if (completedCount === 0) {
      return 0;
    }

    this.saveTasks(pendingTasks);
    return completedCount;
  }

  getStats() {
    const tasks = this.loadTasks();
    const pending = tasks.filter(t => t.status === 'pending');
    const completed = tasks.filter(t => t.status === 'completed');
    const high = tasks.filter(t => t.priority === 'high');
    const medium = tasks.filter(t => t.priority === 'medium');
    const low = tasks.filter(t => t.priority === 'low');

    return {
      total: tasks.length,
      pending: pending.length,
      completed: completed.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0,
      priority: {
        high: high.length,
        medium: medium.length,
        low: low.length
      }
    };
  }
}

module.exports = TaskStorage;