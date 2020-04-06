type MRSArgs = {
	labels?: MRSLabels;
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
	limitedSizeMode?: MRSLimitedSizeMode;
	sizeTooltipMode?: MRSTooltipMode;
	startEndTooltipMode?: MRSTooltipMode;
};

type MRSLabels = {
	min?: string;
	max?: string;
};

enum MRSLimitedSizeMode { extendSize, shrinkRanges, shrinkRangesProportionally }
enum MRSTooltipMode { never, always, onHover }

class MRS {
	private _defaultArgs: MRSArgs = {
		labels: { min: '#min#', max: '#max#' },
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
		limitedSizeMode: MRSLimitedSizeMode.extendSize,
		sizeTooltipMode: MRSTooltipMode.onHover,
		startEndTooltipMode: MRSTooltipMode.onHover,
	};
	private _defaultRangeArgs: any = {
		start: 0,
		startFixed: false,
		startConnected: false,
		end: 100,
		endFixed: false,
		endConnected: false,
		minSize: 1,
		allowContact: true,
	};

	private _element: HTMLElement;
	private _args: MRSArgs;
	private _slider: MRSSlider;

	constructor(element: HTMLElement, args: any) {
		this._element = element;
		this._args = this.validateArgs({ ...this.defaultArgs, ...args });
		this._slider = new MRSSlider(this);
	}

	private get defaultArgs(): MRSArgs {
		return { ...this._defaultArgs };
	}

	private get defaultRangeArgs(): any {
		return { ...this._defaultRangeArgs };
	}

	public get element(): HTMLElement {
		return this._element;
	}

	public get args(): MRSArgs {
		return this._args;
	}

