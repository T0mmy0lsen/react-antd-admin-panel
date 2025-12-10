import { Section, Title, Space, Typography } from '../../../../typescript'
import { ExternalsPageStructure } from '../types'
import Main from '../../../../typescript/main'
import { validateStep1 } from '../utils/validators'
import { DEBUG_PREFILL_ENABLED, DEBUG_TEST_DATA } from '../config'

export function Step1PersonalInfo(page: ExternalsPageStructure, main: Main): Section {
    const { s1 } = page
    
    // 🐛 DEBUG: Prefill test data if enabled (CHANGE 1: updated for country)
    if (DEBUG_PREFILL_ENABLED) {
        console.log('🐛 DEBUG MODE: Prefilling Step 1 with test data')
        s1.field_name.default(DEBUG_TEST_DATA.step1.name)
        s1.field_country.default(DEBUG_TEST_DATA.step1.country)
        s1.field_address.default(DEBUG_TEST_DATA.step1.address)
        s1.field_city.default(DEBUG_TEST_DATA.step1.city)
        s1.field_zip.default(DEBUG_TEST_DATA.step1.zip)
    }
    
    // Configure field handlers (CHANGE 1: removed phone, added country)
    s1.field_name.onChange(() => validateStep1(page))
    s1.field_email.onChange(() => validateStep1(page))
    s1.field_country.onChange(() => validateStep1(page))
    s1.field_address.onChange(() => validateStep1(page))
    s1.field_city.onChange(() => validateStep1(page))
    s1.field_zip.onChange(() => validateStep1(page))
    
    // Build section
    s1.section.add(new Title().label('Personal Information').level(3))
    s1.section.add(new Space().bottom(24).border())
    
    s1.section.add(new Typography()
        .style({ marginLeft: 12, marginBottom: 12 })
        .strong()
        .label('Please provide your contact details for payment and correspondence.')
    )
    
    s1.section.add(s1.field_name.label('Full Name').required(true))
    s1.section.add(s1.field_email.label('Email Address').required(true))
    s1.section.add(s1.field_country.label('Country').required(true))
    s1.section.add(s1.field_address.label('Street Address').required(true))
    s1.section.add(s1.field_city.label('City').required(true))
    s1.section.add(s1.field_zip.label('Postal/ZIP Code').required(true))
    
    // Hidden fields for system use
    s1.section.add(s1.field_id.key('id'))
    s1.section.add(s1.field_inviteToken.key('inviteToken'))
    
    s1.section.formula(page.formula)
    s1.section.init()
    
    // Run initial validation (e.g., if email is pre-filled from URL)
    setTimeout(() => validateStep1(page), 100)
    
    return s1.section
}
