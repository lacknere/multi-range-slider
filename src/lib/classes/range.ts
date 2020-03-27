class MRSRange {
	private _args: MRS_Args;
	private _index: number;
	private _start: number;
	private _startFixed: boolean;
	private _startConnectedTo: number;
	private _end: number;
	private _endFixed: boolean;
	private _endConnectedTo: number;
	private _minSize: number;

	constructor(index: number, range: any) {
		this._index = index;
		this._start = range.start;
		this._startFixed = range.startFixed;
		this._startConnectedTo = range.startConnectedTo;
		this._end = range.end;
		this._endFixed = range.endFixed;
		this._endConnectedTo = range.endConnectedTo;
		this._minSize = range.minSize;
	}

	public get index(): number {
		return this._index;
	}

	public get start(): number {
		return this._start;
	}

	public set start(start: number) {
		this._start = start;
	}

	public set startFixed(startFixed: boolean) {
		this._startFixed = startFixed;
	}

	public set startConnectedTo(startConnectedTo: number) {
		this._startConnectedTo = startConnectedTo;
	}

	public get end(): number {
		return this._end;
	}

	public set end(end: number) {
		this._end = end;
	}

	public set endFixed(endFixed: boolean) {
		this._endFixed = endFixed;
	}

	public set endConnectedTo(endConnectedTo: number) {
		this._endConnectedTo = endConnectedTo;
	}

	public get minSize(): number {
		return this._minSize;
	}

	public get size(): number {
		return this.end - this.start;
	}

	public get isShrinkable(): boolean {
		return this.size > this._minSize;
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
}