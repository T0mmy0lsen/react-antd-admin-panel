/**
 * Auto-Save Orchestrator
 * 
 * NOTE: Following klinikophold pattern, saving happens on step navigation via steps.onClick()
 * This file provides utility functions for manual save operations if needed in the future.
 * 
 * Current Pattern:
 * - Save on step navigation (configured in config.ts via steps.onClick())
 * - No debouncing needed (user-initiated navigation)
 * - Simple and clean like klinikophold
 */

import Main from '../../../../typescript/main'
import { ExternalsPageStructure } from '../types'
import { AUTO_SAVE_CONFIG } from './apiConfig'

// No state management needed - saves happen on step navigation (klinikophold pattern)

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize save callbacks
 * Called once during app initialization
 * 
 * Enhances formula callbacks with logging and notifications
 * Actual save is triggered by steps.onClick() (klinikophold pattern)
 */
export function initializeAutoSave(main: Main, page: ExternalsPageStructure): void {
    if (AUTO_SAVE_CONFIG.logToConsole) {
        console.log('� Save system initialized (saves on step navigation)')
    }
    
    // Hook into formula's success callback
    const originalOnThen = page.formula._post._onThen
    page.formula._post._onThen = (response: any) => {
        // Call original callback first
        if (originalOnThen) {
            originalOnThen(response)
        }
        
        if (AUTO_SAVE_CONFIG.logToConsole) {
            console.log('✅ Save successful')
        }
        
        if (AUTO_SAVE_CONFIG.showNotifications) {
            main.tsxSuccessMessage('Changes saved')
        }
    }
    
    // Hook into formula's error callback
    const originalOnCatch = page.formula._post._onCatch
    page.formula._post._onCatch = (error: any) => {
        // Call original callback first
        if (originalOnCatch) {
            originalOnCatch(error)
        }
        
        if (AUTO_SAVE_CONFIG.logToConsole) {
            console.error('❌ Save failed:', error)
        }
        
        // Always show error notifications
        main.tsxErrorMessage('Failed to save changes')
    }
}

// ============================================================================
// UTILITY FUNCTIONS (For Future Use)
// ============================================================================

/**
 * Force immediate save (for use before final submission if needed)
 * Returns Promise for async/await usage
 * 
 * Example usage in Step5:
 * await forceImmediateSave(page)
 * // Then proceed with submission
 */
export function forceImmediateSave(page: ExternalsPageStructure): Promise<void> {
    return new Promise((resolve, reject) => {
        const processId = page.s1.field_id._data || page.s1.field_id._default
        
        if (!processId) {
            console.warn('⚠️  No process ID available for save')
            resolve()
            return
        }
        
        if (AUTO_SAVE_CONFIG.logToConsole) {
            console.log('⚡ Force immediate save triggered')
        }
        
        // Hook into formula callbacks for promise resolution
        const originalOnThen = page.formula._post._onThen
        const originalOnCatch = page.formula._post._onCatch
        
        page.formula._post._onThen = (response: any) => {
            if (originalOnThen) originalOnThen(response)
            resolve()
        }
        
        page.formula._post._onCatch = (error: any) => {
            if (originalOnCatch) originalOnCatch(error)
            reject(error)
        }
        
        // Execute save
        try {
            page.formula.submit(processId)
        } catch (error) {
            console.error('❌ Save execution error:', error)
            reject(error)
        }
    })
}
