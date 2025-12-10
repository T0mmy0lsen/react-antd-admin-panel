import React from 'react'
import { Input, Space, Typography } from 'antd'
import { GodtgoerelseRecord, ExternalsPageStructure } from '../types'
import Main from '../../../../typescript/main'
import { DistanceCalculator } from './DistanceCalculator'

const { Text } = Typography
const { TextArea } = Input

interface ExpenseRowRendererProps {
    record: GodtgoerelseRecord
    page: ExternalsPageStructure
    main: Main
    onChange: (updates: Partial<GodtgoerelseRecord>) => void
    disabled?: boolean
}

export function ExpenseRowRenderer({ record, page, main, onChange, disabled }: ExpenseRowRendererProps) {
    
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ description: e.target.value })
    }

    // Render different fields based on expense type
    switch (record.type) {
        case 'MILEAGE':
            return (
                <DistanceCalculator
                    record={record}
                    onChange={onChange}
                    disabled={disabled}
                />
            )

        // All other types just use description field
        case 'FLIGHT':
        case 'TRAIN':
        case 'BUS':
        case 'TAXI':
        case 'FERRY':
        case 'BRIDGE_TOLL':
        case 'PARKING':
        case 'BIKE_SCOOTER':
        case 'HOTEL_DK':
        case 'HOTEL_ABROAD':
        case 'NON_HOTEL':
        case 'MEALS_TRAVEL':
        case 'CONF_DK':
        case 'CONF_ABROAD':
        case 'TRAINING_DK':
        case 'TRAINING_ABROAD':
        case 'VISA':
        case 'MEDICAL_CERT':
        case 'EU_TAXES':
        case 'MEMBERSHIPS':
        case 'LAYOUT_CONVERT':
        case 'GOODS_GENERAL':
            return (
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div>
                        <Text strong style={{ fontSize: 12 }}>Description: *</Text>
                        <TextArea
                            value={record.description || ''}
                            onChange={handleDescriptionChange}
                            disabled={disabled}
                            placeholder={getPlaceholderForType(record.type)}
                            style={{ marginTop: 4 }}
                            rows={2}
                        />
                    </div>
                </Space>
            )

        default:
            return (
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Select an expense type to see relevant fields
                </Text>
            )
    }
}

// Helper function to provide type-specific placeholders
function getPlaceholderForType(type: string): string {
    switch (type) {
        case 'FLIGHT':
            return 'e.g., SAS flight SK123 Copenhagen-Stockholm, Business trip to AI conference'
        case 'TRAIN':
            return 'e.g., DSB InterCity train Odense-Copenhagen, Regional train to meeting'
        case 'BUS':
            return 'e.g., FlixBus Copenhagen-Berlin, Local bus transportation'
        case 'TAXI':
            return 'e.g., Airport taxi to hotel, Late night taxi after conference dinner'
        case 'FERRY':
            return 'e.g., Scandlines ferry Rødby-Puttgarden, Island ferry transportation'
        case 'BRIDGE_TOLL':
            return 'e.g., Great Belt Bridge toll, Øresund Bridge toll'
        case 'PARKING':
            return 'e.g., Airport parking 3 days, Conference venue parking'
        case 'BIKE_SCOOTER':
            return 'e.g., City bike rental for 2 hours, Electric scooter for local transport'
        case 'HOTEL_DK':
            return 'e.g., Hotel Scandic Copenhagen 2 nights, Business hotel stay'
        case 'HOTEL_ABROAD':
            return 'e.g., Hotel Stockholm conference venue, Business accommodation'
        case 'NON_HOTEL':
            return 'e.g., Airbnb apartment Stockholm, Guest house accommodation'
        case 'MEALS_TRAVEL':
            return 'e.g., Meals during 3-day conference, Business lunch with partners'
        case 'CONF_DK':
            return 'e.g., AI Research Conference Copenhagen registration fee'
        case 'CONF_ABROAD':
            return 'e.g., International Machine Learning Conference Stockholm'
        case 'TRAINING_DK':
            return 'e.g., Professional development course at SDU, Leadership training'
        case 'TRAINING_ABROAD':
            return 'e.g., Advanced research methods course Stockholm University'
        case 'VISA':
            return 'e.g., Business visa for USA conference, Research visa application'
        case 'MEDICAL_CERT':
            return 'e.g., Vaccination certificate for travel, Medical clearance for fieldwork'
        case 'EU_TAXES':
            return 'e.g., VAT payment for EU services, Cross-border tax obligation'
        case 'MEMBERSHIPS':
            return 'e.g., Professional association membership, Research consortium fee'
        case 'LAYOUT_CONVERT':
            return 'e.g., Expense paid personally to be converted later'
        case 'GOODS_GENERAL':
            return 'e.g., Research equipment purchase, Office supplies for project'
        default:
            return 'Please describe this expense in detail'
    }
}
