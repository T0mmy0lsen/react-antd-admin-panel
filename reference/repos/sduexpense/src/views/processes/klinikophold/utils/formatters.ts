import { ExpenseItem, ExpenseApiPayload, KontoStreng } from "../types";

/**
 * Format account string (kontostreng) from page data
 * Maps hidden fields to account structure for API
 */
export const formatKontostreng = (page: any): KontoStreng => {
    return {
        underkonto: page.s1.field_underkonto._data ?? '08',
        omkostningsted: page.s1.field_omkostningsted._data ?? '00000',
        analysenummer: page.s1.field_analysenummer._data ?? '00000',
        projektnummer: page.s1.field_projektnummer._data ?? '0000000',
        omkostningsted2: page.s1.field_omkostningsted2._data ?? '000',
        formål: page.s1.field_formaal._data ?? '00',
    };
};

/**
 * Format records from the expense list to API payload format
 * Converts UI data structure to backend expected format
 */
export const formatRecordToUdgiftspost = (page: any): ExpenseApiPayload[] => {
    const records = page.s4.list._componentIsBuild 
        ? page.s4.list.getRecords() 
        : page.s4.list._default?.dataSource;
    
    console.log('formatRecordToUdgiftspost', records);
    
    return records?.map((r: any) => ({
        id: r.id === '' ? null : r.id,
        dato: r.date,
        kategori: r.category ?? '2',
        bemærkninger: r.text,
        valuta: r.currency ?? '2',
        beløb: r.amount,
        attachments: r.upload,
    })) || [];
};

/**
 * Format expense post from API response to UI format
 * Converts backend data structure to UI expected format
 */
export const formatUdgiftspost = (r: any): ExpenseItem => {
    return {
        id: r.id,
        date: r.dato,
        text: r.bemærkninger ?? '',
        category: r.kategori,
        amount: r.beløb,
        upload: r.attachments,
    };
};
