
export default class StepsItem {

    constructor() {

    }

    _index: number = 0;
    index(v: number) { this._index = v; return this; }

    _done: boolean = true;
    done(v: boolean) { this._done = v; return this; }

    _title: string = '';
    title(v: string) { this._title = v; return this; }

    _content: any = true;
    content(v: any) { this._content = v; return this; }

    // Steps.tsx will call this to get the item-object.
    getObject() {
        return {
            done: this._done,
            title: this._title,
            content: (n: any) => this._content(n)
        }
    }
}