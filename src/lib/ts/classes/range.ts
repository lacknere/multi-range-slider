class MRS_Range {
    private _index: number;
    private _start: number;
    private _startFixed: boolean;
    private _startConnectedTo: number;
    private _end: number;
    private _endFixed: boolean;
    private _endConnectedTo: number;

    constructor(index: number, range: any) {
        this._index = index;
        if (range) {
            this._start = range.start;
            this._startFixed = range.startFixed;
            this._startConnectedTo = range.startConnectedTo;
            this._end = range.end;
            this._endFixed = range.endFixed;
            this._endConnectedTo = range.endConnectedTo;
        }
    }

    public get start(): number {
        return this._start;
    }

    public get end(): number {
        return this._end;
    }
}