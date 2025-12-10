import React, { useState, useEffect } from 'react'
import { Section, Title, Space, Typography, CheckboxItem } from '../../../../typescript'
import { ExternalsPageStructure } from '../types'
import Main from '../../../../typescript/main'
import { validateStep2 } from '../utils/validators'
import { DEBUG_PREFILL_ENABLED, DEBUG_TEST_DATA } from '../config'
import { Alert } from 'antd'
import { UploadToList } from '../../../components/UploadComponent'

// Denmark detection function
function checkDenmarkTravel(page: ExternalsPageStructure) {
    const { s2 } = page
    const destination = s2.field_destination._data || s2.field_destination._default || ''
    
    console.log('🔍 Denmark detection - destination:', destination, 'type:', typeof destination)
    
    // Ensure destination is a string before calling string methods
    if (typeof destination !== 'string') {
        console.log('🔍 Denmark detection - destination is not a string, skipping')
        return
    }
    
    // Auto-detect Denmark variations
    const denmarkVariations = ['denmark', 'danmark', 'dänemark', 'dk ', ' dk', 'danish']
    const lowerDest = destination.toLowerCase()
    const isDenmark = denmarkVariations.some(variant => lowerDest.includes(variant))
    
    console.log('🔍 Denmark detection - isDenmark:', isDenmark)
    console.log('🔍 Denmark detection - current checkbox value:', s2.field_nonDkTravel._data)
    
    // Auto-update checkbox - uncheck for Denmark travel
    if (isDenmark) {
        // For Denmark travel, uncheck international travel box
        console.log('🔍 Denmark detected - unchecking international travel checkbox')
        
        // Use empty array to uncheck (checkbox uses [1] when checked, [] when unchecked)
        s2.field_nonDkTravel._data = []
        s2.field_nonDkTravel.default([])
        
        console.log('🔍 After update - checkbox value:', s2.field_nonDkTravel._data)
    }
    // Note: Don't auto-check for non-Denmark destinations - let user decide
}

/**
 * CHANGE 3: Journey Details (renamed from Project Details)
 * New fields: departureDate, returnDate, reason, destination, programDocument
 */
export function Step2JourneyDetails(page: ExternalsPageStructure, main: Main): Section {
    const { s2 } = page
    
    // Store reference to the upload visibility callback
    let updateUploadVisibility: ((checked: boolean) => void) | null = null
    
    // 🐛 DEBUG: Prefill test data if enabled
    if (DEBUG_PREFILL_ENABLED) {
        console.log('🐛 DEBUG MODE: Prefilling Step 2 (Journey Details) with test data')
        s2.field_departureDate.default(DEBUG_TEST_DATA.step2.departureDate)
        s2.field_returnDate.default(DEBUG_TEST_DATA.step2.returnDate)
        s2.field_reason.default(DEBUG_TEST_DATA.step2.reason)
        s2.field_destination.default(DEBUG_TEST_DATA.step2.destination)
        // Temporarily skip checkbox prefill to avoid value.includes error
        // s2.field_nonDkTravel.default(DEBUG_TEST_DATA.step2.nonDkTravel)
        
        // Also set _data to ensure it's available immediately
        setTimeout(() => {
            s2.field_departureDate._data = DEBUG_TEST_DATA.step2.departureDate
            s2.field_returnDate._data = DEBUG_TEST_DATA.step2.returnDate
            s2.field_reason._data = DEBUG_TEST_DATA.step2.reason
            s2.field_destination._data = DEBUG_TEST_DATA.step2.destination
            // Temporarily skip checkbox data setting
            // s2.field_nonDkTravel._data = DEBUG_TEST_DATA.step2.nonDkTravel
            validateStep2(page, true) // Now validate with step status update
        }, 100)
    }
    
    // Configure field handlers
    s2.field_departureDate.onChange(() => validateStep2(page))
    s2.field_returnDate.onChange(() => validateStep2(page))
    s2.field_reason.onChange(() => validateStep2(page))
    s2.field_destination.onChange(() => {
        try {
            console.log('🔍 Destination changed! New value:', s2.field_destination._data)
            validateStep2(page)
            checkDenmarkTravel(page) // Auto-detect Denmark travel
        } catch (error) {
            console.error('Error in destination onChange:', error)
        }
    })
    
    // Build section
    s2.section.add(new Title().label('Journey Details').level(3))
    s2.section.add(new Space().bottom(24).border())
    
    s2.section.add(new Typography()
        .style({ marginLeft: 12, marginBottom: 12 })
        .strong()
        .label('Please provide details about your travel.')
    )
    
    s2.section.add(s2.field_departureDate.label('Departure Date').required(true))
    s2.section.add(s2.field_returnDate.label('Return Date').required(true))
    s2.section.add(s2.field_destination.label('Where did you travel to?').required(true))
    s2.section.add(new Typography()
        .style({ marginLeft: 12, marginBottom: 12, fontSize: '12px', color: '#666' })
        .label('Please specify both country and city/location (e.g., "Sweden, Stockholm")')
    )
    s2.section.add(s2.field_reason.label('Reason for Travel').required(true))
    s2.section.add(s2.field_nonDkTravel.add(new CheckboxItem().value(1).label('Travel outside Denmark (check if international)')))
    
    // Add conditional upload component that shows based on checkbox
    s2.section.add(new Section().component(() => <ConditionalUploadComponent page={page} />))
    
    // Hidden fields (keep for backend compatibility)
    if (s2.field_projectNumber) s2.section.add(s2.field_projectNumber.key('projektNummer'))
    if (s2.field_contractNumber) s2.section.add(s2.field_contractNumber.key('kontraktNummer'))
    if (s2.field_approver) s2.section.add(s2.field_approver.key('godkender'))
    if (s2.field_costCenter) s2.section.add(s2.field_costCenter.key('omkostningssted'))
    
    s2.section.formula(page.formula)
    s2.section.init()
    
    // Run initial validation without updating step status (just log for debugging)
    setTimeout(() => {
        validateStep2(page, false) // Don't mark step as done on initial load
        console.log('Step 2 initial validation completed (status not updated)')
    }, 200)
    
    return s2.section
}

