const fs = require('fs');
const path = require('path');

async function copyAllBuildFiles() {
    const cpy = (await import('cpy')).default;

    const sourcePattern = 'build/**/*';
    const destination = path.join(__dirname, '../public');

    // Copy all files from build to destination
    await cpy(sourcePattern, destination, {
        parents: true,
        cwd: __dirname,
        nodir: true,
    });
    console.log(`All build files copied to ${destination}`);
}

function copyAndMove(source, target, renameTo) {
    const targetPath = path.join(target, renameTo);

    // Copy the file
    fs.copyFileSync(source, targetPath);

    console.log(`File copied from ${source} to ${targetPath}`);
}

async function main() {
    const sourceFile = path.join(__dirname, 'build/index.html');
    const targetDir = path.join(__dirname, '../resources/views');
    const renameTo = 'react.blade.php';

    copyAndMove(sourceFile, targetDir, renameTo);
    await copyAllBuildFiles();
}

main().catch(error => {
    console.error(`Error: ${error}`);
});
