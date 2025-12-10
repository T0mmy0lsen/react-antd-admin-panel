import path from 'path';
import fs from 'fs-extra';

/**
 * Validate project name
 */
export function validateProjectName(name: string): { valid: boolean; message?: string } {
  if (!name) {
    return { valid: false, message: 'Project name is required' };
  }
  
  if (!/^[a-z0-9-_]+$/i.test(name)) {
    return { valid: false, message: 'Project name can only contain letters, numbers, hyphens, and underscores' };
  }
  
  if (name.startsWith('-') || name.startsWith('_')) {
    return { valid: false, message: 'Project name cannot start with a hyphen or underscore' };
  }
  
  return { valid: true };
}

/**
 * Check if directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Convert project name to title case
 */
export function toTitleCase(name: string): string {
  return name
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get templates directory path
 */
export function getTemplatesDir(): string {
  // In dist, go up to package root then into templates
  return path.join(import.meta.dirname, '..', 'templates');
}

/**
 * Available templates
 */
export const TEMPLATES = ['basic', 'auth'] as const;
export type Template = typeof TEMPLATES[number];

export function isValidTemplate(template: string): template is Template {
  return TEMPLATES.includes(template as Template);
}
