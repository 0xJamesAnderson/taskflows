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
  .action(() => {
    const tasks = storage.getTasks();
    console.log(chalk.blue('📋 Your Tasks:'));
    
    if (tasks.length === 0) {
      console.log(chalk.gray('No tasks yet. Use "taskflows add" to create your first task.'));
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

program.parse();