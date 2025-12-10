import inquirer from 'inquirer';
import { validateProjectName, directoryExists, TEMPLATES, type Template } from './utils.js';
import path from 'path';

export interface ProjectOptions {
  projectName: string;
  template: Template;
  targetDir: string;
}

/**
 * Prompt for project name if not provided
 */
export async function promptProjectName(initialName?: string): Promise<string> {
  if (initialName) {
    const validation = validateProjectName(initialName);
    if (validation.valid) {
      const targetDir = path.resolve(process.cwd(), initialName);
      if (await directoryExists(targetDir)) {
        console.log(`Directory "${initialName}" already exists.`);
      } else {
        return initialName;
      }
    } else {
      console.log(validation.message);
    }
  }

  const { projectName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      validate: async (input: string) => {
        const validation = validateProjectName(input);
        if (!validation.valid) {
          return validation.message || 'Invalid project name';
        }
        const targetDir = path.resolve(process.cwd(), input);
        if (await directoryExists(targetDir)) {
          return `Directory "${input}" already exists`;
        }
        return true;
      },
    },
  ]);

  return projectName;
}

/**
 * Prompt for template selection
 */
export async function promptTemplate(initialTemplate?: string): Promise<Template> {
  if (initialTemplate && TEMPLATES.includes(initialTemplate as Template)) {
    return initialTemplate as Template;
  }

  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template:',
      choices: [
        { name: 'basic - Simple setup with example pages', value: 'basic' },
        { name: 'auth - JWT authentication with login page', value: 'auth' },
      ],
      default: 'basic',
    },
  ]);

  return template;
}

/**
 * Get all project options
 */
export async function getProjectOptions(
  argName?: string,
  argTemplate?: string
): Promise<ProjectOptions> {
  const projectName = await promptProjectName(argName);
  const template = await promptTemplate(argTemplate);
  const targetDir = path.resolve(process.cwd(), projectName);

  return { projectName, template, targetDir };
}
