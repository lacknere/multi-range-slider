type MRSRangeData = {
	key: any;
	start: number;
	startFixed: boolean;
	startConnected: boolean;
	end: number;
	endFixed: boolean;
	endConnected: boolean;
	minSize: number;
	size: number;
	allowContact: boolean;
	color: string;
};

type MRSRangeElements = {
	container?: HTMLDivElement;
	sizeHolder?: HTMLDivElement;
	startEndHolder?: HTMLDivElement;
	start?: HTMLInputElement;
	startFixed?: HTMLInputElement;
	startConnected?: HTMLInputElement;
	end?: HTMLInputElement;
	endFixed?: HTMLInputElement;
	endConnected?: HTMLInputElement;
	minSize?: HTMLInputElement;
	size?: HTMLInputElement;
	allowContact?: HTMLInputElement;
	color?: HTMLInputElement;
};

class MRSRange {
	private _index: number;
	private _data: MRSRangeData;
	private _slider: MRSSlider;
	private _elements: MRSRangeElements = {};
	private _previousRange: MRSRange;
	private _nextRange: MRSRange;

	constructor(index: number, data: any) {
		this._index = index;
		this._data = data;
		this._data.size = this.size;
	}

	public get index(): number {
		return this._index;
	}

	// data getters/setters
	public get data(): MRSRangeData {
		return this._data;
	}

	public get hiddenDataKeys(): string[] {
		return [
			'startFixed',
			'startConnected',
			'endFixed',
			'endConnected',
			'minSize',
			'size',
			'allowContact',
			'color'
		];
	}

	public get key(): any {
		return this._data.key ? this._data.key : this.index;
	}

	public get start(): number {
		return this._data.start;
	}

	public set start(start: number) {
		this._data.start = start;
	}

	public get startFixed(): boolean {
		return this._data.startFixed;
	}

	public set startFixed(startFixed: boolean) {
		this._data.startFixed = startFixed;
	}

	public get startConnected(): boolean {
		return this._data.startConnected;
	}

	public set startConnected(startConnected: boolean) {
		this._data.startConnected = startConnected;
	}

	public get end(): number {
		return this._data.end;
	}

	public set end(end: number) {
		this._data.end = end;
	}

	public get endFixed(): boolean {
		return this._data.endFixed;
	}

	public set endFixed(endFixed: boolean) {
		this._data.endFixed = endFixed;
	}

	public get endConnected(): boolean {
		return this._data.endConnected;
	}

	public set endConnected(endConnected: boolean) {
		this._data.endConnected = endConnected;
	}

	public get minSize(): number {
		return this._data.minSize;
	}

	public get allowContact(): boolean {
		return this._data.allowContact;
	}

	public get color(): string {
		return this._data.color;
	}

	// slider getters/setter
	public set slider(slider: MRSSlider) {
		this._slider = slider;
	}

	public get element(): HTMLElement {
		return this._slider.element;
	}

	public get args(): MRSArgs {
		return this._slider.args;
	}

	// neighbor range getters/setters
	public get previousRange(): MRSRange {
		return this._previousRange;
	}

	public set previousRange(previousRange: MRSRange) {
		this._previousRange = previousRange;
	}

	public get nextRange(): MRSRange {
		return this._nextRange;
	}

	public set nextRange(nextRange: MRSRange) {
		this._nextRange = nextRange;
	}

	// HTML element getters/setters
	public get elements(): MRSRangeElements {
		return this._elements;
	}

	public get containerElement(): HTMLDivElement {
		return this._elements.container;
	}

	public set containerElement(containerElement: HTMLDivElement) {
		this._elements.container = containerElement;
	}

	public get sizeHolderElement(): HTMLDivElement {
		return this._elements.sizeHolder;
	}

	public set sizeHolderElement(sizeHolderElement: HTMLDivElement) {
		this._elements.sizeHolder = sizeHolderElement;
	}

	public get startEndHolderElement(): HTMLDivElement {
		return this._elements.startEndHolder;
	}

	public set startEndHolderElement(startEndHolderElement: HTMLDivElement) {
		this._elements.startEndHolder = startEndHolderElement;
	}

	public get startInput(): HTMLInputElement {
		return this._elements.start;
	}

	public set startInput(startInput: HTMLInputElement) {
		startInput.setAttribute('value', this.start.toString());
		startInput.oninput = this.startInputChanged.bind(this);

		this._elements.start = startInput;
	}

	public get startFixedInput(): HTMLInputElement {
		return this._elements.startFixed;
	}

	public set startFixedInput(startFixedInput: HTMLInputElement) {
		this._elements.startFixed = startFixedInput;
	}

	public get startConnectedInput(): HTMLInputElement {
		return this._elements.startConnected;
	}

	public set startConnectedInput(startConnectedInput: HTMLInputElement) {
		this._elements.startConnected = startConnectedInput;
	}

