export function isValidDanishCPR(cpr: string): boolean {
    // Regular expression to match the CPR format
    const cprRegex = /^\d{6}-?\d{4}$/;

    // Check if the CPR matches the regular expression
    if (!cprRegex.test(cpr)) {
        return false;
    }

    // Remove any hyphen for easier processing
    const sanitizedCPR = cpr.replace('-', '');

    // Extract day, month, and year parts
    const day = parseInt(sanitizedCPR.substring(0, 2), 10);
    const month = parseInt(sanitizedCPR.substring(2, 4), 10);
    const year = parseInt(sanitizedCPR.substring(4, 6), 10);

    // Validate date components
    if (!isValidDate(day, month, year)) {
        return false;
    }

    // Validate individual digits if needed (additional checks can be added here)
    return true;
}

// Helper function to validate date components
export function isValidDate(day: number, month: number, year: number): boolean {
    // Adjust year based on Danish CPR rules (check if it's 19xx, 20xx, etc.)
    let fullYear = 1900 + year;
    if (year <= new Date().getFullYear() % 100) {
        fullYear += 100;
    }

    // Check if the date is valid
    const date = new Date(fullYear, month - 1, day);
    return (
        date.getFullYear() === fullYear &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}