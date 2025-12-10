/**
 * API Configuration - Centralized endpoint definitions
 * Single source of truth for all API endpoints and auto-save settings
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ApiEndpoints {
    create: string
    update: (id: string | number) => string
    get: (id: string | number) => string
    submit: (id: string | number) => string
    
    expenses: {
        list: (processId: string | number) => string
        create: (processId: string | number) => string
        update: (processId: string | number, expenseId: string | number) => string
        delete: (processId: string | number, expenseId: string | number) => string
    }
    
    validateIban: string
    calculateDistance: string
}

export interface AutoSaveConfig {
    enabled: boolean
    debounceMs: number
    showNotifications: boolean
    logToConsole: boolean
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export const EXTERNALS_API: ApiEndpoints = {
    create: 'RejseAfregning',
    update: (id) => `RejseAfregning/${id}`,
    get: (id) => `RejseAfregning/${id}`,
    submit: (id) => `RejseAfregning/${id}/submit`,
    
    expenses: {
        list: (processId) => `RejseAfregning/${processId}/expenses`,
        create: (processId) => `RejseAfregning/${processId}/expenses`,
        update: (processId, expenseId) => `RejseAfregning/${processId}/expenses/${expenseId}`,
        delete: (processId, expenseId) => `RejseAfregning/${processId}/expenses/${expenseId}`,
    },
    
    validateIban: 'RejseAfregning/validate-iban',
    calculateDistance: 'RejseAfregning/calculate-distance',
}

// ============================================================================
// AUTO-SAVE CONFIGURATION
// ============================================================================

export const AUTO_SAVE_CONFIG: AutoSaveConfig = {
    enabled: true,              // Master switch for auto-save
    debounceMs: 1000,           // Wait time after last change (1 second)
    showNotifications: false,   // Don't spam user with save notifications
    logToConsole: true,         // Enable console logging for debugging
}

// ============================================================================
// MOCK API CONFIGURATION
// ============================================================================

export const MOCK_API_CONFIG = {
    enabled: false,             // Use real backend API
    createDefaultProcess: true, // Auto-create a process on load
    logToConsole: true,         // Log mock API calls
    delay: 300,                 // Simulate network delay (ms)
}
