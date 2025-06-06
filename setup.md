# VSCode Mage Extension Setup

## Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **VSCode Extension Manager (vsce)**:
   ```bash
   npm install -g @vscode/vsce
   ```

## Setup Steps

### 1. Install Dependencies

```bash
cd vscode-mage
npm install
```

### 2. Compile TypeScript

```bash
npm run compile
```

### 3. Test the Extension

Press `F5` in VSCode to launch the Extension Development Host with your extension loaded.

### 4. Package the Extension

```bash
vsce package
```

This creates a `.vsix` file that you can install or distribute.

### 5. Install the Extension

```bash
# Install in your VSCode
code --install-extension mage-language-0.1.0.vsix
```

Or use VSCode UI:
1. Press `Ctrl+Shift+P`
2. Run "Extensions: Install from VSIX..."
3. Select the `.vsix` file

## Development Workflow

### Watch Mode
For active development, use watch mode:
```bash
npm run watch
```

Then press `Ctrl+R` in the Extension Development Host to reload changes.

### Manual Testing
1. Create a test `.mage` file
2. Verify syntax highlighting works
3. Test snippets by typing prefixes like `conjure`, `incant`, etc.
4. Test commands:
   - `Ctrl+F5` to run script
   - `Ctrl+Shift+R` for REPL
   - Hover over keywords for documentation

## Publishing (Optional)

### To Visual Studio Marketplace:
1. Create publisher account at https://marketplace.visualstudio.com/
2. Get Personal Access Token from Azure DevOps
3. Login: `vsce login <publisher-name>`
4. Publish: `vsce publish`

### To Open VSX Registry:
```bash
npm install -g ovsx
ovsx publish mage-language-0.1.0.vsix
```

## Troubleshooting

### TypeScript Errors
- Make sure all dependencies are installed: `npm install`
- Check `tsconfig.json` is properly configured

### Extension Not Loading
- Check `package.json` syntax
- Verify all file paths in contributions section
- Look at Output > Extension Host for errors

### Syntax Highlighting Issues
- Verify `syntaxes/mage.tmLanguage.json` is valid JSON
- Check grammar patterns match your language syntax
- Test with simple patterns first

## File Structure

```
vscode-mage/
├── package.json              # Extension manifest
├── src/
│   └── extension.ts         # Main extension code
├── syntaxes/
│   └── mage.tmLanguage.json # TextMate grammar
├── snippets/
│   └── mage.json           # Code snippets
├── icons/
│   ├── mage-dark.svg       # Dark theme icon
│   └── mage-light.svg      # Light theme icon
├── language-configuration.json
├── tsconfig.json
├── README.md
└── .vscodeignore
```

## Next Steps

1. **Test thoroughly** with various `.mage` files
2. **Add more features** like:
   - Diagnostics/linting
   - Code formatting
   - Debugging support
   - Advanced IntelliSense
3. **Improve syntax highlighting** based on usage
4. **Add more snippets** for common patterns
5. **Create themes** specifically for mage files 