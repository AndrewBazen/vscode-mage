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

        // Check if running in CI environment
        const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
        
        const launchArgs = [
            '--no-sandbox',
            '--disable-updates', 
            '--skip-welcome',
            '--skip-release-notes',
            '--disable-workspace-trust'
        ];

        // Add additional args for CI/headless environments
        if (isCI) {
            launchArgs.push(
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--no-first-run',
                '--disable-extensions',
                '--disable-default-apps',
                '--headless'
            );
        }

        // Download VS Code, unzip it and run the integration test
        await runTests({ 
            extensionDevelopmentPath, 
            extensionTestsPath,
            version: 'stable',
            launchArgs
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        
        // In CI, provide more helpful error info
        if (process.env.CI === 'true') {
            console.error('💡 Tip: Make sure tests are running with xvfb-run in CI environment');
            console.error('Environment variables:', {
                CI: process.env.CI,
                DISPLAY: process.env.DISPLAY,
                GITHUB_ACTIONS: process.env.GITHUB_ACTIONS
            });
        }
        
        process.exit(1);
    }
}

main(); 