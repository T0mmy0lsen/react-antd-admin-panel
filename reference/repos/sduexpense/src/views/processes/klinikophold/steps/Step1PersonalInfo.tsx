import { Section, Space, Title, Typography } from "../../../../typescript";
import { KlinikopholdPageStructure } from "../types";

/**
 * Step 1: Personal Information
 * Collects user's CPR number, name, address, and other personal details
 */
export const Step1PersonalInfo = (page: KlinikopholdPageStructure, main: any): Section => {
    const { s1, formula } = page;
    
    s1.section.add(new Title().label('Kære rejsende, først skal vi lære dig at kende').level(3));
    s1.section.add(new Space().bottom(24).border());
    s1.section.add(new Typography().strong().style({ marginLeft: 12 }).label('Cpr. nr. skal bruges i forbindelse med udbetaling til Nemkonto.'));
    s1.section.add(s1.field_cpr_nr.label('Cpr. nr.').key('cpr'));
    s1.section.add(s1.field_name.label('Fulde navn').key('navn'));
    s1.section.add(s1.field_address.label('Addresse').key('addresse'));
    s1.section.add(s1.field_city.label('By').key('by'));
    s1.section.add(s1.field_zip.label('Postnr.').key('postnummer'));

    // Hidden fields for backend data
    s1.section.add(s1.field_id.key('id'));
    s1.section.add(s1.field_underkonto.key('underkonto'));
    s1.section.add(s1.field_analysenummer.key('analysenummer'));
    s1.section.add(s1.field_omkostningsted.key('omkostningsted'));
    s1.section.add(s1.field_projektnummer.key('projektnummer'));
    s1.section.add(s1.field_omkostningsted2.key('omkostningsted2'));
    s1.section.add(s1.field_formaal.key('formål'));
    s1.section.add(s1.field_godkender.key('godkender'));
    s1.section.add(s1.field_kontostreng.key('kontostreng'));
    s1.section.add(s1.field_udgiftsposter.key('udgiftsposter'));
    s1.section.add(s1.field_branch.key('branch'));
    s1.section.add(s1.field_department.key('department'));

    s1.section.formula(formula);
    s1.section.init();
    
    return s1.section;
};
