import { runBasicTests } from './completion.test';

export async function run(): Promise<void> {
    try {
        console.log('🧪 Starting Mage Extension Test Suite...');
        await runBasicTests();
        console.log('✅ All tests completed successfully!');
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        throw error;
    }
} 