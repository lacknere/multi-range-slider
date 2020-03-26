class MRS_Range {
    private _args: MRS_Args;
    private _index: number;
    private _start: number;
    private _startFixed: boolean;
    private _startConnectedTo: number;
    private _end: number;
    private _endFixed: boolean;
    private _endConnectedTo: number;
    private _minSize: number;

    constructor(index: number, range: any) {
        this._index = index;
        this._start = range.start;
        this._startFixed = range.startFixed;
        this._startConnectedTo = range.startConnectedTo;
        this._end = range.end;
        this._endFixed = range.endFixed;
        this._endConnectedTo = range.endConnectedTo;
        this._minSize = range.minSize;
    }

    public get index(): number {
        return this._index;
    }

    public get start(): number {
        return this._start;
    }

    public get end(): number {
        return this._end;
    }

    public get minSize(): number {
        return this._minSize;
    }

    public get size(): number {
        return this.end - this.start;
    }

    public get isShrinkable(): boolean {
        return this.size > this._minSize;
    }

    public set start(start: number) {
        this._start = start;
    }

    public set startFixed(startFixed: boolean) {
        this._startFixed = startFixed;
    }

    public set startConnectedTo(startConnectedTo: number) {
        this._startConnectedTo = startConnectedTo;
    }

    public set end(end: number) {
        this._end = end;
    }

    public set endFixed(endFixed: boolean) {
        this._endFixed = endFixed;
    }

    public set endConnectedTo(endConnectedTo: number) {
        this._endConnectedTo = endConnectedTo;
    }

    // shrink range, reposition it and return new range start/end
    public shrinkBy(value: number, from: 'start' | 'end'): number {
        let maxShrink: number = this.size - this.minSize,
            shrinkBy: number = value > maxShrink ? maxShrink : value,
            leftover: number = value - shrinkBy;

        switch (from) {
            case 'start':
                this.start += value;
                this.end += leftover;
                return this.end;
            case 'end':
                this.start -= leftover
                this.end -= value;
                return this.start;
        }
    }
}