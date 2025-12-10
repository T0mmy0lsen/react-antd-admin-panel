import { Formula, Get, Post } from "../../../../typescript";
import { DataObject } from "../types";
import { checkStep } from "../utils/validators";
import { formatUdgiftspost } from "../utils/formatters";
import { message } from "antd";
import { modalNew } from "../components/modals";

/**
 * Create the main formula for saving form data
 * Handles PUT requests to update existing RejseAfregning records
 */
export const createFormula = (main: any): Formula => {
    return new Formula(new Post().target((id: any) => ({
            target: `RejseAfregning/${id}`,
            method: 'PUT',
        }))
            .header({'Authorization': 'Bearer ' + main.$account.accessToken })
            .onThen((r: DataObject) => {
                // Refresh the expense list after successful save
                main.$stored('page').s4.list.refresh?.();

                // Validate the next step
                let currentStep = main.$stored('page').steps.getCurrentStep() ?? 0;
                checkStep(currentStep + 1, main.$stored('page'));
            })
            .onCatch(() => {
                // Error handling can be added here if needed
            })
    );
};

/**
 * Create formula for submitting the form
 * Handles PUT requests to submit endpoint
 */
export const createSubmitFormula = (main: any, getPage: () => any): Formula => {
    return new Formula(new Post().target((id: any) => ({
        target: `RejseAfregning/${id}/submit`,
        method: 'PUT',
    }))
        .header({'Authorization': 'Bearer ' + main.$account.accessToken })
    );
};

/**
 * Create formula for creating a new RejseAfregning record
 * Handles POST requests to create new records
 */
export const createNewFormula = (main: any): Formula => {
    return new Formula(new Post().target(() => ({
            target: 'RejseAfregning',
            method: 'POST',
        }))
            .header({'Authorization': 'Bearer ' + main.$account.accessToken })
            .onThen((r: any) => {
                // Reload to get the new record
            })
            .onCatch(() => {
                // Error handling
            })
    );
};

/**
 * Restart the flow by creating a new record and reloading the page
 * Used when user wants to start over with a fresh form
 */
export const restartFlow = (main: any, steps: any): void => {
    const formula = createNewFormula(main);
    formula._post
        .onThen(() => {
            steps.goTo(0);
            window.location.reload();
        })
        .onCatch(() => {
            steps.goTo(0);
            window.location.reload();
        });
    formula.submit();
};

/**
 * Get initial data for the form
 * Fetches existing RejseAfregning records and populates the form
 * If no records exist, creates a new one
 */
