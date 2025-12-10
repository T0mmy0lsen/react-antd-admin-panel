/**
 * Mock API Implementation
 * Simulates backend API responses until real backend is ready
 * Stores data in localStorage for persistence across page reloads
 */

import { ApiExpensePayload, ApiResponse } from './mappers'

// ============================================================================
// CONFIGURATION
// ============================================================================

export const MOCK_API_ENABLED = true // Set to false when real backend is ready
export const MOCK_API_DELAY = 300 // Simulate network delay (ms)

const STORAGE_KEY = 'externals-mock-data'

// ============================================================================
// MOCK DATA STRUCTURE
// ============================================================================

interface MockDatabase {
    processes: Record<string, ApiResponse>
    nextId: number
}

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function getDatabase(): MockDatabase {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Failed to load mock database:', error)
    }
    
    // Return empty database
    return {
        processes: {},
        nextId: 1
    }
}

function saveDatabase(db: MockDatabase): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch (error) {
        console.error('Failed to save mock database:', error)
    }
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================================
// MOCK API FUNCTIONS
// ============================================================================

/**
 * Create a new process
 */
export async function mockCreateProcess(data: Partial<ApiResponse>): Promise<ApiResponse> {
    await delay(MOCK_API_DELAY)
    
    const db = getDatabase()
    const id = db.nextId++
    
    const newProcess: ApiResponse = {
        id,
        // Step 1: Personal Info
        navn: data.navn || '',
        email: data.email || '',
        land: data.land || '', // CHANGE 1: Added country
        adresse: data.adresse || '',
        by: data.by || '',
        postnummer: data.postnummer || '',
        // Step 2: Journey Details (CHANGE 3)
        afrejseDato: data.afrejseDato || '',
        rejseÅrsag: data.rejseÅrsag || '',
        rejsemål: data.rejsemål || '',
        programDokument: data.programDokument || '',
        // Step 3: PDF Acceptance (CHANGE 8)
        vilkårAccepteret: data.vilkårAccepteret || false,
        acceptTidspunkt: data.acceptTidspunkt || '',
        // Step 5: Bank Details - Region-specific
        kontoindehaver: data.kontoindehaver || '',
        bankNavn: data.bankNavn || '',
        valuta: data.valuta || 'DKK',
        // Danish/Nordic
        registreringsnummer: data.registreringsnummer || '',
        kontonummer: data.kontonummer || '',
        // European/International
        iban: data.iban || '',
        swift: data.swift || '',
        // Americas
        routingNumber: data.routingNumber || '',
        // Japan
        alternativtBankNavn: data.alternativtBankNavn || '',
        // India
        bankBranchKode: data.bankBranchKode || '',
        afsenderModtagerForhold: data.afsenderModtagerForhold || '',
        betalingsÅrsag: data.betalingsÅrsag || '',
        fakturaDetaljer: data.fakturaDetaljer || '',
        // South Korea
        kontoindehaverAdresse: data.kontoindehaverAdresse || '',
        // Metadata
        kræverManuelBehandling: data.kræverManuelBehandling || false,
        betalingsRegion: data.betalingsRegion || '',
        // Hidden fields (backend compatibility)
        projektNummer: data.projektNummer || '',
        kontraktNummer: data.kontraktNummer || '',
        godkender: data.godkender || '',
        omkostningssted: data.omkostningssted || '',
        inviteToken: data.inviteToken || '',
        // Expenses
        udgiftsposter: []
    }
    
    db.processes[id] = newProcess
    saveDatabase(db)
    
    console.log('🔧 Mock: Created process', id, newProcess)
    return newProcess
}

/**
 * Get process by ID
 */
export async function mockGetProcess(id: string | number): Promise<ApiResponse | null> {
    await delay(MOCK_API_DELAY)
    
    const db = getDatabase()
    const process = db.processes[id]
    
    if (process) {
        console.log('🔧 Mock: Retrieved process', id)
        return process
    }
    
    console.warn('🔧 Mock: Process not found', id)
    return null
}

/**
 * Update existing process
 */
