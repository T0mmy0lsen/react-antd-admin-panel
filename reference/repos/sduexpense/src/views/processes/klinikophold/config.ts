import {
    Button,
    Checkbox,
    Conditions,
    ConditionsItem,
    DatePicker,
    Get,
    Input,
    List,
    Section,
    Select,
    SelectItem,
    Steps
} from "../../../typescript";
import { KlinikopholdPageStructure } from "./types";
import { onStepClicker } from "./utils/stepHandlers";
import { formatKontostreng, formatRecordToUdgiftspost } from "./utils/formatters";
import { fieldCprChange, fieldNameChange } from "./utils/fieldHelpers";
import { createFormula, createSubmitFormula } from "./api/klinikopholdApi";
import { checkStep } from "./utils/validators";

/**
 * Debug flag for prefilling test data
 */
export const DEBUG_PREFILL_ENABLED = false;

/**
 * Creates the page structure with all fields, steps, and sections
 * This is the central configuration for the Klinikophold process
 */
export const createPageStructure = (main: any): KlinikopholdPageStructure => {
    const page: KlinikopholdPageStructure = {
        formula: createFormula(main),
        main: main,
        steps: new Steps()
            .default(0)
            .onClick((index: any) => onStepClicker(page, main)),
        section: new Section(),
        condition: new Conditions().default(true),
        
        // Step 1: Personal Information
        s1: {
            section: new Section(),
            field_cpr_nr: new Input().onChange((e: any) => fieldCprChange(main, page)),
            field_name: new Input().onChange((e: any) => fieldNameChange(main, page)),
            field_address: new Input().onChange(() => checkStep(1, page)),
            field_city: new Input().onChange(() => checkStep(1, page)),
            field_zip: new Input().onChange(() => checkStep(1, page)),
            field_email: new Input(),
            field_id: new Input().key('id').disabled().hidden(),
            field_udgiftsposter: new Input().disabled().hidden().format(() => formatRecordToUdgiftspost(page)),
            field_kontostreng: new Input().disabled().hidden().format(() => formatKontostreng(page)),
            field_underkonto: new Input().disabled().hidden(),
            field_analysenummer: new Input().disabled().hidden(),
            field_omkostningsted: new Input().disabled().hidden(),
            field_projektnummer: new Input().disabled().hidden(),
            field_omkostningsted2: new Input().disabled().hidden(),
            field_formaal: new Input().disabled().hidden(),
            field_godkender: new Input().disabled().hidden(),
            field_branch: new Input().disabled().hidden(),
            field_department: new Input().disabled().hidden(),
        },
        
        // Step 2: Trip Details
        s2: {
            section: new Section(),
            field_beskrivelse: new Select()
                .key('beskrivelse')
                .addMore([
                    new SelectItem("Klinikophold - Medicin - BA"),
                    new SelectItem("Klinikophold - Medicin - KA"),
                    new SelectItem("Klinikophold - Bio.Mek. - BA"),
                    new SelectItem("Klinikophold - Bio.Mek. - KA"),
                    new SelectItem("Klinikophold - Farmaci - KA"),
                    new SelectItem("Klinikophold - Audiologi - BA"),
                    new SelectItem("Klinikophold - Audiologi - KA"),
                ])
                .default("Klinikophold - Medicin - BA"),
            field_bystednavn: new Input()
                .label('By(er)')
                .onChange(() => checkStep(2, page)),
            field_fra: new DatePicker().picker('week').onChange(() => checkStep(2, page)),
            field_til: new DatePicker().picker('week').onChange(() => checkStep(2, page)),
        },
        
        // Step 3: Guide Instructions
        s3: {
            section: new Section(),
            field_checkbox: new Checkbox().onChange(() => checkStep(3, page))
        },
        
        // Step 4: Expenses
        s4: {
            section: new Section(),
            list: new List(),
            button: new Button(),
            get: new Get(),
            condition: new Conditions()
        },
        
        // Step 5: (Reserved for future use)
        s5: {
            section: new Section(),
            list: new List()
        },
        
        // Step 6: Review & Submit
        s6: {
            section: new Section(),
            button: new Button().formula(createSubmitFormula(main, () => page)),
            sectionFail: new Section(),
            sectionReady: new Section(),
            sectionSuccess: new Section(),
            condition: new Conditions().default('ready'),
            conditionFail: new ConditionsItem()
                .condition((v: string) => v == 'fail')
                .content((next) => next((page as any).s6.sectionFail)),
            conditionReady: new ConditionsItem()
                .condition((v: string) => v == 'ready')
                .content((next) => next((page as any).s6.sectionReady)),
            conditionSuccess: new ConditionsItem()
                .condition((v: string) => v == 'success')
                .content((next) => next((page as any).s6.sectionSuccess)),
        },
        
        clear: () => {
            // Cleanup function if needed
        },
    };
    
    // Store page in main for global access
    main.$store(page, 'page');
    
    return page;
};
