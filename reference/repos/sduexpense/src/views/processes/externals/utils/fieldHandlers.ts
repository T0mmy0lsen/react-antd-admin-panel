// Field change handlers

import { ExternalsPageStructure } from '../types'
import { validateStep1, validateStep5, validateIBAN, validateSWIFT } from './validators' // CHANGE 2: Updated import
import { formatIBAN } from './formatters'

export function handleIBANChange(page: ExternalsPageStructure, value: string): void {
    // Format IBAN with spaces
    const formatted = formatIBAN(value)
    if (formatted !== value) {
        page.s5.field_iban.tsxSetValue(formatted) // CHANGE 2: Updated from s2 to s5
    }
    
    // Validate
    const isValid = validateIBAN(value)
    if (isValid) {
        // Could trigger bank name lookup here
    }
    
    validateStep5(page) // CHANGE 2: Updated validator
}

export function handleSWIFTChange(page: ExternalsPageStructure, value: string): void {
    // Convert to uppercase
    const uppercase = value.toUpperCase()
    if (uppercase !== value) {
        page.s5.field_swift.tsxSetValue(uppercase) // CHANGE 2: Updated from s2 to s5
    }
    
    // Validate
    const isValid = validateSWIFT(value)
    if (isValid) {
        // TODO: Lookup bank name from SWIFT code
        // page.s5.field_bankName.tsxSetValue('Bank Name')
    }
    
    validateStep5(page) // CHANGE 2: Updated validator
}
