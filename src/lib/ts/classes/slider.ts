class MRS_Slider {
    private _mrs: MRS;

    constructor(mrs: MRS) {
        this._mrs = mrs;

        console.log(this.ranges);
        this.buildHTML();
    }

    private get args(): MRS_Args {
        return this._mrs.args;
    }

    private get element(): HTMLElement {
        return this._mrs.element;
    }

    private get ranges(): MRS_Range[] {
        return (this._mrs.args.ranges as MRS_Range[]);
    }

    private buildHTML() {
        let args: MRS_Args = this.args;
        let element: HTMLElement = this.element;
    }
}