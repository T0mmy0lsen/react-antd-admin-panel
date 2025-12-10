/**
 * Data Mappers - Maps UI data to backend RejseAfregningBody format
 * Matches the C# DTO structure with proper field names
 */

import { ExternalsPageStructure, GodtgoerelseRecord, GodtgoerelseType } from '../types'

// ExpenseType is the union of allowed expense type codes
type ExpenseType = GodtgoerelseRecord['type']

// ============================================================================
// API PAYLOAD TYPES (matching C# DTOs)
// ============================================================================

export interface KontostrengBody {
    underkonto?: string
    omkostningsted?: string
    analysenummer?: string
    formål?: string
    projektnummer?: string
    omkostningsted2?: string
}

export interface BankInformationBody {
    accountHolder?: string
    bankName?: string
    currency?: string
    regNumber?: string
    accountNumber?: string
    iban?: string
    swift?: string
    routingNumber?: string
    alternateBankName?: string
    branchCode?: string
    relationship?: string
    paymentReason?: string
    invoiceDetails?: string
    accountHolderAddress?: string
}

export interface UdgiftspostBody {
    id?: number | null
    dato: string
    kategori: string
    bemærkninger?: string
    valuta: string
    beløb: number
}

export interface RejseAfregningBody {
    navn?: string
    addresse?: string
    by?: string
    postnummer?: string
    cpr?: string
    godkender?: string
    beskrivelse?: string
    byStedNavn?: string
    department?: string
    branch?: string
    fra?: string
    til?: string
    process: number  // 0=Standard, 1=Klinikophold, 2=Externals
    country?: string
    bankInformation?: BankInformationBody
    kontostreng: KontostrengBody
    udgiftsposter: UdgiftspostBody[]
}

// ============================================================================
// LEGACY TYPE (for compatibility)
// ============================================================================

export interface ApiPayload {
    navn?: string
    email?: string
    land?: string
    adresse?: string
    by?: string
    postnummer?: string
    afrejseDato?: string
    rejseÅrsag?: string
    rejsemål?: string
    programDokument?: string
    projektNummer?: string
    kontraktNummer?: string
    godkender?: string
    omkostningssted?: string
    vilkårAccepteret?: boolean
    acceptTidspunkt?: string
    kontoindehaver?: string
    bankNavn?: string
    valuta?: string
    registreringsnummer?: string
    kontonummer?: string
    iban?: string
    swift?: string
    
    // Americas
    routingNumber?: string
    
    // Japan
    alternativtBankNavn?: string
    
    // India
    bankBranchKode?: string
    afsenderModtagerForhold?: string
    betalingsÅrsag?: string
    fakturaDetaljer?: string
    
    // South Korea
    kontoindehaverAdresse?: string
    
    // Metadata
    kræverManuelBehandling?: boolean
    betalingsRegion?: string
    
    // Hidden fields (CHANGE 9: added accountString)
    id?: number
    inviteToken?: string
    accountString?: string     // CHANGE 9: NEW - full account string
    costCenter?: string        // Keep for backward compatibility
}

export interface ApiExpensePayload {
    id?: string
    dato: string
    type: 'KM' | 'TRANS' | 'OVER' | 'MEAL' | 'OTHER'
    beløb: number
    valuta: string              // CHANGE 6: NEW - currency code
    beskrivelse?: string
    
    // CHANGE 4: KM-specific fields - MANUAL ENTRY
    fraAdresse?: string         // Text input for documentation
    tilAdresse?: string         // Text input for documentation
    afstandKM?: number          // CHANGE 4: Manual KM input
    beregnetBeløb?: number      // CHANGE 4: Calculated amount (KM × 2.3)
    
    // File uploads
    upload?: Array<{
        id: string
        file: string
    }>
}

// Map our comprehensive 24-type system to the backend's 5-type system
function mapToApiType(frontendType: ExpenseType): 'KM' | 'TRANS' | 'OVER' | 'MEAL' | 'OTHER' {
    switch (frontendType) {
        case 'MILEAGE':
            return 'KM'
        case 'FLIGHT':
        case 'TRAIN':
        case 'BUS':
        case 'TAXI':
        case 'FERRY':
        case 'BRIDGE_TOLL':
        case 'PARKING':
        case 'BIKE_SCOOTER':
            return 'TRANS'
        case 'HOTEL_DK':
        case 'HOTEL_ABROAD':
        case 'NON_HOTEL':
            return 'OVER'
        case 'MEALS_TRAVEL':
            return 'MEAL'
        default:
            return 'OTHER'
    }
}

