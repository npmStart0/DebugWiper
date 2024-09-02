import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.removeAllDebuggers",
    async () => {
      // Gets all the open files in the project
      const files = await vscode.workspace.findFiles(
        "**/*.{js,ts}",
        "**/node_modules/**"
      );

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const edit = new vscode.WorkspaceEdit();

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          // Checking whether the line contains the word 'debugger'
          if (line.text.includes("debugger")) {
            edit.delete(file, line.range);
          }
        }

        await vscode.workspace.applyEdit(edit);
        await document.save();
      }

      vscode.window.showInformationMessage(
        "All debugger statements have been removed!"
      );
    }
  );

  // To pass the debugger commands to a comment
  let commentDebuggersCommand = vscode.commands.registerCommand('extension.commentAllDebuggers', async () => {
    const files = await vscode.workspace.findFiles('**/*.{js,ts}', '**/node_modules/**');

    for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const edit = new vscode.WorkspaceEdit();

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            if (line.text.includes('debugger')) {
                const startIdx = line.text.indexOf('debugger');
                const range = new vscode.Range(i, startIdx, i, startIdx + 'debugger'.length);
                edit.replace(file, range, `// debugger`);
            }
        }

        await vscode.workspace.applyEdit(edit);
        await document.save();
    }

    vscode.window.showInformationMessage('All debugger statements have been commented out!');
});


  context.subscriptions.push(disposable);
  context.subscriptions.push(commentDebuggersCommand);
}

export function deactivate() {}
