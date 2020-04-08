type MRSRangeArgs = {
	key: any;
	start: number;
	startFixed: boolean;
	startConnected: boolean;
	end: number;
	endFixed: boolean;
	endConnected: boolean;
	minSize: number;
	allowContact: boolean;
	color: string;
	textColor: string;
	size?: number;
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
	textColor?: HTMLInputElement;
};

class MRSRange {
	private _index: number;
	private _args: MRSRangeArgs;
	private _slider: MRSSlider;
	private _elements: MRSRangeElements = {};
	private _previousRange: MRSRange;
	private _nextRange: MRSRange;

	constructor(index: number, args: MRSRangeArgs) {
		this._index = index;
		this._args = args;
		this._args.size = this.size;
	}

	public get index(): number {
		return this._index;
	}

	public static get requiredArgs(): string[] {
		return [
			'start',
			'end'
		];
	}

	// args getters/setters

	public get args(): MRSRangeArgs {
		return this._args;
	}

	public get hiddenPostDataKeys(): string[] {
		return [
			'startFixed',
			'startConnected',
			'endFixed',
			'endConnected',
			'minSize',
			'size',
			'allowContact',
			'color',
			'textColor'
		];
	}

	public get key(): any {
		return this._args.key ? this._args.key : this.index;
	}

	public get start(): number {
		return this._args.start;
	}

	public set start(start: number) {
		this._args.start = start;
	}

	public get startFixed(): boolean {
		return this._args.startFixed;
	}

	public set startFixed(startFixed: boolean) {
		this._args.startFixed = startFixed;
	}

	public get startConnected(): boolean {
		return this._args.startConnected;
	}

	public set startConnected(startConnected: boolean) {
		this._args.startConnected = startConnected;
	}

	public get end(): number {
		return this._args.end;
	}

	public set end(end: number) {
		this._args.end = end;
	}

	public get endFixed(): boolean {
		return this._args.endFixed;
	}

	public set endFixed(endFixed: boolean) {
		this._args.endFixed = endFixed;
	}

	public get endConnected(): boolean {
		return this._args.endConnected;
	}

	public set endConnected(endConnected: boolean) {
		this._args.endConnected = endConnected;
	}

	public get minSize(): number {
		return this._args.minSize;
	}

	public get allowContact(): boolean {
		return this._args.allowContact;
	}

	public get color(): string {
		return this._args.color;
	}

	public get textColor(): string {
		return this._args.textColor;
	}

	// slider getters/setter

	public set slider(slider: MRSSlider) {
		this._slider = slider;
	}

	public get sliderElement(): HTMLElement {
		return this._slider.element;
	}

