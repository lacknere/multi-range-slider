interface HTMLElement {
    multiRangeSlider: Function;
    mrs: MRS;
}
declare type MRS_Args = {
    name?: string;
    step?: number;
    min?: number;
    max?: number;
    fixToMin?: boolean;
    fixToMax?: boolean;
    ranges?: number | MRS_Range[];
    connectRanges?: boolean;
    allowContact?: boolean;
};
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
    private _index;
    private _start;
    private _startFixed;
    private _startConnectedTo;
    private _end;
    private _endFixed;
    private _endConnectedTo;
    constructor(index: number, range: any);
    get start(): number;
    get end(): number;
}
declare class MRS_Slider {
    private _mrs;
    constructor(mrs: MRS);
    private get mrs();
    private get ranges();
    private buildHTML;
}
