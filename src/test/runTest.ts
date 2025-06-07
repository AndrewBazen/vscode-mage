import * as path from 'path';
import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // The path to test runner
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');

        // Download VS Code, unzip it and run the integration test
        await runTests({ 
            extensionDevelopmentPath, 
            extensionTestsPath,
            // Use VSCode Insiders for testing
            version: 'stable',
            // Additional launch arguments
            launchArgs: [
                '--no-sandbox',
                '--disable-updates',
                '--skip-welcome',
                '--skip-release-notes',
                '--disable-workspace-trust'
            ]
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main(); 