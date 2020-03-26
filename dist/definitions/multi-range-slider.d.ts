interface HTMLElement {
    multiRangeSlider: Function;
    mrs: MRS;
}
declare type MRS_Args = {
    name?: string;
    step?: number;
    min?: number;
    max?: number;
    autoMinMax?: boolean;
    fixToMin?: boolean;
    fixToMax?: boolean;
    allowContact?: boolean;
    ranges?: number | MRS_Range[];
    connectRanges?: boolean;
    limitedSizeMode?: MRS_LimitedSizeMode;
};
declare enum MRS_LimitedSizeMode {
    extendSize = 0,
    shrinkRanges = 1,
    shrinkRangesProportionally = 2
}
declare class MRS {
    private _defaultArgs;
    private _defaultRangeProps;
    private _element;
    private _args;
    private _slider;
    constructor(element: HTMLElement, args: any);
    get defaultArgs(): MRS_Args;
    get defaultRangeProps(): any;
    get element(): HTMLElement;
    get args(): MRS_Args;
    private cleanArgs;
    private validateArgs;
    static logM(message: string): void;
    static logW(message: string): void;
    static logE(message: string): void;
}
declare class MRS_Range {
    private _args;
    private _index;
    private _start;
    private _startFixed;
    private _startConnectedTo;
    private _end;
    private _endFixed;
    private _endConnectedTo;
    private _minSize;
    constructor(index: number, range: any);
    get index(): number;
    get start(): number;
    get end(): number;
    get minSize(): number;
    get size(): number;
    get isShrinkable(): boolean;
    set start(start: number);
    set startFixed(startFixed: boolean);
    set startConnectedTo(startConnectedTo: number);
    set end(end: number);
    set endFixed(endFixed: boolean);
    set endConnectedTo(endConnectedTo: number);
    shrinkBy(value: number, from: 'start' | 'end'): number;
}
declare class MRS_Slider {
    private _mrs;
    constructor(mrs: MRS);
    private get args();
    private get element();
    private get ranges();
    private buildHTML;
}
