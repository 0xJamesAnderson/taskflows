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
}

module.exports = TaskStorage;