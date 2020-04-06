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

		if (this.args.labels.min !== '') {
			this.element.setAttribute('min-label', this.args.labels.min);
		}

		if (this.args.labels.max !== '') {
			this.element.setAttribute('max-label', this.args.labels.max);
		}

		switch (this.args.sizeTooltipMode) {
			case MRSTooltipMode.never:
				break;
			case MRSTooltipMode.always:
			case MRSTooltipMode.onHover:
				this.element.setAttribute('size-tooltip', '');
				break;
		}

		switch (this.args.startEndTooltipMode) {
			case MRSTooltipMode.never:
				break;
			case MRSTooltipMode.onHover:
				this.element.setAttribute('start-end-tooltip', '');
				break;
		}

		const trackContainer: HTMLDivElement = document.createElement('div'),
			trackElement: HTMLDivElement = document.createElement('div');

		trackContainer.setAttribute('track-container', '');
		trackElement.setAttribute('track', '');
		trackContainer.appendChild(trackElement);
		this.element.appendChild(trackContainer);

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

		const setRangeContainerAttributes = (element: HTMLDivElement) => {
			element.setAttribute('range-container', '');

			return element;
		};

		const setRangeSizeElementAttributes = (element: HTMLDivElement): HTMLDivElement => {
			element.setAttribute('range-size', '');
			switch (this.args.sizeTooltipMode) {
				case MRSTooltipMode.never:
					break;
				case MRSTooltipMode.always:
					element.setAttribute('size-tooltip-always', '');
					break;
				case MRSTooltipMode.onHover:
					element.setAttribute('size-tooltip-on-hover', '');
					break;
			}

			return element;
		};
		const setRangeStartEndElementAttributes = (element: HTMLDivElement): HTMLDivElement => {
			element.setAttribute('range', '');
			switch (this.args.startEndTooltipMode) {
				case MRSTooltipMode.never:
					break;
				case MRSTooltipMode.onHover:
					element.setAttribute('start-end-tooltip-on-hover', '');
					break;
			}

			return element;
		};

		this.ranges.forEach((range: MRSRange) => {
			let rangeStartInput: HTMLInputElement = document.createElement('input'),
				rangeEndInput: HTMLInputElement = document.createElement('input'),
				rangeContainer: HTMLDivElement = document.createElement('div'),
				rangeSizeElement: HTMLDivElement = document.createElement('div'),
				rangeStartEndElement: HTMLDivElement = document.createElement('div');

			rangeStartInput = setSliderAttributes(rangeStartInput);
			rangeEndInput = setSliderAttributes(rangeEndInput);

			rangeStartInput = setInputAttributes(rangeStartInput, range, 'start');
			rangeEndInput = setInputAttributes(rangeEndInput, range, 'end');

			rangeContainer = setRangeContainerAttributes(rangeContainer);
			rangeSizeElement = setRangeSizeElementAttributes(rangeSizeElement);
			rangeStartEndElement = setRangeStartEndElementAttributes(rangeStartEndElement);

			rangeContainer.appendChild(rangeSizeElement);
			rangeContainer.appendChild(rangeStartEndElement);

			range.startInput = rangeStartInput;
			range.endInput = rangeEndInput;

			range.rangeContainer = rangeContainer;
			range.rangeSizeElement = rangeSizeElement;
			range.rangeStartEndElement = rangeStartEndElement;

			this.element.appendChild(range.startInput);
			this.element.appendChild(range.endInput);
			this.element.appendChild(rangeContainer);

			range.updateRangeElement();
		});
	}

	private updateRangeElements() {
		this.ranges.forEach((range: MRSRange) => {
			range.updateRangeElement();
		});
	}
}