class MRSSlider {
	private _mrs: MRS;

	constructor(mrs: MRS) {
		mrs.args.thumbWidth = parseFloat(getComputedStyle(document.body).getPropertyValue('--input-range-thumb-width'));
		this._mrs = mrs;
		this.buildHTML();

		// set resize listener to update range elements
		window.onresize = this.updateRangeElements.bind(this);
	}

	public get element(): HTMLElement {
		return this._mrs.element;
	}

	public get args(): MRSArgs {
		return this._mrs.args;
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
			case MRSTooltipMode.always:
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

		this.ranges.forEach((range: MRSRange) => {
			range.slider = this;
			range.buildHTML();
		});
	}

	private updateRangeElements() {
		this.ranges.forEach((range: MRSRange) => {
			range.updateRangeElements();
		});
	}
}