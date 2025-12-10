import React from "react";
import { CheckboxItem, Section, Space, Title, Typography } from "../../../../typescript";
import { KlinikopholdPageStructure } from "../types";
import { PDFGuideViewer } from "../components/PDFGuideViewer";

/**
 * Step 3: Guide Instructions
 * Shows the PDF guide and requires user to confirm they've read it
 */
export const Step3GuideInstructions = (page: KlinikopholdPageStructure, main: any): Section => {
    const { s3 } = page;
    
    s3.section.add(new Title().label('Du skal lære lidt om hvordan bilag skal se ud').level(3));
    s3.section.add(new Space().bottom(12).border());
    s3.section.add(new Typography().style({}).strong().label('Læs guiden og klik i checkboxen for at kunne komme videre.'));
    s3.section.add(new Space().top(36));
    s3.section.add(new Section().component(() => {
        return <PDFGuideViewer />;
    }));
    s3.section.add(new Section().row().center()
        .add(new Space().top(24))
        .add(s3.field_checkbox.add(new CheckboxItem().value(1).label('Jeg har læst guiden')))
    );
    
    return s3.section;
};
