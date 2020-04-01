class MRSSlider {
	private _mrs: MRS;

	constructor(mrs: MRS) {
		this._mrs = mrs;
		this.buildHTML();
	}

	private get args(): MRSArgs {
		return this._mrs.args;
	}

	private get element(): HTMLElement {
		return this._mrs.element;
	}

	private get ranges(): MRSRange[] {
		return (this._mrs.args.ranges as MRSRange[]);
	}

	private setSliderAttributes(input: HTMLInputElement): HTMLInputElement {
		const { step, min, max } = this.args;

		input.type = 'range';
		input.step = step.toString();
		input.min = min.toString();
		input.max = max.toString();

		return input;
	}

	private buildHTML() {
		this.element.className += ' multi-range-slider';

		this.ranges.forEach((range: MRSRange) => {
			let rangeStartInput: HTMLInputElement = document.createElement('input'),
				rangeEndInput: HTMLInputElement = document.createElement('input');

			rangeStartInput.name = `${this.args.name}[${range.index}].start`;
			rangeEndInput.name = `${this.args.name}[${range.index}].end`;

			rangeStartInput = this.setSliderAttributes(rangeStartInput);
			rangeEndInput = this.setSliderAttributes(rangeEndInput);

			range.startInput = rangeStartInput;
			range.endInput = rangeEndInput;

			this.element.appendChild(range.startInput);
			this.element.appendChild(range.endInput);
		});
	}
}