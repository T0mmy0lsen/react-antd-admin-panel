import React from 'react'
import { Section, Title, Space, Typography, Action, ListHeader, SelectItem } from '../../../../typescript'
import { ExternalsPageStructure, GodtgoerelseRecord } from '../types'
import Main from '../../../../typescript/main'
import { GODTGOERELSE_TYPES, KM_RATE_DKK } from '../config'
import { validateStep4, handleTypeChange, updateTotalAmount, calculateCurrencyTotals, formatCurrencyTotals } from '../utils'
import { ExpenseRowRenderer } from '../components'
import { UploadToList } from '../../../components/UploadComponent'
import { Alert, Typography as AntTypography } from 'antd'
import { SUPPORTED_CURRENCIES } from '../types' // CHANGE 6: Import currency list

// Generate unique ID for new records
function generateId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * CHANGE 4-7: Expenses Step (renamed from Godtgoerelse)
 * - Manual KM entry (no auto-calculation)
 * - Multi-currency support
 * - Currency totals
 * - No date field (inherited from Journey)
 */
export function Step4Expenses(page: ExternalsPageStructure, main: Main): Section {
    const { s4 } = page
    
    // Configure Get request for loading expenses from main GET call
    // Pattern matches klinikophold: GET /Externals/{processId} returns full data including udgiftsposter
    s4.get
        .target(() => {
            const processId = page.s1.field_id._data || page.s1.field_id._default || '1'
            return `Externals/${processId}`
        })
        .header({ 'Authorization': 'Bearer ' + main.$account.accessToken })
        .alter((data: any) => {
            // Transform API format to UI format
            console.log('📥 Loading expenses from Externals GET:', data)
            
            // Extract expenses from response (udgiftsposter field, like klinikophold)
            const expenses = data?.udgiftsposter || []
            
            // Map from API format (Danish) to UI format (English)
            return expenses.map((expense: any) => ({
                id: expense.id || generateId(),
                date: expense.dato || expense.date,
                type: expense.type,
                amount: expense.beløb || expense.amount || 0,
                description: expense.beskrivelse || expense.description,
                fromAddress: expense.fraAdresse || expense.fromAddress,
                toAddress: expense.tilAdresse || expense.toAddress,
                distance: expense.afstand || expense.distance,
                upload: expense.upload || []
            }))
        })
        .onThen((expenses: any[]) => {
            console.log(`✅ Loaded ${expenses.length} expenses from main GET`)
            validateStep4(page)
            s4.condition.checkCondition(true)
        })
        .onCatch((error: any) => {
            console.error('Failed to load expenses:', error)
            // Initialize with empty list on error
            return []
        })
    
    // Add instructional alert for expense types
    s4.section.add(new Section().component(() => (
        <Alert
            type="info"
            showIcon
            message="Expense Types Guide"
            description={
                <div>
                    <p style={{ marginBottom: 8 }}><strong>Select the appropriate expense type for each entry:</strong></p>
                    <ul style={{ marginBottom: 0 }}>
                        <li><strong>Km-godtgørelse (KM):</strong> Mileage reimbursement - Enter start/end addresses to calculate distance</li>
                        <li><strong>Transport:</strong> Train, bus, plane tickets - Description required, receipt recommended</li>
                        <li><strong>Overnatning (Hotel):</strong> Accommodation - Max 1000 DKK/night, receipt required</li>
                        <li><strong>Måltidsgodtgørelse (Meal):</strong> Meal allowance - Standard rates apply</li>
                        <li><strong>Andet (Other):</strong> Other expenses - Detailed description and documentation required</li>
                    </ul>
                </div>
            }
            style={{ marginBottom: 16 }}
            closable
        />
    )))
    
    // Configure "Add Expense" button
    s4.button
        .style({ marginBottom: 16 })
        .middle()
        .primary()
        .action(new Action()
            .label('+ Add Expense')
            .callback(() => {
                const existingRecords = s4.list.getRecords?.() || []
                // CHANGE 5 & 6: Auto-set date from Journey, default currency to DKK
                const journeyDate = page.s2.field_departureDate._data || page.s2.field_departureDate._default || new Date().toISOString().substring(0, 10)
                const newRecord: GodtgoerelseRecord = {
                    id: generateId(),
                    date: journeyDate,      // CHANGE 5: Auto-set from Journey Details
                    type: 'MILEAGE',       // Default to MILEAGE type (was 'KM')
                    amount: 0,
                    currency: 'DKK',       // CHANGE 6: Default currency
                    upload: []
                }
                
                console.log('Adding new expense record:', newRecord)
                s4.list.setRecord(newRecord)
                
                // Trigger validation
                setTimeout(() => validateStep4(page), 100)
            })
        )
    
    // Configure List
    s4.list.headerCreate(false) // No built-in create button
    s4.list.footer(false)
    s4.list.rowClassName('topAlign')
    s4.list.get(() => s4.get) // Connect Get request to List (CRITICAL!)
    
    // Hidden ID column (required for List to work)
    s4.list.headerPrepend(new ListHeader()
        .key('id')
        .title('')
        .width('10px')
        .render((_, r) => <></>)
    )
    
    // Date column
    s4.list.headerPrepend(new ListHeader()
        .key('date')
        .type('date')
        .title('Date')
        .editable()
        .width('140px')
        .onChange(() => {
            console.log('Date changed, validating...')
            validateStep4(page)
        })
    )
    
    // Type dropdown
    s4.list.headerPrepend(new ListHeader()
        .key('type')
        .type('select')
        .title('Type')
        .editable()
        .width('200px')
        .items(
            // Use comprehensive expense types instead of hardcoded old types
            GODTGOERELSE_TYPES.map(expenseType => 
                new SelectItem(expenseType.code, expenseType.code, expenseType.label)
            )
        )
        .onChange((record: any) => {
            console.log('Type changed, record:', record)
            // Check if record and record.type exist before proceeding
            if (record && record.type) {
                console.log('Type changed to:', record.type)
                handleTypeChange(record, page)
            } else {
                console.warn('Type change called but record or type is undefined:', record)
            }
            // Always validate regardless
            setTimeout(() => validateStep4(page), 50)
        })
    )
    
    // Amount column
    s4.list.headerPrepend(new ListHeader()
        .key('amount')
        .type('number')
        .title('Amount (DKK)')
        .editable()
        .width('130px')
        .onChange(() => {
            console.log('Amount changed, updating total...')
            updateTotalAmount(page)
            validateStep4(page)
        })
    )
    
    // Warning column for amount limits
    s4.list.headerPrepend(new ListHeader()
        .key('warning')
        .title('')
        .width('120px')
        .render((_, record: GodtgoerelseRecord) => {
            const isLimitedType = record.type === 'TRAIN' || record.type === 'BUS' || record.type === 'MILEAGE'
            const exceedsLimit = isLimitedType && record.amount > 140
            
            if (!exceedsLimit) return null
            
            return (
                <div style={{ 
                    fontSize: 11, 
                    color: '#ff4d4f', 
                    fontStyle: 'italic',
                    fontWeight: 500
                }}>
                    ⚠️ Max 140 DKK
                </div>
            )
        })
    )
    
    // Details column - renders type-specific fields
    s4.list.headerPrepend(new ListHeader()
        .key('details')
        .title('Details')
        .width('350px')
        .render((_, record: GodtgoerelseRecord) => {
            return (
                <ExpenseRowRenderer
                    record={record}
                    page={page}
                    main={main}
                    onChange={(updates) => {
                        console.log('Row details changed:', updates)
                        // Update record with new values
                        Object.assign(record, updates)
                        validateStep4(page)
                    }}
                    disabled={false}
                />
            )
        })
    )
    
    // Files/Upload column
    s4.list.headerPrepend(new ListHeader()
        .key('upload')
        .title('Files')
        .width('180px')
        .render((_, record: any) => {
            return (
                <UploadToList
                    disabled={false}
                    main={main}
                    page={page}
                    record={record}
                    onChange={() => {
                        console.log('Files changed for record:', record.id)
                        validateStep4(page)
                    }}
                />
            )
        })
    )
    
    // Delete action
    s4.list.actions(new Action()
        .key('deleteFromList')
        .onComplete(() => {
            console.log('Record deleted, validating...')
            validateStep4(page)
        })
    )
    
    // Build section content
    s4.section.add(new Title().label('Expense Entries').level(3))
    s4.section.add(new Space().bottom(24).border())
    
    // Instructions
    s4.section.add(new Section().component(() => {
        return (
            <>
                <Alert
                    type="info"
                    message="Km-godtgørelse (Mileage Reimbursement)"
                    description={
                        <div>
                            <p>For travel by personal vehicle, enter your start and end addresses. The system will calculate the distance automatically. Current rate: 3.67 DKK per km.</p>
                        </div>
                    }
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <Alert
                    type="info"
                    message="Transport (Train/Bus/Plane)"
                    description={
                        <div>
                            <p>For public transportation, enter the amount from your receipt/ticket. Upload documentation to support your claim.</p>
                        </div>
                    }
                    showIcon
                    style={{ marginBottom: 16 }}
                />
                <AntTypography.Text type="secondary" style={{ fontSize: 12 }}>
                    💡 Tip: Click "+ Add Expense" to create a new entry. You can add multiple entries of different types.
                </AntTypography.Text>
            </>
        )
    }))
    
    s4.section.add(new Space().top(24))
    s4.section.add(s4.button)
    s4.section.add(new Space().top(16))
    s4.section.add(s4.list)
    
    // Total amount display
    s4.section.add(new Section().component(() => {
        const records = s4.list.getRecords?.() || []
        const total = records.reduce((sum: number, r: any) => sum + (parseFloat(r.amount) || 0), 0)
        
        if (records.length === 0) {
            return null
        }
        
        return (
            <div style={{ 
                marginTop: 24, 
                padding: 16, 
                backgroundColor: '#f0f2f5', 
                borderRadius: 4,
                textAlign: 'right'
            }}>
                <AntTypography.Text strong style={{ fontSize: 18 }}>
                    Total Amount: {total.toFixed(2)} DKK
                </AntTypography.Text>
            </div>
        )
    }))
    
    s4.section.formula(page.formula)
    s4.section.init()
    
    // Note: Validation will run automatically when expenses load via s4.get.onThen()
    // The expenses are loaded from GET /Externals/{processId} which returns udgiftsposter[]
    
    return s4.section
}
