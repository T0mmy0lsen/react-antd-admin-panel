// helpers.ts

import {Conditions, ConditionsItem, Get, Post, Section} from "./typescript";
import {
    IFormularCreatorConfigs,
    IFormularCreatorElementConfigs, IFormularCreatorElements,
} from "./classes";

export const getSortedElements = (list: IFormularCreatorElements[]) => {

    list = list.filter((e: IFormularCreatorElements) => !e.parent_id)
    list = list.sort((a, b) => {
        // Compare by 'section' first
        if (a.section < b.section) return -1;
        if (a.section > b.section) return 1;

        // If 'section' is equal, compare by 'group'
        if (a.group < b.group) return -1;
        if (a.group > b.group) return 1;

        // If 'group' is also equal, finally compare by 'order'
        return a.order - b.order;
    });

    return list;
}

export const getInitials = (name: string) : string => {
    const words = name.trim().split(' ');

    if (words.length === 1) {
        // If there's only one word, use the first two letters of this word
        return words[0].substring(0, 2).toUpperCase();
    } else {
        // Take the first letter of the first two words
        return (words[0][0] + words[1][0]).toUpperCase();
    }
}

export const getConfigValue = (configs: any[], value: string) => {
    return configs.find((c: IFormularCreatorConfigs | IFormularCreatorElementConfigs) => {
        return c.config.config === value
    })?.inputs[0].value.value_boolean.value ?? undefined;
}

export const hasConfigValue = (configs: any[], value: string) => {
    return configs.some((c: IFormularCreatorConfigs | IFormularCreatorElementConfigs) => {
        return c.config.config === value
    });
}

export const createAndOpenFormular = (main, id, withTrigger = false, withTriggerFormularId = 0) => {
    if (id) {
        new Post()
            .target(() => ({
                target: '/api/formularCreate',
                params: { id: id, withTrigger: withTrigger, withTriggerFormularId: withTriggerFormularId }
            }))
            .onThen((e) => {
                main.$route(`/formular?id=` + e.data.id);
            })
            .submit();
    }
}

export const downloadExcelFile = (id: number, onThen: () => any) =>
{
    let get = new Get()

    get.target(() => ({
            target: '/api/formularsByDataistExportExcel',
            params: { id: id },
            responseType: 'blob'
        }))
        .onThen((response: any) => {
            onThen();
        })
        .get(undefined, undefined, `formular.${id}.xlsx`)
};

export const addCondition = (
    elementToShow, formula: any = undefined,
    initialState: () => boolean = () => false
) => {
    let condition = new Conditions().default(initialState)
    let conditionFalse = new ConditionsItem()
        .condition(v => !v)
        .content((next) => next(new Section()))
    let conditionTrue = new ConditionsItem()
        .condition(v => v)
        .content((next) => {
            let sectionWithConditionCreator = new Section()
                .add(typeof elementToShow === 'function' ? elementToShow() : elementToShow)
                .init()
            if (formula) {
                next(new Section()
                    .formula(formula ?? undefined)
                    .add(sectionWithConditionCreator)
                    .init()
                )
            } else {
                next(new Section().add(sectionWithConditionCreator))
            }
        })

    condition.add(conditionFalse)
    condition.add(conditionTrue)
    condition.restore(initialState)

    return condition;
}

export const findByKey = (arr, key) => arr.find(obj => obj.key === key);


// Utility function to darken colors (you might need to adjust it to your needs)
export const darkenColor = (color: any, amount = 0.7) => {
    if (color[0] === '#') color = color.slice(1);
    let [r, g, b] = color.match(/\w\w/g).map((x: any) => parseInt(x, 16) * amount);
    return `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
};

export const lightenColor = (color, amount = 0.7) => {
    if (color[0] === '#') color = color.slice(1);

    // Parse the hex color string into its RGB components
    let [r, g, b] = color.match(/\w\w/g).map(x => parseInt(x, 16));

    // Calculate the new color component values
    r = Math.min(255, r + (255 - r) * amount);
    g = Math.min(255, g + (255 - g) * amount);
    b = Math.min(255, b + (255 - b) * amount);

    // Convert the RGB components back into a hex color string
    return `#${[r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
}

