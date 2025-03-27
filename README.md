# TaskFlows

A lightweight CLI tool for personal task flow management.

## Installation

```bash
npm install -g taskflows
```

## Usage

```bash
# List all tasks
taskflows list

# Add a new task
taskflows add "Complete project documentation"

# Add a high priority task
taskflows add "Fix critical bug" --priority high

# Mark task as completed (use task ID from list)
taskflows complete 1234567890

# Remove a task
taskflows remove 1234567890
```

## Commands

- `list` (`ls`) - Show all tasks with their status and priority
- `add <task>` - Add a new task
  - `-p, --priority <level>` - Set priority (high/medium/low, default: medium)
- `complete <id>` (`done`) - Mark a task as completed
- `remove <id>` (`rm`) - Remove a task completely

Tasks are stored locally in `~/.taskflows/tasks.json`.