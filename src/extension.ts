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
  

  let breakpointsBackup: vscode.SourceBreakpoint[] = [];

let commentDebuggersCommand = vscode.commands.registerCommand(
  "extension.commentAllDebuggers",
  async () => {
    const files = await vscode.workspace.findFiles(
      "**/*.{js,ts}",
      "**/node_modules/**"
    );

    // Backup breakpoints
    breakpointsBackup = vscode.debug.breakpoints
      .filter((bp) => bp instanceof vscode.SourceBreakpoint)
      .map((bp) => bp as vscode.SourceBreakpoint);

    // Remove all breakpoints
    vscode.debug.removeBreakpoints(breakpointsBackup);

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
      let changesMade = false;

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const lineText = line.text;

        const debuggerPattern = /\/\/\s*debugger/g;
        let match: RegExpExecArray | null;

        while ((match = debuggerPattern.exec(lineText)) !== null) {
          const startIdx = match.index;
          const endIdx = startIdx + match[0].length;

          const range = new vscode.Range(i, startIdx, i, endIdx);
          edit.replace(file, range, "debugger");
          changesMade = true;

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

    // Restore breakpoints
    vscode.debug.addBreakpoints(breakpointsBackup);

    vscode.window.showInformationMessage(
      "Finished restoring debugger statements and breakpoints!"
    );
  }
);


  context.subscriptions.push(disposable);
  context.subscriptions.push(commentDebuggersCommand);
  context.subscriptions.push(restoreDebuggersCommand);
}

export function deactivate() {}
