/**
 * Bank Region Configuration for International Payments
 * Based on SDU payment requirements for different countries/regions
 */

export enum BankRegion {
    DENMARK_NORDIC = 'DK_NORDIC',      // Denmark, Greenland, Faroe Islands
    EUROPE_ISRAEL = 'EU_ISRAEL',       // EU + Israel
    AMERICAS = 'AMERICAS',              // USA, Canada, Australia, New Zealand
    INDIA = 'INDIA',
    JAPAN = 'JAPAN',
    JORDAN = 'JORDAN',
    MYANMAR = 'MYANMAR',
    SOUTH_KOREA = 'SOUTH_KOREA',
    REST_OF_WORLD = 'REST_OF_WORLD'
}

/**
 * Map countries to their payment region
 */
export const COUNTRY_TO_REGION_MAP: Record<string, BankRegion> = {
    // Denmark, Greenland, Faroe Islands
    'Denmark': BankRegion.DENMARK_NORDIC,
    'Greenland': BankRegion.DENMARK_NORDIC,
    'Faroe Islands': BankRegion.DENMARK_NORDIC,
    
    // Europe + Israel
    'Austria': BankRegion.EUROPE_ISRAEL,
    'Belgium': BankRegion.EUROPE_ISRAEL,
    'Bulgaria': BankRegion.EUROPE_ISRAEL,
    'Croatia': BankRegion.EUROPE_ISRAEL,
    'Cyprus': BankRegion.EUROPE_ISRAEL,
    'Czech Republic': BankRegion.EUROPE_ISRAEL,
    'Estonia': BankRegion.EUROPE_ISRAEL,
    'Finland': BankRegion.EUROPE_ISRAEL,
    'France': BankRegion.EUROPE_ISRAEL,
    'Germany': BankRegion.EUROPE_ISRAEL,
    'Greece': BankRegion.EUROPE_ISRAEL,
    'Hungary': BankRegion.EUROPE_ISRAEL,
    'Ireland': BankRegion.EUROPE_ISRAEL,
    'Italy': BankRegion.EUROPE_ISRAEL,
    'Latvia': BankRegion.EUROPE_ISRAEL,
    'Lithuania': BankRegion.EUROPE_ISRAEL,
    'Luxembourg': BankRegion.EUROPE_ISRAEL,
    'Malta': BankRegion.EUROPE_ISRAEL,
    'Netherlands': BankRegion.EUROPE_ISRAEL,
    'Poland': BankRegion.EUROPE_ISRAEL,
    'Portugal': BankRegion.EUROPE_ISRAEL,
    'Romania': BankRegion.EUROPE_ISRAEL,
    'Slovakia': BankRegion.EUROPE_ISRAEL,
    'Slovenia': BankRegion.EUROPE_ISRAEL,
    'Spain': BankRegion.EUROPE_ISRAEL,
    'Sweden': BankRegion.EUROPE_ISRAEL,
    'Norway': BankRegion.EUROPE_ISRAEL,
    'Iceland': BankRegion.EUROPE_ISRAEL,
    'Liechtenstein': BankRegion.EUROPE_ISRAEL,
    'Switzerland': BankRegion.EUROPE_ISRAEL,
    'United Kingdom': BankRegion.EUROPE_ISRAEL,
    'Israel': BankRegion.EUROPE_ISRAEL,
    
    // Americas (USA, Canada, Australia, New Zealand)
    'United States': BankRegion.AMERICAS,
    'Canada': BankRegion.AMERICAS,
    'Australia': BankRegion.AMERICAS,
    'New Zealand': BankRegion.AMERICAS,
    
    // Special regions
    'India': BankRegion.INDIA,
    'Japan': BankRegion.JAPAN,
    'Jordan': BankRegion.JORDAN,
    'Myanmar': BankRegion.MYANMAR,
    'South Korea': BankRegion.SOUTH_KOREA,
}

/**
 * Countries under sanctions - cannot process payments
 */
export const SANCTIONED_COUNTRIES = [
    'Russia',
    'Belarus',
    'Ukraine (non-government controlled areas)'
]

/**
 * Field requirements for each region
 */
export interface RegionFieldRequirements {
    accountHolder: boolean
    regNumber: boolean           // Denmark only
    accountNumber: boolean       // Denmark, Americas, Japan, Korea, Rest
    bankName: boolean
    iban: boolean
    swift: boolean
    routingNumber: boolean       // Americas only
    alternateBankName: boolean   // Japan only
    branchCode: boolean          // India only
    relationship: boolean        // India only
    paymentReason: boolean       // India only
    invoiceDetails: boolean      // India only
    accountHolderAddress: boolean // South Korea only
}

