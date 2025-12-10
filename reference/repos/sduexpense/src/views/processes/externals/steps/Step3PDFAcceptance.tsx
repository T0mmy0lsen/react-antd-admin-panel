import React, { useState, useEffect } from 'react'
import { Section, Title, Space, Typography } from '../../../../typescript'
import { ExternalsPageStructure } from '../types'
import Main from '../../../../typescript/main'
import { validateStep3 } from '../utils/validators'
import { Alert, Checkbox } from 'antd'

/**
 * CHANGE 8: NEW Step - PDF Terms & Conditions Acceptance
 * Displays travel expense policy and requires user acceptance
 */
export function Step3PDFAcceptance(page: ExternalsPageStructure, main: Main): Section {
    const { s3 } = page
    
    // Build section
    s3.section.add(new Title().label('Terms & Conditions').level(3))
    s3.section.add(new Space().bottom(24).border())
    
    // Add React component for PDF viewer and acceptance checkbox
    s3.section.add(new Section().component(() => <PDFAcceptanceComponent page={page} />))
    
    s3.section.formula(page.formula)
    s3.section.init()
    
    // Run initial validation without updating step status
    setTimeout(() => {
        validateStep3(page, false) // Don't mark step as done on initial load
        console.log('Step 3 initial validation completed (status not updated)')
    }, 200)
    
    return s3.section
}

interface PDFAcceptanceComponentProps {
    page: ExternalsPageStructure
}

const PDFAcceptanceComponent: React.FC<PDFAcceptanceComponentProps> = ({ page }) => {
    const { s3 } = page
    
    // Initialize state from page data if available
    const initialAccepted = s3.field_accepted._data === true || s3.field_accepted._data === 'true'
    const [accepted, setAccepted] = useState(initialAccepted)
    const [hasScrolled, setHasScrolled] = useState(initialAccepted) // If already accepted, assume scrolled
    
    // Check initial state on mount
    useEffect(() => {
        const currentAccepted = s3.field_accepted._data === true || s3.field_accepted._data === 'true'
        if (currentAccepted) {
            setAccepted(true)
            setHasScrolled(true)
            // If already accepted (loaded from storage), update step status
            validateStep3(page, true)
        } else {
            // Just check validation without updating step status
            validateStep3(page, false)
        }
    }, [])
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50
        
        if (isAtBottom && !hasScrolled) {
            setHasScrolled(true)
        }
    }
    
    const handleAccept = (checked: boolean) => {
        setAccepted(checked)
        
        // Update page data - try multiple ways to ensure it sticks
        s3.field_accepted.tsxSetValue(checked)
        s3.field_accepted._data = checked
        s3.field_timestamp.tsxSetValue(new Date().toISOString())
        s3.field_timestamp._data = new Date().toISOString()
        
        console.log('PDF Acceptance changed:', {
            checked,
            fieldData: s3.field_accepted._data,
            timestamp: s3.field_timestamp._data
        })
        
        // Run validation with step status update (user action)
        validateStep3(page, true)
        
        // Trigger auto-save
        const processId = page.s1.field_id._data || page.s1.field_id._default
        if (processId) {
            page.formula.submit(processId)
        }
    }
    
    return (
        <div style={{ marginTop: 16 }}>
            <Alert
                message="Please Read Carefully"
                description="You must read through the travel expense policy and accept the terms before continuing."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />
            
            {/* PDF Content Container */}
            <div
                style={{
                    maxHeight: '60vh',
                    overflow: 'auto',
                    border: '1px solid #d9d9d9',
                    padding: 24,
                    marginBottom: 16,
                    backgroundColor: '#fafafa'
                }}
                onScroll={handleScroll}
            >
                <h3 style={{ marginTop: 0 }}>SDU Travel Expense Policy</h3>
                
                <h4>1. General Provisions</h4>
                <p>
                    This policy applies to all external collaborators and guests submitting travel expense claims
                    to Syddansk Universitet (SDU). By submitting this claim, you confirm that all expenses are
                    accurate, necessary, and comply with SDU's reimbursement guidelines.
                </p>
                
                <h4>2. Eligible Expenses</h4>
                <ul>
                    <li><strong>Transportation:</strong> Train, bus, plane tickets at economy class rates</li>
                    <li><strong>Mileage:</strong> Personal vehicle use at DKK 2.3 per kilometer</li>
                    <li><strong>Accommodation:</strong> Hotel expenses up to DKK 1,000 per night (receipt required)</li>
                    <li><strong>Meals:</strong> Standard meal allowance rates apply</li>
                    <li><strong>Other:</strong> Conference fees, parking, and other approved expenses</li>
                </ul>
                
                <h4>3. Documentation Requirements</h4>
                <p>
                    All expenses must be supported by original receipts or invoices. For international travel,
                    a conference program or travel justification document must be provided. Expenses should be
                    reported in the currency paid - no conversion required.
                </p>
                
                <h4>4. Currency and Exchange Rates</h4>
                <p>
                    Report all expenses in the currency actually paid. SDU's finance department will handle
                    currency conversion during the approval and payment process using official exchange rates
                    on the date of expense.
                </p>
                
                <h4>5. Approval Process</h4>
                <p>
                    Your expense claim will be reviewed by the designated approver. Additional documentation
                    may be requested. Payment will be processed within 14-21 business days after approval.
                </p>
                
                <h4>6. Data Privacy</h4>
                <p>
                    Your personal information and bank details will be processed securely and used solely for
                    the purpose of reimbursement. SDU complies with GDPR and Danish data protection regulations.
                </p>
                
                <h4>7. Accuracy and Compliance</h4>
                <p>
                    You are responsible for the accuracy of all information provided. False or fraudulent claims
                    may result in rejection and potential legal action. SDU reserves the right to audit expense
                    claims and request additional documentation.
                </p>
                
                <p style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #ddd' }}>
                    <strong>Last Updated:</strong> October 2025<br />
                    <strong>Policy Version:</strong> 4.0<br />
                    <strong>Contact:</strong> finance@sdu.dk
                </p>
            </div>
            
            {!hasScrolled && (
                <Alert
                    message="Please scroll to the bottom to enable acceptance"
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            
            <div style={{ marginTop: 16 }}>
                <Checkbox
                    checked={accepted}
                    onChange={(e) => handleAccept(e.target.checked)}
                    disabled={!hasScrolled}
                    style={{ fontSize: 16 }}
                >
                    <strong>I have read and accept the travel expense terms and conditions</strong>
                </Checkbox>
            </div>
            
            {accepted && (
                <Alert
                    message="Terms Accepted"
                    description={`You accepted the terms on ${new Date().toLocaleString('da-DK')}`}
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                />
            )}
        </div>
    )
}
