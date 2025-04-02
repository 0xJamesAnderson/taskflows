#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const package = require('../package.json');
const TaskStorage = require('../lib/storage');

const storage = new TaskStorage();
const program = new Command();

program
  .name('taskflows')
  .description('Personal task flow management CLI tool')
  .version(package.version);

program
  .command('list')
  .alias('ls')
  .description('List all tasks')
  .option('--pending', 'Show only pending tasks')
  .option('--completed', 'Show only completed tasks')
  .action((options) => {
    let tasks = storage.getTasks();
    
    if (options.pending) {
      tasks = tasks.filter(t => t.status === 'pending');
      console.log(chalk.blue('📋 Pending Tasks:'));
    } else if (options.completed) {
      tasks = tasks.filter(t => t.status === 'completed');
      console.log(chalk.blue('📋 Completed Tasks:'));
    } else {
      console.log(chalk.blue('📋 All Tasks:'));
    }
    
    if (tasks.length === 0) {
      if (options.pending) {
        console.log(chalk.gray('No pending tasks.'));
      } else if (options.completed) {
        console.log(chalk.gray('No completed tasks.'));
      } else {
        console.log(chalk.gray('No tasks yet. Use "taskflows add" to create your first task.'));
      }
      return;
    }

    tasks.forEach((task, index) => {
      const status = task.status === 'completed' ? '✅' : '⏳';
      const priority = task.priority === 'high' ? chalk.red('HIGH') : 
                      task.priority === 'low' ? chalk.gray('LOW') : chalk.yellow('MED');
      console.log(`${status} [${priority}] ${chalk.gray('#' + task.id)} ${task.text}`);
    });
  });

program
  .command('add <task>')
  .description('Add a new task')
  .option('-p, --priority <level>', 'Task priority (high/medium/low)', 'medium')
  .action((task, options) => {
    const newTask = storage.addTask(task, options.priority);
    console.log(chalk.green('✅ Task added:'), task);
    console.log(chalk.gray(`   ID: ${newTask.id} | Priority: ${options.priority}`));
  });

program
  .command('complete <id>')
  .alias('done')
  .description('Mark a task as completed')
  .action((id) => {
    const task = storage.completeTask(id);
    if (task) {
      console.log(chalk.green('✅ Task completed:'), task.text);
    } else {
      console.log(chalk.red('❌ Task not found'));
    }
  });

program
  .command('remove <id>')
  .alias('rm')
  .description('Remove a task')
  .action((id) => {
    const result = storage.removeTask(id);
    if (result) {
      console.log(chalk.yellow('🗑️  Task removed'));
    } else {
      console.log(chalk.red('❌ Task not found'));
    }
  });

program
  .command('clear')
  .description('Remove all completed tasks')
  .action(() => {
    const count = storage.clearCompleted();
    if (count > 0) {
      console.log(chalk.yellow(`🧹 Cleared ${count} completed task${count > 1 ? 's' : ''}`));
    } else {
      console.log(chalk.gray('No completed tasks to clear'));
    }
  });

program
  .command('stats')
  .description('Show task statistics')
  .action(() => {
    const stats = storage.getStats();
    
    console.log(chalk.blue('📊 Task Statistics:'));
    console.log('');
    console.log(chalk.green(`Total tasks: ${stats.total}`));
    console.log(chalk.yellow(`Pending: ${stats.pending}`));
    console.log(chalk.cyan(`Completed: ${stats.completed}`));
    console.log(chalk.magenta(`Completion rate: ${stats.completionRate}%`));
    console.log('');
    console.log(chalk.blue('Priority breakdown:'));
    console.log(chalk.red(`  High: ${stats.priority.high}`));
    console.log(chalk.yellow(`  Medium: ${stats.priority.medium}`));
    console.log(chalk.gray(`  Low: ${stats.priority.low}`));
  });

program.parse();