export const REGION_FIELD_CONFIG: Record<BankRegion, RegionFieldRequirements> = {
    [BankRegion.DENMARK_NORDIC]: {
        accountHolder: true,
        regNumber: true,
        accountNumber: true,
        bankName: false,
        iban: false,  // Optional - can also be used
        swift: false, // Optional - can also be used
        routingNumber: false,
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.EUROPE_ISRAEL]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: false,
        bankName: true,
        iban: true,
        swift: true,
        routingNumber: false,
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.AMERICAS]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: true,  // ABA (US/CA 9), BSB (AU 6), NZ (6)
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.INDIA]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: false,
        bankName: true,
        iban: true,
        swift: true,
        routingNumber: false,
        alternateBankName: false,
        branchCode: true,
        relationship: true,
        paymentReason: true,
        invoiceDetails: true,
        accountHolderAddress: false
    },
    [BankRegion.JAPAN]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: false,
        alternateBankName: true,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.JORDAN]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: false,
        alternateBankName: true,  // Required per spec
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.MYANMAR]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: false,
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    },
    [BankRegion.SOUTH_KOREA]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: false,
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: true
    },
    [BankRegion.REST_OF_WORLD]: {
        accountHolder: true,
        regNumber: false,
        accountNumber: true,
        bankName: true,
        iban: false,
        swift: true,
        routingNumber: false,
        alternateBankName: false,
        branchCode: false,
        relationship: false,
        paymentReason: false,
        invoiceDetails: false,
        accountHolderAddress: false
    }
}

/**
 * Get human-readable label for region
 */
export function getRegionLabel(region: BankRegion): string {
    const labels: Record<BankRegion, string> = {
        [BankRegion.DENMARK_NORDIC]: 'Denmark, Greenland & Faroe Islands',
        [BankRegion.EUROPE_ISRAEL]: 'Europe & Israel',
        [BankRegion.AMERICAS]: 'Americas (USA, Canada, Australia, New Zealand)',
        [BankRegion.INDIA]: 'India',
        [BankRegion.JAPAN]: 'Japan',
        [BankRegion.JORDAN]: 'Jordan',
        [BankRegion.MYANMAR]: 'Myanmar',
        [BankRegion.SOUTH_KOREA]: 'South Korea',
        [BankRegion.REST_OF_WORLD]: 'Rest of World'
    }
    return labels[region]
}

/**
 * Get routing number field label based on country
 */
export function getRoutingNumberLabel(country: string): string {
    switch (country) {
        case 'United States':
        case 'Canada':
            return 'ABA Routing Number'
        case 'Australia':
            return 'BSB Code'
        case 'New Zealand':
            return 'Bank Code'
        default:
            return 'Routing Number'
    }
}

/**
 * Get routing number placeholder based on country
 */
export function getRoutingNumberPlaceholder(country: string): string {
    switch (country) {
        case 'United States':
        case 'Canada':
            return '9 digits (e.g., 123456789)'
        case 'Australia':
            return '6 digits (e.g., 123456)'
        case 'New Zealand':
            return '6 digits'
        default:
            return 'Enter routing number'
    }
}

/**
 * Get routing number help text based on country
 */
export function getRoutingNumberHelp(country: string): string {
    switch (country) {
        case 'United States':
            return 'ABA routing number: 9-digit code found on your checks'
        case 'Canada':
            return 'ABA routing number: 9-digit transit number'
        case 'Australia':
            return 'BSB code: 6-digit Bank-State-Branch code'
        case 'New Zealand':
            return 'Bank code: 6-digit code identifying your bank branch'
        default:
            return 'Routing number for your bank'
    }
}

/**
 * Validate routing number format based on country
 */
export function validateRoutingNumber(value: string | undefined, country: string): boolean {
    if (!value) return false
    
    // USA/Canada: 9 digits (ABA routing number)
    if (country === 'United States' || country === 'Canada') {
        return /^\d{9}$/.test(value)
    }
    
    // Australia: 6 digits (BSB code)
    if (country === 'Australia') {
        return /^\d{6}$/.test(value)
    }
    
    // New Zealand: 6 digits
    if (country === 'New Zealand') {
        return /^\d{6}$/.test(value)
    }
    
    return false
}