// Map API type back to our frontend type (for incoming data)
function mapFromApiType(apiType: 'KM' | 'TRANS' | 'OVER' | 'MEAL' | 'OTHER'): ExpenseType {
    switch (apiType) {
        case 'KM':
            return 'MILEAGE'
        case 'TRANS':
            return 'FLIGHT'  // Default to flight for transport
        case 'OVER':
            return 'HOTEL_DK'  // Default to DK hotel
        case 'MEAL':
            return 'MEALS_TRAVEL'  // Default to travel meals
        case 'OTHER':
            return 'GOODS_GENERAL'  // Default to general goods
        default:
            return 'GOODS_GENERAL'
    }
}

export interface ApiResponse extends ApiPayload {
    udgiftsposter?: ApiExpensePayload[]
}

// ============================================================================
// FORMATTERS (matching klinikophold pattern)
// ============================================================================

/**
 * Format account string (kontostreng) from page data
 * Maps hidden fields to account structure for API
 */
export const formatKontostreng = (page: any): KontostrengBody => {
    return {
        underkonto: page.s1.field_underkonto?._data ?? '08',
        omkostningsted: page.s1.field_omkostningsted?._data ?? '00000',
        analysenummer: page.s1.field_analysenummer?._data ?? '00000',
        formål: page.s2.field_reason?._data || page.s2.field_reason?._default || '',
        projektnummer: page.s2.field_projectNumber?._data ?? '0000000',
        omkostningsted2: page.s1.field_omkostningsted2?._data ?? '000',
    }
}

/**
 * Format bank information from page data
 */
export const formatBankInformation = (page: any): BankInformationBody => {
    return {
        accountHolder: page.s5.field_accountHolder._data || page.s5.field_accountHolder._default,
        bankName: page.s5.field_bankName._data || page.s5.field_bankName._default,
        currency: page.s5.field_currency._data || page.s5.field_currency._default,
        regNumber: page.s5.field_regNumber._data || page.s5.field_regNumber._default,
        accountNumber: page.s5.field_accountNumber._data || page.s5.field_accountNumber._default,
        iban: page.s5.field_iban._data || page.s5.field_iban._default,
        swift: page.s5.field_swift._data || page.s5.field_swift._default,
        routingNumber: page.s5.field_routingNumber._data || page.s5.field_routingNumber._default,
        alternateBankName: page.s5.field_alternateBankName?._data || page.s5.field_alternateBankName?._default,
        branchCode: page.s5.field_branchCode?._data || page.s5.field_branchCode?._default,
        relationship: page.s5.field_relationship?._data || page.s5.field_relationship?._default,
        paymentReason: page.s5.field_paymentReason?._data || page.s5.field_paymentReason?._default,
        invoiceDetails: page.s5.field_invoiceDetails?._data || page.s5.field_invoiceDetails?._default,
        accountHolderAddress: page.s5.field_accountHolderAddress?._data || page.s5.field_accountHolderAddress?._default,
    }
}

/**
 * Format records from the expense list to API payload format
 * Converts UI data structure to backend expected format
 */
export const formatRecordToUdgiftspost = (page: any): UdgiftspostBody[] => {
    const records = page.s4.list._componentIsBuild 
        ? page.s4.list.getRecords() 
        : page.s4.list._default?.dataSource
    
    console.log('formatRecordToUdgiftspost', records)
    
    return records?.map((r: any) => ({
        id: r.id === '' ? null : r.id,
        dato: r.date,
        kategori: r.category ?? '2',
        bemærkninger: r.text,
        valuta: r.currency ?? 'DKK',
        beløb: r.amount,
    })) || []
}

// ============================================================================
// LEGACY FUNCTIONS (for compatibility)
// ============================================================================

/**
 * Converts UI page structure to API payload format (All steps)
 * CHANGE 1-3, 8-9: Updated for Phase 4 restructure
 */
