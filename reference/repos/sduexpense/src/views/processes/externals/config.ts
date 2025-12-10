import Main from '../../../typescript/main'
import { Steps, Section, Conditions, Input, Select, List, Button, Get, SelectItem, DatePicker, Checkbox, CheckboxItem, Upload } from '../../../typescript'
import { createFormula, createSubmitFormula, getInitialData } from './api/externalsApi'
import { ExternalsPageStructure, GodtgoerelseType } from './types'
import { formatKontostreng, formatRecordToUdgiftspost, formatBankInformation } from './api/mappers'
import { validateStep2 } from './utils/validators'

// 🐛 DEBUG MODE: Set to true to prefill test data in Steps 1-3
export const DEBUG_PREFILL_ENABLED = true

export const DEBUG_TEST_DATA = {
    // Step 1: Personal Info (CHANGE 1: removed phone, added country)
    step1: {
        name: 'John Test Developer',
        country: 'Denmark',
        address: 'Campusvej 55',
        city: 'Odense',
        zip: '5230'
    },
    // Step 2: Journey Details (CHANGE 3: renamed from Project Details)
    step2: {
        departureDate: '2025-10-15',
        returnDate: '2025-10-18',
        reason: 'Research collaboration for AI project - conference attendance and meetings with partner institutions',
        destination: 'Stockholm, Sweden',
        nonDkTravel: 1  // 1 = checked, 0 = unchecked
    },
    // Step 5: Bank Details (CHANGE 2: moved from Step 2)
    step5: {
        iban: 'DK5000400440116243',
        swift: 'DABADKKK',
        accountHolder: 'John Test Developer',
        currency: 'DKK'
    }
}

