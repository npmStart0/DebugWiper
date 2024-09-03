import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.removeAllDebuggers",
    async () => {
      // Get all open files in the project
      const files = await vscode.workspace.findFiles(
        "**/*.{js,ts}",
        "**/node_modules/**"
      );
  
      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const edit = new vscode.WorkspaceEdit();
  
        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          // Check if the line contains the word 'debugger'
          const debuggerIndex = line.text.indexOf("debugger");
          if (debuggerIndex !== -1) {
            const range = new vscode.Range(i, debuggerIndex, i, debuggerIndex + "debugger".length);
            edit.delete(file, range);
          }
        }
  
        await vscode.workspace.applyEdit(edit);
        await document.save();
      }
  
      // Remove all breakpoints
      vscode.debug.removeBreakpoints(vscode.debug.breakpoints);
  
      vscode.window.showInformationMessage(
        "All debugger statements and breakpoints have been removed!"
      );
    }
  );
  

  // To pass the debugger commands to a comment
  let commentDebuggersCommand = vscode.commands.registerCommand(
    "extension.commentAllDebuggers",
    async () => {
      const files = await vscode.workspace.findFiles(
        "**/*.{js,ts}",
        "**/node_modules/**"
      );

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const edit = new vscode.WorkspaceEdit();

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          if (line.text.includes("debugger")) {
            const startIdx = line.text.indexOf("debugger");
            const range = new vscode.Range(
              i,
              startIdx,
              i,
              startIdx + "debugger".length
            );
            edit.replace(file, range, `// debugger`);
          }
        }

        await vscode.workspace.applyEdit(edit);
        await document.save();
      }

      vscode.window.showInformationMessage(
        "All debugger statements have been commented out!"
      );
    }
  );

  let restoreDebuggersCommand = vscode.commands.registerCommand(
    "extension.restoreDebuggers",
    async () => {
      const files = await vscode.workspace.findFiles(
        "**/*.{js,ts}",
        "**/node_modules/**"
      );

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const edit = new vscode.WorkspaceEdit();
        let changesMade = false; // Flag to check if any changes were made

        for (let i = 0; i < document.lineCount; i++) {
          const line = document.lineAt(i);
          const lineText = line.text;

          // Log the line content for debugging
          console.log(`Processing line ${i}: ${lineText}`);

          // Check if the line contains the text '// debugger'
          const debuggerPattern = /\/\/\s*debugger/g;
          let match: RegExpExecArray | null;

          while ((match = debuggerPattern.exec(lineText)) !== null) {
            const startIdx = match.index;
            const endIdx = startIdx + match[0].length;

            // Define the range to replace, only `// debugger`
            const range = new vscode.Range(i, startIdx, i, endIdx);

            // Replace the commented 'debugger' with uncommented 'debugger'
            edit.replace(file, range, "debugger");
            changesMade = true; // Set flag to true

            console.log(`Restored debugger in file: ${file.fsPath}, line ${i}`);
          }
        }

        if (changesMade) {
          await vscode.workspace.applyEdit(edit);
          await document.save();
          vscode.window.showInformationMessage(
            `Debugger statements have been restored in file: ${file.fsPath}`
          );
        } else {
          vscode.window.showInformationMessage(
            `No debugger statements found in file: ${file.fsPath}`
          );
        }
      }

      vscode.window.showInformationMessage(
        "Finished restoring debugger statements!"
      );
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(commentDebuggersCommand);
  context.subscriptions.push(restoreDebuggersCommand);
}

export function deactivate() {}