	public get endInput(): HTMLInputElement {
		return this._elements.end;
	}

	public set endInput(endInput: HTMLInputElement) {
		endInput.setAttribute('value', this.end.toString());
		endInput.oninput = this.endInputChanged.bind(this);

		this._elements.end = endInput;
	}

	public get endFixedInput(): HTMLInputElement {
		return this._elements.endFixed;
	}

	public set endFixedInput(endFixedInput: HTMLInputElement) {
		this._elements.endFixed = endFixedInput;
	}

	public get endConnectedInput(): HTMLInputElement {
		return this._elements.endConnected;
	}

	public set endConnectedInput(endConnectedInput: HTMLInputElement) {
		this._elements.endConnected = endConnectedInput;
	}

	public get minSizeInput(): HTMLInputElement {
		return this._elements.minSize;
	}

	public set minSizeInput(minSizeInput: HTMLInputElement) {
		this._elements.minSize = minSizeInput;
	}

	public get sizeInput(): HTMLInputElement {
		return this._elements.size;
	}

	public set sizeInput(sizeInput: HTMLInputElement) {
		this._elements.size = sizeInput;
	}

	public get allowContactInput(): HTMLInputElement {
		return this._elements.allowContact;
	}

	public set allowContactInput(allowContactInput: HTMLInputElement) {
		this._elements.allowContact = allowContactInput;
	}

	public get colorInput(): HTMLInputElement {
		return this._elements.color;
	}

	public set colorInput(colorInput: HTMLInputElement) {
		this._elements.color = colorInput;
	}

	// additional getters/setters
	public get size(): number {
		return this.end - this.start;
	}

	private get minimalSpaceBetweenRanges(): number {
		return this.allowContact ? 0 : this.minSize;
	}

	private isNewStartAllowed(newStart: number): boolean {
		return !((this.previousRange && newStart < (this.previousRange.end + this.minimalSpaceBetweenRanges)) || (this.end - newStart) < this.minSize);
	}

	private isNewEndAllowed(newEnd): boolean {
		return !((this.nextRange && (newEnd + this.minimalSpaceBetweenRanges) > this.nextRange.start) || (newEnd - this.start) < this.minSize);
	}

	// shrink range by value, reposition it and return new range start/end
	public shrinkBy(value: number, from: 'start' | 'end'): number {
		const maxShrink: number = this.size - this.minSize,
			shrinkBy: number = value > maxShrink ? maxShrink : value,
			leftover: number = value - shrinkBy;

		switch (from) {
			case 'start':
				this.start += value;
				this.end += leftover;
				return this.end;
			case 'end':
				this.start -= leftover;
				this.end -= value;
				return this.start;
		}
	}

	// shrink range proportionally by factor, reposition it and return new range start/end
	public shrinkProportionallyBy(factor: number, from: 'start' | 'end', newFrom: number, maxTo: number): number {
		const originalSize: number = this.size;
		let shrinkSize: number = Math.round((originalSize * factor) / this.minSize) * this.minSize;

		shrinkSize = shrinkSize > this.minSize ? shrinkSize : this.minSize;

		switch (from) {
			case 'start':
				this.start = newFrom;
				this.end = (this.start + shrinkSize) > maxTo ? maxTo : (this.start + shrinkSize);
				return this.end;
			case 'end':
				this.end = newFrom;
				this.start = (this.end - shrinkSize) < maxTo ? maxTo : (this.end - shrinkSize);
				return this.start;
		}
	}

	private startInputChanged(event: Event, by?: number) {
		const startInput: number = by ? this.start + by : Number(this.startInput.value),
			movesBy: number = startInput - this.start;
		let setNewStart: boolean = false;

		if (!this.startFixed) {
			if (this.startConnected && event && movesBy < 0) {
				setNewStart = this.previousRange.moveRange('end', movesBy) && this.isNewStartAllowed(startInput);
			} else if (this.startConnected && event && movesBy > 0) {
				setNewStart = this.isNewStartAllowed(startInput);
				this.start = setNewStart ? startInput : this.start;
				setNewStart = setNewStart && this.previousRange.moveRange('end', movesBy);
			} else {
				setNewStart = this.isNewStartAllowed(startInput);
			}
		}

		this.start = setNewStart ? startInput : this.start;
		this.startInput.value = this.start.toString();
		this.updateRangeElements();

		return setNewStart;
	}

	private endInputChanged(event: Event, by?: number): boolean {
		const endInput: number = by ? this.end + by : Number(this.endInput.value),
			movesBy: number = endInput - this.end;
		let setNewEnd: boolean;

		if (!this.endFixed) {
			if (this.endConnected && event && movesBy > 0) {
				setNewEnd = this.nextRange.moveRange('start', movesBy) && this.isNewEndAllowed(endInput);
			} else if (this.endConnected && event && movesBy < 0) {
				setNewEnd = this.isNewEndAllowed(endInput);
				this.end = setNewEnd ? endInput : this.end;
				setNewEnd = setNewEnd && this.nextRange.moveRange('start', movesBy);
			} else {
				setNewEnd = this.isNewEndAllowed(endInput);
			}
		}

		this.end = setNewEnd ? endInput : this.end;
		this.endInput.value = this.end.toString();
		this.updateRangeElements();

		return setNewEnd;
	}