export const GODTGOERELSE_TYPES: GodtgoerelseType[] = [
    // Transportation
    { code: 'MILEAGE', label: 'Mileage Reimbursement (221001)', requiresDistance: true, requiresUpload: false },
    { code: 'FLIGHT', label: 'Flight tickets (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'TRAIN', label: 'Train tickets (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'BUS', label: 'Bus tickets (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'TAXI', label: 'Taxi (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'FERRY', label: 'Ferry (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'BRIDGE_TOLL', label: 'Bridge Toll (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'PARKING', label: 'Parking (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'BIKE_SCOOTER', label: 'Rental of bicycles and scooters (221000)', requiresDistance: false, requiresUpload: true },
    
    // Accommodation
    { code: 'HOTEL_DK', label: 'Hotel Denmark (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'HOTEL_ABROAD', label: 'Hotel abroad (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'NON_HOTEL', label: 'Non-hotel accommodation (221000)', requiresDistance: false, requiresUpload: true },
    
    // Meals & Subsistence
    { code: 'MEALS_TRAVEL', label: 'Meals when travelling (221000)', requiresDistance: false, requiresUpload: false },
    
    // Conferences & Training
    { code: 'CONF_DK', label: 'Conference fee Denmark (227001)', requiresDistance: false, requiresUpload: true },
    { code: 'CONF_ABROAD', label: 'Conference fee abroad (227001)', requiresDistance: false, requiresUpload: true },
    { code: 'TRAINING_DK', label: 'In-service training courses, Denmark (227001)', requiresDistance: false, requiresUpload: true },
    { code: 'TRAINING_ABROAD', label: 'In-service training courses - Abroad (227001)', requiresDistance: false, requiresUpload: true },
    
    // Official Requirements
    { code: 'VISA', label: 'Visa (221000)', requiresDistance: false, requiresUpload: true },
    { code: 'MEDICAL_CERT', label: 'Medical certificate / vaccination (227063)', requiresDistance: false, requiresUpload: true },
    { code: 'EU_TAXES', label: 'EU taxes and fees (227052)', requiresDistance: false, requiresUpload: true },
    
    // Memberships & Subscriptions
    { code: 'MEMBERSHIPS', label: 'Memberships (227040)', requiresDistance: false, requiresUpload: true },
    
    // General & Other
    { code: 'LAYOUT_CONVERT', label: 'Layout for later conversion (227098)', requiresDistance: false, requiresUpload: true },
    { code: 'GOODS_GENERAL', label: 'Purchase of goods in general (228029)', requiresDistance: false, requiresUpload: true }
]

export const KM_RATE_DKK = 2.3 // CHANGE 4: Manual KM rate (Phase 4)
export const MAX_DISTANCE_KM = 10000 // CHANGE 4: Increased for manual entry
export const MAX_FILE_SIZE_MB = 10 // CHANGE 3: Increased for program documents

export const CURRENCIES = [
    new SelectItem('DKK', 'DKK', 'Danish Krone'),
    new SelectItem('EUR', 'EUR', 'Euro'),
    new SelectItem('USD', 'USD', 'US Dollar'),
    new SelectItem('GBP', 'GBP', 'British Pound'),
    new SelectItem('SEK', 'SEK', 'Swedish Krona'),
    new SelectItem('NOK', 'NOK', 'Norwegian Krone')
]

export function createPageStructure(main: Main): ExternalsPageStructure {
    // Read URL parameters upfront for default values (CHANGE 9-10: added accountString)
    const url = new URL(window.location.href)
    const email = url.searchParams.get('email') || ''
    const inviteToken = url.searchParams.get('inviteToken') || ''
    const projectNumber = url.searchParams.get('projectNumber') || ''
    const contractNumber = url.searchParams.get('contractNumber') || ''
    const approver = url.searchParams.get('approver') || ''
    const costCenter = url.searchParams.get('costCenter') || ''
    const accountString = url.searchParams.get('accountString') || '' // CHANGE 9: Full account string
    
    const page: ExternalsPageStructure = {
        main,
        formula: createFormula(main),
        steps: new Steps().default(0),
        // To customize button text, you can set:
        // steps._backText = 'Tilbage'  // or any custom text
        // steps._nextText = 'Næste'   // or any custom text
        section: new Section(),
        condition: new Conditions().default(true),
        
        // Step 1: Personal Info (CHANGE 1: removed phone, added country)
        s1: {
            section: new Section(),
            field_name: new Input()
                .key('navn')
                .label('Full Name'),
            field_email: new Input()
                .key('email')
                .label('Email')
                .disabled()
                .default(email),
            field_country: new Input()
                .label('Country'),
            field_address: new Input()
                .key('addresse')
                .label('Address'),
            field_city: new Input()
                .key('by')
                .label('City'),
            field_zip: new Input()
                .key('postnummer')
                .label('Postal Code'),
            field_id: new Input()
                .key('cpr')
                .label('ID Number'),
            // Hidden fields with formatters
            field_inviteToken: new Input().key('inviteToken').disabled().hidden().default(inviteToken),
            field_udgiftsposter: new Input().key('udgiftsposter').disabled().hidden().format(() => formatRecordToUdgiftspost(page)),
            field_kontostreng: new Input().key('kontostreng').disabled().hidden().format(() => formatKontostreng(page)),
            field_process: new Input().key('process').disabled().hidden().default(2), // 2 = Externals
            field_bankInformation: new Input().key('bankInformation').disabled().hidden().format(() => formatBankInformation(page)),
            field_underkonto: new Input().disabled().hidden(),
            field_analysenummer: new Input().disabled().hidden(),
            field_omkostningsted: new Input().disabled().hidden(),
            field_projektnummer: new Input().disabled().hidden(),
            field_omkostningsted2: new Input().disabled().hidden(),
            field_godkender: new Input().disabled().hidden(),
            field_branch: new Input().key('branch').disabled().hidden(),
            field_department: new Input().key('department').disabled().hidden()
        },
        
        // Step 2: Journey Details (CHANGE 3: renamed from Project Details)
        s2: {
            section: new Section(),
            field_departureDate: new DatePicker()
                .key('fra')
                .label('Departure Date')
                .onChange(() => validateStep2(page)),
            field_returnDate: new DatePicker()
                .key('til')
                .label('Return Date')
                .onChange(() => validateStep2(page)),
            field_reason: new Input()
                .key('formål')
                .label('Reason for Travel')
                .textarea(),
            field_destination: new Input()
                .key('byStedNavn')
                .label('Where did you travel to? (Country, City/Location)'),
            field_nonDkTravel: new Checkbox()
                .key('ikkeIndenlandskRejse')
                .onChange(() => {
                    console.log('🔍 Non-DK travel checkbox changed! New value:', page.s2.field_nonDkTravel._data)
                    validateStep2(page)
                    
                    // Call the upload visibility callback if it exists
                    if (typeof (window as any).updateNonDkUploadVisibility === 'function') {
                        const isChecked = Array.isArray(page.s2.field_nonDkTravel._data) && page.s2.field_nonDkTravel._data.length > 0
                        ;(window as any).updateNonDkUploadVisibility(isChecked)
                    }
                }),
            field_programDocument: new Upload()
                .key('programDokument')
                .label('Program Document')
                .fileType('.pdf,.doc,.docx')
                .url(() => `${main.$config.config.pathToApi}Externals/programdocument`)
                .header({ 'Authorization': 'Bearer ' + main.$account.accessToken }),
            // Keep for backend compatibility
            field_projectNumber: new Input()
                .key('projektnummer')
                .disabled()
                .hidden()
                .default(projectNumber),
            field_contractNumber: new Input()
                .disabled()
                .hidden()
                .default(contractNumber),
            field_approver: new Input()
                .key('godkender')
                .disabled()
                .hidden()
                .default(approver),
            field_costCenter: new Input()
                .key('omkostningsted')
                .disabled()
                .hidden()
                .default(costCenter)
        },
        
        // Step 3: PDF Acceptance (CHANGE 8: NEW STEP)
        s3: {
            section: new Section(),
            field_accepted: new Input()
                .disabled()
                .hidden(),
            field_timestamp: new Input()
                .disabled()
                .hidden(),
            condition: new Conditions().default(false)
        },
        
        // Step 4: Expenses (CHANGE 4-7: renamed from Godtgørelse, multi-currency)
        s4: {
            section: new Section(),
            list: new List(),
            button: new Button(),
            get: new Get(),
            condition: new Conditions().default(false)
        },
        
        // Step 5: Bank Details (CHANGE 2: moved from Step 2)
        // Region-specific fields for international payments
        s5: {
            section: new Section(),
            
            // Common fields
            field_accountHolder: new Input()
                .label('Account Holder Name'),
            field_bankName: new Input()
                .label('Bank Name'),
            field_currency: new Select()
                .label('Currency')
                .default('DKK')
                .addMore(CURRENCIES),
            
            // Danish/Nordic specific
            field_regNumber: new Input()
                .label('Registreringsnummer'),
            field_accountNumber: new Input()
                .label('Kontonummer'),
            
            // European/International
            field_iban: new Input()
                .label('IBAN'),
            field_swift: new Input()
                .label('SWIFT/BIC Code'),
            
            // Americas specific
            field_routingNumber: new Input()
                .label('Routing Number'),
            
            // Japan specific
            field_alternateBankName: new Input()
                .label('Alternative Bank Name'),
            
            // India specific
            field_branchCode: new Input()
                .label('Bank Branch Code'),
            field_relationship: new Select()
                .label('Relationship'),
            field_paymentReason: new Select()
                .label('Payment Reason'),
            field_invoiceDetails: new Input()
                .label('Invoice Details'),
            
            // South Korea specific
            field_accountHolderAddress: new Input()
                .label('Account Holder Address'),
            
            // Hidden metadata
            field_requiresManualProcessing: new Input()
                .hidden()
                .disabled(),
            field_region: new Input()
                .hidden()
                .disabled(),
            
            validationState: new Conditions().default('pending')
        },
        
        // Step 6: Review & Submit (CHANGE 2: renumbered from Step 5)
        s6: {
            section: new Section(),
            button: new Button().formula(createSubmitFormula(main, () => page)),
            sectionReady: new Section(),
            sectionSuccess: new Section(),
            sectionFail: new Section(),
            condition: new Conditions().default('ready')
        }
    }
    
    // Configure steps onClick to save on navigation (klinikophold pattern)
    page.steps.onClick((index: number) => {
        const processId = page.s1.field_id._data || page.s1.field_id._default
        if (processId) {
            console.log(`💾 Step navigation (${index}): Saving...`)
            page.formula.submit(processId)
        }
    })
    
    // Initialize data loading
    const initialData = getInitialData(main, () => page)
    initialData.get()
    
    // Store reference for later use
    main.$store(page, 'externals-page')
    
    return page
}
