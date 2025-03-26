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
}

module.exports = TaskStorage;