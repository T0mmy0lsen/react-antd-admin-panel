
export default class ConditionsItem {

    constructor() {

    }

    // Once next(Section) is called the Section will be drawn in the Conditions-component.
    _content: any = true;
    content(v: (next: any, callback?: any, main?: any, args?: any) => any) { this._content = v; return this; }

    _condition: any;
    condition(v: any) { this._condition = v; return this; }

    _onShow: any;
    onShow(v: any) { this._onShow = v; return this; }

    // Conditions.tsx will call this to get the item-object.
    getObject() {
        return {
            content: (n: any) => this._content(n)
        }
    }
}