export const getInitialData = (main: any, getPage: () => any): Get => {
    console.log("Get the initial data for the formula");

    return new Get().target('RejseAfregning')
        .header({ 'Authorization': 'Bearer ' + main.$account.accessToken })
        .onThen((data: any) => {
            const page = getPage();
            const res: DataObject[] = data.data;

            console.log("Get the initial data for the formula", res);

            if (res.length > 0) {
                // Get the last element in the list
                const result = res[res.length - 1];

                main.$store(result.status == 'completed', 'status');

                // Get all data from the URL parameters
                const url = new URL(window.location.href);
                const params = new URLSearchParams(url.search);

                const godkender = params.get('godkender');
                const underkonto = params.get('underkonto');
                const omkostningsted = params.get('omkostningsted');
                const analysenummer = params.get('analysenummer');
                const formaal = params.get('formaal');
                const projektnummer = params.get('projektnummer');
                const omkostningsted2 = params.get('omkostningsted2');
                const branch = params.get('branch');
                const department = params.get('department');

                // Validate required URL parameters
                const missingFields: string[] = [];
                if (!godkender) missingFields.push('godkender');
                if (!underkonto) missingFields.push('underkonto');
                if (!omkostningsted) missingFields.push('omkostningsted');
                if (!analysenummer) missingFields.push('analysenummer');
                if (!formaal) missingFields.push('formaal');
                if (!projektnummer) missingFields.push('projektnummer');
                if (!omkostningsted2) missingFields.push('omkostningsted2');
                if (!branch) missingFields.push('branch');
                if (!department) missingFields.push('department');

                // Alert user if any required fields are missing
                if (missingFields.length > 0) {
                    alert('The following fields are missing: ' + missingFields.join(', '));
                }

                // Format expense posts
                const udgiftsposter = result.udgiftsposter.splice(0, 10).map((r: any) => formatUdgiftspost(r));

                // Populate hidden fields with URL parameters
                page.s1.field_id.default(result.id);
                page.s1.field_analysenummer.default(analysenummer);
                page.s1.field_formaal.default(formaal);
                page.s1.field_omkostningsted.default(omkostningsted);
                page.s1.field_omkostningsted2.default(omkostningsted2);
                page.s1.field_projektnummer.default(projektnummer);
                page.s1.field_underkonto.default(underkonto);
                page.s1.field_branch.default(branch);
                page.s1.field_department.default(department);
                // Populate godkender from backend API if available, otherwise use URL parameter
                page.s1.field_godkender.default(result.godkender || godkender);
                page.s1.field_kontostreng.default('');
                page.s1.field_udgiftsposter.default(udgiftsposter);

                // Populate visible fields with API data
                page.s1.field_address
                    .default(result.addresse)
                    .disabled(main.$stored('status'));
                page.s1.field_city
                    .default(result.by)
                    .disabled(main.$stored('status'));
                page.s1.field_zip
                    .default(result.postnummer)
                    .disabled(main.$stored('status'));
                page.s1.field_email
                    .default(main.$account.account.username)
                    .disabled(true);
                page.s1.field_name
                    .default(result.navn)
                    .disabled(main.$stored('status'));
                page.s1.field_cpr_nr
                    .default(result.cpr)
                    .disabled(main.$stored('status'));
                
                // Validate beskrivelse against allowed options
                const validBeskrivelser = [
                    "Klinikophold - Medicin - BA",
                    "Klinikophold - Medicin - KA",
                    "Klinikophold - Bio.Mek. - BA",
                    "Klinikophold - Bio.Mek. - KA",
                    "Klinikophold - Farmaci - KA",
                    "Klinikophold - Audiologi - BA",
                    "Klinikophold - Audiologi - KA"
                ];
                
                // Use the result.beskrivelse if it's valid, otherwise default to first option
                const beskrivelseValue = validBeskrivelser.includes(result.beskrivelse) 
                    ? result.beskrivelse 
                    : "Klinikophold - Medicin - BA";

                console.log("Beskrivelse value set to:", beskrivelseValue);
                
                page.s2.field_beskrivelse
                    .default({ value: beskrivelseValue })
                    .disabled(main.$stored('status'));
                page.s2.field_bystednavn
                    .default(result.byStedNavn)
                    .disabled(main.$stored('status'));
                page.s2.field_til
                    .default(result.til)
                    .disabled(main.$stored('status'));
                page.s2.field_fra
                    .default(result.fra)
                    .disabled(main.$stored('status'));
                page.s3.field_checkbox
                    .default(udgiftsposter.length ? [1] : [0])
                    .disabled(main.$stored('status'));

                page.s4.list
                    .default({ dataSource: udgiftsposter })
                    .disabled(main.$stored('status'));

                page.s4.button
                    .disabled(main.$stored('status'));

                page.s6.condition.default(main.$stored('status') ? 'success' : 'ready');

                page.condition.checkCondition(true);

                // Validate steps
                checkStep(page.steps.done(0, page), page, '_default');
                checkStep(page.steps.done(1, page), page, '_default');

                // If already completed, mark all steps as done and show modal
                if (main.$stored('status')) {
                    main.$modal(modalNew(main));
                    checkStep(page.steps.done(2, page), page, '_default');
                    checkStep(page.steps.done(3, page), page, '_default');
                    checkStep(page.steps.done(4, page), page, '_default');
                }

            } else {
                // No existing record - create a new one
                message.success("Vi laver lige en formular til dig.");

                new Formula(new Post().target(() => ({
                        target: 'RejseAfregning',
                        method: 'POST',
                    }))
                        .header({'Authorization': 'Bearer ' + main.$account.accessToken })
                        .onThen((r: any) => {
                            window.location.reload();
                        })
                        .onCatch(() => {
                            message.error("Uh. Det gik ikke så godt.");
                        })
                ).submit();
            }
        });
};