	private cleanArgs(args: any): MRSArgs {
		const defaultArgs: MRSArgs = this.defaultArgs,
			cleanedArgs: MRSArgs = {};

		const getNestedArg = (rootArgs: any, key: string): any => {
			const splitKeys: string[] = key.split('.');

			if (splitKeys.length === 1) {
				return rootArgs[key];
			}

			let arg: any = rootArgs[splitKeys[0]];

			splitKeys.shift();
			splitKeys.forEach((splitKey: string) => {
				arg = arg[splitKey];
			});

			return arg;
		};

		const setNestedArg = (rootArgs: any, key: string, value: any) => {
			let schema: any = rootArgs;  // a moving reference to internal args within rootArgs
			const splitKeys: string[] = key.split('.'),
				keysLength: number = splitKeys.length;

			for (let i = 0; i < keysLength - 1; i++) {
				const argKey = splitKeys[i];

				if (!schema[argKey]) {
					schema[argKey] = {};
				}
				schema = schema[argKey];
			}

			schema[splitKeys[keysLength - 1]] = value;
		};

		const cleanDefaultType = (key: string, type: string) => {
			const arg: any = getNestedArg(args, key),
				defaultArg: any = getNestedArg(defaultArgs, key);

			if (typeof arg === type) {
				setNestedArg(cleanedArgs, key, arg);
			} else {
				setNestedArg(cleanedArgs, key, defaultArg);
				MRS.logW(`Property "${key}" is not of type ${type}! Default value "${defaultArg}" is used instead.`);
			}
		};

		const cleanBoolean = (key: string) => {
			if (args[key] === true || args[key] === 1 || args[key] === 'true') {
				cleanedArgs[key] = true;
			} else if (args[key] === false || args[key] === 0 || args[key] === 'false') {
				cleanedArgs[key] = false;
			} else {
				cleanedArgs[key] = defaultArgs[key];
				MRS.logW(`Property "${key}" is not of type boolean! Default value "${defaultArgs[key]}" is used instead.`);
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
						cleanedRanges.push(new MRSRange(i, { ...this.defaultRangeArgs, ...range }));
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
					cleanedArgs.ranges = [new MRSRange(0, { ...this.defaultRangeArgs, ...ranges })];
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
					cleanedArgs.limitedSizeMode = MRSLimitedSizeMode.extendSize;
					break;
				case 'shrinkRanges':
					cleanedArgs.limitedSizeMode = MRSLimitedSizeMode.shrinkRanges;
					break;
				case 'shrinkRangesProportionally':
					cleanedArgs.limitedSizeMode = MRSLimitedSizeMode.shrinkRangesProportionally;
					break;
				case MRSLimitedSizeMode.extendSize:
				case MRSLimitedSizeMode.shrinkRanges:
				case MRSLimitedSizeMode.shrinkRangesProportionally:
					cleanedArgs.limitedSizeMode = args.limitedSizeMode;
					break;
				default:
					cleanedArgs.limitedSizeMode = defaultArgs.limitedSizeMode;
					break;
			}
		};

		const cleanSizeTooltipMode = () => {
			switch (args.sizeTooltipMode) {
				case 'never':
					cleanedArgs.sizeTooltipMode = MRSTooltipMode.never;
					break;
				case 'always':
					cleanedArgs.sizeTooltipMode = MRSTooltipMode.always;
					break;
				case 'onHover':
					cleanedArgs.sizeTooltipMode = MRSTooltipMode.onHover;
					break;
				case MRSTooltipMode.never:
				case MRSTooltipMode.always:
				case MRSTooltipMode.onHover:
					cleanedArgs.sizeTooltipMode = args.sizeTooltipMode;
					break;
				default:
					cleanedArgs.sizeTooltipMode = defaultArgs.sizeTooltipMode;
					break;
			}
		};

		const cleanStartEndTooltipMode = () => {
			switch (args.startEndTooltipMode) {
				case 'never':
					cleanedArgs.startEndTooltipMode = MRSTooltipMode.never;
					break;
				case 'always':
				case MRSTooltipMode.always:
				case 'onHover':
					cleanedArgs.startEndTooltipMode = MRSTooltipMode.onHover;
					break;
				case MRSTooltipMode.never:
				case MRSTooltipMode.onHover:
					cleanedArgs.startEndTooltipMode = args.startEndTooltipMode;
					break;
				default:
					cleanedArgs.startEndTooltipMode = defaultArgs.startEndTooltipMode;
					break;
			}
		};

		// need to merge default labels into args before cleaning because it is a nested object
		args.labels = { ...defaultArgs.labels, ...args.labels };
		cleanDefaultType('labels.min', 'string');
		cleanDefaultType('labels.max', 'string');
		cleanDefaultType('name', 'string');
		cleanDefaultType('step', 'number');

		// need to validate step here and set it as default range min size
		// step has to be > 0
		cleanedArgs.step = cleanedArgs.step > 0 ? cleanedArgs.step : defaultArgs.step;
		this._defaultRangeArgs.minSize = cleanedArgs.step;

		cleanDefaultType('min', 'number');
		cleanDefaultType('max', 'number');
		cleanBoolean('autoMinMax');
		cleanBoolean('fixToMin');
		cleanBoolean('fixToMax');
		cleanBoolean('allowContact');

		// set default range allow contact
		this._defaultRangeArgs.allowContact = cleanedArgs.allowContact;

		cleanAndCreateRanges();
		cleanBoolean('connectRanges');
		cleanLimitedSizeMode();
		cleanSizeTooltipMode();
		cleanStartEndTooltipMode();

		return cleanedArgs;
	}