	public get sliderArgs(): MRSArgs {
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

	public get textColorInput(): HTMLInputElement {
		return this._elements.textColor;
	}

	public set textColorInput(textColorInput: HTMLInputElement) {
		this._elements.textColor = textColorInput;
	}

	// additional getters/setters

	public get size(): number {
		return this.end - this.start;
	}

	private getMinimalSpaceBetweenRanges(compareRange: MRSRange): number {
		return compareRange.allowContact && this.allowContact ? 0 : this.sliderArgs.step;
	}

	private isNewStartAllowed(newStart: number): boolean {
		return !((this.previousRange && newStart < (this.previousRange.end + this.getMinimalSpaceBetweenRanges(this.previousRange))) || (this.end - newStart) < this.minSize);
	}

	private isNewEndAllowed(newEnd): boolean {
		return !((this.nextRange && (newEnd + this.getMinimalSpaceBetweenRanges(this.nextRange)) > this.nextRange.start) || (newEnd - this.start) < this.minSize);
	}

	private get startVisuallyConnected(): boolean {
		return this.previousRange && this.previousRange.end === this.start;
	}

	private get endVisuallyConnected(): boolean {
		return this.nextRange && this.nextRange.start === this.end;
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

	// start/end changed listeners

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

	// functions

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
			const { step, min, max, postData } = this.sliderArgs;

			input.type = 'range';
			input.step = step.toString();
			input.min = min.toString();
			input.max = max.toString();

			switch (from) {
				case 'start':
					if (postData.includes('start')) {
						input.name = `${this.sliderArgs.name}[${this.key}][start]`;
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
						input.name = `${this.sliderArgs.name}[${this.key}][end]`;
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
			switch (this.sliderArgs.sizeTooltipMode) {
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
			if (this.textColor) {
				element.style.color = this.textColor;
			}

			return element;
		};

		const setStartEndHolderElementAttributes = (element: HTMLDivElement): HTMLDivElement => {
			element.setAttribute('range', '');
			switch (this.sliderArgs.startEndTooltipMode) {
				case MRSTooltipMode.never:
					break;
				case MRSTooltipMode.always:
					element.setAttribute('start-end-tooltip-always', '');
					break;
				case MRSTooltipMode.onHover:
					element.setAttribute('start-end-tooltip-on-hover', '');
					break;
			}
			if (this.color) {
				element.style.backgroundColor = this.color;
			}
			if (this.textColor) {
				element.style.color = this.textColor;
			}

			return element;
		};

		const createHiddenPostDataInput = (postDataKey: string): HTMLInputElement => {
			const input: HTMLInputElement = document.createElement('input');

			input.type = 'hidden';
			input.name = `${this.sliderArgs.name}[${this.key}][${postDataKey}]`;

			return input;
		};

		this.startInput = setStartEndInputAttributes(document.createElement('input'), 'start');
		this.endInput = setStartEndInputAttributes(document.createElement('input'), 'end');
		this.containerElement = setContainerElementAttributes(document.createElement('div'));
		this.sizeHolderElement = setSizeHolderElementAttributes(document.createElement('div'));
		this.startEndHolderElement = setStartEndHolderElementAttributes(document.createElement('div'));

		this.containerElement.appendChild(this.sizeHolderElement);
		this.containerElement.appendChild(this.startEndHolderElement);

		const hiddenPostDataKeys: string[] = this.hiddenPostDataKeys;
		this.sliderArgs.postData.forEach((postDataKey: string) => {
			if (hiddenPostDataKeys.includes(postDataKey) && this[postDataKey] !== undefined) {
				this[`${postDataKey}Input`] = createHiddenPostDataInput(postDataKey);
				this.containerElement.appendChild(this[`${postDataKey}Input`]);
			}
		});

		this.sliderElement.appendChild(this.startInput);
		this.sliderElement.appendChild(this.endInput);
		this.sliderElement.appendChild(this.containerElement);

		this.updateRangeElements();
	}

	public updateRangeElements(elements: string[] = Object.getOwnPropertyNames(this.elements)) {
		elements.forEach((elementKey: string) => {
			if (elementKey === 'container') {
				const sliderWidth: number = this.startInput.clientWidth,
					sliderSize: number = Number(this.startInput.max) - Number(this.startInput.min),
					startOffset: number = sliderWidth * (this.start - Number(this.startInput.min)) / sliderSize,
					rangeWidth: number = sliderWidth * this.size / sliderSize;

				this.containerElement.style.left = `${startOffset.toString()}px`;
				this.containerElement.style.width = `${rangeWidth.toString()}px`;
			} else if (elementKey === 'sizeHolder') {
				this.sizeHolderElement.setAttribute('size', this.size.toString());
			} else if (elementKey === 'startEndHolder') {
				this.startEndHolderElement.setAttribute('start', this.start.toString());
				this.startEndHolderElement.setAttribute('end', this.end.toString());
			} else if (elementKey === 'start') {
				if (this.startInput) {
					if (this.startVisuallyConnected && !this.startInput.hasAttribute('connected')) {
						this.startInput.setAttribute('connected', '');
						this.previousRange.updateRangeElements(['end']);
					} else if (!this.startVisuallyConnected && this.startInput.hasAttribute('connected')) {
						this.startInput.removeAttribute('connected');
						this.previousRange.updateRangeElements(['end']);
					}
				}
			} else if (elementKey === 'end') {
				if (this.endInput) {
					if (this.endVisuallyConnected && !this.endInput.hasAttribute('connected')) {
						this.endInput.setAttribute('connected', '');
						this.nextRange.updateRangeElements(['start']);
					} else if (!this.endVisuallyConnected && this.endInput.hasAttribute('connected')) {
						this.endInput.removeAttribute('connected');
						this.nextRange.updateRangeElements(['start']);
					}
				}
			} else {
				(this[`${elementKey}Input`] as HTMLInputElement).value = this[elementKey].toString();
			}
		});
	}
}