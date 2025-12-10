import { Command } from 'commander';
import chalk from 'chalk';
import { getProjectOptions } from './prompts.js';
import { generateProject } from './generator.js';
import { isValidTemplate, TEMPLATES } from './utils.js';

const VERSION = '1.0.0';

/**
 * Main CLI runner
 */
export async function run(): Promise<void> {
  const program = new Command();

  program
    .name('create-raap-app')
    .description('Create a new React Antd Admin Panel project')
    .version(VERSION)
    .argument('[project-name]', 'Name of the project')
    .option('-t, --template <template>', `Template to use (${TEMPLATES.join(', ')})`, 'basic')
    .action(async (projectName?: string, options?: { template?: string }) => {
      console.log();
      console.log(chalk.bold(' Create RAAP App'));
      console.log(chalk.dim('React Antd Admin Panel project generator'));
      console.log();

      // Validate template if provided
      const templateArg = options?.template;
      if (templateArg && !isValidTemplate(templateArg)) {
        console.error(chalk.red(`Invalid template: ${templateArg}`));
        console.error(`Available templates: ${TEMPLATES.join(', ')}`);
        process.exit(1);
      }

      try {
        const projectOptions = await getProjectOptions(projectName, templateArg);
        await generateProject(projectOptions);
      } catch (error) {
        if (error instanceof Error) {
          console.error(chalk.red(`Error: ${error.message}`));
        }
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}
