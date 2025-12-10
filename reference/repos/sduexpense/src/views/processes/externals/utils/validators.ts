import { ExternalsPageStructure } from '../types'

// CHANGE 1: Updated validator for Step 1 (removed phone, added country)
export function validateStep1(page: ExternalsPageStructure): boolean {
    const { s1 } = page

    console.log('Validating Step 1:', {
        name: s1.field_name._data,
        email: s1.field_email._data,   
        country: s1.field_country._data,  // CHANGE 1: Added country
        address: s1.field_address._data,
        city: s1.field_city._data,
        zip: s1.field_zip._data
    });
    
    const isValid = 
        (s1.field_name._data?.length || 0) > 0 &&
        (s1.field_email._data?.length || 0) > 0 &&
        (s1.field_country._data?.length || 0) >= 2 &&  // CHANGE 1: Validate country instead of phone
        (s1.field_address._data?.length || 0) > 0 &&
        (s1.field_city._data?.length || 0) > 0 &&
        (s1.field_zip._data?.length || 0) === 4
    
    // Use the Steps.done() method (1-based index)
    page.steps.done(1, isValid)
    return isValid
}

// CHANGE 3: New validator for Step 2 (Journey Details)
export function validateStep2(page: ExternalsPageStructure, updateStepStatus: boolean = true): boolean {
    const { s2 } = page
    
    // Basic field validation
    const hasRequiredFields = 
        (s2.field_departureDate._data?.length || 0) > 0 &&
        (s2.field_returnDate._data?.length || 0) > 0 &&
        (s2.field_reason._data?.length || 0) > 3 &&
        (s2.field_destination._data?.length || 0) > 0
    
    // Date validation - return date must be after departure date
    let datesValid = true
    if (s2.field_departureDate._data && s2.field_returnDate._data) {
        const departureDate = new Date(s2.field_departureDate._data)
        const returnDate = new Date(s2.field_returnDate._data)
        datesValid = returnDate >= departureDate
        
        if (!datesValid) {
            console.warn('⚠️ Return date must be on or after departure date')
        }
    }
    
    // Program document validation for international travel
    let programDocumentValid = true
    const checkboxValue = s2.field_nonDkTravel._data
    const isInternationalTravel = Array.isArray(checkboxValue) && checkboxValue.length > 0  // [1] = checked, [] = unchecked
    
    if (isInternationalTravel) {
        const hasDocument = s2.field_programDocument?._fileList?.length > 0
        programDocumentValid = hasDocument || false
        
        if (!programDocumentValid) {
            console.warn('⚠️ Program document required for international travel')
        }
    }
    
    const isValid = hasRequiredFields && datesValid && programDocumentValid
    
    console.log('Validating Step 2 (Journey Details):', {
        departureDate: s2.field_departureDate._data,
        returnDate: s2.field_returnDate._data,
        reason: s2.field_reason._data,
        destination: s2.field_destination._data,
        isInternationalTravel,
        programDocumentValid,
        hasRequiredFields,
        datesValid,
        isValid,
        updateStepStatus
    });
    
    // Only update step status if requested (not during initial validation)
    if (updateStepStatus) {
        page.steps.done(2, isValid)
    }
    return isValid
}

// CHANGE 8: New validator for Step 3 (PDF Acceptance)
export function validateStep3(page: ExternalsPageStructure, updateStepStatus: boolean = true): boolean {
    const { s3 } = page
    
    // Check multiple sources for acceptance state
    const acceptedData = s3.field_accepted._data
    const acceptedDefault = s3.field_accepted._default
    const isValid = acceptedData === true || 
                   acceptedData === 'true' || 
                   acceptedDefault === true || 
                   acceptedDefault === 'true'
    
    console.log('Validating Step 3 (PDF Acceptance):', {
        accepted_data: acceptedData,
        accepted_default: acceptedDefault,
        isValid,
        updateStepStatus
    });
    
    // Only update step status if requested (not during initial validation)
    if (updateStepStatus) {
        page.steps.done(3, isValid)
    }
    
    return isValid
}

