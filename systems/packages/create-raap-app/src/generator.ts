import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { spawn } from 'child_process';
import { getTemplatesDir, toTitleCase, type Template } from './utils.js';
import type { ProjectOptions } from './prompts.js';

/**
 * Replace template placeholders in content
 */
function replacePlaceholders(content: string, options: ProjectOptions): string {
  const year = new Date().getFullYear().toString();
  const title = toTitleCase(options.projectName);
  
  return content
    .replace(/\{\{projectName\}\}/g, options.projectName)
    .replace(/\{\{projectTitle\}\}/g, title)
    .replace(/\{\{year\}\}/g, year);
}

/**
 * Copy template files to target directory
 */
async function copyTemplateFiles(options: ProjectOptions): Promise<void> {
  const templatesDir = getTemplatesDir();
  const sourceDir = path.join(templatesDir, options.template);
  
  // For auth template, first copy basic then auth on top
  if (options.template === 'auth') {
    const basicDir = path.join(templatesDir, 'basic');
    await fs.copy(basicDir, options.targetDir);
    await fs.copy(sourceDir, options.targetDir, { overwrite: true });
  } else {
    await fs.copy(sourceDir, options.targetDir);
  }
  
  // Process all files for placeholder replacement
  await processDirectory(options.targetDir, options);
}

/**
 * Recursively process directory for placeholder replacement
 */
async function processDirectory(dirPath: string, options: ProjectOptions): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules') {
        await processDirectory(fullPath, options);
      }
    } else if (entry.isFile()) {
      // Handle .template files (rename and process)
      if (entry.name.endsWith('.template')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const processed = replacePlaceholders(content, options);
        const newPath = fullPath.replace('.template', '');
        await fs.writeFile(newPath, processed);
        await fs.remove(fullPath);
      } else if (/\.(ts|tsx|js|jsx|json|md|html|css)$/.test(entry.name)) {
        // Process text files for placeholders
        const content = await fs.readFile(fullPath, 'utf-8');
        if (content.includes('{{')) {
          const processed = replacePlaceholders(content, options);
          await fs.writeFile(fullPath, processed);
        }
      }
    }
  }
}

/**
 * Run npm install in project directory
 */
async function installDependencies(targetDir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['install'], {
      cwd: targetDir,
      stdio: 'pipe',
      shell: true,
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`npm install failed with code ${code}`));
      }
    });
    
    child.on('error', reject);
  });
}

/**
 * Generate project from template
 */
export async function generateProject(options: ProjectOptions): Promise<void> {
  const spinner = ora();
  
  try {
    // Step 1: Copy template files
    spinner.start('Creating project structure...');
    await copyTemplateFiles(options);
    spinner.succeed('Project structure created');
    
    // Success message
    console.log();
    console.log(chalk.green('✓ Project created successfully!'));
    console.log();
    console.log('Next steps:');
    console.log(chalk.cyan(`  cd ${options.projectName}`));
    console.log(chalk.cyan('  npm install'));
    console.log(chalk.cyan('  npm run dev'));
    console.log();
    
  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
}
