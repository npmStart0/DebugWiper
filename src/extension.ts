import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.removeAllDebuggers', async () => {
		// Gets all the open files in the project
        const files = await vscode.workspace.findFiles('**/*.{js,ts}', '**/node_modules/**');

        for (const file of files) {
            const document = await vscode.workspace.openTextDocument(file);
            const edit = new vscode.WorkspaceEdit();

            for (let i = 0; i < document.lineCount; i++) {
                const line = document.lineAt(i);
                // Checking whether the line contains the word 'debugger'
                if (line.text.includes('debugger')) {
                    edit.delete(file, line.range);
                }
            }

            await vscode.workspace.applyEdit(edit);
            await document.save();
        }

        vscode.window.showInformationMessage('All debugger statements have been removed!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