export function validateGodtgoerelseRow(record: any): { valid: boolean, errors: string[], warnings: string[] } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Common validation
    if (!record.date) errors.push('Date is required')
    if (!record.type) errors.push('Type is required')
    if (!record.amount || record.amount <= 0) errors.push('Amount must be greater than 0')
    if (!record.description || record.description.length < 3) errors.push('Description is required (min 3 characters)')
    
    // Check for amount limit warning on specific types
    if ((record.type === 'TRAIN' || record.type === 'BUS' || record.type === 'MILEAGE') && record.amount > 140) {
        warnings.push('Warning: Amount exceeds 140 DKK limit. You may only claim up to 140 DKK, even if the ticket cost more.')
    }
    
    // Type-specific validation
    switch (record.type) {
        case 'MILEAGE':
            if (!record.licensePlate || record.licensePlate.trim().length < 2) {
                errors.push('Vehicle license plate is required for mileage reimbursement')
            }
            if (!record.fromAddress) errors.push('From address required')
            if (!record.toAddress) errors.push('To address required')
            if (!record.distanceKM || record.distanceKM <= 0) {
                errors.push('Distance in kilometers is required')
            }
            break
            
        // All other types just need description and optionally upload
        case 'FLIGHT':
        case 'TRAIN':
        case 'BUS':
        case 'TAXI':
        case 'FERRY':
        case 'BRIDGE_TOLL':
        case 'PARKING':
        case 'BIKE_SCOOTER':
        case 'HOTEL_DK':
        case 'HOTEL_ABROAD':
        case 'NON_HOTEL':
        case 'CONF_DK':
        case 'CONF_ABROAD':
        case 'TRAINING_DK':
        case 'TRAINING_ABROAD':
        case 'VISA':
        case 'MEDICAL_CERT':
        case 'EU_TAXES':
        case 'MEMBERSHIPS':
        case 'LAYOUT_CONVERT':
        case 'GOODS_GENERAL':
            // Upload is recommended for most types (required for some)
            if (!record.upload || record.upload.length === 0) {
                const requiresUpload = ['VISA', 'MEDICAL_CERT', 'CONF_DK', 'CONF_ABROAD', 'TRAINING_DK', 'TRAINING_ABROAD']
                if (requiresUpload.includes(record.type)) {
                    errors.push('Receipt/documentation upload required for this expense type')
                } else {
                    errors.push('Receipt/documentation upload recommended for this expense type')
                }
            }
            break
            
        case 'MEALS_TRAVEL':
            // Meals don't require upload
            break
    }
    
    return { valid: errors.length === 0, errors, warnings }
}

export function validateStep4(page: ExternalsPageStructure): boolean {
    const { s4 } = page
    
    // Guard: Don't validate if List component hasn't been rendered yet
    if (!s4.list.getRecords) {
        console.log('⏸️ Step 4 validation skipped - List not ready yet')
        page.steps.done(4, false)
        return false
    }
    
    // Check if at least one godtgørelse entry exists
    const records = s4.list.getRecords() || []
    
    if (records.length === 0) {
        page.steps.done(4, false)
        return false
    }
    
    // For Phase 2A: We show warnings but allow "Next" (validation will be strict in Step 5)
    // Count valid records
    let validCount = 0
    let warningCount = 0
    
    records.forEach((record: any) => {
        const { valid, errors, warnings } = validateGodtgoerelseRow(record)
        if (valid) {
            validCount++
        } else {
            warningCount++
            console.warn(`Record ${record.id} has errors:`, errors)
        }
        if (warnings && warnings.length > 0) {
            console.warn(`Record ${record.id} has warnings:`, warnings)
        }
    })
    
    // Step is done if we have at least one record (warnings allowed)
    const isValid = records.length > 0
    
    console.log('Step 4 validation:', { 
        total: records.length, 
        valid: validCount, 
        warnings: warningCount, 
        stepValid: isValid 
    })
    
    // Use the Steps.done() method (1-based index)
    page.steps.done(4, isValid)
    return isValid
}

