class MRSSlider {
	private _mrs: MRS;

	constructor(mrs: MRS) {
		this._mrs = mrs;
		this.buildHTML();

		// set resize listener to update range elements
		window.onresize = this.updateRangeElements.bind(this);
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

	private buildHTML() {
		this.element.setAttribute('multi-range-slider', '');

		const trackElement: HTMLDivElement = document.createElement('div');

		trackElement.setAttribute('track', '');
		this.element.appendChild(trackElement);

		const setSliderAttributes = (input: HTMLInputElement): HTMLInputElement => {
			const { step, min, max } = this.args;

			input.type = 'range';
			input.step = step.toString();
			input.min = min.toString();
			input.max = max.toString();

			return input;
		};

		const setInputAttributes = (input: HTMLInputElement, range: MRSRange, from: 'start' | 'end'): HTMLInputElement => {
			switch (from) {
				case 'start':
					input.name = `${this.args.name}[${range.index}][start]`;
					input.setAttribute('start', '');
					if (range.startFixed) {
						input.setAttribute('fixed', '');
					}
					if (range.startConnected) {
						input.setAttribute('connected', '');
					}

					return input;
				case 'end':
					input.name = `${this.args.name}[${range.index}][end]`;
					input.setAttribute('end', '');
					if (range.endFixed) {
						input.setAttribute('fixed', '');
					}
					if (range.endConnected) {
						input.setAttribute('connected', '');
					}

					return input;
			}
		};

		const setRangeAttributes = (element: HTMLDivElement, range: MRSRange): HTMLDivElement => {
			element.setAttribute('range', '');

			return element;
		};

		this.ranges.forEach((range: MRSRange) => {
			let rangeStartInput: HTMLInputElement = document.createElement('input'),
				rangeEndInput: HTMLInputElement = document.createElement('input'),
				rangeElement: HTMLDivElement = document.createElement('div');

			rangeStartInput = setSliderAttributes(rangeStartInput);
			rangeEndInput = setSliderAttributes(rangeEndInput);

			rangeStartInput = setInputAttributes(rangeStartInput, range, 'start');
			rangeEndInput = setInputAttributes(rangeEndInput, range, 'end');

			rangeElement = setRangeAttributes(rangeElement, range);

			range.startInput = rangeStartInput;
			range.endInput = rangeEndInput;
			range.rangeElement = rangeElement;

			this.element.appendChild(range.startInput);
			this.element.appendChild(range.rangeElement);
			this.element.appendChild(range.endInput);

			range.updateRangeElement();
		});
	}

	private updateRangeElements() {
		this.ranges.forEach((range: MRSRange) => {
			range.updateRangeElement();
		});
	}
}