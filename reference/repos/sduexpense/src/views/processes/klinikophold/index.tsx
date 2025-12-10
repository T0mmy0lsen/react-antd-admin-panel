import { Section, StepsItem, ConditionsItem } from "../../../typescript";
import { Main } from "../../../typescript";
import { createPageStructure } from "./config";
import { getInitialData } from "./api/klinikopholdApi";
import {
    Step1PersonalInfo,
    Step2TripDetails,
    Step3GuideInstructions,
    Step4Expenses,
    Step5ReviewSubmit
} from "./steps";

/**
 * Klinikophold Process - Main Entry Point
 * 
 * This is the refactored version of the Klinikophold expense reporting process.
 * It follows the modular architecture pattern established by the externals process.
 * 
 * Flow:
 * 1. Create page structure with all fields and configurations
 * 2. Build individual step sections
 * 3. Register steps with the Steps component
 * 4. Fetch initial data from API
 * 5. Return the configured section
 * 
 * @param main - Main application context object
 * @returns Section - The configured main section for the process
 */
const KlinikopholdProcess = (main: Main): Section => {
    console.log("Initializing Klinikophold Process");
    
    // Step 1: Create the page structure with all configuration
    const page = createPageStructure(main);
    
    // Step 2: Configure the main section styling
    page.section
        .style({ padding: '54px 54px 54px 54px' })
        .add(page.steps)
        .init();
    
    // Step 3: Register all steps with the Steps component
    page.steps
        .add(new StepsItem()
            .done(false)
            .title('Personlige oplysninger')
            .content((next) => next(page.s1.section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Vælg datoer')
            .content((next) => next(page.s2.section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Guide')
            .content((next) => next(page.s3.section))
        )
        .add(new StepsItem()
            .done(false)
            .title('Tilføj udgifter')
            .content((next) => {
                console.log("Step: Tilføj udgifter");
                next(page.s4.section);
            })
        )
        .add(new StepsItem()
            .done(false)
            .title('Indsend')
            .content((next) => next(page.s6.section))
        );
    
    // Step 4: Build all step sections
    // Each step function configures its section and returns it
    Step1PersonalInfo(page, main);
    Step2TripDetails(page, main);
    Step3GuideInstructions(page, main);
    Step4Expenses(page, main);
    Step5ReviewSubmit(page, main);
    
    // Step 5: Configure conditional rendering for the main section
    page.condition.add(new ConditionsItem()
        .content((next) => next(page.section))
        .condition((r: boolean) => r)
    );
    
    // Step 6: Fetch initial data from API
    // This will populate the form with existing data or create a new record
    getInitialData(main, () => page).get();
    
    // Step 7: Return the configured section wrapped in a conditional
    return new Section().add(page.condition);
};

export default KlinikopholdProcess;
