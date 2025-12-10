import Default from "./Default";
import {Helpers} from "../../index";
import Get from "../Get";

export default class Section extends Default {

    _cols: string | number = 24;
    cols(cols: string | number) { this._cols = cols; return this; }

    _type: any = 'Col';
    type(type: 'Row' | 'Col') { this._type = type; return this; }
    row() { this._type = 'Row'; return this; }
    col() { this._type = 'Col'; return this; }

    _justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between' = 'start';
    between() { this._justify = 'space-between'; return this; }
    center() { this._justify = 'center'; return this; }
    start() { this._justify = 'start'; return this; }
    end() { this._justify = 'end'; return this; }

    _align: string = 'start';
    align(v: string) { this._align = v; return this; }

    _async: any;
    async(v: boolean = true) { this._async = v; return this; }

    _overlay: boolean = false;
    overlay(v?: boolean) { this._overlay = v ?? true; return this; }

    _card: boolean = false;
    card(v?: boolean) { this._card = v ?? true; return this; }

    _cardStyle: any = { marginTop: '24px' };
    cardStyle(v?: any) { this._cardStyle = v; return this; }

    addRowEnd(items: any)
    {
        let section = new Section().row().end();
        this.add(section);
        this.addManyTo(section, items);
        return this;
    }

    addRowStart(items: any) {
        let section = new Section().row().start();
        this.add(section);
        this.addManyTo(section, items);
        return this;
    }

    addManyTo(section: Section, items: any) {
        if (Array.isArray(items)) {
            items.forEach((r: any) => section.add(r));
        } else {
            section.add(items);
        }
    }

    _ignore: boolean = false;
    ignore(v: boolean) { this._ignore = v; return this; }

    _object: any;
    object(v: any) { this._object = v; return this; }

    _component: any;
    _componentArgs: any;
    component(component: any, args: any = undefined) {
        this._component = component;
        this._componentArgs = args;
        return this;
    }

    init() {
        if (this._formulaIsRoot) this.formulaSetChildren?.();
        return this;
    }

    immediate(func: (args?: any) => Get, args?: any): this {
        return super.fetch(func, args);
    }

    constructor() {
        super('Section');
        this._key = Helpers.stamp();
    }
}