class MRSSlider {
	private _mrs: MRS;

	constructor(mrs: MRS) {
		this._mrs = mrs;
	}

	private get args(): MRS_Args {
		return this._mrs.args;
	}

	private get element(): HTMLElement {
		return this._mrs.element;
	}

	private get ranges(): MRSRange[] {
		return (this._mrs.args.ranges as MRSRange[]);
	}
}