export function toApiPayload(page: ExternalsPageStructure): ApiPayload {
    const { s1, s2, s3, s4, s5, s6 } = page
    
    return {
        // Step 1: Personal Info (CHANGE 1: removed phone, added country)
        navn: s1.field_name._data || s1.field_name._default,
        email: s1.field_email._data || s1.field_email._default,
        land: s1.field_country._data || s1.field_country._default,
        adresse: s1.field_address._data || s1.field_address._default,
        by: s1.field_city._data || s1.field_city._default,
        postnummer: s1.field_zip._data || s1.field_zip._default,
        
        // Step 2: Journey Details (CHANGE 3: renamed from Project Details)
        afrejseDato: s2.field_departureDate._data || s2.field_departureDate._default,
        rejseÅrsag: s2.field_reason._data || s2.field_reason._default,
        rejsemål: s2.field_destination._data || s2.field_destination._default,
        programDokument: s2.field_programDocument._data || s2.field_programDocument._default,
        // Keep for backend compatibility
        projektNummer: s2.field_projectNumber?._data || s2.field_projectNumber?._default,
        kontraktNummer: s2.field_contractNumber?._data || s2.field_contractNumber?._default,
        godkender: s2.field_approver?._data || s2.field_approver?._default,
        omkostningssted: s2.field_costCenter?._data || s2.field_costCenter?._default,
        
        // Step 3: PDF Acceptance (CHANGE 8: NEW STEP)
        vilkårAccepteret: s3.field_accepted._data || s3.field_accepted._default,
        acceptTidspunkt: s3.field_timestamp._data || s3.field_timestamp._default,
        
        // Step 5: Bank Details (CHANGE 2: moved from Step 2)
        // Region-specific payment fields
        kontoindehaver: s5.field_accountHolder._data || s5.field_accountHolder._default,
        bankNavn: s5.field_bankName._data || s5.field_bankName._default,
        valuta: s5.field_currency._data || s5.field_currency._default,
        
        // Danish/Nordic
        registreringsnummer: s5.field_regNumber._data || s5.field_regNumber._default,
        kontonummer: s5.field_accountNumber._data || s5.field_accountNumber._default,
        
        // European/International
        iban: s5.field_iban._data || s5.field_iban._default,
        swift: s5.field_swift._data || s5.field_swift._default,
        
        // Americas
        routingNumber: s5.field_routingNumber._data || s5.field_routingNumber._default,
        
        // Japan
        alternativtBankNavn: s5.field_alternateBankName._data || s5.field_alternateBankName._default,
        
        // India
        bankBranchKode: s5.field_branchCode._data || s5.field_branchCode._default,
        afsenderModtagerForhold: s5.field_relationship._data || s5.field_relationship._default,
        betalingsÅrsag: s5.field_paymentReason._data || s5.field_paymentReason._default,
        fakturaDetaljer: s5.field_invoiceDetails._data || s5.field_invoiceDetails._default,
        
        // South Korea
        kontoindehaverAdresse: s5.field_accountHolderAddress._data || s5.field_accountHolderAddress._default,
        
        // Metadata
        kræverManuelBehandling: s5.field_requiresManualProcessing._data || s5.field_requiresManualProcessing._default,
        betalingsRegion: s5.field_region._data || s5.field_region._default,
        
        // Hidden fields (CHANGE 9: added accountString)
        id: s1.field_id._data || s1.field_id._default,
        inviteToken: s1.field_inviteToken._data || s1.field_inviteToken._default,
    }
}

/**
 * Converts single expense record to API format
 * CHANGE 4 & 6: Updated for manual KM and multi-currency
 */
export function toApiExpensePayload(record: GodtgoerelseRecord): ApiExpensePayload {
    return {
        id: record.id,
        dato: record.date,
        type: mapToApiType(record.type),  // Map our 24-type system to API's 5-type system
        beløb: record.amount,
        valuta: record.currency || 'DKK',  // CHANGE 6: Include currency
        beskrivelse: record.description,
        
        // CHANGE 4: KM-specific fields - MANUAL ENTRY
        fraAdresse: record.fromAddress,
        tilAdresse: record.toAddress,
        afstandKM: record.distanceKM,      // Manual KM input
        beregnetBeløb: record.calculatedAmount,  // Calculated amount
        
        // File uploads
        upload: record.upload,
    }
}

/**
 * Converts all expense records from List component to API format
 * Used by hidden field_expenses.format() function
 */
export function toApiExpenseListPayload(page: ExternalsPageStructure): ApiExpensePayload[] {
    const records = page.s4.list.getRecords() as GodtgoerelseRecord[]
    
    if (!records || records.length === 0) {
        return []
    }
    
    return records.map(record => toApiExpensePayload(record))
}

// ============================================================================
// API → UI TRANSFORMATIONS (Inbound)
// ============================================================================

/**
 * Populates UI fields from API response (All steps)
 * CHANGE 1-3, 8: Updated for Phase 4 restructure
 */
