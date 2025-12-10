import Default from "./Default";

export default class Upload extends Default {

    /** Non-builder variables are set before the constructor. */

    _fileWasUploaded: boolean = false;

    constructor() {
        super('Upload');
    }

    /** Builder specific functions. */

    _url: any;
    url(v: any) { this._url = v; return this; }

    _header: any;
    header(v: any) { this._header = v; return this; }

    _onThen: any;
    onThen(v: any) { this._onThen = v; return this; }

    _onCatch: any;
    onCatch(v: any) { this._onCatch = v; return this; }

    _fileType: any;
    fileType(v: string) { this._fileType = v; return this; }

    _fileList: any[] = [];
    fileList(v: any[]) { this._fileList = v; return this; }

    /** On-functions are called by the .tsx and set by the builder. */

    _onFileDeleted: () => void = () => {};
    onFileDeleted(v: any) { this._onFileDeleted = v; return this; };

    /** Component-return functions. */

    clearFiles: any = () => {};
}