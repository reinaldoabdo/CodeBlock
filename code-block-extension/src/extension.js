"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
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
        const decorations = [];
        const regex = /(?:\/\/|#)\s*>>>\s*(.*)[\s\S]*?(?:\/\/|#)\s*<<<$/gm;
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
function deactivate() { }
//# sourceMappingURL=extension.js.map