// CHANGE 2: New validator for Step 5 (Bank Details - moved from Step 2)
// Region-aware validation based on country selection
export function validateStep5(page: ExternalsPageStructure, updateStepStatus = true): boolean {
    const { s5, s1 } = page
    const country = s1.field_country._data || ''
    
    // Dynamically import region config
    const { COUNTRY_TO_REGION_MAP, BankRegion, REGION_FIELD_CONFIG, SANCTIONED_COUNTRIES, validateRoutingNumber } = 
        require('../constants/bankRegions')
    
    // Check for sanctioned countries first
    if (SANCTIONED_COUNTRIES.includes(country)) {
        console.warn('❌ Cannot process payments to sanctioned country:', country)
        if (updateStepStatus) page.steps.done(5, false)
        return false
    }
    
    const region = COUNTRY_TO_REGION_MAP[country] || BankRegion.REST_OF_WORLD
    const requirements = REGION_FIELD_CONFIG[region]
    
    // Store region for API
    s5.field_region.tsxSetValue(region)
    s5.field_region._data = region
    
    // Flag Myanmar for manual processing
    if (region === BankRegion.MYANMAR) {
        s5.field_requiresManualProcessing.tsxSetValue(true)
        s5.field_requiresManualProcessing._data = true
    }
    
    // Validate based on region requirements
    const validations: Record<string, boolean> = {
        accountHolder: !requirements.accountHolder || 
            ((s5.field_accountHolder._data?.trim().length || 0) > 0),
        regNumber: !requirements.regNumber || 
            /^\d{4}$/.test(s5.field_regNumber._data || ''),
        accountNumber: !requirements.accountNumber || 
            ((s5.field_accountNumber._data?.trim().length || 0) > 0),
        bankName: !requirements.bankName || 
            ((s5.field_bankName._data?.trim().length || 0) > 0),
        iban: !requirements.iban || 
            validateIBAN(s5.field_iban._data),
        swift: !requirements.swift || 
            validateSWIFT(s5.field_swift._data),
        routingNumber: !requirements.routingNumber || 
            validateRoutingNumber(s5.field_routingNumber._data, country),
        alternateBankName: !requirements.alternateBankName || 
            ((s5.field_alternateBankName._data?.trim().length || 0) > 0),
        branchCode: !requirements.branchCode || 
            ((s5.field_branchCode._data?.trim().length || 0) > 0),
        relationship: !requirements.relationship || 
            ((s5.field_relationship._data?.trim().length || 0) > 0),
        paymentReason: !requirements.paymentReason || 
            ((s5.field_paymentReason._data?.trim().length || 0) > 0),
        invoiceDetails: !requirements.invoiceDetails || 
            ((s5.field_invoiceDetails._data?.trim().length || 0) > 10),
        accountHolderAddress: !requirements.accountHolderAddress || 
            ((s5.field_accountHolderAddress._data?.trim().length || 0) > 5)
    }
    
    const isValid = Object.values(validations).every(v => v)
    
    console.log('Validating Step 5 (Bank Details):', {
        country,
        region,
        requirements,
        validations,
        isValid
    })
    
    if (updateStepStatus) {
        page.steps.done(5, isValid)
    }
    
    return isValid
}

export function validateIBAN(iban: string | undefined): boolean {
    if (!iban) return false
    
    // Remove spaces and convert to uppercase
    iban = iban.replace(/\s/g, '').toUpperCase()
    
    // Check length (15-34 characters)
    if (iban.length < 15 || iban.length > 34) return false
    
    // Check country code (2 letters at start)
    if (!/^[A-Z]{2}/.test(iban)) return false
    
    // Check check digits (2 digits after country code)
    if (!/^[A-Z]{2}[0-9]{2}/.test(iban)) return false
    
    // MOD-97 checksum validation
    try {
        const rearranged = iban.substring(4) + iban.substring(0, 4)
        const numeric = rearranged.replace(/[A-Z]/g, (char) => 
            (char.charCodeAt(0) - 55).toString()
        )
        
        // Calculate mod 97 for large numbers (IBAN checksum)
        let remainder = 0
        for (let i = 0; i < numeric.length; i++) {
            remainder = (remainder * 10 + parseInt(numeric[i])) % 97
        }
        
        return remainder === 1
    } catch (error) {
        return false
    }
}

export function validateSWIFT(swift: string | undefined): boolean {
    if (!swift) return false
    
    // Remove spaces and convert to uppercase
    swift = swift.replace(/\s/g, '').toUpperCase()
    
    // Pattern: AAAABBCCDDD (8 or 11 characters)
    // AAAA - Bank code (letters)
    // BB - Country code (letters)
    // CC - Location code (letters or numbers)
    // DDD - Branch code (optional, letters or numbers)
    const pattern = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/
    return pattern.test(swift)
}
