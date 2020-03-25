class MRS_Slider {
    private _mrs: MRS;

    constructor(mrs: MRS) {
        this._mrs = mrs;

        console.log(this.ranges);
        this.buildHTML();
    }

    private get mrs(): MRS {
        return this._mrs;
    }

    private get ranges(): MRS_Range[] {
        return (this.mrs.args.ranges as MRS_Range[]);
    }

    private buildHTML() {
        let args: MRS_Args = this.mrs.args;
        let element: HTMLElement = this.mrs.element;
    }
}