import { Formula, Get, Post } from '../../../../typescript'
import Main from '../../../../typescript/main'
import { ExternalsPageStructure, GodtgoerelseRecord } from '../types'
import { message } from 'antd'

/**
 * Create the main formula for saving form data
 * Handles PUT requests to update existing RejseAfregning records
 */
export const createFormula = (main: any): Formula => {
    return new Formula(new Post().target((id: any) => ({
            target: `RejseAfregning/${id}`,
            method: 'PUT',
        }))
            .header({'Authorization': 'Bearer ' + main.$account.accessToken })
            .onThen((r: any) => {
                console.log('💾 Save successful', r)
                // Refresh the expense list after successful save
                const page = main.$stored('externals-page')
                if (page?.s4?.list?.refresh) {
                    page.s4.list.refresh()
                }
            })
            .onCatch((error: any) => {
                console.error('❌ Save failed:', error)
            })
    )
}

/**
 * Create formula for submitting the form
 * Handles PUT requests to submit endpoint
 */
export const createSubmitFormula = (main: any, getPage: () => any): Formula => {
    return new Formula(new Post().target((id: any) => ({
        target: `RejseAfregning/${id}/submit`,
        method: 'PUT',
    }))
        .header({'Authorization': 'Bearer ' + main.$account.accessToken })
    )
}

/**
 * Create formula for creating a new RejseAfregning record
 * Handles POST requests to create new records
 */
export const createNewFormula = (main: any): Formula => {
    return new Formula(new Post().target(() => ({
            target: 'RejseAfregning',
            method: 'POST',
        }))
            .header({'Authorization': 'Bearer ' + main.$account.accessToken })
            .onThen((r: any) => {
                // Reload to get the new record
            })
            .onCatch(() => {
                // Error handling
            })
    )
}

/**
 * Get initial data for the form
 * Fetches existing RejseAfregning records and populates the form
 * If no records exist, creates a new one
 */
export const getInitialData = (main: any, getPage: () => any): Get => {
    console.log('Get the initial data for externals process')

    return new Get().target('RejseAfregning')
        .header({ 'Authorization': 'Bearer ' + main.$account.accessToken })
        .onThen((data: any) => {
            const page = getPage()
            const res: any[] = data.data

            console.log('Initial data loaded:', res)

            if (res.length > 0) {
                // Get the last element in the list
                const result = res[res.length - 1]

                main.$store(result.status == 'completed', 'status')

                // Format expense posts
                const udgiftsposter = result.udgiftsposter?.map((r: any) => ({
                    id: r.id,
                    date: r.dato,
                    text: r.bemærkninger ?? '',
                    category: r.kategori,
                    amount: r.beløb,
                    currency: r.valuta ?? 'DKK',
                    upload: r.attachments || []
                })) || []

                // Populate hidden fields
                page.s1.field_id.default(result.id)
                page.s1.field_udgiftsposter.default(udgiftsposter)
                page.s1.field_kontostreng.default('')

                // Step 1: Personal Info
                page.s1.field_name
                    .default(result.navn)
                    .disabled(main.$stored('status'))
                page.s1.field_email
                    .default(main.$account.account.username)
                    .disabled(true)
                page.s1.field_country
                    .default(result.country)
                    .disabled(main.$stored('status'))
                page.s1.field_address
                    .default(result.addresse)
                    .disabled(main.$stored('status'))
                page.s1.field_city
                    .default(result.by)
                    .disabled(main.$stored('status'))
                page.s1.field_zip
                    .default(result.postnummer)
                    .disabled(main.$stored('status'))
                page.s1.field_id
                    .default(result.cpr)
                    .disabled(main.$stored('status'))

                // Step 2: Journey Details
                page.s2.field_departureDate
                    .default(result.fra)
                    .disabled(main.$stored('status'))
                page.s2.field_returnDate
                    .default(result.til)
                    .disabled(main.$stored('status'))
                page.s2.field_reason
                    .default(result.kontostreng?.formål)
                    .disabled(main.$stored('status'))
                page.s2.field_destination
                    .default(result.byStedNavn)
                    .disabled(main.$stored('status'))

                // Populate approver from backend (for failure messages)
                if (result.godkender) {
                    page.s2.field_approver.default(result.godkender)
                }

                // Step 5: Bank Details
                if (result.bankInformation) {
                    page.s5.field_accountHolder.default(result.bankInformation.accountHolder)
                    page.s5.field_bankName.default(result.bankInformation.bankName)
                    page.s5.field_currency.default(result.bankInformation.currency)
                    page.s5.field_regNumber.default(result.bankInformation.regNumber)
                    page.s5.field_accountNumber.default(result.bankInformation.accountNumber)
                    page.s5.field_iban.default(result.bankInformation.iban)
                    page.s5.field_swift.default(result.bankInformation.swift)
                    page.s5.field_routingNumber.default(result.bankInformation.routingNumber)
                }

                // Step 4: Expenses
                page.s4.list
                    .default({ dataSource: udgiftsposter })
                    .disabled(main.$stored('status'))

                page.s4.button
                    .disabled(main.$stored('status'))

                page.condition.checkCondition(true)

            } else {
                // No existing record - create a new one
                message.success('Creating a new expense report...')

                new Formula(new Post().target(() => ({
                        target: 'RejseAfregning',
                        method: 'POST',
                    }))
                        .header({'Authorization': 'Bearer ' + main.$account.accessToken })
                        .onThen((r: any) => {
                            window.location.reload()
                        })
                        .onCatch(() => {
                            message.error('Failed to create expense report.')
                        })
                ).submit()
            }
        })
}