// Component for conditional program document upload
interface ConditionalUploadComponentProps {
    page: ExternalsPageStructure
}

const ConditionalUploadComponent: React.FC<ConditionalUploadComponentProps> = ({ page }) => {
    const { s2 } = page
    const [showUpload, setShowUpload] = useState(false)
    
    useEffect(() => {
        // Register callback function for checkbox onChange
        ;(window as any).updateNonDkUploadVisibility = (isChecked: boolean) => {
            console.log('🔍 Upload visibility callback triggered:', isChecked)
            setShowUpload(isChecked)
        }
        
        // Initial check - get current state
        const currentValue = s2.field_nonDkTravel._data
        const initialChecked = Array.isArray(currentValue) && currentValue.length > 0
        setShowUpload(initialChecked)
        console.log('🔍 Initial checkbox state:', initialChecked)
        
        // Cleanup - remove callback when component unmounts
        return () => {
            delete (window as any).updateNonDkUploadVisibility
        }
    }, [s2])
    
    if (!showUpload) {
        return null
    }

    // Create a mock record for the upload component
    const programDocumentRecord = {
        id: 'program-document',
        upload: Array.isArray(s2.field_programDocument?._fileList) ? s2.field_programDocument._fileList : []
    }
    
    return (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
            <Alert
                message="International Travel - Program Documentation Required"
                description="Please upload your conference program, invitation letter, or other travel documentation"
                type="info"
                showIcon
                style={{ marginBottom: 12 }}
            />
            <div style={{ marginLeft: 12 }}>
                <label style={{ 
                    fontWeight: 'bold', 
                    marginBottom: 8, 
                    display: 'block',
                    fontSize: '14px'
                }}>
                    Program Document *
                </label>
                <div style={{ marginTop: 8 }}>
                    <UploadToList
                        disabled={false}
                        main={page.main}
                        page={page}
                        record={programDocumentRecord}
                        uploadEndpoint="Externals/programdocument" // Different endpoint from expenses
                        acceptedFileTypes=".pdf,.doc,.docx"
                        maxFileSizeMB={10}
                        onChange={(files: any[]) => {
                            try {
                                console.log('Program document files changed:', files)
                                if (s2.field_programDocument && Array.isArray(files)) {
                                    s2.field_programDocument.fileList(files)
                                    s2.field_programDocument._fileList = files
                                }
                                validateStep2(page)
                            } catch (error) {
                                console.error('Error handling program document files:', error)
                            }
                        }}
                    />
                </div>
                <div style={{ 
                    fontSize: '11px', 
                    color: '#666', 
                    marginTop: 4 
                }}>
                    Supported formats: PDF, DOC, DOCX • Maximum size: 10MB
                </div>
            </div>
        </div>
    )
}

