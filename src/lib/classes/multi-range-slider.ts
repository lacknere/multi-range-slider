type MRS_Args = {
	name?: string;
	step?: number;
	min?: number;
	max?: number;
	autoMinMax?: boolean;
	fixToMin?: boolean;
	fixToMax?: boolean;
	allowContact?: boolean;
	ranges?: number | MRSRange[];
	connectRanges?: boolean;
	limitedSizeMode?: MRS_LimitedSizeMode;
};

enum MRS_LimitedSizeMode { extendSize, shrinkRanges, shrinkRangesProportionally }

class MRS {
	private _defaultArgs: MRS_Args = {
		name: 'multi-range-slider',
		step: 1,
		min: 0,
		max: 100,
		autoMinMax: false,
		fixToMin: false,
		fixToMax: false,
		allowContact: true,
		ranges: 1,
		connectRanges: false,
		limitedSizeMode: MRS_LimitedSizeMode.extendSize,
	};
	private _defaultRangeProps: any = {
		start: 0,
		startFixed: false,
		startConnectedTo: null,
		end: 100,
		endFixed: false,
		endConnectedTo: null,
		minSize: 1,
	};

	private _element: HTMLElement;
	private _args: MRS_Args;
	private _slider: MRSSlider;

	constructor(element: HTMLElement, args: any) {
		this._element = element;
		this._args = this.validateArgs({ ...this.defaultArgs, ...args });
		this._slider = new MRSSlider(this);
	}

	public get defaultArgs(): MRS_Args {
		return { ...this._defaultArgs };
	}

	public get defaultRangeProps(): any {
		return { ...this._defaultRangeProps };
	}

	public get element(): HTMLElement {
		return this._element;
	}

	public get args(): MRS_Args {
		return this._args;
	}

	private cleanArgs(args: any): MRS_Args {
		const defaultArgs: MRS_Args = this.defaultArgs,
			cleanedArgs: MRS_Args = {};

		const cleanDefaultType = (key: string, type: string) => {
			if (typeof args[key] === type) {
				cleanedArgs[key] = args[key];
			} else {
				cleanedArgs[key] = defaultArgs[key];
				MRS.logW(`Property "${key}" is not of type ${type}! Defaul value "${defaultArgs[key]}" is used instead.`);
			}
		};

		const cleanBoolean = (key: string) => {
			if (args[key] === true || args[key] === 1 || args[key] === 'true') {
				cleanedArgs[key] = true;
			} else if (args[key] === false || args[key] === 0 || args[key] === 'false') {
				cleanedArgs[key] = false;
			} else {
				cleanedArgs[key] = defaultArgs[key];
				MRS.logW(`Property "${key}" is not of type boolean! Defaul value "${defaultArgs[key]}" is used instead.`);
			}
		};

		const cleanAndCreateRanges = () => {
			let ranges: any = args.ranges;

			const validRange = (range: any): boolean => {
				return range.hasOwnProperty('start') && typeof range.start === 'number' && range.hasOwnProperty('end') && typeof range.end === 'number';
			};

			if (Array.isArray(ranges)) {
				// ranges is an array, check and create range objects
				const cleanedRanges: any[] = [];

				ranges.forEach((range: any, i: number) => {
					if (validRange(range)) {
						cleanedRanges.push(new MRSRange(i, { ...this.defaultRangeProps, ...range }));
					} else {
						MRS.logW(`Range on position ${i} is invalid and was removed!`);
					}
				});

				cleanedArgs.ranges = cleanedRanges.map((cleanedRange: any, i: number) => {
					return new MRSRange(i, cleanedRange);
				});
			} else if (typeof ranges === 'object') {
				// ranges is a single object, check and create array with range object
				if (validRange(ranges)) {
					cleanedArgs.ranges = [new MRSRange(0, { ...this.defaultRangeProps, ...ranges })];
				} else {
					cleanedArgs.ranges = 1;
					MRS.logW(`Range is invalid and was replaced by default range!`);
				}
			} else {
				if (typeof ranges !== 'number' || !Number.isInteger(ranges)) {
					ranges = defaultArgs.ranges;
					MRS.logW(`Property "ranges" is invalid! Defaul value "${defaultArgs.ranges}" is used instead.`);
				}

				cleanedArgs.ranges = ranges;
			}
		};

		const cleanLimitedSizeMode = () => {
			switch (args.limitedSizeMode) {
				case 'extendSize':
					cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.extendSize;
					break;
				case 'shrinkRanges':
					cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.shrinkRanges;
					break;
				case 'shrinkRangesProportionally':
					cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.shrinkRangesProportionally;
					break;
				case MRS_LimitedSizeMode.extendSize:
				case MRS_LimitedSizeMode.shrinkRanges:
				case MRS_LimitedSizeMode.shrinkRangesProportionally:
					cleanedArgs.limitedSizeMode = args.limitedSizeMode;
					break;
				default:
					cleanedArgs.limitedSizeMode = defaultArgs.limitedSizeMode;
					break;
			}
		};

		cleanDefaultType('name', 'string');
		cleanDefaultType('step', 'number');

		// need to validate step here and set it as default range min size
		// step has to be > 0
		cleanedArgs.step = cleanedArgs.step > 0 ? cleanedArgs.step : defaultArgs.step;
		this._defaultRangeProps.minSize = cleanedArgs.step;

		cleanDefaultType('min', 'number');
		cleanDefaultType('max', 'number');
		cleanBoolean('autoMinMax');
		cleanBoolean('fixToMin');
		cleanBoolean('fixToMax');
		cleanBoolean('allowContact');
		cleanAndCreateRanges();
		cleanBoolean('connectRanges');
		cleanLimitedSizeMode();

		return cleanedArgs;
	}

