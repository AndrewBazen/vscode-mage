import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('Mage Language Extension is now active!');

    // Register commands
    const runScript = vscode.commands.registerCommand('mage.runScript', () => {
        runMageScript();
    });

    const runRepl = vscode.commands.registerCommand('mage.runRepl', () => {
        runMageRepl();
    });

    const formatDocument = vscode.commands.registerCommand('mage.formatDocument', () => {
        formatMageDocument();
    });

    // Register language features
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        'mage',
        new MageCompletionProvider(),
        ' ', '.'
    );

    const hoverProvider = vscode.languages.registerHoverProvider(
        'mage',
        new MageHoverProvider()
    );

    // Add to context subscriptions
    context.subscriptions.push(
        runScript,
        runRepl,
        formatDocument,
        completionProvider,
        hoverProvider
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(magic-wand) Mage";
    statusBarItem.tooltip = "Mage Language Support";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

function getMageExecutablePath(): string {
    const config = vscode.workspace.getConfiguration('mage');
    return config.get('executablePath', 'mage');
}

function runMageScript() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active mage file');
        return;
    }

    const document = activeEditor.document;
    if (document.languageId !== 'mage') {
        vscode.window.showErrorMessage('Current file is not a mage script');
        return;
    }

    // Save the document first
    document.save();

    const filePath = document.fileName;
    const mageExecutable = getMageExecutablePath();
    const config = vscode.workspace.getConfiguration('mage');
    const defaultShell = config.get('defaultShell', '');

    let args = [filePath];
    if (defaultShell) {
        args = ['--shell', defaultShell, ...args];
    }

    const terminal = vscode.window.createTerminal({
        name: 'Mage Script',
        cwd: path.dirname(filePath)
    });

    terminal.sendText(`${mageExecutable} ${args.join(' ')}`);
    terminal.show();
}

function runMageRepl() {
    const mageExecutable = getMageExecutablePath();
    const config = vscode.workspace.getConfiguration('mage');
    const defaultShell = config.get('defaultShell', '');

    let args = ['repl'];
    if (defaultShell) {
        args = ['--shell', defaultShell, ...args];
    }

    const terminal = vscode.window.createTerminal({
        name: 'Mage REPL'
    });

    terminal.sendText(`${mageExecutable} ${args.join(' ')}`);
    terminal.show();
}

function formatMageDocument() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showErrorMessage('No active mage file');
        return;
    }

    const document = activeEditor.document;
    if (document.languageId !== 'mage') {
        vscode.window.showErrorMessage('Current file is not a mage script');
        return;
    }

    const mageExecutable = getMageExecutablePath();
    const filePath = document.fileName;

    cp.exec(`${mageExecutable} format "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Mage format error: ${error.message}`);
            return;
        }
        if (stderr) {
            vscode.window.showWarningMessage(`Mage format warning: ${stderr}`);
        }
        if (stdout) {
            // Apply the formatted code to the document
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(document.getText().length)
            );
            edit.replace(document.uri, fullRange, stdout);
            vscode.workspace.applyEdit(edit);
        }
    });
}

class MageCompletionProvider implements vscode.CompletionItemProvider {
    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        // Keywords
        const keywords = [
            'conjure', 'incant', 'curse', 'evoke', 'enchant', 'cast',
            'scry', 'morph', 'lest', 'loop', 'chant',
            'from', 'to', 'step', 'channel', 'recite', 'true', 'false'
        ];

        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            item.detail = `Mage keyword: ${keyword}`;
            completions.push(item);
        });

        // Function snippets
        const snippets = [
            {
                name: 'enchant',
                snippet: 'enchant ${1:function_name}(${2:parameters}) {\n\t${3:// function body}\n}',
                description: 'Define a function'
            },
            {
                name: 'chant',
                snippet: 'chant ${1:variable} from ${2:start} to ${3:end} {\n\t${4:// loop body}\n}',
                description: 'For loop'
            },
            {
                name: 'scry',
                snippet: 'scry ${1:condition} {\n\t${2:// scry body}\n}',
                description: 'Magical conditional'
            },
            {
                name: 'scrylest',
                snippet: 'scry ${1:condition} {\n\t${2:// scry body}\n} lest {\n\t${3:// lest body}\n}',
                description: 'Conditional with else'
            },
            {
                name: 'scrymorph',
                snippet: 'scry ${1:condition} {\n\t${2:// scry body}\n} morph ${3:other_condition} {\n\t${4:// morph body}\n} lest {\n\t${5:// lest body}\n}',
                description: 'Full conditional chain'
            }
        ];

        snippets.forEach(snippet => {
            const item = new vscode.CompletionItem(snippet.name, vscode.CompletionItemKind.Snippet);
            item.insertText = new vscode.SnippetString(snippet.snippet);
            item.detail = snippet.description;
            completions.push(item);
        });

        return completions;
    }
}

class MageHoverProvider implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position
    ): vscode.Hover | undefined {
        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);

        const keywordDescriptions: { [key: string]: string } = {
            'conjure': 'Creates a new variable\n\nExample: `conjure name = "Mage"`',
            'incant': 'Outputs a message to the console\n\nExample: `incant "Hello, World!"`',
            'curse': 'Outputs an error message and exits the script\n\nExample: `curse "Something went wrong!"`',
            'evoke': 'Executes a shell command\n\nExample: `evoke "ls -la"`',
            'enchant': 'Defines a new function\n\nExample: `enchant greet(name) { incant "Hello, $name!" }`',
            'cast': 'Calls a function\n\nExample: `cast greet("World")`',
            'chant': 'Creates a for loop\n\nExample: `chant i from 0 to 5 { incant "i = $i" }`',
            'scry': 'Magical conditional statement (if)\n\nExample: `scry x > 0 { incant "Positive!" }`',
            'morph': 'Else-if clause for scry\n\nExample: `scry x > 0 { incant "Positive!" } morph x == 0 { incant "Zero!" }`',
            'lest': 'Else clause for scry\n\nExample: `scry x > 0 { incant "Positive!" } lest { incant "Not positive!" }`',
            'loop': 'Basic loop (3 iterations)\n\nExample: `loop { incant "Looping!" }`'
        };

        if (keywordDescriptions[word]) {
            return new vscode.Hover(new vscode.MarkdownString(keywordDescriptions[word]));
        }

        return undefined;
    }
}

export function deactivate() {
    console.log('Mage Language Extension deactivated');
} 