// Formatters for data transformation

export function formatBankDetailsForApi(iban: string, swift: string, accountHolder: string, bankName: string, currency: string) {
    return {
        iban: iban.replace(/\s/g, ''),
        swift: swift?.toUpperCase(),
        accountHolder,
        bankName,
        currency
    }
}

export function formatIBAN(iban: string): string {
    // Remove spaces and add them back in groups of 4
    const cleaned = iban.replace(/\s/g, '')
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
}
