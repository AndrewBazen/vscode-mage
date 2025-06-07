import * as assert from 'assert';
import * as vscode from 'vscode';

// Simple test without Mocha globals to avoid type issues
export async function testCompletionProvider() {
    console.log('🧪 Testing Completion Provider...');
    
    try {
        // Test that extension is loaded
        const extension = vscode.extensions.getExtension('mage-lang.mage-language');
        assert.ok(extension, 'Extension should be found');
        
        if (!extension.isActive) {
            await extension.activate();
        }
        
        // Test commands are registered
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('mage.runScript'), 'Should register mage.runScript');
        assert.ok(commands.includes('mage.runRepl'), 'Should register mage.runRepl');
        assert.ok(commands.includes('mage.formatDocument'), 'Should register mage.formatDocument');
        
        // Test completion provider
        const testDocument = await vscode.workspace.openTextDocument({
            content: 'enchant test() {\n\t\n}',
            language: 'mage'
        });
        
        const position = new vscode.Position(1, 1); // Inside function body
        const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            testDocument.uri,
            position
        );
        
        assert.ok(completions, 'Should provide completions');
        assert.ok(completions.items.length > 0, 'Should have completion items');
        
        // Check for Mage keywords
        const labels = completions.items.map(item => item.label.toString());
        const expectedKeywords = ['incant', 'conjure', 'scry', 'chant', 'evoke'];
        
        let foundKeywords = 0;
        expectedKeywords.forEach(keyword => {
            if (labels.includes(keyword)) {
                foundKeywords++;
            }
        });
        
        assert.ok(foundKeywords > 0, `Should find some Mage keywords. Found: ${foundKeywords}`);
        
        // Test configuration
        const config = vscode.workspace.getConfiguration('mage');
        assert.ok(config, 'Should have mage configuration');
        assert.strictEqual(config.get('executablePath'), 'mage', 'Should have default executable path');
        
        console.log('✅ All completion tests passed!');
        return true;
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
}

// Export test runner
export async function runBasicTests() {
    console.log('🚀 Starting Mage Extension Tests...');
    
    const results = [];
    
    // Run completion tests
    results.push(await testCompletionProvider());
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`📊 Test Results: ${passed}/${total} passed`);
    
    if (passed !== total) {
        throw new Error(`${total - passed} tests failed`);
    }
    
    console.log('🎉 All tests passed!');
} 