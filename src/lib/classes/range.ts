class MRSRange {
	private _args: MRSArgs;
	private _index: number;
	private _previousRange: MRSRange;
	private _start: number;
	private _startFixed: boolean;
	private _startConnected: boolean;
	private _startInput: HTMLInputElement;
	private _rangeElement: HTMLDivElement;
	private _nextRange: MRSRange;
	private _end: number;
	private _endFixed: boolean;
	private _endConnected: boolean;
	private _endInput: HTMLInputElement;
	private _minSize: number;
	private _allowContact: boolean;

	constructor(index: number, range: any) {
		this._index = index;
		this._start = range.start;
		this._startFixed = range.startFixed;
		this._startConnected = range.startConnected;
		this._end = range.end;
		this._endFixed = range.endFixed;
		this._endConnected = range.endConnected;
		this._minSize = range.minSize;
		this._allowContact = range.allowContact;
	}

	public get index(): number {
		return this._index;
	}

	public get previousRange(): MRSRange {
		return this._previousRange;
	}

	public set previousRange(previousRange: MRSRange) {
		this._previousRange = previousRange;
	}

	public get start(): number {
		return this._start;
	}

	public set start(start: number) {
		this._start = start;
	}

	public get startFixed(): boolean {
		return this._startFixed;
	}

	public set startFixed(startFixed: boolean) {
		this._startFixed = startFixed;
	}

	public get startConnected(): boolean {
		return this._startConnected;
	}

	public set startConnected(startConnected: boolean) {
		this._startConnected = startConnected;
	}

	public get startInput(): HTMLInputElement {
		return this._startInput;
	}

	public set startInput(startInput: HTMLInputElement) {
		startInput.setAttribute('value', this.start.toString());
		startInput.oninput = this.startInputChanged.bind(this);

		this._startInput = startInput;
	}

	public get rangeElement(): HTMLDivElement {
		return this._rangeElement;
	}

	public set rangeElement(rangeElement: HTMLDivElement) {
		this._rangeElement = rangeElement;
	}

	public get nextRange(): MRSRange {
		return this._nextRange;
	}

	public set nextRange(nextRange: MRSRange) {
		this._nextRange = nextRange;
	}

	public get end(): number {
		return this._end;
	}

	public set end(end: number) {
		this._end = end;
	}

	public get endFixed(): boolean {
		return this._endFixed;
	}

	public set endFixed(endFixed: boolean) {
		this._endFixed = endFixed;
	}

	public get endConnected(): boolean {
		return this._endConnected;
	}

	public set endConnected(endConnected: boolean) {
		this._endConnected = endConnected;
	}

	public get endInput(): HTMLInputElement {
		return this._endInput;
	}

	public set endInput(endInput: HTMLInputElement) {
		endInput.setAttribute('value', this.end.toString());
		endInput.oninput = this.endInputChanged.bind(this);

		this._endInput = endInput;
	}

	public get minSize(): number {
		return this._minSize;
	}

	public get allowContact(): boolean {
		return this._allowContact;
	}

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
		this.updateRangeElement();

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
		this.updateRangeElement();

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

	public updateRangeElement() {
		const sliderWidth: number = this.startInput.clientWidth,
			sliderSize: number = Number(this.startInput.max) - Number(this.startInput.min),
			startOffset: number = sliderWidth * (this.start - Number(this.startInput.min)) / sliderSize,
			rangeWidth: number = sliderWidth * this.size / sliderSize;

		this.rangeElement.style.left = `${startOffset.toString()}px`;
		this.rangeElement.style.width = `${rangeWidth.toString()}px`;
	}
}