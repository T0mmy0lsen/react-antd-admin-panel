import {
    Section,
    Space,
    Typography
} from "../../../../typescript";
import { createNewFormula } from "../api/klinikopholdApi";

/**
 * Modal shown when user already has a submitted form
 * Allows them to create a new form if desired
 */
export const modalNew = (main: any) => {
    const section = new Section();

    section.add(new Space().top(16));
    section.add(new Typography().label("Vi viser din seneste rejseafregning. Hvis du ønsker at lave en ny, så tryk på opret."));
    section.add(new Space().top(16));

    return {
        title: 'Opret ny rejseafregning',
        label: '',
        visible: true,
        section: section,
        mask: false,
        maskClosable: false,
        className: 'removeShadowBox',
        closable: false,
        footer: null,
        okText: 'Opret',
        cancelText: 'Luk',
        handleCancel: () => main.$modalClose(),
        handleOk: () => {
            const formula = createNewFormula(main);
            formula._post
                .onThen(() => {
                    window.location.reload();
                })
                .onCatch(() => {
                    window.location.reload();
                });
            formula.submit();
        }
    };
};
