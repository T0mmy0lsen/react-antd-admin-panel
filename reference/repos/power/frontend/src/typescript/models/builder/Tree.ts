import Default from "./Default";

export default class Tree extends Default {

    _children: any;
    env: any;

    /** Component-return functions.
     *  - Call .tsx functions from the model
     *  - Functions will be set at the end of the .tsx
     */

    selectNode: any = () => {};
    expandNode: any = () => {};
    reloadLocal: any = () => {};

    constructor() {
        super('Tree');
        this.env = JSON.parse(window.localStorage.getItem('env') ?? '{}');
    }

    // Add a node from the tree.
    _nodeAdd: any;
    nodeAdd(v:any) { this._nodeAdd = v; return this; }

    // Remove a node from the tree.
    _nodeRemove: any;
    nodeRemove(v:any) { this._nodeRemove = v; return this; }

    // Any default get function for Node on Tree.
    _getOnChild: any;
    getOnChild(v: any) { this._getOnChild = v; return this; }

    _getOnChildIgnoreIf: any;
    getOnChildIgnoreIf(v: any) { this._getOnChildIgnoreIf = v; return this; }
}