
const { runTests } = require('@vscode/test-electron');
const path = require('path');

async function main() {
    try {
        const extensionDevelopmentPath = __dirname;
        const extensionTestsPath = path.resolve(__dirname, './src/test/empty.js');

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [__dirname]
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();
