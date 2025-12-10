import { Section, Space, Title, Typography } from "../../../../typescript";
import { KlinikopholdPageStructure } from "../types";

/**
 * Step 2: Trip Details
 * Collects information about the clinic stay including education, cities, and dates
 */
export const Step2TripDetails = (page: KlinikopholdPageStructure, main: any): Section => {
    const { s2, formula } = page;
    
    s2.section.add(new Title().label('Du udfylder udgifter ifm. klinikophold').level(3));
    s2.section.add(new Space().bottom(12).border());
    s2.section.add(new Typography().style({ marginLeft: 12, marginBottom: 6 }).strong().label('Angiv venligst den eller de byer, hvor du har været i klinik. For eksempel: \'Svendborg, Fredericia\''));
    s2.section.add(s2.field_beskrivelse.label('Uddannelse'));
    s2.section.add(s2.field_bystednavn.key('bystednavn'));
    s2.section.add(new Typography().style({ marginLeft: 12, marginTop: 12, marginBottom: 6 }).strong().label('Angiv ugen for dit første og sidste klinikophold. Uger uden klinik imellem kan forekomme. Indsend kun én samlet afregning for semesteret.'));
    s2.section.add(s2.field_fra.returnStartOfWeek().key('fra').label('Fra uge'));
    s2.section.add(new Space().top(12));
    s2.section.add(s2.field_til.returnEndOfWeek().key('til').label('Til uge'));
    
    s2.section.formula(formula);
    s2.section.init();
    
    return s2.section;
};
