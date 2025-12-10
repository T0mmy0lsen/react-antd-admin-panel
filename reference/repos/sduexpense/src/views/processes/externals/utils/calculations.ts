// Calculation utilities

import { KM_RATE_DKK } from '../config'
import { GodtgoerelseRecord, ExternalsPageStructure, CurrencyTotals, SUPPORTED_CURRENCIES } from '../types'

// CHANGE 4: Manual KM calculation
export function calculateKmAmount(distanceKm: number): number {
    // Round to 2 decimal places
    return Math.round(distanceKm * KM_RATE_DKK * 100) / 100
}

// LEGACY: Single currency total (deprecated in Phase 4)
export function calculateTotalAmount(records: GodtgoerelseRecord[]): number {
    return records.reduce((sum, record) => sum + (parseFloat(record.amount as any) || 0), 0)
}

// CHANGE 7: Calculate totals per currency
export function calculateCurrencyTotals(records: GodtgoerelseRecord[]): CurrencyTotals {
    return records.reduce((totals, record) => {
        const currency = record.currency || 'DKK'
        const amount = parseFloat(record.amount as any) || 0
        totals[currency] = (totals[currency] || 0) + amount
        return totals
    }, {} as CurrencyTotals)
}

// CHANGE 7: Format currency totals for display
export function formatCurrencyTotals(totals: CurrencyTotals): string[] {
    return Object.entries(totals).map(([currency, amount]) => {
        const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency)
        return `Total ${currency}: ${amount.toFixed(2)} ${currencyInfo?.symbol || currency}`
    })
}

// CHANGE 7: Format single currency amount
export function formatCurrency(amount: number, currency: string): string {
    const currencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currency)
    return `${amount.toFixed(2)} ${currencyInfo?.symbol || currency}`
}

export function updateTotalAmount(page: ExternalsPageStructure): number {
    const records = page.s4.list.getRecords?.() || []
    const total = calculateTotalAmount(records)
    console.log('Total amount updated:', total)
    return total
}

export function handleTypeChange(record: GodtgoerelseRecord, page: ExternalsPageStructure): void {
    // Clear type-specific fields when type changes
    // Note: In this framework, we modify the record directly
    
    // Clear all type-specific fields (CHANGE 4: updated for manual KM)
    record.fromAddress = undefined
    record.toAddress = undefined
    record.distanceKM = undefined         // CHANGE 4: Manual KM field
    record.calculatedAmount = undefined   // CHANGE 4: Calculated amount
    record.licensePlate = undefined       // License plate for mileage
    
    console.log('Type changed, cleared type-specific fields for record:', record.id)
}
