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
    Steps
} from "../../../typescript";
import { Formula } from "../../../typescript";

/**
 * Expense item structure
 */
export interface ExpenseItem {
    id: string | number;
    date: string;
    text?: string;
    category: string;
    amount: number;
    upload: Array<{ id: string | number; file: string }>;
}

/**
 * API payload for expense posts
 */
export interface ExpenseApiPayload {
    id: string | number | null;
    dato: string;
    kategori: string;
    bemærkninger?: string;
    valuta: string;
    beløb: number;
    attachments: Array<{ id: string | number; file: string }>;
}

/**
 * Account string structure
 */
export interface KontoStreng {
    underkonto: string;
    omkostningsted: string;
    analysenummer: string;
    projektnummer: string;
    omkostningsted2: string;
    formål: string;
}

/**
 * Data object returned from API
 */
export interface DataObject {
    id: string | number;
    cpr: string;
    navn: string;
    addresse: string;
    by: string;
    postnummer: string;
    beskrivelse: string;
    byStedNavn: string;
    fra: string;
    til: string;
    udgiftsposter: ExpenseApiPayload[];
    status: string;
    godkender?: string;
}

/**
 * Page structure for Klinikophold process
 */
export interface KlinikopholdPageStructure {
    formula: Formula;
    main: any;
    steps: Steps;
    section: Section;
    condition: Conditions;
    
    s1: {
        section: Section;
        field_cpr_nr: Input;
        field_name: Input;
        field_address: Input;
        field_city: Input;
        field_zip: Input;
        field_email: Input;
        field_id: Input;
        field_udgiftsposter: Input;
        field_kontostreng: Input;
        field_underkonto: Input;
        field_analysenummer: Input;
        field_omkostningsted: Input;
        field_projektnummer: Input;
        field_omkostningsted2: Input;
        field_formaal: Input;
        field_godkender: Input;
        field_branch: Input;
        field_department: Input;
    };
    
    s2: {
        section: Section;
        field_beskrivelse: Select;
        field_bystednavn: Input;
        field_fra: DatePicker;
        field_til: DatePicker;
    };
    
    s3: {
        section: Section;
        field_checkbox: Checkbox;
    };
    
    s4: {
        section: Section;
        list: List;
        button: Button;
        get: Get;
        condition: Conditions;
    };
    
    s5: {
        section: Section;
        list: List;
    };
    
    s6: {
        section: Section;
        button: Button;
        sectionFail: Section;
        sectionReady: Section;
        sectionSuccess: Section;
        condition: Conditions;
        conditionFail: ConditionsItem;
        conditionReady: ConditionsItem;
        conditionSuccess: ConditionsItem;
    };
    
    clear: () => void;
}
