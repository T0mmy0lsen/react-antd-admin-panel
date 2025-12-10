import React from "react";
import { 
    Action, 
    ConditionsItem, 
    ListHeader, 
    Section, 
    SelectItem, 
    Space, 
    Title 
} from "../../../../typescript";
import { Alert } from "antd";
import { KlinikopholdPageStructure } from "../types";
import { formatUdgiftspost } from "../utils/formatters";
import { checkStep } from "../utils/validators";
import { UploadToList } from "../../../components";

/**
 * Step 4: Expenses
 * Allows users to add, edit, and manage expense line items with attachments
 */
export const Step4Expenses = (page: KlinikopholdPageStructure, main: any): Section => {
    const { s4 } = page;
    
    // Configure the Get request for loading expenses
    s4.get
        .target(() => {
            return `RejseAfregning/${main.$stored('page').formula.params()['id']}`;
        })
        .header({ 'Authorization': 'Bearer ' + main.$account.accessToken })
        .alter((data: any) => {
            return data.udgiftsposter
                .splice(0, 10)
                .map((r: any) => formatUdgiftspost(r));
        })
        .onThen(() => {
            checkStep(4, page);
            s4.condition.checkCondition(true);
        });
    
    // Configure the "Add empty row" button
    s4.button
        .style({ marginBottom: 16 })
        .middle()
        .primary()
        .action(new Action()
            .label('Tilføj tom række')
            .callback(() => {
                s4.list.setRecord({
                    id: '',
                    date: s4.list.getRecords()?.[0]?.date ?? page.s2.field_fra._data.substring(0, 10) ?? new Date().toISOString().substring(0, 10),
                    location_from: s4.list.getRecords()?.[0]?.location_from ?? 'Odense',
                    location_to: s4.list.getRecords()?.[0]?.location_to ?? '',
                    category: s4.list.getRecords()?.[0]?.category ?? '26',
                    amount: 0,
                    upload: ''
                });
                page.formula.submit(page.formula.params()['id']);
            }));

    // Configure the expense list
    s4.list.headerCreate(false);
    s4.list.footer(false);
    s4.list.rowClassName('topAlign');
    s4.list.get(() => s4.get);
    s4.list.headerPrepend(new ListHeader().key('id').title('').width('10px').render((_, r) => <></>));
    s4.list.headerPrepend(new ListHeader().key('date').type('dateWeek').title('Dato').editable().width('160px').onChange(() => checkStep(4, page)));
    s4.list.headerPrepend(new ListHeader().key('category')
        .type('select')
        .title('Kategori')
        .editable(!main.$stored('status'))
        .onChange(() => checkStep(4, page))
        .items([
            new SelectItem('26', '26', 'Togbilletter'),
            new SelectItem('4', '4', 'Busbilletter'),
            new SelectItem('11', '11', 'Kilometergodtgørelse'),
            new SelectItem('18', '18', 'Overnatning (ikke hotel)'),
            new SelectItem('9', '9', 'Hotel i Danmark'),
        ]));
    s4.list.headerPrepend(new ListHeader()
        .key('amount')
        .type('number')
        .title('Beløb')
        .editable()
        .width('100px')
        .onChange(() => checkStep(4, page)));
    s4.list.headerPrepend(new ListHeader()
        .key('warning')
        .title('')
        .render((_, record: any) => {
            const isTransportCategory = record.category === '26' || record.category === '4' || record.category === '11';
            const isAccommodationCategory = record.category === '18' || record.category === '9';
            
            const exceedsTransportLimit = isTransportCategory && record.amount > 140;
            const exceedsAccommodationLimit = isAccommodationCategory && record.amount > 400;
            
            if (exceedsTransportLimit) {
                return (
                    <div style={{ 
                        fontSize: 11, 
                        color: '#ff4d4f', 
                        fontStyle: 'italic',
                        fontWeight: 500
                    }}>
                        ⚠️ Max 140 kr. pr. uge
                    </div>
                );
            }
            
            if (exceedsAccommodationLimit) {
                return (
                    <div style={{ 
                        fontSize: 11, 
                        color: '#ff4d4f', 
                        fontStyle: 'italic',
                        fontWeight: 500
                    }}>
                        ⚠️ Max 400 kr. pr. nat
                    </div>
                );
            }
            
            return null;
        }));
    s4.list.headerPrepend(new ListHeader()
        .key('attachments')
        .width('240px')
        .title('Upload').render((_, r) => {
            return <UploadToList disabled={main.$stored('status')} main={main} page={page} record={r} onChange={() => checkStep(4, page)} />;
        }));
    s4.list.headerPrepend(new ListHeader()
        .key('text')
        .title('Evt. bemærkning')
        .editable());
    s4.list.actions(new Action()
        .key('deleteFromList')
        .onComplete(() => page.formula.submit(page.formula.params()['id'])));

    // Build the section
    s4.section.add(new Title().label('Du skal tilføje nogle bilag').level(3));
    s4.section.add(new Space().bottom(24).border());
    s4.section.add(new Section().component(() => {
        return (
            <>
                <Alert
                    type="info"
                    message="Transportudgifter (tog/bus)"
                    description={
                        <div>
                            <p>Opret én række pr. uge og upload relevant dokumentation. <strong>Du kan maksimalt søge 140 kr. pr. uge</strong>, så dokumentation ud over dette beløb er ikke nødvendig. Angiv enten dine faktiske udgifter eller maksimalt 140 kr. (For ungdomskort skal det være gyldigt alle 7 dage i ugen for at søge det fulde beløb).</p>
                        </div>
                    }
                    showIcon
                />
                <Alert
                    type="info"
                    message="Kørt i egen bil"
                    description={
                        <div>
                            <p>Hvis du har kørt i egen bil, skal du udfylde et kørselsregnskab. <strong>Du skal kun dokumentere udgifter op til 140 kr. pr. uge</strong>. <a style={{marginLeft: 4}} href="https://mitsdu.dk/-/media/mitsdu/filer/mit_studie/sund/koerselsregnskab_2025.xlsx">Find blanketten her.</a> Opret en række i den første uge af dit klinikophold, vælg kategori: kilometergodtgørelse, vedhæft kørselsregnskabet og angiv det samlede beløb (antal uger x 140 kr.).</p>
                        </div>
                    }
                    showIcon
                    style={{marginTop: 16}}
                />
                <Alert
                    type="info"
                    message="Overnatning"
                    description={
                        <div>
                            <p>Opret én række pr. uge og upload relevant dokumentation. <strong>Du kan maksimalt søge 400 kr. pr. overnatning</strong>.</p>
                        </div>
                    }
                    showIcon
                    style={{marginTop: 16}}
                />
            </>
        );
    }));
    s4.section.add(new Space().top(24));

    // Configure conditional rendering
    s4.condition = page.s4.condition.default(false)
        .add(new ConditionsItem()
            .condition((v: boolean) => !v)
            .content((n) => {
                n(new Section().component(<></>));
            }))
        .add(new ConditionsItem()
            .condition((v: boolean) => v)
            .content((n) => {
                n(new Section()
                    .add(s4.button)
                    .add(s4.list)
                );
            }));

    s4.section.add(s4.condition);
    
    return s4.section;
};
