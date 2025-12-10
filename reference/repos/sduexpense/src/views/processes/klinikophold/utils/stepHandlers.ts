/**
 * Handle step navigation clicks
 * Auto-saves the form when navigating between steps (unless already completed)
 */
export const onStepClicker = (page: any, main: any): void => {
    if (!main.$stored('status')) {
        page.formula.submit(page.formula.params()['id']);
    } else {
        console.info("Skipping save, since formula has status completed.");
    }
};
