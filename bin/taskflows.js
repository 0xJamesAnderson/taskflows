#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const package = require('../package.json');

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
    console.log(chalk.blue('📋 Your Tasks:'));
    console.log(chalk.gray('No tasks yet. Use "taskflows add" to create your first task.'));
  });

program
  .command('add <task>')
  .description('Add a new task')
  .action((task) => {
    console.log(chalk.green('✅ Task added:'), task);
  });

program.parse();