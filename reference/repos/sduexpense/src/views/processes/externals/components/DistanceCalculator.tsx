import React, { useState } from 'react'
import { Input, Space, Typography, InputNumber } from 'antd'
import { GodtgoerelseRecord } from '../types'
import { calculateKmAmount } from '../utils/calculations'

const { Text } = Typography

/**
 * CHANGE 4: Simplified to Manual KM Entry Only (Phase 4)
 * - Removed Google Maps distance calculation
 * - Removed distanceOverride (now just distanceKM)
 * - Simple manual input with real-time calculation
 */
interface DistanceCalculatorProps {
    record: GodtgoerelseRecord
    onChange: (updates: Partial<GodtgoerelseRecord>) => void
    disabled?: boolean
}

export function DistanceCalculator({ record, onChange, disabled }: DistanceCalculatorProps) {

    const handleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ licensePlate: e.target.value })
    }

    const handleDistanceChange = (value: number | null) => {
        if (value !== null && value > 0) {
            onChange({
                distanceKM: value,
                calculatedAmount: calculateKmAmount(value),
                amount: calculateKmAmount(value)
            })
        } else {
            onChange({ 
                distanceKM: undefined,
                calculatedAmount: undefined
            })
        }
    }

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const from = e.target.value
        const to = record.toAddress || ''
        onChange({ 
            fromAddress: from,
            description: from && to ? `${from} - ${to}` : from || to
        })
    }

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const to = e.target.value
        const from = record.fromAddress || ''
        onChange({ 
            toAddress: to,
            description: from && to ? `${from} - ${to}` : from || to
        })
    }

    return (
        <div style={{ padding: '0 0 8px 0' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                {/* License Plate - Required for KM reimbursement */}
                <div>
                    <Text strong style={{ fontSize: 12 }}>Vehicle License Plate: *</Text>
                    <Input
                        placeholder="e.g., AB12345"
                        value={record.licensePlate || ''}
                        onChange={handleLicensePlateChange}
                        disabled={disabled}
                        style={{ marginTop: 4 }}
                        maxLength={10}
                    />
                </div>

                {/* From Address */}
                <div>
                    <Text strong style={{ fontSize: 12 }}>From:</Text>
                    <Input
                        placeholder="e.g., Home, SDU Campus, Hotel Name"
                        value={record.fromAddress || ''}
                        onChange={handleFromChange}
                        disabled={disabled}
                        style={{ marginTop: 4 }}
                    />
                </div>

                {/* To Address */}
                <div>
                    <Text strong style={{ fontSize: 12 }}>To:</Text>
                    <Input
                        placeholder="e.g., SDU Odense, Conference Center, Airport"
                        value={record.toAddress || ''}
                        onChange={handleToChange}
                        disabled={disabled}
                        style={{ marginTop: 4 }}
                    />
                </div>

                {/* Manual KM Entry */}
                <div>
                    <Text strong style={{ fontSize: 12 }}>Distance (km): *</Text>
                    <InputNumber
                        min={0}
                        max={10000}
                        value={record.distanceKM}
                        onChange={handleDistanceChange}
                        disabled={disabled}
                        style={{ width: '100%', marginTop: 4 }}
                        placeholder="Enter distance in kilometers"
                        precision={1}
                    />
                </div>

                {/* Calculated Amount Display */}
                {record.distanceKM && record.distanceKM > 0 && (
                    <div style={{ 
                        padding: 8, 
                        backgroundColor: '#f0f5ff', 
                        borderRadius: 4,
                        border: '1px solid #adc6ff'
                    }}>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            {record.distanceKM} km × 2.3 DKK/km = <strong>{calculateKmAmount(record.distanceKM).toFixed(2)} DKK</strong>
                        </Text>
                    </div>
                )}
            </Space>
        </div>
    )
}
