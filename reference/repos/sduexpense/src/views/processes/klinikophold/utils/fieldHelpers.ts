import { checkStep } from "./validators";

/**
 * Handle CPR number field changes
 * Shows validation feedback based on CPR validation
 */
export const fieldCprChange = (main: any, page: any): void => {
    const valid = checkStep(1, page);
    
    if (valid.field_cpr_nr) {
        page.s1.field_cpr_nr.tsxShowHelperText({ 
            status: 'success', 
            text: 'Cpr. nr. er gyldigt' 
        });
    } else if (page.s1.field_cpr_nr._data.length > 0) {
        page.s1.field_cpr_nr.tsxShowHelperText({ 
            status: 'error', 
            text: 'Cpr. nr. er ikke gyldigt' 
        });
    } else {
        page.s1.field_cpr_nr.tsxShowHelperText(false);
    }
};

/**
 * Handle name field changes
 * Validates that full name is provided (first and last name)
 */
export const fieldNameChange = (main: any, page: any): void => {
    const valid = checkStep(1, page);
    
    if (page.s1.field_name._data.split(' ').length === 1 || 
        page.s1.field_name._data.split(' ')?.[1] === '') {
        page.s1.field_name.tsxShowHelperText({ 
            status: 'error', 
            text: 'Det skal være dit fulde navn' 
        });
    } else {
        page.s1.field_name.tsxShowHelperText(false);
    }
};
