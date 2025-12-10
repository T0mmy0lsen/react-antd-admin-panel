import { Section, Steps, Conditions, Input, Select, List, Button, Get, Formula, DatePicker, Checkbox, Upload } from '../../../typescript'
import Main from '../../../typescript/main'

export interface ExternalsPageStructure {
    main: Main
    formula: Formula
    steps: Steps
    section: Section
    condition: Conditions
    
    s1: PersonalInfoStep
    s2: JourneyDetailsStep  // RENAMED from ProjectDetailsStep
    s3: PDFAcceptanceStep   // NEW
    s4: ExpensesStep        // RENAMED from GodtgoerelseStep
    s5: BankDetailsStep     // MOVED from s2
    s6: SubmitStep          // RENUMBERED from s5
}

export interface PersonalInfoStep {
    section: Section
    field_name: Input
    field_email: Input
    field_country: Input
    field_address: Input
    field_city: Input
    field_zip: Input
    field_id: Input
    // Hidden fields with formatters
    field_inviteToken: Input
    field_udgiftsposter: Input
    field_kontostreng: Input
    field_process: Input
    field_bankInformation: Input
    field_underkonto: Input
    field_analysenummer: Input
    field_omkostningsted: Input
    field_projektnummer: Input
    field_omkostningsted2: Input
    field_godkender: Input
    field_branch: Input
    field_department: Input
}

export interface BankDetailsStep {
    section: Section
    
    // Common fields (used by most regions)
    field_accountHolder: Input
    field_bankName: Input
    field_currency: Select
    
    // Danish/Nordic specific
    field_regNumber: Input       // Registreringsnummer (4 digits)
    field_accountNumber: Input   // Kontonummer (10 digits for DK, varies for others)
    
    // European/International
    field_iban: Input
    field_swift: Input
    
    // Americas specific
    field_routingNumber: Input   // ABA/BSB routing number
    
    // Japan specific
    field_alternateBankName: Input  // Alternative bank name
    
    // India specific
    field_branchCode: Input      // Bank branch code
    field_relationship: Select   // Sender/recipient relationship
    field_paymentReason: Select  // Reason for payment
    field_invoiceDetails: Input  // Invoice/service details
    
    // South Korea specific
    field_accountHolderAddress: Input  // Full address
    
    // Special handling flags
    field_requiresManualProcessing: Input  // Hidden flag for Myanmar
    field_region: Input  // Hidden - stores detected region
    
    validationState: Conditions
}

// CHANGE 3: Renamed and updated Journey Details (formerly ProjectDetailsStep)
export interface JourneyDetailsStep {
    section: Section
    field_departureDate: DatePicker  // Departure date picker
    field_returnDate: DatePicker     // NEW: Return date picker
    field_reason: Input              // Travel reason (textarea)
    field_destination: Input         // Travel destination
    field_programDocument: Upload    // NEW: Upload component for program document
    field_nonDkTravel: Checkbox      // NEW: Checkbox for non-DK travel
    // Keep for backend compatibility
    field_projectNumber?: Input
    field_contractNumber?: Input
    field_approver?: Input
    field_costCenter?: Input
}

// CHANGE 8: NEW PDF Acceptance Step
export interface PDFAcceptanceStep {
    section: Section
    field_accepted: Input           // Checkbox state
    field_timestamp: Input          // Hidden timestamp field
    condition: Conditions           // For validation
}

// CHANGE 4-7: Renamed Expenses Step (formerly GodtgoerelseStep)
export interface ExpensesStep {
    section: Section
    list: List
    button: Button
    get: Get
    condition: Conditions
}

export interface SubmitStep {
    section: Section
    button: Button
    sectionReady: Section
    sectionSuccess: Section
    sectionFail: Section
    condition: Conditions
}

export interface GodtgoerelseType {
    code: string
    label: string
    requiresDistance: boolean
    requiresUpload: boolean
    maxAmount?: number
}

// Updated expense record with comprehensive expense types
export interface GodtgoerelseRecord {
    id?: string
    date: string                    // Still stored but not shown in UI
    type: 'MILEAGE' | 'FLIGHT' | 'TRAIN' | 'BUS' | 'TAXI' | 'FERRY' | 'BRIDGE_TOLL' | 'PARKING' | 'BIKE_SCOOTER' |
          'HOTEL_DK' | 'HOTEL_ABROAD' | 'NON_HOTEL' | 'MEALS_TRAVEL' | 'CONF_DK' | 'CONF_ABROAD' | 
          'TRAINING_DK' | 'TRAINING_ABROAD' | 'VISA' | 'MEDICAL_CERT' | 'EU_TAXES' | 'MEMBERSHIPS' | 
          'LAYOUT_CONVERT' | 'GOODS_GENERAL'
    amount: number
    currency: string                // ISO 4217 currency code
    description?: string            // Required for all types
    
    // Mileage-specific fields - MANUAL ENTRY (only for MILEAGE type)
    licensePlate?: string           // Required for mileage reimbursement
    fromAddress?: string            // Text input for documentation
    toAddress?: string              // Text input for documentation
    distanceKM?: number             // Manual KM input
    calculatedAmount?: number       // Auto = distanceKM × 2.3
    
    // File uploads (for all types except MILEAGE and MEALS_TRAVEL)
    upload?: Array<{
        id: string
        file: string // filename
    }>
}

export interface FileAttachment {
    id: string
    name: string
    size: number
    url: string
}

export interface BankDetails {
    iban: string
    swift: string
    accountHolder: string
    bankName: string
    currency: string
}

export interface InviteTokenData {
    token: string
    email: string
    projectNumber: string
    contractNumber: string
    approver: string
    costCenter?: string         // CHANGE 10: Optional
    accountString?: string      // CHANGE 9: Optional
    expiresAt: string
    isValid: boolean
}

export interface DistanceCalculationRequest {
    from: string
    to: string
}

export interface DistanceCalculationResponse {
    distance_km: number
    duration_minutes: number
    from_formatted: string
    to_formatted: string
}

// CHANGE 6: Supported currencies for multi-currency expenses
export const SUPPORTED_CURRENCIES = [
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
] as const

export type CurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code']

// CHANGE 7: Currency totals interface
export interface CurrencyTotals {
    [currencyCode: string]: number
}

// CHANGE 9-10: Enhanced URL parameters with account string and cost center
export interface URLParams {
    email?: string
    approver?: string
    accountString?: string      // CHANGE 9: Full account string format
    costCenter?: string         // CHANGE 10: Simplified cost center format
    token?: string
}

// CHANGE 9-10: Hidden metadata (not shown to user)
export interface HiddenMetadata {
    accountString?: string
    costCenter?: string
    approver?: string
    inviteToken?: string
}
