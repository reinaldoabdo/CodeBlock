import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const decorationType = vscode.window.createTextEditorDecorationType({
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        isWholeLine: true,
    });

    let activeEditor = vscode.window.activeTextEditor;

    function updateDecorations() {
        if (!activeEditor) {
            return;
        }

        const text = activeEditor.document.getText();
        const decorations: vscode.DecorationOptions[] = [];
        const regex = />>>\s*(.*)[\s\S]*?<<</g;
        let match;

        while (match = regex.exec(text)) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const legend = match[1];

            const decoration = {
                range: new vscode.Range(startPos, endPos),
                hoverMessage: 'Code Block',
                renderOptions: {
                    before: {
                        contentText: legend,
                        color: 'rgba(255, 255, 255, 0.5)',
                        margin: '0 0 0 1em',
                    }
                }
            };

            decorations.push(decoration);
        }

        activeEditor.setDecorations(decorationType, decorations);
    }

    if (activeEditor) {
        updateDecorations();
    }

    vscode.window.onDidChangeActiveTextEditor(editor => {
        activeEditor = editor;
        if (editor) {
            updateDecorations();
        }
    }, null, context.subscriptions);

    vscode.workspace.onDidChangeTextDocument(event => {
        if (activeEditor && event.document === activeEditor.document) {
            updateDecorations();
        }
    }, null, context.subscriptions);
}

export function deactivate() {}