	private validateArgs(args: MRSArgs): MRSArgs {
		args = this.cleanArgs(args);
		const validatedArgs: MRSArgs = {};

		const getMinRequiredSize = (rangesLength: number) => {
			return (rangesLength * validatedArgs.step) + (validatedArgs.allowContact ? 0 : ((rangesLength - 1) * validatedArgs.step));
		};

		const firstRange = (): MRSRange => validatedArgs.ranges[0];
		const lastRange = (): MRSRange => validatedArgs.ranges[(validatedArgs.ranges as MRSRange[]).length - 1];

		// set name
		validatedArgs.name = args.name;

		// step has already been validated
		validatedArgs.step = args.step;

		// set min and max and change them later if needed
		validatedArgs.min = args.min;
		validatedArgs.max = args.max;

		// set bools
		validatedArgs.autoMinMax = args.autoMinMax;
		validatedArgs.fixToMin = args.fixToMin;
		validatedArgs.fixToMax = args.fixToMax;
		validatedArgs.allowContact = args.allowContact;
		validatedArgs.connectRanges = args.connectRanges;

		// set limitedSizeMode (autoMinMax = true forces extendSize)
		validatedArgs.limitedSizeMode = validatedArgs.autoMinMax ? MRSLimitedSizeMode.extendSize : args.limitedSizeMode;

		// set sizeTooltipMode and startEndTooltipMode
		validatedArgs.sizeTooltipMode = args.sizeTooltipMode;
		validatedArgs.startEndTooltipMode = args.startEndTooltipMode;

		if (typeof args.ranges === 'number') {
			// ranges is still a number, so we still have to create ranges

			// calculate min required size
			// minimal size of range = step; if contact is not allowed, add a step between them
			const minRequiredSize: number = getMinRequiredSize(args.ranges);
			let givenSize: number;

			if (validatedArgs.autoMinMax) {
				// autoMinMax activated, so we set size to min required size for now
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
			let iPrevious: number;

			for (let i = 0; i < args.ranges; i++) {
				const rangeArgs = this.defaultRangeArgs;

				if (i === 0) {
					rangeArgs.start = validatedArgs.min;
					rangeArgs.startFixed = validatedArgs.fixToMin;
				} else {
					rangeArgs.start = ranges[iPrevious].end + spaceBetweenRanges;
					rangeArgs.startConnected = validatedArgs.connectRanges ? true : false;
				}

				if (i === args.ranges - 1) {
					rangeArgs.end = validatedArgs.max;
					rangeArgs.endFixed = validatedArgs.fixToMax;
				} else {
					rangeArgs.end = rangeArgs.start + rangeSize;
					rangeArgs.endConnected = validatedArgs.connectRanges ? true : false;
				}

				ranges.push(new MRSRange(i, rangeArgs));
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
					isFirstRange: boolean = !previousRange,
					isLastRange: boolean = i === args.ranges.length - 1;

				range.start = previousRange ? (range.start < minStart || validatedArgs.connectRanges ? minStart : range.start) : range.start;
				range.startFixed = validatedArgs.fixToMin && isFirstRange;
				range.startConnected = validatedArgs.connectRanges && !isFirstRange ? true : false;

				const minEnd: number = range.start + validatedArgs.step;

				range.end = range.end < minEnd ? minEnd : range.end;
				range.endFixed = validatedArgs.fixToMax && isLastRange;
				range.endConnected = validatedArgs.connectRanges && !isLastRange ? true : false;

				previousRange = range;
			}

			validatedArgs.ranges = args.ranges;

			const extendSize = () => {
				validatedArgs.min = validatedArgs.autoMinMax || firstRange().start < validatedArgs.min ? firstRange().start : validatedArgs.min;
				validatedArgs.max = validatedArgs.autoMinMax || lastRange().end > validatedArgs.max ? lastRange().end : validatedArgs.max;
			};

			const shrinkRanges = () => {
				validatedArgs.ranges = validatedArgs.ranges as MRSRange[];

				const givenSize: number = validatedArgs.max - validatedArgs.min,
					minRequiredSize: number = getMinRequiredSize(validatedArgs.ranges.length);

				// check if it is even possible to shrink it to given size
				if (minRequiredSize > givenSize) {
					return false;
				}

				let isFirstRange: boolean = true,
					previousRangeEnd: number = validatedArgs.min,
					isLastRange: boolean = true,
					previousRangeStart: number = validatedArgs.max,
					i: number = 0;

				while (i < validatedArgs.ranges.length) {
					const range: MRSRange = validatedArgs.ranges[i],
						shrinkBy: number = previousRangeEnd - range.start + (isFirstRange ? 0 : spaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					isFirstRange = false;
					previousRangeEnd = range.shrinkBy(shrinkBy, 'start');
					i++;
				}

				i = validatedArgs.ranges.length - 1;

				while (i >= 0) {
					const range: MRSRange = validatedArgs.ranges[i],
						shrinkBy: number = range.end - previousRangeStart + (isLastRange ? 0 : spaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					isLastRange = false;
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

				if (firstRange().start < validatedArgs.min) {
					const originalStart: number = firstRange().start,
						originalEnd: number = lastRange().end > validatedArgs.max ? lastRange().end : validatedArgs.max,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let isFirstRange: boolean = true,
						previousRangeOriginalEnd: number = originalStart,
						previousRangeNewEnd: number = validatedArgs.min,
						i: number = 0;

					while (i < validatedArgs.ranges.length) {
						const range: MRSRange = validatedArgs.ranges[i],
							originalSpaceBetweenRanges: number = range.start - previousRangeOriginalEnd;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / validatedArgs.step) * validatedArgs.step,
							newStart: number;

						newSpaceBetweenRanges = !isFirstRange && !validatedArgs.allowContact && newSpaceBetweenRanges < validatedArgs.step ? validatedArgs.step : newSpaceBetweenRanges;
						newStart = previousRangeNewEnd + newSpaceBetweenRanges;

						isFirstRange = false;
						previousRangeOriginalEnd = range.end;
						previousRangeNewEnd = range.shrinkProportionallyBy(sizeFactor, 'start', newStart, validatedArgs.max);
						i++;
					}
				} else if (lastRange().end > validatedArgs.max) {
					const originalStart: number = validatedArgs.min,
						originalEnd: number = lastRange().end,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let isLastRange: boolean = true,
						previousRangeOriginalStart: number = originalEnd,
						previousRangeNewStart: number = validatedArgs.max,
						i: number = validatedArgs.ranges.length - 1;

					while (i >= 0) {
						const range: MRSRange = validatedArgs.ranges[i],
							originalSpaceBetweenRanges: number = previousRangeOriginalStart - range.end;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / validatedArgs.step) * validatedArgs.step,
							newEnd: number;

						newSpaceBetweenRanges = !isLastRange && !validatedArgs.allowContact && newSpaceBetweenRanges < validatedArgs.step ? validatedArgs.step : newSpaceBetweenRanges;
						newEnd = previousRangeNewStart - newSpaceBetweenRanges;

						isLastRange = false;
						previousRangeOriginalStart = range.start;
						previousRangeNewStart = range.shrinkProportionallyBy(sizeFactor, 'end', newEnd, validatedArgs.min);
						i--;
					}
				} else {
					return false;
				}

				return true;
			};

			if (validatedArgs.ranges.length > 0 && (firstRange().start < validatedArgs.min || lastRange().end > validatedArgs.max)) {
				switch (validatedArgs.limitedSizeMode) {
					case MRSLimitedSizeMode.extendSize:
						extendSize();
						break;
					case MRSLimitedSizeMode.shrinkRanges:
						// in case shrinking ranges is not possible, extend size instead
						if (!shrinkRanges()) {
							MRS.logW(`LimitedSizeMode.shrinkRanges is not possible with the given arguments. LimitedSizeMode.extendSize is used instead.`);
							extendSize();
						}
						break;
					case MRSLimitedSizeMode.shrinkRangesProportionally:
						// in case shrinking ranges proportionally is not possible, extend size instead
						if (!shrinkRangesProportionally()) {
							MRS.logW(`LimitedSizeMode.shrinkRangesProportionally is not possible with the given arguments. LimitedSizeMode.extendSize is used instead.`);
							extendSize();
						}
						break;
				}
			}
		}

		(validatedArgs.ranges as MRSRange[]).forEach((range: MRSRange, i: number) => {
			range.previousRange = i > 0 ? validatedArgs.ranges[i - 1] : null;
			range.nextRange = i < (validatedArgs.ranges as MRSRange[]).length - 1 ? validatedArgs.ranges[i + 1] : null;
		});

		if (validatedArgs.fixToMin) {
			firstRange().start = validatedArgs.min;
		}

		if (validatedArgs.fixToMax) {
			lastRange().end = validatedArgs.max;
		}

		// set labels with filled placeholders
		const placeholderData = {
			min: validatedArgs.min,
			max: validatedArgs.max
		};

		const fillPlaceholders = (label: string): string => {
			let filledLabel: string = label;

			Object.keys(placeholderData).forEach((key: string) => {
				filledLabel = filledLabel.split(`#${key}#`).join(placeholderData[key]);
			});

			return filledLabel;
		};

		validatedArgs.labels = {
			min: fillPlaceholders(args.labels.min),
			max: fillPlaceholders(args.labels.max)
		};

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