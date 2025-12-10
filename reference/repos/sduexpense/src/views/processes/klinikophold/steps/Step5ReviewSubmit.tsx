import { 
    Action, 
    Button, 
    Formula, 
    Post, 
    Result, 
    Section, 
    Space, 
    Typography 
} from "../../../../typescript";
import { message } from "antd";
import { KlinikopholdPageStructure } from "../types";
import { restartFlow } from "../api/klinikopholdApi";

/**
 * Step 5: Review & Submit
 * Final review step where users submit their expense report
 */
export const Step5ReviewSubmit = (page: KlinikopholdPageStructure, main: any): Section => {
    const { s6, steps } = page;
    
    // Configure the submit button
    s6.button
        .middle()
        .primary()
        .action(new Action()
            .label('Gem og indsend')
            .callback(() => {
                s6.button.tsxSetLoading(true);
                s6.button._formula._post
                    .onThen(() => {
                        new Formula(new Post().target((id: Number) => ({
                                target: `RejseAfregning/${id}/complete`,
                                method: 'PUT',
                            }))
                                .header({'Authorization': 'Bearer ' + main.$account.accessToken })
                                .onThen((r: any) => {
                                    console.log(r);
                                    if (r.data == 'failed') {
                                        message.error('Noget gik galt ...');
                                        s6.condition.checkCondition('fail');
                                    } else {
                                        message.success('Det gik godt!');
                                        s6.condition.checkCondition('success');
                                        page.steps.tsxStepsButtonDisable(true);
                                    }
                                })
                                .onCatch(() => {
                                    s6.button.tsxSetLoading(false);
                                    s6.condition.checkCondition('fail');
                                    message.error('Noget gik galt...');
                                })
                        ).submit(page.formula.params()['id']);
                    })
                    .onCatch(() => {
                        s6.button.tsxSetLoading(false);
                        s6.condition.checkCondition('fail');
                        message.error('Noget gik galt...');
                    });
                s6.button._formula.submit(page.formula.params()['id']);
            }));

    // Failure result section
    s6.sectionFail.add(new Result()
        .title('Fejl i maskinrummet')
        .status('error')
        .subTitle('Ej, hvor pinligt. Der var noget der gik galt.')
        .add(new Section().row().center().add(new Button().action(new Action()
            .label('Åben ny')
            .callback(() => {
                message.success('Vi åbner nu et nyt flow. Det du har udfyldt er ikke sendt afsted.');
                setTimeout(() => restartFlow(main, steps), 2000);
            })))
        )
    );

    s6.sectionFail.add(new Space().top(24));
    s6.sectionFail.add(new Section()
        .row()
        .center()
        .add(new Section().component(() => {
            const approverEmail = page.s1.field_godkender?._data || 'rejser@sdu.dk';
            return (
                <div style={{ textAlign: 'center' }}>
                    <strong>Kontakt {approverEmail}, så hjælper de dig videre med rejseafregningen.</strong>
                </div>
            );
        }))
    );

    // Ready to submit section
    s6.sectionReady.add(new Result()
        .title('Så er du næsten færdig')
        .status('info')
        .subTitle('Har du husket alle bilag? – perfekt, tryk på gem og indsend')
        .add(new Section().row().center().add(s6.button))
    );

    // Success section
    s6.sectionSuccess.add(new Result()
        .title(main.$stored('status') ? 'Den er allerede sendt afsted' : 'Godkendt')
        .status('success')
        .subTitle('Den er sendt afsted og alt gik godt! Du kan fint lukke siden nu.')
    );

    // Build the section with conditional rendering
    s6.section = new Section()
        .add(s6.condition
            .add(s6.conditionFail)
            .add(s6.conditionReady)
            .add(s6.conditionSuccess)
        );
    
    return s6.section;
};
