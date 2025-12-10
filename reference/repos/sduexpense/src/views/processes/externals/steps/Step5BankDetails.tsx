import React, { useState, useEffect } from 'react'
import { Section, Title, Space } from '../../../../typescript'
import { ExternalsPageStructure } from '../types'
import Main from '../../../../typescript/main'
import { validateStep5 } from '../utils/validators'
import { Select as AntSelect, Typography } from 'antd'

import { DEBUG_PREFILL_ENABLED, DEBUG_TEST_DATA } from '../config'
import { 
    BankRegion, 
    COUNTRY_TO_REGION_MAP, 
    SANCTIONED_COUNTRIES,
    getRegionLabel
} from '../constants/bankRegions'
import { SanctionedCountryWarning, SpecialProcessingAlert, RegionIndicator } from '../components/BankRegionAlerts'
import { BankDetailsConditionalFields } from '../components/BankDetailsConditionalFields'

const { Text } = Typography

/**
 * React component for region-aware bank details form
 * Extracted to comply with React hooks rules
 */
function BankDetailsForm({ page }: { page: ExternalsPageStructure }) {
    const { s5, s1 } = page
    const [region, setRegion] = useState<BankRegion>(BankRegion.REST_OF_WORLD)
    const [regionOverride, setRegionOverride] = useState<boolean>(false)
    const country = s1.field_country._data || ''
        
        // Auto-detect region from country
        useEffect(() => {
            if (!regionOverride) { // Only auto-detect if not manually overridden
                const detectedRegion = COUNTRY_TO_REGION_MAP[country] || BankRegion.REST_OF_WORLD
                setRegion(detectedRegion)
                
                // Store region for API
                s5.field_region.tsxSetValue(detectedRegion)
                s5.field_region._data = detectedRegion
                
                // Flag Myanmar for manual processing
                if (detectedRegion === BankRegion.MYANMAR) {
                    s5.field_requiresManualProcessing.tsxSetValue(true)
                    s5.field_requiresManualProcessing._data = true
                } else {
                    s5.field_requiresManualProcessing.tsxSetValue(false)
                    s5.field_requiresManualProcessing._data = false
                }
                
                // Currency restrictions for Jordan
                if (detectedRegion === BankRegion.JORDAN) {
                    const currentCurrency = s5.field_currency._data
                    if (currentCurrency !== 'USD' && currentCurrency !== 'EUR') {
                        s5.field_currency.tsxSetValue('EUR')
                        s5.field_currency._data = 'EUR'
                    }
                }
                
                // Initial validation with detected region
                setTimeout(() => validateStep5(page, false), 200)
            }
        }, [country, regionOverride])
        
        // Handler for manual region override
        const handleRegionOverride = (selectedRegion: BankRegion) => {
            setRegion(selectedRegion)
            setRegionOverride(true)
            
            // Update stored region
            s5.field_region.tsxSetValue(selectedRegion)
            s5.field_region._data = selectedRegion
            
            // Apply region-specific rules
            if (selectedRegion === BankRegion.MYANMAR) {
                s5.field_requiresManualProcessing.tsxSetValue(true)
                s5.field_requiresManualProcessing._data = true
            } else {
                s5.field_requiresManualProcessing.tsxSetValue(false)
                s5.field_requiresManualProcessing._data = false
            }
            
            // Currency restrictions for Jordan
            if (selectedRegion === BankRegion.JORDAN) {
                const currentCurrency = s5.field_currency._data
                if (currentCurrency !== 'USD' && currentCurrency !== 'EUR') {
                    s5.field_currency.tsxSetValue('EUR')
                    s5.field_currency._data = 'EUR'
                }
            }
            
            // Trigger validation
            setTimeout(() => validateStep5(page), 100)
        }
        
        // Field change handlers - all trigger validation
        useEffect(() => {
            const fields = [
                s5.field_accountHolder,
                s5.field_bankName,
                s5.field_regNumber,
                s5.field_accountNumber,
                s5.field_iban,
                s5.field_swift,
                s5.field_routingNumber,
                s5.field_alternateBankName,
                s5.field_branchCode,
                s5.field_relationship,
                s5.field_paymentReason,
                s5.field_invoiceDetails,
                s5.field_accountHolderAddress
            ]
            
            fields.forEach(field => {
                if (field && field.onChange) {
                    field.onChange(() => validateStep5(page))
                }
            })
        }, [])
        
        // If sanctioned country, show warning and block form
        if (SANCTIONED_COUNTRIES.includes(country)) {
            return (
                <div>
                    <SanctionedCountryWarning country={country} />
                </div>
            )
        }
        
        return (
            <div>
                {/* Region Override Selector */}
                <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 6, border: '1px solid #e0e0e0' }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Banking Region</Text>
                    <AntSelect
                        placeholder="Auto-detected from country"
                        value={region}
                        onChange={handleRegionOverride}
                        style={{ width: '100%' }}
                        options={[
                            { value: BankRegion.DENMARK_NORDIC, label: 'Denmark/Nordic Banking' },
                            { value: BankRegion.EUROPE_ISRAEL, label: 'European IBAN (EU + Israel)' },
                            { value: BankRegion.AMERICAS, label: 'Americas Banking (US, Canada, AU, NZ)' },
                            { value: BankRegion.INDIA, label: 'Indian Banking' },
                            { value: BankRegion.JAPAN, label: 'Japanese Banking' },
                            { value: BankRegion.SOUTH_KOREA, label: 'South Korean Banking' },
                            { value: BankRegion.JORDAN, label: 'Jordan (EUR/USD only)' },
                            { value: BankRegion.MYANMAR, label: 'Myanmar (Manual Processing)' },
                            { value: BankRegion.REST_OF_WORLD, label: 'Other Countries' }
                        ]}
                    />
                    <Text style={{ fontSize: 11, color: '#666', display: 'block', marginTop: 4 }}>
                        {regionOverride 
                            ? '✏️ Region manually selected - override auto-detection' 
                            : `🔍 Auto-detected from "${country}" - you can change this if needed`}
                    </Text>
                </div>

                {/* Region indicator */}
                <RegionIndicator 
                    country={country} 
                    regionLabel={getRegionLabel(region)} 
                />
                
                {/* Special processing alerts */}
                <SpecialProcessingAlert region={region} />
                
                {/* Conditional fields based on region */}
                <BankDetailsConditionalFields 
                    page={page} 
                    region={region} 
                />
                
                {/* Currency selector */}
                <div style={{ marginTop: 24 }}>
                    <Text strong>Currency *</Text>
                    <AntSelect
                        placeholder="Select currency"
                        value={s5.field_currency._data || 'DKK'}
                        onChange={(value) => {
                            s5.field_currency.tsxSetValue(value)
                            s5.field_currency._data = value
                            validateStep5(page)
                        }}
                        style={{ width: '100%', marginTop: 4 }}
                        disabled={region === BankRegion.JORDAN} // Force EUR/USD for Jordan
                        options={[
                            { value: 'DKK', label: 'DKK - Danish Krone' },
                            { value: 'EUR', label: 'EUR - Euro' },
                            { value: 'USD', label: 'USD - US Dollar' },
                            { value: 'GBP', label: 'GBP - British Pound' },
                            { value: 'SEK', label: 'SEK - Swedish Krona' },
                            { value: 'NOK', label: 'NOK - Norwegian Krone' },
                            { value: 'JPY', label: 'JPY - Japanese Yen' },
                            { value: 'CHF', label: 'CHF - Swiss Franc' }
                        ]}
                    />
                    <Text style={{ fontSize: 12, color: '#666', display: 'block', marginTop: 4 }}>
                        {region === BankRegion.JORDAN 
                            ? '⚠️ Jordan payments must use EUR or USD' 
                            : 'Select the currency of your bank account'}
                    </Text>
                </div>
            </div>
        )
}

/**
 * CHANGE 2: Bank Details Step (moved from Step 2 to Step 5)
 * Region-aware payment fields based on country selection
 */
export function Step5BankDetails(page: ExternalsPageStructure, main: Main): Section {
    const { s5 } = page
    
    // Build section
    s5.section.add(new Title().label('Bank Details for Reimbursement').level(3))
    s5.section.add(new Space().bottom(24).border())
    
    // Add the React component for region-aware dynamic UI
    s5.section.add(new Section().component(() => <BankDetailsForm page={page} />))
    
    s5.section.formula(page.formula)
    s5.section.init()
    
    return s5.section
}
