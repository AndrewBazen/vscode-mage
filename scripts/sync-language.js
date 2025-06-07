#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

/**
 * Configuration for syncing from the main Mage language repository
 */
const CONFIG = {
  // Update these URLs to point to your actual Mage language repository
  MAIN_REPO_URL: 'https://github.com/AndrewBazen/mage',
  GRAMMAR_FILE_URL: 'https://raw.githubusercontent.com/AndrewBazen/mage/main/editor-support/vscode/syntaxes/mage.tmLanguage.json',
  LANGUAGE_CONFIG_URL: 'https://raw.githubusercontent.com/AndrewBazen/mage/main/editor-support/vscode/language-configuration.json',
  SNIPPETS_URL: 'https://raw.githubusercontent.com/AndrewBazen/mage/main/editor-support/vscode/snippets/mage.json',
  EXAMPLES_URL: 'https://raw.githubusercontent.com/AndrewBazen/mage/examples',
};

/**
 * Download a file from URL and save it locally
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
          resolve();
        });
      } else if (response.statusCode === 404) {
        console.log(`⚠ File not found (404): ${url}`);
        file.close();
        fs.unlinkSync(outputPath); // Clean up empty file
        resolve(); // Don't reject, just skip this file
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(outputPath); // Clean up on error
      reject(err);
    });
  });
}

/**
 * Sync language files from the main repository
 */
async function syncLanguageFiles() {
  console.log('🔄 Syncing language files from main Mage repository...\n');

  try {
    // Create directories if they don't exist
    const dirs = ['syntaxes', 'snippets'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Download files in parallel
    const downloads = [
      downloadFile(CONFIG.GRAMMAR_FILE_URL, 'syntaxes/mage.tmLanguage.json'),
      downloadFile(CONFIG.LANGUAGE_CONFIG_URL, 'language-configuration.json'),
      downloadFile(CONFIG.SNIPPETS_URL, 'snippets/mage.json'),
    ];

    await Promise.all(downloads);

    console.log('\n✅ Language sync completed successfully!');
    
    // Update package.json version based on git commit or timestamp
    updateVersion();
    
  } catch (error) {
    console.error('❌ Error syncing language files:', error.message);
    process.exit(1);
  }
}

/**
 * Update version in package.json based on current timestamp or git info
 */
function updateVersion() {
  try {
    const packagePath = 'package.json';
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Try to get git commit hash for version
    let versionSuffix = '';
    try {
      const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      versionSuffix = `-${commitHash}`;
    } catch (e) {
      // Fallback to timestamp if git is not available
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      versionSuffix = `-${timestamp}`;
    }
    
    // Update version (keep major.minor.patch, add suffix)
    const [major, minor, patch] = packageJson.version.split('.');
    const baseVersion = `${major}.${minor}.${patch.split('-')[0]}`;
    packageJson.version = `${baseVersion}${versionSuffix}`;
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log(`📦 Updated version to: ${packageJson.version}`);
    
  } catch (error) {
    console.log('⚠ Could not update version:', error.message);
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  syncLanguageFiles();
}

module.exports = { syncLanguageFiles, downloadFile }; 