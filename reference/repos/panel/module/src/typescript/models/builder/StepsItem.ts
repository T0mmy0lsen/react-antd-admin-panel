
export default class StepsItem {

    constructor() {

    }

    _done: boolean = true;
    done(v: boolean) { this._done = v; return this; }

    _title: string = '';
    title(v: string) { this._title = v; return this; }

    // Once next(Section) is called the Section will be drawn in the Steps-component.
    _content: any = true;
    content(v: (next: any) => any) { this._content = v; return this; }

    // Steps.tsx will call this to get the item-object.
    getObject() {
        return {
            done: this._done,
            title: this._title,
            content: (n: any) => this._content(n)
        }
    }
}