	private validateArgs(args: MRS_Args): MRS_Args {
		args = this.cleanArgs(args);
		const defaultArgs: MRS_Args = this.defaultArgs,
			validatedArgs: MRS_Args = {};

		const getMinRequiredSize = (rangesLength: number) => {
			return (rangesLength * validatedArgs.step) + (validatedArgs.allowContact ? 0 : ((rangesLength - 1) * validatedArgs.step));
		};

		// step has already been validated
		validatedArgs.step = args.step;

		// set min and max and change them later if needed
		validatedArgs.min = args.min;
		validatedArgs.max = args.max;

		// set bools and limitedSizeMode (autoMinMax = true forces extendSize)
		validatedArgs.autoMinMax = args.autoMinMax;
		validatedArgs.fixToMin = args.fixToMin;
		validatedArgs.fixToMax = args.fixToMax;
		validatedArgs.allowContact = args.allowContact;
		validatedArgs.connectRanges = args.connectRanges;
		validatedArgs.limitedSizeMode = validatedArgs.autoMinMax ? MRS_LimitedSizeMode.extendSize : args.limitedSizeMode;

		if (typeof args.ranges === 'number') {
			// ranges is still a number, so we still have to create ranges

			// calculate min required size
			// minimal size of range = step; if contact is not allowed, add a step between them
			const minRequiredSize: number = getMinRequiredSize(args.ranges);
			let givenSize: number;

			if (validatedArgs.autoMinMax) {
				// autoMinMax activated, so we set size to min required size
				validatedArgs.min = 0;
				validatedArgs.max = minRequiredSize;
			} else {
				// calculate given size
				givenSize = validatedArgs.max - validatedArgs.min;

				// given size has to be > min required size, otherwise adjust max
				if (minRequiredSize > givenSize) {
					validatedArgs.max = validatedArgs.min + minRequiredSize;
				}
			}

			// now (re)calculate the validated given size and create the ranges based on it
			givenSize = validatedArgs.max - validatedArgs.min;
			const ranges: MRSRange[] = [],
				rangeSize: number = (givenSize - (validatedArgs.allowContact ? 0 : ((args.ranges - 1) * validatedArgs.step))) / args.ranges,
				spaceBetweenRanges: number = validatedArgs.allowContact ? 0 : validatedArgs.step;
			let iPrevious: any;

			for (let i = 0; i < args.ranges; i++) {
				const rangeProps = this.defaultRangeProps;

				if (i === 0) {
					rangeProps.start = validatedArgs.min;
					rangeProps.startFixed = validatedArgs.fixToMin;
				} else {
					rangeProps.start = ranges[iPrevious].end + spaceBetweenRanges;
					rangeProps.startConnectedTo = validatedArgs.connectRanges ? iPrevious : null;
				}

				if (i === args.ranges - 1) {
					rangeProps.end = validatedArgs.max;
					rangeProps.endFixed = validatedArgs.fixToMax;
				} else {
					rangeProps.end = rangeProps.start + rangeSize;
					rangeProps.endConnectedTo = validatedArgs.connectRanges ? i + 1 : null;
				}

				ranges.push(new MRSRange(i, rangeProps));
				iPrevious = i;
			}

			validatedArgs.ranges = ranges;
		} else if (Array.isArray(args.ranges)) {
			// ranges is an array of ranges already, validate them

			// make sure start > previous range end, end > start and connect if connectRanges = true
			let previousRange: MRSRange;
			const spaceBetweenRanges: number = validatedArgs.allowContact ? 0 : validatedArgs.step;

			for (let i = 0; i < args.ranges.length; i++) {
				const range: MRSRange = args.ranges[i],
					minStart: number = previousRange ? previousRange.end + spaceBetweenRanges : null,
					firstRange: boolean = !previousRange,
					lastRange: boolean = i === args.ranges.length - 1;

				range.start = previousRange ? (range.start < minStart || validatedArgs.connectRanges ? minStart : range.start) : range.start;
				range.startFixed = validatedArgs.fixToMin && firstRange;
				range.startConnectedTo = validatedArgs.connectRanges && !firstRange ? previousRange.index : null;

				const minEnd: number = range.start + validatedArgs.step;

				range.end = range.end < minEnd ? minEnd : range.end;
				range.endFixed = validatedArgs.fixToMax && lastRange;
				range.endConnectedTo = validatedArgs.connectRanges && !lastRange ? i + 1 : null;

				previousRange = range;
			}

			validatedArgs.ranges = args.ranges;

			const extendSize = () => {
				validatedArgs.ranges = validatedArgs.ranges as MRSRange[];

				const firstRange: MRSRange = validatedArgs.ranges[0],
					lastRange: MRSRange = validatedArgs.ranges[validatedArgs.ranges.length - 1];

				validatedArgs.min = validatedArgs.autoMinMax || firstRange.start < validatedArgs.min ? firstRange.start : validatedArgs.min;
				validatedArgs.max = validatedArgs.autoMinMax || lastRange.end > validatedArgs.max ? lastRange.end : validatedArgs.max;
			};

			const shrinkRanges = () => {
				validatedArgs.ranges = validatedArgs.ranges as MRSRange[];

				const givenSize: number = validatedArgs.max - validatedArgs.min,
					minRequiredSize: number = getMinRequiredSize(validatedArgs.ranges.length);

				// check if it is even possible to shrink it to given size
				if (minRequiredSize > givenSize) {
					return false;
				}

				let firstRange: boolean = true,
					previousRangeEnd: number = validatedArgs.min,
					lastRange: boolean = true,
					previousRangeStart: number = validatedArgs.max,
					i: number = 0;

				while (i < validatedArgs.ranges.length) {
					const range: MRSRange = validatedArgs.ranges[i],
						shrinkBy: number = previousRangeEnd - range.start + (firstRange ? 0 : spaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					firstRange = false;
					previousRangeEnd = range.shrinkBy(shrinkBy, 'start');
					i++;
				}

				i = validatedArgs.ranges.length - 1;

				while (i >= 0) {
					const range: MRSRange = validatedArgs.ranges[i],
						shrinkBy: number = range.end - previousRangeStart + (lastRange ? 0 : spaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					lastRange = false;
					previousRangeStart = range.shrinkBy(shrinkBy, 'end');
					i--;
				}

				return true;
			};

			const shrinkRangesProportionally = () => {
				validatedArgs.ranges = validatedArgs.ranges as MRSRange[];

				const givenSize: number = validatedArgs.max - validatedArgs.min,
					minRequiredSize: number = getMinRequiredSize(validatedArgs.ranges.length);

				// check if it is even possible to shrink it to given size
				if (minRequiredSize > givenSize) {
					return false;
				}

				if (validatedArgs.ranges[0].start < validatedArgs.min) {
					const originalStart: number = validatedArgs.ranges[0].start,
						originalEnd: number = validatedArgs.ranges[validatedArgs.ranges.length - 1].end > validatedArgs.max ? validatedArgs.ranges[validatedArgs.ranges.length - 1].end : validatedArgs.max,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let firstRange: boolean = true,
						previousRangeOriginalEnd: number = originalStart,
						previousRangeNewEnd: number = validatedArgs.min,
						i: number = 0;

					while (i < validatedArgs.ranges.length) {
						const range: MRSRange = validatedArgs.ranges[i],
							originalSpaceBetweenRanges: number = range.start - previousRangeOriginalEnd;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / validatedArgs.step) * validatedArgs.step,
							newStart: number;

						newSpaceBetweenRanges = !firstRange && !validatedArgs.allowContact && newSpaceBetweenRanges < validatedArgs.step ? validatedArgs.step : newSpaceBetweenRanges;
						newStart = previousRangeNewEnd + newSpaceBetweenRanges;

						firstRange = false;
						previousRangeOriginalEnd = range.end;
						previousRangeNewEnd = range.shrinkProportionallyBy(sizeFactor, 'start', newStart, validatedArgs.max);
						i++;
					}
				} else if (validatedArgs.ranges[validatedArgs.ranges.length - 1].end > validatedArgs.max) {
					const originalStart: number = validatedArgs.min,
						originalEnd: number = validatedArgs.ranges[validatedArgs.ranges.length - 1].end,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let lastRange: boolean = true,
						previousRangeOriginalStart: number = originalEnd,
						previousRangeNewStart: number = validatedArgs.max,
						i: number = validatedArgs.ranges.length - 1;

					while (i >= 0) {
						const range: MRSRange = validatedArgs.ranges[i],
							originalSpaceBetweenRanges: number = previousRangeOriginalStart - range.end;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / validatedArgs.step) * validatedArgs.step,
							newEnd: number;

						newSpaceBetweenRanges = !lastRange && !validatedArgs.allowContact && newSpaceBetweenRanges < validatedArgs.step ? validatedArgs.step : newSpaceBetweenRanges;
						newEnd = previousRangeNewStart - newSpaceBetweenRanges;

						lastRange = false;
						previousRangeOriginalStart = range.start;
						previousRangeNewStart = range.shrinkProportionallyBy(sizeFactor, 'end', newEnd, validatedArgs.min);
						i--;
					}
				} else {
					return false;
				}

				return true;
			};

			if (validatedArgs.ranges.length > 0 && (validatedArgs.ranges[0].start < validatedArgs.min || validatedArgs.ranges[validatedArgs.ranges.length - 1].end > validatedArgs.max)) {
				switch (validatedArgs.limitedSizeMode) {
					case MRS_LimitedSizeMode.extendSize:
						extendSize();
						break;
					case MRS_LimitedSizeMode.shrinkRanges:
						// in case shrinking ranges is not possible, extend size instead
						if (!shrinkRanges()) {
							MRS.logW(`LimitedSizeMode.shrinkRanges is not possible with the given arguments. LimitedSizeMode.extendSize is used instead.`);
							extendSize();
						}
						break;
					case MRS_LimitedSizeMode.shrinkRangesProportionally:
						// in case shrinking ranges proportionally is not possible, extend size instead
						if (!shrinkRangesProportionally()) {
							MRS.logW(`LimitedSizeMode.shrinkRangesProportionally is not possible with the given arguments. LimitedSizeMode.extendSize is used instead.`);
							extendSize();
						}
						break;
				}
			}
		}

		if (validatedArgs.fixToMin) {
			validatedArgs.ranges[0].start = validatedArgs.min;
		}

		if (validatedArgs.fixToMax) {
			validatedArgs.ranges[(validatedArgs.ranges as MRSRange[]).length - 1].end = validatedArgs.max;
		}

		return validatedArgs;
	}

	static logO(object: any) {
		// tslint:disable-next-line:no-console
		console.log(object);
	}

	static logW(message: string) {
		// tslint:disable-next-line:no-console
		console.warn(message);
	}

	static logE(message: string) {
		// tslint:disable-next-line:no-console
		console.error(message);
	}
}