export async function mockUpdateProcess(id: string | number, data: Partial<ApiResponse>): Promise<ApiResponse> {
    await delay(MOCK_API_DELAY)
    
    const db = getDatabase()
    const existing = db.processes[id]
    
    if (!existing) {
        throw new Error(`Process ${id} not found`)
    }
    
    // Merge data
    const updated: ApiResponse = {
        ...existing,
        ...data,
        id: typeof id === 'string' ? parseInt(id) : id
    }
    
    // Don't overwrite expenses with undefined
    if (data.udgiftsposter === undefined && existing.udgiftsposter) {
        updated.udgiftsposter = existing.udgiftsposter
    }
    
    db.processes[id] = updated
    saveDatabase(db)
    
    console.log('🔧 Mock: Updated process', id, updated)
    return updated
}

/**
 * Delete process (for testing)
 */
export async function mockDeleteProcess(id: string | number): Promise<void> {
    await delay(MOCK_API_DELAY)
    
    const db = getDatabase()
    delete db.processes[id]
    saveDatabase(db)
    
    console.log('🔧 Mock: Deleted process', id)
}

/**
 * List all expenses for a process
 */
export async function mockGetExpenses(processId: string | number): Promise<ApiExpensePayload[]> {
    await delay(MOCK_API_DELAY)
    
    const db = getDatabase()
    const process = db.processes[processId]
    
    if (!process) {
        console.warn('🔧 Mock: Process not found for expenses', processId)
        return []
    }
    
    const expenses = process.udgiftsposter || []
    console.log('🔧 Mock: Retrieved expenses', processId, expenses.length)
    return expenses
}

/**
 * Clear all mock data (for testing)
 */
export function mockClearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
    console.log('🔧 Mock: Cleared all data')
}

/**
 * Get mock database stats (for debugging)
 */
export function mockGetStats(): { processCount: number; nextId: number } {
    const db = getDatabase()
    return {
        processCount: Object.keys(db.processes).length,
        nextId: db.nextId
    }
}

/**
 * Export all processes (for debugging)
 */
export function mockExportAll(): MockDatabase {
    return getDatabase()
}

// ============================================================================
// DEBUG HELPERS (Available in console)
// ============================================================================

// Expose mock API to window for debugging
if (typeof window !== 'undefined' && MOCK_API_ENABLED) {
    (window as any).mockAPI = {
        getStats: mockGetStats,
        exportAll: mockExportAll,
        clearAll: mockClearAll,
        getProcess: mockGetProcess,
        createProcess: mockCreateProcess,
        updateProcess: mockUpdateProcess,
        deleteProcess: mockDeleteProcess,
        help: () => {
            console.log(`
🔧 Mock API Debug Console
========================

Available commands:
  mockAPI.getStats()           - Get database statistics
  mockAPI.exportAll()          - Export all data
  mockAPI.clearAll()           - Clear all mock data
  mockAPI.getProcess(id)       - Get specific process
  mockAPI.createProcess(data)  - Create new process
  mockAPI.updateProcess(id, data) - Update process
  mockAPI.deleteProcess(id)    - Delete process

Example:
  mockAPI.getStats()
  mockAPI.getProcess(1)
  mockAPI.clearAll()
            `)
        }
    }
    
    console.log('🔧 Mock API enabled. Type "mockAPI.help()" in console for debug commands.')
}

// ============================================================================
// MOCK FORMULA INTERCEPTOR
// ============================================================================

/**
 * Intercept formula calls and route to mock API
 * This integrates with the existing Formula system
 */