// ============================================================================
// LEGACY EXPORTS (for compatibility)
// ============================================================================

export interface SubmitFormData {
    personalInfo: {
        name: string
        email: string
        phone: string
        address: string
        city: string
        zip: string
    }
    bankDetails: {
        iban: string
        swift: string
        accountHolder: string
        bankName: string
        currency: string
    }
    projectDetails: {
        projectNumber: string
        contractNumber: string
        approver: string
        costCenter: string
        purpose: string
    }
    expenses: GodtgoerelseRecord[]
    submittedAt: string
}

export interface SubmitResponse {
    submissionId: string
    status: 'success' | 'error'
    message: string
}

export async function submitExpenseClaim(
    main: Main,
    formData: SubmitFormData
): Promise<SubmitResponse> {
    console.log('submitExpenseClaim called with:', formData)
    
    try {
        // TODO: Replace with real API endpoint when backend is ready
        // const response = await fetch('/api/v1/Externals/submit', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + main.$account.accessToken
        //     },
        //     body: JSON.stringify(formData)
        // })
        // 
        // if (!response.ok) {
        //     throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        // }
        // 
        // return await response.json()
        
        // MOCK IMPLEMENTATION - Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Simulate 10% failure rate for testing
        if (Math.random() < 0.1) {
            throw new Error('Simulated network error')
        }
        
        const submissionId = `EXT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        
        console.log('✅ Submission successful:', submissionId)
        
        return {
            submissionId,
            status: 'success',
            message: 'Your expense claim has been submitted successfully'
        }
        
    } catch (error: any) {
        console.error('❌ Submission failed:', error)
        
        return {
            submissionId: '',
            status: 'error',
            message: error.message || 'An unexpected error occurred during submission'
        }
    }
}

// ============================================================================
// DRAFT SAVE/LOAD API (Auto-save functionality)
// ============================================================================

export interface DraftData {
    formData: Partial<SubmitFormData>
    lastUpdated: string
    version: number
}

export async function saveDraft(
    main: Main,
    formData: Partial<SubmitFormData>
): Promise<boolean> {
    console.log('saveDraft called')
    
    try {
        // TODO: Replace with real API endpoint when backend is ready
        // const response = await fetch('/api/v1/Externals/save-draft', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + main.$account.accessToken
        //     },
        //     body: JSON.stringify({
        //         formData,
        //         lastUpdated: new Date().toISOString()
        //     })
        // })
        // 
        // return response.ok
        
        // MOCK IMPLEMENTATION - Save to localStorage for now
        const draftData: DraftData = {
            formData,
            lastUpdated: new Date().toISOString(),
            version: 1
        }
        
        localStorage.setItem('externals-draft', JSON.stringify(draftData))
        console.log('✅ Draft saved to localStorage')
        
        return true
        
    } catch (error) {
        console.error('❌ Failed to save draft:', error)
        return false
    }
}

export async function loadDraft(main: Main): Promise<DraftData | null> {
    console.log('loadDraft called')
    
    try {
        // TODO: Replace with real API endpoint when backend is ready
        // const response = await fetch('/api/v1/Externals/draft', {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': 'Bearer ' + main.$account.accessToken
        //     }
        // })
        // 
        // if (response.ok) {
        //     return await response.json()
        // }
        // 
        // return null
        
        // MOCK IMPLEMENTATION - Load from localStorage
        const draftJson = localStorage.getItem('externals-draft')
        
        if (draftJson) {
            const draft = JSON.parse(draftJson) as DraftData
            console.log('✅ Draft loaded from localStorage:', draft.lastUpdated)
            return draft
        }
        
        console.log('ℹ️ No draft found')
        return null
        
    } catch (error) {
        console.error('❌ Failed to load draft:', error)
        return null
    }
}

export function clearDraft(): void {
    try {
        localStorage.removeItem('externals-draft')
        console.log('✅ Draft cleared')
    } catch (error) {
        console.error('❌ Failed to clear draft:', error)
    }
}

// ============================================================================
// LEGACY EXPORTS (removed - now using klinikophold pattern)
// ============================================================================
