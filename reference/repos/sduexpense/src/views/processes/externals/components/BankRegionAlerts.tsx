import React from 'react'
import { Alert } from 'antd'
import { BankRegion, SANCTIONED_COUNTRIES } from '../constants/bankRegions'

/**
 * Warning for sanctioned countries - blocks payment form
 */
export function SanctionedCountryWarning({ country }: { country: string }) {
    if (!SANCTIONED_COUNTRIES.includes(country)) return null
    
    return (
        <Alert
            type="error"
            message="⚠️ Payment Restricted"
            description={
                <div>
                    <p style={{ marginBottom: 8 }}>
                        <strong>SDU cannot process payments to {country}</strong> due to international sanctions.
                    </p>
                    <p style={{ marginBottom: 8 }}>
                        This applies to purchases and payments related to Russia, Belarus, 
                        and non-government controlled areas in Ukraine.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        For more information, visit:{' '}
                        <a 
                            href="https://danskeci.com/ci/news-and-insights/stay-updated-on-the-situation-in-ukraine" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Danske Bank - Ukraine Situation
                        </a>
                    </p>
                </div>
            }
            showIcon
            style={{ marginBottom: 24 }}
        />
    )
}

/**
 * Special processing alerts for Myanmar and Jordan
 */
export function SpecialProcessingAlert({ region }: { region: BankRegion }) {
    if (region === BankRegion.MYANMAR) {
        return (
            <Alert
                type="warning"
                message="⚠️ Special Processing Required"
                description={
                    <div>
                        <p style={{ marginBottom: 8 }}>
                            <strong>Payments to Myanmar require manual processing.</strong>
                        </p>
                        <p style={{ marginBottom: 0 }}>
                            Your payment information will be automatically forwarded to{' '}
                            <a href="mailto:betaling@sdu.dk">betaling@sdu.dk</a> for manual review and processing.
                            This is necessary because the automated payment system requires additional text 
                            fields that are not supported by our standard workflow.
                        </p>
                    </div>
                }
                showIcon
                style={{ marginBottom: 24 }}
            />
        )
    }
    
    if (region === BankRegion.JORDAN) {
        return (
            <Alert
                type="info"
                message="ℹ️ Currency Restriction"
                description={
                    <div>
                        <p style={{ marginBottom: 0 }}>
                            <strong>Payments to Jordan must be made in USD or EUR</strong> (not DKK) 
                            due to ERP system limitations with the "formål" (purpose) field.
                        </p>
                        <p style={{ marginTop: 8, marginBottom: 0, fontSize: 12, color: '#666' }}>
                            Note: Please ensure the "Alternative Bank Name" field is completed.
                        </p>
                    </div>
                }
                showIcon
                style={{ marginBottom: 24 }}
            />
        )
    }
    
    return null
}

/**
 * Region indicator showing auto-detected payment region
 */
interface RegionIndicatorProps {
    country: string
    regionLabel: string
}

export function RegionIndicator({ country, regionLabel }: RegionIndicatorProps) {
    return (
        <Alert
            type="info"
            message={`Payment Region: ${regionLabel}`}
            description={
                <span>
                    Based on your selected country (<strong>{country}</strong>), 
                    the appropriate payment fields are shown below.
                </span>
            }
            showIcon
            style={{ marginBottom: 24 }}
        />
    )
}
