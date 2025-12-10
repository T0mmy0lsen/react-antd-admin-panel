import React, { useEffect } from 'react'
import { Input as AntInput, Select as AntSelect, Typography } from 'antd'
import { ExternalsPageStructure } from '../types'
import { 
    BankRegion, 
    REGION_FIELD_CONFIG,
    getRoutingNumberLabel,
    getRoutingNumberPlaceholder,
    getRoutingNumberHelp
} from '../constants/bankRegions'

const { Text } = Typography
const { TextArea } = AntInput

interface ConditionalFieldsProps {
    page: ExternalsPageStructure
    region: BankRegion
}

/**
 * Renders conditional bank detail fields based on payment region
 */
export function BankDetailsConditionalFields({ page, region }: ConditionalFieldsProps) {
    const s5 = page.s5
    const country = page.s1.field_country._data || ''
    const requirements = REGION_FIELD_CONFIG[region]
    
    // Auto-populate alternative bank name for Japan
    useEffect(() => {
        if (region === BankRegion.JAPAN) {
            const bankName = s5.field_bankName._data
            const altBankName = s5.field_alternateBankName._data
            
            if (bankName && !altBankName) {
                s5.field_alternateBankName.tsxSetValue(bankName)
                s5.field_alternateBankName._data = bankName
            }
        }
    }, [s5.field_bankName._data, region])
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Account Holder - Always shown */}
            {requirements.accountHolder && (
                <div>
                    <Text strong>Account Holder Name *</Text>
                    <AntInput
                        placeholder="Full name as it appears on the bank account"
                        value={s5.field_accountHolder._data || ''}
                        onChange={(e) => {
                            s5.field_accountHolder.tsxSetValue(e.target.value)
                            s5.field_accountHolder._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* Danish/Nordic Fields */}
            {requirements.regNumber && (
                <div>
                    <Text strong>Registreringsnummer *</Text>
                    <AntInput
                        placeholder="4 cifre (e.g., 1234)"
                        maxLength={4}
                        value={s5.field_regNumber._data || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '') // Only digits
                            s5.field_regNumber.tsxSetValue(value)
                            s5.field_regNumber._data = value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        4-cifret registreringsnummer fra din bank
                    </Text>
                </div>
            )}
            
            {requirements.accountNumber && region === BankRegion.DENMARK_NORDIC && (
                <div>
                    <Text strong>Kontonummer *</Text>
                    <AntInput
                        placeholder="10 cifre"
                        maxLength={10}
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '') // Only digits
                            s5.field_accountNumber.tsxSetValue(value)
                            s5.field_accountNumber._data = value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        Du kan også bruge IBAN og SWIFT hvis du foretrækker det
                    </Text>
                </div>
            )}
            
            {/* European/Israel Fields */}
            {requirements.iban && (
                <div>
                    <Text strong>IBAN (International Bank Account Number) *</Text>
                    <AntInput
                        placeholder="e.g., DK50 0040 0440 1162 43"
                        value={s5.field_iban._data || ''}
                        onChange={(e) => {
                            s5.field_iban.tsxSetValue(e.target.value)
                            s5.field_iban._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        💡 15-34 characters starting with country code. Examples:<br />
                        DK50 0040 0440 1162 43 (Denmark) • DE89 3704 0044 0532 0130 00 (Germany)
                    </Text>
                </div>
            )}
            
            {requirements.swift && (
                <div>
                    <Text strong>SWIFT/BIC Code *</Text>
                    <AntInput
                        placeholder="e.g., DABADKKK"
                        maxLength={11}
                        value={s5.field_swift._data || ''}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase()
                            s5.field_swift.tsxSetValue(value)
                            s5.field_swift._data = value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        8 or 11 characters identifying your bank
                    </Text>
                </div>
            )}
            
            {/* Bank Name */}
            {requirements.bankName && (
                <div>
                    <Text strong>Bank Name *</Text>
                    <AntInput
                        placeholder="e.g., Danske Bank, ICICI Bank, Chase Bank"
                        value={s5.field_bankName._data || ''}
                        onChange={(e) => {
                            s5.field_bankName.tsxSetValue(e.target.value)
                            s5.field_bankName._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* Americas: Account Number + Routing Number */}
            {requirements.accountNumber && region === BankRegion.AMERICAS && (
                <div>
                    <Text strong>Account Number *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {requirements.routingNumber && (
                <div>
                    <Text strong>{getRoutingNumberLabel(country)} *</Text>
                    <AntInput
                        placeholder={getRoutingNumberPlaceholder(country)}
                        value={s5.field_routingNumber._data || ''}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '') // Only digits
                            s5.field_routingNumber.tsxSetValue(value)
                            s5.field_routingNumber._data = value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        {getRoutingNumberHelp(country)}
                    </Text>
                </div>
            )}
            
            {/* Japan: Account Number + Alternative Bank Name */}
            {requirements.accountNumber && region === BankRegion.JAPAN && (
                <div>
                    <Text strong>Account Number (口座番号) *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {requirements.alternateBankName && (
                <div>
                    <Text strong>Alternative Bank Name (オルタナティブバンク名) *</Text>
                    <AntInput
                        placeholder="Same as Bank Name if not provided"
                        value={s5.field_alternateBankName._data || ''}
                        onChange={(e) => {
                            s5.field_alternateBankName.tsxSetValue(e.target.value)
                            s5.field_alternateBankName._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        Alternative representation of your bank name (auto-filled from Bank Name if empty)
                    </Text>
                </div>
            )}
            
            {/* India: Special Fields */}
            {requirements.branchCode && (
                <div>
                    <Text strong>Bank Branch Code *</Text>
                    <AntInput
                        placeholder="e.g., ICIC0000007"
                        value={s5.field_branchCode._data || ''}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase()
                            s5.field_branchCode.tsxSetValue(value)
                            s5.field_branchCode._data = value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        If bank branch is provided (e.g., ICIC0000007), add this to the bank name field above
                    </Text>
                </div>
            )}
            
            {requirements.relationship && (
                <div>
                    <Text strong>Relationship between Sender and Recipient *</Text>
                    <AntSelect
                        placeholder="Select relationship"
                        value={s5.field_relationship._data || undefined}
                        onChange={(value) => {
                            s5.field_relationship.tsxSetValue(value)
                            s5.field_relationship._data = value
                        }}
                        style={{ width: '100%', marginTop: 4 }}
                        options={[
                            { value: 'employee_employer', label: 'Employee / Employer' },
                            { value: 'subsidiary_parent', label: 'Subsidiary / Parent Company' },
                            { value: 'vendor_client', label: 'Vendor / Client' },
                            { value: 'contractor_company', label: 'Contractor / Company' }
                        ]}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        Must be stated in English for Indian bank transfers
                    </Text>
                </div>
            )}
            
            {requirements.paymentReason && (
                <div>
                    <Text strong>Reason for Payment *</Text>
                    <AntSelect
                        placeholder="Select payment reason"
                        value={s5.field_paymentReason._data || undefined}
                        onChange={(value) => {
                            s5.field_paymentReason.tsxSetValue(value)
                            s5.field_paymentReason._data = value
                        }}
                        style={{ width: '100%', marginTop: 4 }}
                        options={[
                            { value: 'salary', label: 'Salary' },
                            { value: 'invoice', label: 'Invoice Payment' },
                            { value: 'expense_reimbursement', label: 'Expense Reimbursement' },
                            { value: 'loan', label: 'Loan' },
                            { value: 'service_payment', label: 'Service Payment' }
                        ]}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        Must be stated in English for Indian bank transfers
                    </Text>
                </div>
            )}
            
            {requirements.invoiceDetails && (
                <div>
                    <Text strong>Invoice/Service Details *</Text>
                    <TextArea
                        placeholder="Invoice number and brief description of goods/services (in English)"
                        rows={3}
                        value={s5.field_invoiceDetails._data || ''}
                        onChange={(e) => {
                            s5.field_invoiceDetails.tsxSetValue(e.target.value)
                            s5.field_invoiceDetails._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        If payment is based on invoice/service, provide details (e.g., "Invoice #12345 for conference attendance and materials")
                    </Text>
                </div>
            )}
            
            {/* South Korea: Account Holder Address */}
            {requirements.accountHolderAddress && (
                <div>
                    <Text strong>Account Holder's Full Address *</Text>
                    <TextArea
                        placeholder="Complete address including street, city, postal code"
                        rows={2}
                        value={s5.field_accountHolderAddress._data || ''}
                        onChange={(e) => {
                            s5.field_accountHolderAddress.tsxSetValue(e.target.value)
                            s5.field_accountHolderAddress._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* Rest of World: Account Number (generic) */}
            {requirements.accountNumber && region === BankRegion.REST_OF_WORLD && (
                <div>
                    <Text strong>Account Number *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* South Korea: Account Number */}
            {requirements.accountNumber && region === BankRegion.SOUTH_KOREA && (
                <div>
                    <Text strong>Account Number (계좌번호) *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* Myanmar: Account Number */}
            {requirements.accountNumber && region === BankRegion.MYANMAR && (
                <div>
                    <Text strong>Account Number *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
            
            {/* Jordan: Account Number */}
            {requirements.accountNumber && region === BankRegion.JORDAN && (
                <div>
                    <Text strong>Account Number *</Text>
                    <AntInput
                        placeholder="Your bank account number"
                        value={s5.field_accountNumber._data || ''}
                        onChange={(e) => {
                            s5.field_accountNumber.tsxSetValue(e.target.value)
                            s5.field_accountNumber._data = e.target.value
                        }}
                        style={{ marginTop: 4 }}
                    />
                </div>
            )}
        </div>
    )
}
