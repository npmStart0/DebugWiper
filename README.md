# Debugger Wipe

A simple Visual Studio Code extension to manage 'debugger' statements and breakpoints in your project.

## Installation

You can install the Debugger Wipe extension from the Visual Studio Code Marketplace.

## Usage

### Comment All Debuggers

1. Press `Ctrl+Shift+P` to open the command palette.
2. Type `Comment All Debuggers` and select the command.
3. This command will comment out all 'debugger' statements in your project and remove all existing breakpoints. The breakpoints are saved and can be restored later.

### Restore Debuggers

1. Press `Ctrl+Shift+P` to open the command palette.
2. Type `Restore Debuggers` and select the command.
3. This command will restore all previously commented-out 'debugger' statements in your project. It will also restore any breakpoints that were saved when commenting out the debuggers.

### Remove All Debuggers

1. Press `Ctrl+Shift+P` to open the command palette.
2. Type `Remove All Debuggers` and select the command.
3. This command will remove all 'debugger' statements from your project. 

## Keyboard Shortcuts

To make using the Debugger Wipe more convenient, you can use the following keyboard shortcuts:

- **Comment All Debuggers:** `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (macOS)
- **Restore Debuggers:** `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)
- **Remove All Debuggers:** `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (macOS)

To customize these shortcuts:

1. Open **Keyboard Shortcuts** by pressing `Ctrl+K Ctrl+S` (or `Cmd+K Cmd+S` on macOS).
2. Search for `Comment All Debuggers`, `Restore Debuggers`, or `Remove All Debuggers`.
3. Click on the pencil icon next to the command and enter your desired keyboard shortcut.

## Support

If you encounter any issues, please report them at [issue tracker link] or contact support at npmstart2@gmail.com.

## License

This extension is licensed under npm-start.
