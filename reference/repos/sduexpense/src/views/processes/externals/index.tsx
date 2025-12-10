import React from 'react'
import Main from '../../../typescript/main'
import { Section, Steps, StepsItem, Conditions, ConditionsItem, Title, Typography, Space } from '../../../typescript'
import { createPageStructure, DEBUG_PREFILL_ENABLED } from './config'
// CHANGE 2: Updated imports for renamed/reordered steps
import { Step1PersonalInfo } from './steps/Step1PersonalInfo'
import { Step2JourneyDetails } from './steps/Step2JourneyDetails'      // RENAMED from Step3ProjectDetails
import { Step3PDFAcceptance } from './steps/Step3PDFAcceptance'        // NEW
import { Step4Expenses } from './steps/Step4Expenses'                  // RENAMED from Step4Godtgoerelse
import { Step5BankDetails } from './steps/Step5BankDetails'            // MOVED from Step2
import { Step6ReviewSubmit } from './steps/Step6ReviewSubmit'          // RENUMBERED from Step5
import { validateInviteToken } from './api/inviteToken'
import { initializeAutoSave } from './api/autoSave'
import { Alert } from 'antd'

export default function ExternalsProcess(main: Main): Section {
    
    // 1. Create page structure
    const page = createPageStructure(main)
    
    // 2. Validate invite token (sync for now)
    validateInviteToken(main, page)
    
    // 3. Initialize auto-save orchestrator
    initializeAutoSave(main, page)
    
    // 4. Build ALL steps ONCE (prevents section duplication on navigation)
    // CHANGE 2: Updated to new 6-step structure
    const step1Section = Step1PersonalInfo(page, main)
    const step2Section = Step2JourneyDetails(page, main)        // RENAMED from Step3ProjectDetails
    const step3Section = Step3PDFAcceptance(page, main)         // NEW
    const step4Section = Step4Expenses(page, main)              // RENAMED from Step4Godtgoerelse
    const step5Section = Step5BankDetails(page, main)           // MOVED from Step2
    const step6Section = Step6ReviewSubmit(page, main)          // RENUMBERED from Step5
    
    // 5. Register steps with pre-built sections (reference, not function call)
    // CHANGE 2: Now 6 steps instead of 5
    page.steps
        .add(new StepsItem()
            .done(false)
            .title('Personal Information')
            .content((next) => next(step1Section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Journey Details')                           // CHANGE 3: Renamed
            .content((next) => next(step2Section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Terms & Conditions')                        // CHANGE 8: NEW
            .content((next) => next(step3Section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Expenses')
            .content((next) => next(step4Section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Bank Details')                              // CHANGE 2: Moved
            .content((next) => next(step5Section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Review & Submit')
            .content((next) => next(step6Section))
        )
    
    // 4. Wrap in container
    page.section
        .style({ padding: '54px 54px 54px 54px' })
    
    // 🐛 DEBUG: Show debug banner if prefill is enabled
    if (DEBUG_PREFILL_ENABLED) {
        page.section.add(new Section().component(() => (
            <Alert
                type="warning"
                message="🐛 DEBUG MODE ACTIVE"
                description={
                    <div>
                        <strong>Test data has been prefilled in Steps 1-3 for easier testing.</strong>
                        <br />
                        To disable: Set <code>DEBUG_PREFILL_ENABLED = false</code> in <code>src/views/processes/externals/config.ts</code>
                    </div>
                }
                showIcon
                closable
                style={{ marginBottom: 24 }}
            />
        )))
    }
    
    page.section
        .add(page.steps)
        .init()
    
    // 5. Create error section for invalid token
    const errorSection = new Section()
        .style({ padding: '54px 54px 54px 54px' })
        .add(new Title().label('Invalid Invite Link').level(3))
        .add(new Space().bottom(24).border())
        .add(new Typography()
            .style({ marginLeft: 12, marginTop: 12, color: 'red' })
            .strong()
            .label('This invite link is no longer valid or missing required parameters.')
        )
        .add(new Typography()
            .style({ marginLeft: 12, marginTop: 12 })
            .label('Please contact your SDU administrator for a new invite link.')
        )
        .add(new Typography()
            .style({ marginLeft: 12, marginTop: 12 })
            .label(`For assistance, please contact your approver: ${page.s2.field_approver?._data || 'rejser@sdu.dk'}`)
        )
    
    // 6. Conditional rendering (show error if token invalid, otherwise show form)
    page.condition
        .add(new ConditionsItem()
            .condition((valid: boolean) => valid === true)
            .content((next) => next(page.section))
        )
        .add(new ConditionsItem()
            .condition((valid: boolean) => valid === false)
            .content((next) => next(errorSection))
        )
    
    // 7. Initialize data (async)
    // Commented out for now - will be implemented when backend is ready
    // initializeProcess(main, page)
    
    return new Section().add(page.condition)
}