export function createMockFormula(main: any) {
    return {
        // Simulates successful save
        submit: async (id: string | number) => {
            console.log('🔧 Mock: Formula submit called for', id)
            
            // Get current page data (this would be collected by real formula)
            const page = main.$stored('externals-page')
            
            if (!page) {
                console.error('Page not found in store')
                return
            }
            
            // Build data from page fields (simulating what real formula does)
            const data: Partial<ApiResponse> = {
                // Step 1: Personal Info (CHANGE 1: removed phone, added country)
                navn: page.s1.field_name._data || page.s1.field_name._default,
                email: page.s1.field_email._data || page.s1.field_email._default,
                land: page.s1.field_country._data || page.s1.field_country._default,
                adresse: page.s1.field_address._data || page.s1.field_address._default,
                by: page.s1.field_city._data || page.s1.field_city._default,
                postnummer: page.s1.field_zip._data || page.s1.field_zip._default,
                
                // Step 2: Journey Details (CHANGE 3)
                afrejseDato: page.s2.field_departureDate._data || page.s2.field_departureDate._default,
                rejseÅrsag: page.s2.field_reason._data || page.s2.field_reason._default,
                rejsemål: page.s2.field_destination._data || page.s2.field_destination._default,
                programDokument: page.s2.field_programDocument?._data || page.s2.field_programDocument?._default,
                
                // Step 3: PDF Acceptance (CHANGE 8)
                vilkårAccepteret: page.s3.field_accepted._data || page.s3.field_accepted._default,
                acceptTidspunkt: page.s3.field_timestamp._data || page.s3.field_timestamp._default,
                
                // Step 5: Bank Details (CHANGE 2: moved from s2 to s5) - Region-specific
                kontoindehaver: page.s5.field_accountHolder._data || page.s5.field_accountHolder._default,
                bankNavn: page.s5.field_bankName._data || page.s5.field_bankName._default,
                valuta: page.s5.field_currency._data || page.s5.field_currency._default,
                // Danish/Nordic
                registreringsnummer: page.s5.field_regNumber._data || page.s5.field_regNumber._default,
                kontonummer: page.s5.field_accountNumber._data || page.s5.field_accountNumber._default,
                // European/International
                iban: page.s5.field_iban._data || page.s5.field_iban._default,
                swift: page.s5.field_swift._data || page.s5.field_swift._default,
                // Americas
                routingNumber: page.s5.field_routingNumber._data || page.s5.field_routingNumber._default,
                // Japan
                alternativtBankNavn: page.s5.field_alternateBankName._data || page.s5.field_alternateBankName._default,
                // India
                bankBranchKode: page.s5.field_branchCode._data || page.s5.field_branchCode._default,
                afsenderModtagerForhold: page.s5.field_relationship._data || page.s5.field_relationship._default,
                betalingsÅrsag: page.s5.field_paymentReason._data || page.s5.field_paymentReason._default,
                fakturaDetaljer: page.s5.field_invoiceDetails._data || page.s5.field_invoiceDetails._default,
                // South Korea
                kontoindehaverAdresse: page.s5.field_accountHolderAddress._data || page.s5.field_accountHolderAddress._default,
                // Metadata
                kræverManuelBehandling: page.s5.field_requiresManuelProcessing._data || page.s5.field_requiresManualProcessing._default,
                betalingsRegion: page.s5.field_region._data || page.s5.field_region._default,
                
                // Hidden fields (backend compatibility - from s2 journey details)
                projektNummer: page.s2.field_projectNumber?._data || page.s2.field_projectNumber?._default,
                kontraktNummer: page.s2.field_contractNumber?._data || page.s2.field_contractNumber?._default,
                godkender: page.s2.field_approver?._data || page.s2.field_approver?._default,
                omkostningssted: page.s2.field_costCenter?._data || page.s2.field_costCenter?._default,
            }
            
            // Get expenses from list (Step 4)
            if (page.s4.list && page.s4.list.getRecords) {
                const records = page.s4.list.getRecords()
                if (records) {
                    // Map to API format (CHANGE 4-6: manual KM, multi-currency)
                    data.udgiftsposter = records.map((r: any) => ({
                        id: r.id,
                        dato: r.date,
                        type: r.type,
                        beløb: r.amount,
                        valuta: r.currency || 'DKK', // CHANGE 6: Multi-currency
                        beskrivelse: r.description,
                        fraAdresse: r.fromAddress,
                        tilAdresse: r.toAddress,
                        afstandKM: r.distanceKM, // CHANGE 4: Manual KM entry
                        beregnetBeløb: r.calculatedAmount,
                        hotelNavn: r.hotelName,
                        indcheckningsDato: r.checkInDate,
                        udcheckningsDato: r.checkOutDate,
                        transportMåde: r.transportMode,
                        upload: r.upload
                    }))
                }
            }
            
            try {
                await mockUpdateProcess(id, data)
                // Call success callback
                if (page.formula._post._onThen) {
                    page.formula._post._onThen({ data })
                }
            } catch (error) {
                console.error('Mock save error:', error)
                // Call error callback
                if (page.formula._post._onCatch) {
                    page.formula._post._onCatch(error)
                }
            }
        }
    }
}