export function fromApiResponse(page: ExternalsPageStructure, apiData: ApiResponse): void {
    const { s1, s2, s3, s5 } = page
    
    // Step 1: Personal Info (CHANGE 1: removed phone, added country)
    if (apiData.navn) s1.field_name.tsxSetValue(apiData.navn)
    if (apiData.email) s1.field_email.tsxSetValue(apiData.email)
    if (apiData.land) s1.field_country.tsxSetValue(apiData.land)
    if (apiData.adresse) s1.field_address.tsxSetValue(apiData.adresse)
    if (apiData.by) s1.field_city.tsxSetValue(apiData.by)
    if (apiData.postnummer) s1.field_zip.tsxSetValue(apiData.postnummer)
    
    // Step 2: Journey Details (CHANGE 3: renamed from Project Details)
    if (apiData.afrejseDato) s2.field_departureDate.tsxSetValue(apiData.afrejseDato)
    if (apiData.rejseÅrsag) s2.field_reason.tsxSetValue(apiData.rejseÅrsag)
    if (apiData.rejsemål) s2.field_destination.tsxSetValue(apiData.rejsemål)
    if (apiData.programDokument) s2.field_programDocument.tsxSetValue(apiData.programDokument)
    // Keep for backend compatibility
    if (apiData.projektNummer && s2.field_projectNumber) s2.field_projectNumber.tsxSetValue(apiData.projektNummer)
    if (apiData.kontraktNummer && s2.field_contractNumber) s2.field_contractNumber.tsxSetValue(apiData.kontraktNummer)
    if (apiData.godkender && s2.field_approver) s2.field_approver.tsxSetValue(apiData.godkender)
    if (apiData.omkostningssted && s2.field_costCenter) s2.field_costCenter.tsxSetValue(apiData.omkostningssted)
    
    // Step 3: PDF Acceptance (CHANGE 8: NEW STEP)
    if (apiData.vilkårAccepteret) s3.field_accepted.tsxSetValue(apiData.vilkårAccepteret)
    if (apiData.acceptTidspunkt) s3.field_timestamp.tsxSetValue(apiData.acceptTidspunkt)
    
    // Step 5: Bank Details (CHANGE 2: moved from Step 2)
    // Region-specific payment fields
    if (apiData.kontoindehaver) s5.field_accountHolder.tsxSetValue(apiData.kontoindehaver)
    if (apiData.bankNavn) s5.field_bankName.tsxSetValue(apiData.bankNavn)
    if (apiData.valuta) s5.field_currency.tsxSetValue(apiData.valuta)
    
    // Danish/Nordic
    if (apiData.registreringsnummer) s5.field_regNumber.tsxSetValue(apiData.registreringsnummer)
    if (apiData.kontonummer) s5.field_accountNumber.tsxSetValue(apiData.kontonummer)
    
    // European/International
    if (apiData.iban) s5.field_iban.tsxSetValue(apiData.iban)
    if (apiData.swift) s5.field_swift.tsxSetValue(apiData.swift)
    
    // Americas
    if (apiData.routingNumber) s5.field_routingNumber.tsxSetValue(apiData.routingNumber)
    
    // Japan
    if (apiData.alternativtBankNavn) s5.field_alternateBankName.tsxSetValue(apiData.alternativtBankNavn)
    
    // India
    if (apiData.bankBranchKode) s5.field_branchCode.tsxSetValue(apiData.bankBranchKode)
    if (apiData.afsenderModtagerForhold) s5.field_relationship.tsxSetValue(apiData.afsenderModtagerForhold)
    if (apiData.betalingsÅrsag) s5.field_paymentReason.tsxSetValue(apiData.betalingsÅrsag)
    if (apiData.fakturaDetaljer) s5.field_invoiceDetails.tsxSetValue(apiData.fakturaDetaljer)
    
    // South Korea
    if (apiData.kontoindehaverAdresse) s5.field_accountHolderAddress.tsxSetValue(apiData.kontoindehaverAdresse)
    
    // Metadata
    if (apiData.kræverManuelBehandling) s5.field_requiresManualProcessing.tsxSetValue(apiData.kræverManuelBehandling)
    if (apiData.betalingsRegion) s5.field_region.tsxSetValue(apiData.betalingsRegion)
    
    // Hidden fields
    if (apiData.id) s1.field_id.tsxSetValue(apiData.id.toString())
    if (apiData.inviteToken) s1.field_inviteToken.tsxSetValue(apiData.inviteToken)
}

/**
 * Converts API expense response to UI record format
 * CHANGE 4 & 6: Updated for manual KM and multi-currency
 */
export function fromApiExpenseResponse(apiRecord: ApiExpensePayload): GodtgoerelseRecord {
    // Split combined route description if fromAddress/toAddress not provided
    let fromAddress = apiRecord.fraAdresse
    let toAddress = apiRecord.tilAdresse
    
    if (!fromAddress && !toAddress && apiRecord.beskrivelse && apiRecord.beskrivelse.includes(' - ')) {
        const parts = apiRecord.beskrivelse.split(' - ')
        fromAddress = parts[0]?.trim()
        toAddress = parts[1]?.trim()
    }
    
    return {
        id: apiRecord.id,
        date: apiRecord.dato,
        type: mapFromApiType(apiRecord.type),  // Map API's 5-type system to our 24-type system
        amount: apiRecord.beløb,
        currency: apiRecord.valuta || 'DKK',  // CHANGE 6: Include currency
        description: apiRecord.beskrivelse,
        
        // CHANGE 4: KM-specific fields - MANUAL ENTRY
        fromAddress: fromAddress,
        toAddress: toAddress,
        distanceKM: apiRecord.afstandKM,              // Manual KM input
        calculatedAmount: apiRecord.beregnetBeløb,    // Calculated amount
        
        // File uploads
        upload: apiRecord.upload,
    }
}
