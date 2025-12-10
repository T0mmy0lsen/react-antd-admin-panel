import React from 'react'
import { Section, Title, Space, Typography, Button, Action, ConditionsItem } from '../../../../typescript'
import { ExternalsPageStructure, GodtgoerelseRecord } from '../types'
import Main from '../../../../typescript/main'
import { validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateGodtgoerelseRow } from '../utils/validators'
import { GODTGOERELSE_TYPES } from '../config'
import { submitExpenseClaim, clearDraft } from '../api/externalsApi'
import { calculateCurrencyTotals, formatCurrency } from '../utils/calculations'
import { Alert, Descriptions, Table, Tag, Typography as AntTypography, Button as AntButton } from 'antd'
import { CheckCircleOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons'

const { Title: AntTitle } = AntTypography

/**
 * CHANGE 2: Review & Submit Step (renumbered from Step 5 to Step 6)
 * CHANGE 7: Updated to show multi-currency totals
 */
export function Step6ReviewSubmit(page: ExternalsPageStructure, main: Main): Section {
    const { s6 } = page
    
    // Build ready section with comprehensive review
    s6.sectionReady.add(new Title().label('Review & Submit').level(3))
    s6.sectionReady.add(new Space().bottom(24).border())
    
    // Validation summary component
    s6.sectionReady.add(new Section().component(() => {
        const validationResults = {
            step1: validateStep1(page),
            step2: validateStep2(page),
            step3: validateStep3(page),
            step4: validateStep4(page)
        }
        
        const allValid = Object.values(validationResults).every(v => v)
        const records = page.s4.list.getRecords?.() || []
        const recordValidations = records.map(r => validateGodtgoerelseRow(r))
        const hasInvalidRecords = recordValidations.some(v => !v.valid)
        
        console.log('Step 5 validation check:', { validationResults, allValid, hasInvalidRecords })
        
        if (!allValid || hasInvalidRecords) {
            return (
                <Alert
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    message="Cannot Submit - Validation Errors"
                    description={
                        <div>
                            <p style={{ marginBottom: 8 }}><strong>Please fix the following issues before submitting:</strong></p>
                            <ul style={{ marginBottom: 0 }}>
                                {!validationResults.step1 && <li>Step 1 (Personal Information): Missing or invalid fields</li>}
                                {!validationResults.step2 && <li>Step 2 (Bank Details): Invalid IBAN, SWIFT, or account holder</li>}
                                {!validationResults.step3 && <li>Step 3 (Project Details): Missing required project information</li>}
                                {!validationResults.step4 && <li>Step 4 (Expenses): No expense entries added</li>}
                                {hasInvalidRecords && <li>Step 4 (Expenses): Some expense entries have validation errors</li>}
                            </ul>
                            <p style={{ marginTop: 12, marginBottom: 0 }}>
                                <strong>Navigate back to the relevant step using the wizard above.</strong>
                            </p>
                        </div>
                    }
                    style={{ marginBottom: 24 }}
                />
            )
        }
        
        return (
            <Alert
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                message="All Validations Passed"
                description="Your form is complete and ready to submit. Please review the details below."
                style={{ marginBottom: 24 }}
            />
        )
    }))
    
    // Personal Information Summary
    s6.sectionReady.add(new Section().component(() => (
        <div style={{ marginBottom: 24 }}>
            <AntTitle level={4}>Personal Information</AntTitle>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Full Name" span={2}>
                    {page.s1.field_name._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {page.s1.field_email._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Country">
                    {page.s1.field_country._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={2}>
                    {page.s1.field_address._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                    {page.s1.field_city._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Postal Code">
                    {page.s1.field_zip._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )))
    
    // Bank Details Summary (MASKED for security)
    s6.sectionReady.add(new Section().component(() => {
        const iban = page.s5.field_iban._data || ''
        const swift = page.s5.field_swift._data || ''
        
        // Mask IBAN (show first 4 and last 4 characters only)
        const maskedIban = iban.length > 8 
            ? `${iban.substring(0, 4)}${'*'.repeat(iban.length - 8)}${iban.substring(iban.length - 4)}`
            : iban
        
        // Mask SWIFT (show first 4 and last 2 characters only)
        const maskedSwift = swift.length > 6
            ? `${swift.substring(0, 4)}${'*'.repeat(swift.length - 6)}${swift.substring(swift.length - 2)}`
            : swift
        
        return (
            <div style={{ marginBottom: 24 }}>
                <AntTitle level={4}>Bank Details</AntTitle>
                <Descriptions bordered size="small" column={2}>
                    <Descriptions.Item label="IBAN" span={2}>
                        {maskedIban || <em style={{ color: '#999' }}>Not provided</em>}
                    </Descriptions.Item>
                    <Descriptions.Item label="SWIFT/BIC">
                        {maskedSwift || <em style={{ color: '#999' }}>Not provided</em>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Account Holder">
                        {page.s5.field_accountHolder._data || <em style={{ color: '#999' }}>Not provided</em>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Bank Name" span={2}>
                        {page.s5.field_bankName._data || <em style={{ color: '#999' }}>Not provided</em>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Currency">
                        {page.s5.field_currency._data || 'DKK'}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        )
    }))
    
    // Journey Details Summary
    s6.sectionReady.add(new Section().component(() => (
        <div style={{ marginBottom: 24 }}>
            <AntTitle level={4}>Journey Details</AntTitle>
            <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Departure Date">
                    {page.s2.field_departureDate._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Destination">
                    {page.s2.field_destination._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Reason for Travel" span={2}>
                    {page.s2.field_reason._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
                <Descriptions.Item label="Project Number" span={2}>
                    {page.s2.field_projectNumber?._data || <em style={{ color: '#999' }}>Not provided</em>}
                </Descriptions.Item>
            </Descriptions>
        </div>
    )))
    
    // Expense Entries Summary
    s6.sectionReady.add(new Section().component(() => {
        const records: GodtgoerelseRecord[] = page.s4.list.getRecords?.() || []
        
        const columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                width: 120,
                render: (date: string) => date || '-'
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                width: 150,
                render: (type: string) => {
                    const typeInfo = GODTGOERELSE_TYPES.find(t => t.code === type)
                    const validation = validateGodtgoerelseRow({ type, date: '', amount: 0, ...records.find(r => r.type === type) })
                    return (
                        <span>
                            {typeInfo?.label || type}
                            {!validation.valid && <WarningOutlined style={{ color: 'orange', marginLeft: 8 }} />}
                        </span>
                    )
                }
            },
            {
                title: 'Details',
                key: 'details',
                render: (_: any, record: GodtgoerelseRecord) => {
                    const parts: string[] = []
                    
                    if (record.type === 'MILEAGE') {
                        if (record.licensePlate) parts.push(`Vehicle: ${record.licensePlate}`)
                        if (record.fromAddress) parts.push(`From: ${record.fromAddress}`)
                        if (record.toAddress) parts.push(`To: ${record.toAddress}`)
                        if (record.distanceKM) parts.push(`Distance: ${record.distanceKM} km`)
                    }
                    
                    // For all other expense types, just show description
                    if (record.type !== 'MILEAGE' && record.description) {
                        parts.push(record.description)
                    }
                    
                    return parts.length > 0 ? parts.join(' | ') : <em style={{ color: '#999' }}>No details</em>
                }
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                width: 120,
                align: 'right' as const,
                render: (amount: number) => `${amount.toFixed(2)} DKK`
            },
            {
                title: 'Files',
                dataIndex: 'upload',
                key: 'upload',
                width: 80,
                align: 'center' as const,
                render: (upload: any[]) => {
                    const count = upload?.length || 0
                    return count > 0 ? <Tag color="blue">{count} file(s)</Tag> : <Tag>None</Tag>
                }
            },
            {
                title: 'Status',
                key: 'status',
                width: 100,
                align: 'center' as const,
                render: (_: any, record: GodtgoerelseRecord) => {
                    const validation = validateGodtgoerelseRow(record)
                    return validation.valid 
                        ? <Tag color="success" icon={<CheckCircleOutlined />}>Valid</Tag>
                        : <Tag color="warning" icon={<WarningOutlined />}>Warnings</Tag>
                }
            }
        ]
        
        const total = records.reduce((sum, r) => sum + (r.amount || 0), 0)
        
        return (
            <div style={{ marginBottom: 24 }}>
                <AntTitle level={4}>Expense Entries ({records.length})</AntTitle>
                <Table
                    dataSource={records}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    bordered
                    summary={() => (
                        <Table.Summary fixed>
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3} align="right">
                                    <strong>Total Amount:</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">
                                    <strong style={{ fontSize: 16 }}>{total.toFixed(2)} DKK</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={2} colSpan={2} />
                            </Table.Summary.Row>
                        </Table.Summary>
                    )}
                />
            </div>
        )
    }))
    
    // Submit Button (conditionally enabled)
    s6.sectionReady.add(new Space().top(24))
    s6.sectionReady.add(new Section().component(() => {
        const validationResults = {
            step1: validateStep1(page),
            step2: validateStep2(page),
            step3: validateStep3(page),
            step4: validateStep4(page)
        }
        
        const allValid = Object.values(validationResults).every(v => v)
        const records = page.s4.list.getRecords?.() || []
        const recordValidations = records.map(r => validateGodtgoerelseRow(r))
        const hasInvalidRecords = recordValidations.some(v => !v.valid)
        
        const canSubmit = allValid && !hasInvalidRecords
        
        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <AntButton
                    type={canSubmit ? 'primary' : 'default'}
                    size="large"
                    disabled={!canSubmit}
                    onClick={() => {
                        if (!canSubmit) {
                            main.tsxErrorMessage('Please fix validation errors before submitting')
                            return
                        }
                        
                        console.log('Submitting form...')
                        
                        // Collect all form data
                        const formData = {
                            personalInfo: {
                                name: page.s1.field_name._data || '',
                                email: page.s1.field_email._data || '',
                                phone: '', // Removed in Phase 4, keeping for API compatibility
                                address: page.s1.field_address._data || '',
                                city: page.s1.field_city._data || '',
                                zip: page.s1.field_zip._data || ''
                            },
                            journeyDetails: {
                                departureDate: page.s2.field_departureDate._data || '',
                                destination: page.s2.field_destination._data || '',
                                reason: page.s2.field_reason._data || '',
                                projectNumber: page.s2.field_projectNumber?._data || ''
                            },
                            bankDetails: {
                                iban: page.s5.field_iban._data || '',
                                swift: page.s5.field_swift._data || '',
                                accountHolder: page.s5.field_accountHolder._data || '',
                                bankName: page.s5.field_bankName._data || '',
                                currency: page.s5.field_currency._data || 'DKK'
                            },
                            projectDetails: {
                                projectNumber: page.s2.field_projectNumber?._data || '',
                                contractNumber: page.s2.field_contractNumber?._data || '',
                                approver: page.s2.field_approver?._data || '',
                                costCenter: page.s2.field_costCenter?._data || '',
                                purpose: page.s2.field_reason?._data || ''
                            },
                            expenses: records,
                            submittedAt: new Date().toISOString()
                        }
                        
                        console.log('Form data to submit:', formData)
                        
                        // Call real API (with mock implementation for now)
                        submitExpenseClaim(main, formData).then((response) => {
                            if (response.status === 'success') {
                                console.log('✅ Submission successful:', response.submissionId)
                                
                                // Store submission ID and message for success screen
                                page.formula.params()['submissionId'] = response.submissionId
                                page.formula.params()['submissionMessage'] = response.message
                                
                                // Clear draft on successful submission
                                clearDraft()
                                
                                // Show success screen
                                s6.condition.checkCondition('success')
                                main.tsxSuccessMessage(response.message)
                            } else {
                                console.error('❌ Submission failed:', response.message)
                                
                                // Store error message for fail screen
                                page.formula.params()['errorMessage'] = response.message
                                
                                // Show fail screen
                                s6.condition.checkCondition('fail')
                                main.tsxErrorMessage('Submission failed: ' + response.message)
                            }
                        }).catch((error) => {
                            console.error('❌ Submission error:', error)
                            
                            page.formula.params()['errorMessage'] = 'Unexpected error occurred'
                            s6.condition.checkCondition('fail')
                            main.tsxErrorMessage('An unexpected error occurred')
                        })
                    }}
                >
                    {canSubmit ? '✓ Submit for Approval' : '✗ Cannot Submit - Fix Errors'}
                </AntButton>
            </div>
        )
    }))
    
    // Build success section
    s6.sectionSuccess.add(new Title().label('✓ Submission Successful!').level(3))
    s6.sectionSuccess.add(new Space().bottom(24).border())
    
    s6.sectionSuccess.add(new Section().component(() => {
        const submissionId = page.formula.params()['submissionId'] || 'UNKNOWN'
        
        return (
            <Alert
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                message="Your Expense Claim Has Been Submitted"
                description={
                    <div>
                        <p><strong>Submission ID:</strong> {submissionId}</p>
                        <p>Your expense claim has been successfully submitted for approval. You will receive an email confirmation shortly.</p>
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Your approver will review your claim</li>
                            <li>You'll receive email notifications about the status</li>
                            <li>Once approved, payment will be processed to your bank account</li>
                        </ul>
                        <p style={{ marginTop: 16, marginBottom: 0 }}>
                            <strong>Questions?</strong> Contact: {page.s2.field_approver?._data || 'rejser@sdu.dk'}
                        </p>
                    </div>
                }
                style={{ marginBottom: 24 }}
            />
        )
    }))
    
    // Build fail section
    s6.sectionFail.add(new Title().label('✗ Submission Failed').level(3))
    s6.sectionFail.add(new Space().bottom(24).border())
    
    s6.sectionFail.add(new Section().component(() => {
        const errorMessage = page.formula.params()['errorMessage'] || 'Unknown error'
        
        return (
            <Alert
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                message="Submission Error"
                description={
                    <div>
                        <p><strong>Error:</strong> {errorMessage}</p>
                        <p>This could be due to:</p>
                        <ul>
                            <li>Network connectivity issues</li>
                            <li>Server temporarily unavailable</li>
                            <li>Session timeout</li>
                            <li>Invalid data format</li>
                        </ul>
                        <p style={{ marginTop: 16 }}><strong>Please try again in a few moments.</strong></p>
                        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
                            <p style={{ marginBottom: 4, fontSize: 14 }}>
                                <strong>Need Help?</strong>
                            </p>
                            <p style={{ marginBottom: 0, fontSize: 14 }}>
                                Contact your approver: <strong>{page.s2.field_approver?._data || 'rejser@sdu.dk'}</strong>
                            </p>
                        </div>
                    </div>
                }
                style={{ marginBottom: 24 }}
            />
        )
    }))
    
    s6.sectionFail.add(new Space().top(16))
    s6.sectionFail.add(new Section().row().center()
        .add(new Button()
            .middle()
            .primary()
            .action(new Action()
                .label('← Try Again')
                .callback(() => {
                    console.log('Returning to ready state')
                    s6.condition.checkCondition('ready')
                })
            )
        )
    )
    
    // Setup conditional rendering based on state
    s6.condition
        .add(new ConditionsItem()
            .condition((state: string) => state === 'ready')
            .content((next) => next(s6.sectionReady))
        )
        .add(new ConditionsItem()
            .condition((state: string) => state === 'success')
            .content((next) => next(s6.sectionSuccess))
        )
        .add(new ConditionsItem()
            .condition((state: string) => state === 'fail')
            .content((next) => next(s6.sectionFail))
        )
    
    // Add conditional sections to main section
    s6.section.add(s6.condition)
    
    s6.section.formula(page.formula)
    s6.section.init()
    
    return s6.section
}
