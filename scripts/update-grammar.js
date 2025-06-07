#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Update and validate grammar files
 */
class GrammarUpdater {
  constructor() {
    this.backupDir = path.join(__dirname, '..', '.grammar-backups');
    this.syntaxDir = path.join(__dirname, '..', 'syntaxes');
  }

  /**
   * Create backup of current grammar files
   */
  createBackup() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `mage.tmLanguage.${timestamp}.json`);
    const currentGrammar = path.join(this.syntaxDir, 'mage.tmLanguage.json');

    if (fs.existsSync(currentGrammar)) {
      fs.copyFileSync(currentGrammar, backupPath);
      console.log(`📁 Created backup: ${path.basename(backupPath)}`);
      return backupPath;
    }
    return null;
  }

  /**
   * Validate grammar JSON structure
   */
  validateGrammar(grammarPath) {
    try {
      const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
      
      // Basic validation
      const requiredFields = ['name', 'scopeName', 'patterns'];
      const missingFields = requiredFields.filter(field => !grammar[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      if (!Array.isArray(grammar.patterns)) {
        throw new Error('patterns must be an array');
      }

      console.log('✅ Grammar validation passed');
      return true;
    } catch (error) {
      console.error('❌ Grammar validation failed:', error.message);
      return false;
    }
  }

  /**
   * Restore from backup
   */
  restoreFromBackup(backupPath) {
    if (backupPath && fs.existsSync(backupPath)) {
      const currentGrammar = path.join(this.syntaxDir, 'mage.tmLanguage.json');
      fs.copyFileSync(backupPath, currentGrammar);
      console.log('🔄 Restored grammar from backup');
    }
  }

  /**
   * Clean old backups (keep last 5)
   */
  cleanOldBackups() {
    if (!fs.existsSync(this.backupDir)) return;

    const backups = fs.readdirSync(this.backupDir)
      .filter(file => file.startsWith('mage.tmLanguage.') && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(this.backupDir, file),
        mtime: fs.statSync(path.join(this.backupDir, file)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Keep only the 5 most recent backups
    backups.slice(5).forEach(backup => {
      fs.unlinkSync(backup.path);
      console.log(`🗑️  Removed old backup: ${backup.name}`);
    });
  }

  /**
   * Update grammar with validation and backup
   */
  async update() {
    console.log('🔄 Updating grammar files...\n');

    // Create backup first
    const backupPath = this.createBackup();

    try {
      // Sync language files (this will download new grammar)
      const { syncLanguageFiles } = require('./sync-language.js');
      await syncLanguageFiles();

      // Validate the new grammar
      const grammarPath = path.join(this.syntaxDir, 'mage.tmLanguage.json');
      const isValid = this.validateGrammar(grammarPath);

      if (!isValid) {
        console.log('🔄 Restoring from backup due to validation failure...');
        this.restoreFromBackup(backupPath);
        process.exit(1);
      }

      // Clean old backups
      this.cleanOldBackups();

      console.log('\n✅ Grammar update completed successfully!');

    } catch (error) {
      console.error('❌ Error updating grammar:', error.message);
      console.log('🔄 Restoring from backup...');
      this.restoreFromBackup(backupPath);
      process.exit(1);
    }
  }
}

/**
 * Main execution
 */
if (require.main === module) {
  const updater = new GrammarUpdater();
  updater.update();
}

module.exports = GrammarUpdater; 