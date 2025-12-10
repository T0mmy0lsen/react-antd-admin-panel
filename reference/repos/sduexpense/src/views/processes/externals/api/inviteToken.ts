import { Get } from '../../../../typescript'
import Main from '../../../../typescript/main'
import { ExternalsPageStructure } from '../types'

export function validateInviteToken(main: Main, page: ExternalsPageStructure): void {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('inviteToken')
    const email = url.searchParams.get('email')
    
    // For MVP, we'll use URL parameters directly
    // TODO: In production, validate token against backend API
    
    if (!token || !email) {
        main.tsxErrorMessage('No invite token or email provided. Please use the invite link provided by SDU.')
        page.condition.checkCondition(false)
        return
    }
    
    // Fields are already pre-filled via default() in config.ts
    // Just enable the form
    page.condition.checkCondition(true)
    
    // TODO: For production, implement real token validation:
    /*
    new Get()
        .target(`InviteToken/${token}/validate`)
        .header({ 'Authorization': 'Bearer ' + main.$account.accessToken })
        .onThen((response: any) => {
            if (response.data.isValid) {
                // Pre-fill fields
                page.s1.field_email.tsxSetValue(response.data.email)
                page.s1.field_inviteToken.tsxSetValue(token)
                page.s3.field_projectNumber.tsxSetValue(response.data.projectNumber)
                page.s3.field_contractNumber.tsxSetValue(response.data.contractNumber)
                page.s3.field_approver.tsxSetValue(response.data.approver)
                page.s3.field_costCenter.tsxSetValue(response.data.costCenter)
                
                page.condition.checkCondition(true)
            } else {
                main.tsxErrorMessage('Invite token is expired or invalid')
                page.condition.checkCondition(false)
            }
        })
        .onCatch(() => {
            main.tsxErrorMessage('Failed to validate invite token')
            page.condition.checkCondition(false)
        })
        .get()
    */
}
