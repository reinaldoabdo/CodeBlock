import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeBlock: activate');
                const boxDeco = vscode.window.createTextEditorDecorationType({
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    isWholeLine: true
                });

        const labelDeco = vscode.window.createTextEditorDecorationType({});
            const hideCommentDeco = vscode.window.createTextEditorDecorationType({ color: 'transparent', backgroundColor: 'transparent' });
            const topDeco = vscode.window.createTextEditorDecorationType({});
            const bottomDeco = vscode.window.createTextEditorDecorationType({});

        const update = (editor?: vscode.TextEditor) => {
        const ed = editor ?? vscode.window.activeTextEditor;
        if (!ed) return;
        const text = ed.document.getText();
    const boxDecs: vscode.DecorationOptions[] = [];
    const labelDecs: vscode.DecorationOptions[] = [];
    const hideDecs: vscode.DecorationOptions[] = [];
    const topDecs: vscode.DecorationOptions[] = [];
    const bottomDecs: vscode.DecorationOptions[] = [];
        // permite prefixo de comentário (//, #, /*), aceita >>> ... <<< ou <<< ... >>>
        const re = /(?:\/\/\s*|#\s*|\/\*\s*)?(?:>>>|<<<)\s*(.*?)\s*[\s\S]*?\s*(?:<<<|>>>)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
            const start = ed.document.positionAt(m.index);
            const end = ed.document.positionAt(m.index + m[0].length);
                // pintar o bloco (linha inteira)
                boxDecs.push({ range: new vscode.Range(start, end), hoverMessage: m[1] || undefined });
                // preparar legenda e linhas superior/inferior
                const legend = (m[1] || '').trim();
                const header = legend.length ? `--| ${legend} |` : '--| |';
                const totalLen = 120;
                const headerPad = totalLen - header.length;
                const headerTail = headerPad > 0 ? '-'.repeat(headerPad) : '';
                const topText = header + headerTail;
                const bottomText = '-'.repeat(totalLen);
                const topRange = new vscode.Range(start, start);
                const bottomRange = new vscode.Range(end, end);
                topDecs.push({ range: topRange, renderOptions: { before: { contentText: topText, color: '#000000', margin: '0 0 0 0', fontWeight: 'normal' } } });
                bottomDecs.push({ range: bottomRange, renderOptions: { after: { contentText: bottomText, color: new vscode.ThemeColor('editorLineNumber.foreground') as any, margin: '0 0 0 0' } } });
                // esconder o comentário original na linha de abertura (apenas o trecho do comentário)
                const openLocal = m[0].indexOf('>>>');
                if (openLocal !== -1) {
                    const openIdx = m.index + openLocal;
                    // retrocede até o início da linha para pegar prefixo de comentário e espaços
                    const lineStart = text.lastIndexOf('\n', openIdx) + 1;
                    // caso não haja nova linha, lineStart será 0
                    // também ajusta para capturar markers de comentário comuns antes do >>>
                    const pre = text.slice(lineStart, openIdx);
                    const commentPrefixMatch = pre.match(/(\s*(?:\/\/|#|\/\*)\s*)$/);
                    const startIdx = commentPrefixMatch ? (lineStart + commentPrefixMatch.index!) : lineStart;
                    const lineEnd = text.indexOf('\n', openIdx);
                    const commentEnd = lineEnd === -1 ? (m.index + m[0].length) : lineEnd;
                    const commentStartPos = ed.document.positionAt(startIdx);
                    const commentEndPos = ed.document.positionAt(commentEnd);
                    hideDecs.push({ range: new vscode.Range(commentStartPos, commentEndPos) });
                }
                        // (antiga lógica de linha superior/inferior removida — usamos topText/bottomText)
                console.log('CodeBlock: match ->', { legend: m[1], index: m.index, length: m[0].length, snippet: m[0].slice(0, 80) });
        }
            ed.setDecorations(boxDeco, boxDecs);
            try {
                if (typeof labelDeco !== 'undefined') {
                    ed.setDecorations(labelDeco, labelDecs);
                }
                if (typeof hideCommentDeco !== 'undefined' && hideDecs.length) {
                    ed.setDecorations(hideCommentDeco, hideDecs);
                }
                if (typeof topDeco !== 'undefined') {
                    ed.setDecorations(topDeco, topDecs);
                }
                if (typeof bottomDeco !== 'undefined') {
                    ed.setDecorations(bottomDeco, bottomDecs);
                }
            }
            catch (e) { console.error('CodeBlock: could not apply decos', e); }
            console.log('CodeBlock: found', boxDecs.length, 'block(s) in', ed.document.fileName);
    };

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((e) => update(e)),
            vscode.workspace.onDidChangeTextDocument((ev) => {
            const ed = vscode.window.activeTextEditor;
            if (ed && ev.document === ed.document) update(ed);
        })
    );

        // comando para forçar atualização manualmente
        context.subscriptions.push(vscode.commands.registerCommand('code-block.toggle', () => update()));

    // initial
    update();
}

export function deactivate() {}