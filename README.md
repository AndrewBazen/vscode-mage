# Mage Language Support for VSCode

A comprehensive VSCode extension providing language support for the Mage scripting language - a magic-themed, cross-platform scripting language.

## Features

### ✨ Syntax Highlighting
- Full syntax highlighting for all Mage keywords and constructs
- String interpolation highlighting with `$variable` syntax
- Comment highlighting (both `#` line comments and `## ##` block comments)
- Number and operator highlighting

### 🔮 Language Features
- **IntelliSense**: Auto-completion for Mage keywords and functions
- **Hover Information**: Detailed descriptions and examples for keywords
- **Code Snippets**: Pre-built snippets for common Mage patterns
- **Bracket Matching**: Auto-closing brackets and quotes
- **Code Folding**: Support for folding code blocks

### ⚡ Commands & Features
- **Run Mage Script** (`Ctrl+F5`): Execute the current .mage file
- **Start Mage REPL** (`Ctrl+Shift+R`): Launch an interactive Mage session
- **Format Document**: Auto-format Mage code (if formatter is available)

### 🎯 Code Snippets

Type these prefixes and press Tab to expand:

- `conjure` - Variable declaration
- `incant` - Output statement
- `curse` - Error statement
- `evoke` - Shell command
- `enchant` - Function definition
- `cast` - Function call
- `chant` - For loop
- `chantstep` - For loop with step
- `scry` - Magical conditional statement
- `scrylest` - Conditional with else clause
- `scrymorph` - Full conditional chain (if-else if-else)
- `header` - Script header template
- `dotfiles` - Dotfiles setup function
- `crossplatform` - Cross-platform command

## Installation

### From VSIX Package
1. Download the latest `.vsix` file from releases
2. In VSCode, press `Ctrl+Shift+P` and run "Extensions: Install from VSIX..."
3. Select the downloaded `.vsix` file

### From Source
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` to launch a new VSCode window with the extension loaded

## Configuration

Configure the extension through VSCode settings:

```json
{
  "mage.executablePath": "mage",
  "mage.defaultShell": "",
  "mage.enableAutoCompletion": true,
  "mage.enableSyntaxHighlighting": true
}
```

### Settings

- `mage.executablePath`: Path to the mage executable (default: "mage")
- `mage.defaultShell`: Default shell to use for mage scripts
- `mage.enableAutoCompletion`: Enable auto-completion features
- `mage.enableSyntaxHighlighting`: Enable syntax highlighting

## File Association

The extension automatically associates `.mage` files with the Mage language. You can also manually set the language mode by clicking on the language indicator in the status bar and selecting "Mage".

## Mage Language Overview

Mage is a cross-platform scripting language with magic-themed keywords:

```mage
#!/usr/bin/env mage
# Welcome to Mage! 🧙‍♂️

conjure name = "World"
incant "Hello, $name!"

# Conditional magic  
scry name == "World" {
    incant "Greetings, earthling!"
} morph name == "Gandalf" {
    incant "Welcome, wise wizard!"
} lest {
    incant "Welcome, $name!"
}

# Loops and iteration
chant i from 1 to 5 {
    incant "Counting: $i"
}

# Functions (spells)
enchant greet(person) {
    incant "🌟 Magical greetings, $person!"
}

cast greet("Mage User")

# Shell commands
evoke "echo 'System information:'"
evoke "uname -a || ver"  # Cross-platform
```

## Features in Detail

### Keywords and Constructs

- `conjure` - Variable declaration
- `incant` - Output/print
- `curse` - Error output and exit
- `evoke` - Shell command execution
- `enchant` - Function definition
- `cast` - Function call
- `chant` - For loop (`from`/`to`/`step`)
- `scry`/`morph`/`lest` - Conditionals (if/else-if/else)
- `loop` - Basic loop

### String Interpolation

Mage supports variable interpolation in strings:
```mage
conjure user = "Gandalf"
incant "Welcome, $user!"
incant "Path: ${HOME}/mage"
```

### Cross-Platform Shell Commands

```mage
# Cross-platform file listing
evoke "ls -la 2>/dev/null || dir"

# Cross-platform package management
evoke "which brew >/dev/null && brew install git || which choco >/dev/null && choco install git"
```

## Development

### Building the Extension

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
vsce package
```

### Testing

1. Press `F5` to launch Extension Development Host
2. Open a `.mage` file
3. Test syntax highlighting, snippets, and commands

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- [Report Issues](https://github.com/your-username/mage-vscode-extension/issues)
- [Request Features](https://github.com/your-username/mage-vscode-extension/issues)
- [Documentation](https://github.com/your-username/mage-language)

---

**Happy coding with Mage! 🧙‍♂️✨** 