// Distance calculation API (Google Maps integration)

import { DistanceCalculationRequest, DistanceCalculationResponse } from '../types'

export async function calculateDistance(
    from: string,
    to: string
): Promise<DistanceCalculationResponse> {
    // TODO: Implement Google Maps Distance Matrix API
    // For now, return mock data with realistic distances for Danish cities
    
    console.log('calculateDistance called with:', { from, to })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock implementation with realistic Danish city distances
    const mockDistance = generateMockDistance(from, to)
    
    return {
        distance_km: mockDistance,
        duration_minutes: Math.round(mockDistance * 0.8), // Rough estimate: 75 km/h average
        from_formatted: from,
        to_formatted: to
    }
    
    /* Production implementation:
    const response = await fetch('/api/v1/Utils/calculate-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to })
    })
    
    if (!response.ok) {
        throw new Error('Failed to calculate distance')
    }
    
    return await response.json()
    */
}

function generateMockDistance(from: string, to: string): number {
    // Generate deterministic but varied distances based on city names
    // This gives consistent results for the same route
    
    const hashString = (str: string) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i)
            hash = hash & hash // Convert to 32bit integer
        }
        return Math.abs(hash)
    }
    
    const routeKey = from.toLowerCase() + to.toLowerCase()
    const seed = hashString(routeKey)
    
    // Generate distance between 20-150 km (typical for Danish travel)
    const distance = 20 + (seed % 130)
    
    // Round to 1 decimal place
    return Math.round(distance * 10) / 10
}

export function geocodeAddress(
    address: string,
    onSuccess: (suggestions: string[]) => void,
    onError: (error: string) => void
): void {
    // TODO: Replace with Google Places Autocomplete API
    
    console.log('geocodeAddress called with:', address)
    
    // Mock Danish city suggestions
    const danishCities = [
        'Odense', 'København', 'Aarhus', 'Aalborg', 'Esbjerg',
        'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde',
        'Herning', 'Silkeborg', 'Næstved', 'Fredericia', 'Viborg'
    ]
    
    const mockSuggestions = danishCities
        .filter(city => city.toLowerCase().includes(address.toLowerCase()))
        .slice(0, 5)
        .map(city => `${city}, Denmark`)
    
    // Add the input as-is if no matches
    if (mockSuggestions.length === 0 && address.length > 2) {
        mockSuggestions.push(`${address}, Denmark`)
    }
    
    setTimeout(() => onSuccess(mockSuggestions), 200)
}