	public moveRange(from: 'start' | 'end', by: number): boolean {
		switch (from) {
			case 'start':
				return this.startInputChanged(null, by);
			case 'end':
				return this.endInputChanged(null, by);
		}
	}

	public buildHTML() {
		const setStartEndInputAttributes = (input: HTMLInputElement, from: 'start' | 'end'): HTMLInputElement => {
			const { step, min, max, postData } = this.args;

			input.type = 'range';
			input.step = step.toString();
			input.min = min.toString();
			input.max = max.toString();

			switch (from) {
				case 'start':
					if (postData.includes('start')) {
						input.name = `${this.args.name}[${this.key}][start]`;
					}
					input.setAttribute('start', '');
					if (this.startFixed) {
						input.setAttribute('fixed', '');
					}
					if (this.startConnected) {
						input.setAttribute('connected', '');
					}

					return input;
				case 'end':
					if (postData.includes('end')) {
						input.name = `${this.args.name}[${this.key}][end]`;
					}
					input.setAttribute('end', '');
					if (this.endFixed) {
						input.setAttribute('fixed', '');
					}
					if (this.endConnected) {
						input.setAttribute('connected', '');
					}

					return input;
			}
		};

		const setContainerElementAttributes = (element: HTMLDivElement) => {
			element.setAttribute('range-container', '');

			return element;
		};

		const setSizeHolderElementAttributes = (element: HTMLDivElement): HTMLDivElement => {
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
			if (this.color) {
				element.style.backgroundColor = this.color;
			}

			return element;
		};

		const setStartEndHolderElementAttributes = (element: HTMLDivElement): HTMLDivElement => {
			element.setAttribute('range', '');
			switch (this.args.startEndTooltipMode) {
				case MRSTooltipMode.never:
					break;
				case MRSTooltipMode.onHover:
					element.setAttribute('start-end-tooltip-on-hover', '');
					break;
			}
			if (this.color) {
				element.style.backgroundColor = this.color;
			}

			return element;
		};

		const createHiddenPostDataInput = (dataKey: string): HTMLInputElement => {
			const input: HTMLInputElement = document.createElement('input');

			input.type = 'hidden';
			input.name = `${this.args.name}[${this.key}][${dataKey}]`;

			return input;
		};

		this.startInput = setStartEndInputAttributes(document.createElement('input'), 'start');
		this.endInput = setStartEndInputAttributes(document.createElement('input'), 'end');
		this.containerElement = setContainerElementAttributes(document.createElement('div'));
		this.sizeHolderElement = setSizeHolderElementAttributes(document.createElement('div'));
		this.startEndHolderElement = setStartEndHolderElementAttributes(document.createElement('div'));

		this.containerElement.appendChild(this.sizeHolderElement);
		this.containerElement.appendChild(this.startEndHolderElement);

		const hiddenDataKeys: string[] = this.hiddenDataKeys;
		this.args.postData.forEach((dataKey: string) => {
			if (hiddenDataKeys.includes(dataKey) && this[dataKey] !== undefined) {
				this[`${dataKey}Input`] = createHiddenPostDataInput(dataKey);
				this.containerElement.appendChild(this[`${dataKey}Input`]);
			}
		});

		this.element.appendChild(this.startInput);
		this.element.appendChild(this.endInput);
		this.element.appendChild(this.containerElement);

		this.updateRangeElements();
	}

	public updateRangeElements() {
		const sliderWidth: number = this.startInput.clientWidth,
			sliderSize: number = Number(this.startInput.max) - Number(this.startInput.min),
			startOffset: number = sliderWidth * (this.start - Number(this.startInput.min)) / sliderSize,
			rangeWidth: number = sliderWidth * this.size / sliderSize;

		Object.getOwnPropertyNames(this.elements).forEach((elementKey: string) => {
			if (elementKey === 'container') {
				this.containerElement.style.left = `${startOffset.toString()}px`;
				this.containerElement.style.width = `${rangeWidth.toString()}px`;
			} else if (elementKey === 'sizeHolder') {
				this.sizeHolderElement.setAttribute('size', this.size.toString());
			} else if (elementKey === 'startEndHolder') {
				this.startEndHolderElement.setAttribute('start', this.start.toString());
				this.startEndHolderElement.setAttribute('end', this.end.toString());
			} else if (elementKey !== 'start' && elementKey !== 'end') {
				(this[`${elementKey}Input`] as HTMLInputElement).value = this[elementKey].toString();
			}
		});
	}
}