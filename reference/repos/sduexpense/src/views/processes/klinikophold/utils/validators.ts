import { isValidDanishCPR } from "../../../../helpers";

/**
 * Check if all expense records have valid required fields
 */
const checkUdgifterIfValid = (records: any): boolean => {
    let valid = true;
    console.log("Checking step calling checkUdgifterIfValid", records);
    
    records.forEach((record: any) => {
        if (!record.date || record.date == "") {
            valid = false;
        }
        if (!record.amount || record.amount <= 0) {
            valid = false;
        }
        if (!record.category || record.category == "") {
            valid = false;
        }
        if (!record.upload || record.upload.length == 0) {
            valid = false;
        }
        
        // Warning for train/bus/mileage amounts over 140 DKK
        const isTransportCategory = record.category === '26' || record.category === '4' || record.category === '11';
        if (isTransportCategory && record.amount > 140) {
            console.warn(`⚠️ Category ${record.category} exceeds 140 kr limit (${record.amount} kr)`);
        }
        
        // Warning for accommodation amounts over 400 DKK
        const isAccommodationCategory = record.category === '18' || record.category === '9';
        if (isAccommodationCategory && record.amount > 400) {
            console.warn(`⚠️ Category ${record.category} exceeds 400 kr limit (${record.amount} kr)`);
        }
    });
    
    return valid;
};

/**
 * Validate a specific step and mark it as done/undone
 * @param step - Step number to validate
 * @param page - Page structure object
 * @param index - Data index to check ('_data' or '_default')
 * @returns Object with validation results for each field
 */
export const checkStep = (step: any, page: any, index: string = '_data'): any => {
    let valid: any = {};

    console.log('Checking step', step, page);

    switch (step) {
        case 1:
            // Step 1: Personal Information validation
            valid = {
                field_cpr_nr: !!page.s1.field_cpr_nr[index] && 
                             page.s1.field_cpr_nr[index] != '' && 
                             (isValidDanishCPR(page.s1.field_cpr_nr[index]) ?? false),
                field_name: !!page.s1.field_name[index] && page.s1.field_name[index] != '',
                field_address: !!page.s1.field_address[index] && page.s1.field_address[index] != '',
                field_city: !!page.s1.field_city[index] && page.s1.field_city[index] != '',
                field_zip: !!page.s1.field_zip[index] && page.s1.field_zip[index] != '',
            };
            break;
            
        case 2:
            // Step 2: Trip Details validation
            valid = {
                field_bystednavn: !!page.s2.field_bystednavn[index] && page.s2.field_bystednavn[index] != '',
                field_fra: !!page.s2.field_fra[index] && 
                          page.s2.field_fra[index] != "Invalid Date" && 
                          page.s2.field_fra[index] != '',
                field_til: !!page.s2.field_til[index] && 
                          page.s2.field_til[index] != "Invalid Date" && 
                          page.s2.field_til[index] != '',
            };
            break;
            
        case 3:
            // Step 3: Guide Instructions validation (checkbox must be checked)
            valid = {
                checkbox: page.s3.field_checkbox._default[0] == 1,
            };
            break;
            
        case 4:
            // Step 4: Expenses validation
            const records = page.s4.list.getRecords();
            console.log("Stepcheckers", records);
            valid = {
                udgifter: (
                    page.s4.list.getRecords().length > 0 && 
                    checkUdgifterIfValid(page.s4.list.getRecords())
                )
            };
            break;
    }

    // Mark the step as done if all validations pass
    page.steps.done(step, Object.values(valid).every((v: any) => v));
    
    return valid;
};
