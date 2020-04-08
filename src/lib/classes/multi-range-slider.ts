type MRSArgs = {
	labels?: MRSLabels;
	name?: string;
	step?: number;
	min?: number;
	max?: number;
	autoMinMax?: boolean;
	fixToMin?: boolean;
	fixToMax?: boolean;
	minSize?: number;
	allowContact?: boolean;
	connectRanges?: boolean;
	connectMode?: MRSConnectMode;
	limitedSizeMode?: MRSLimitedSizeMode;
	sizeTooltipMode?: MRSTooltipMode;
	startEndTooltipMode?: MRSTooltipMode;
	postData?: string[];
	ranges?: MRSRange[] | number;
};
type MRSLabels = {
	min?: string;
	max?: string;
};
enum MRSConnectMode { keepStart, center, keepEnd }
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
		minSize: 1,
		allowContact: true,
		connectRanges: false,
		connectMode: MRSConnectMode.center,
		limitedSizeMode: MRSLimitedSizeMode.extendSize,
		sizeTooltipMode: MRSTooltipMode.always,
		startEndTooltipMode: MRSTooltipMode.onHover,
		postData: ['start', 'end', 'size'],
		ranges: 1,
	};
	private _argsCleaningFunctions: any = {
		labels: { min: MRSTypeCleaner.cleanString, max: MRSTypeCleaner.cleanString },
		name: MRSTypeCleaner.cleanString,
		step: MRSTypeCleaner.cleanNumber,
		min: MRSTypeCleaner.cleanNumber,
		max: MRSTypeCleaner.cleanNumber,
		autoMinMax: MRSTypeCleaner.cleanBoolean,
		fixToMin: MRSTypeCleaner.cleanBoolean,
		fixToMax: MRSTypeCleaner.cleanBoolean,
		minSize: MRSTypeCleaner.cleanNumber,
		allowContact: MRSTypeCleaner.cleanBoolean,
		connectRanges: MRSTypeCleaner.cleanBoolean,
		connectMode: MRSTypeCleaner.cleanConnectMode,
		limitedSizeMode: MRSTypeCleaner.cleanLimitedSizeMode,
		sizeTooltipMode: MRSTypeCleaner.cleanTooltipMode,
		startEndTooltipMode: MRSTypeCleaner.cleanTooltipMode,
		postData: MRSTypeCleaner.cleanStringArray,
		ranges: this.cleanRangeArray,
	};

	private _defaultRangeArgs: MRSRangeArgs = {
		key: undefined,
		start: 0,
		startFixed: false,
		startConnected: false,
		end: 100,
		endFixed: false,
		endConnected: false,
		minSize: 1,
		allowContact: true,
		color: undefined,
		textColor: undefined,
	};
	private _rangeArgsCleaningFunctions: any = {
		key: MRSTypeCleaner.cleanString,
		start: MRSTypeCleaner.cleanNumber,
		startFixed: MRSTypeCleaner.cleanBoolean,
		startConnected: MRSTypeCleaner.cleanBoolean,
		end: MRSTypeCleaner.cleanNumber,
		endFixed: MRSTypeCleaner.cleanBoolean,
		endConnected: MRSTypeCleaner.cleanBoolean,
		minSize: MRSTypeCleaner.cleanNumber,
		allowContact: MRSTypeCleaner.cleanBoolean,
		color: MRSTypeCleaner.cleanString,
		textColor: MRSTypeCleaner.cleanString,
	};

	private _element: HTMLElement;
	private _args: MRSArgs;
	private _slider: MRSSlider;

	constructor(element: HTMLElement, args: any) {
		this._element = element;
		this._args = { ...this.defaultArgs, ...args };
		this.validateArgs();
		console.log(this.args);
		this._slider = new MRSSlider(this);
	}

	// getters

	private get defaultArgs(): MRSArgs {
		return { ...this._defaultArgs };
	}

	private get defaultRangeArgs(): MRSRangeArgs {
		return {
			...this._defaultRangeArgs,
			minSize: this.args.minSize,
			allowContact: this.args.allowContact,
			startConnected: this.args.connectRanges,
			endConnected: this.args.connectRanges,
		};
	}

	public get element(): HTMLElement {
		return this._element;
	}

	public get args(): MRSArgs {
		return this._args;
	}

	// nested arg functions

	private iterateNestedArg(rootArgs: any, callback: (key: string, value: any) => void) {
		const splitKeys: string[] = [];

		const iterateArg = (arg: object) => {
			for (const argKey in arg) {
				if (arg.hasOwnProperty(argKey)) {
					splitKeys.push(argKey);
					const nestedArg: any = arg[argKey];

					if (typeof nestedArg === 'object' && !Array.isArray(nestedArg)) {
						iterateArg(nestedArg);
					} else {
						const fullKey: string = splitKeys.join('.');

						callback(fullKey, nestedArg);
						splitKeys.pop();
					}
				}
			}

			splitKeys.pop();
		};

		iterateArg(rootArgs);
	}

	private getNestedArg(rootArgs: any, key: string): any {
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
	}

	private setNestedArg(rootArgs: any, key: string, value: any, deleteArg: boolean = false) {
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

		if (!deleteArg) {
			schema[splitKeys[keysLength - 1]] = value;
		} else {
			delete schema[splitKeys[keysLength - 1]];
		}
	}

	// type cleaning



	// arg cleaning
	private cleanRangeArray(key: string, ranges: any): MRSRange[] | number {
		let cleanedRangeArray: any[] | number;

		if (Array.isArray(ranges)) {
			cleanedRangeArray = MRSTypeCleaner.cleanArray(key, ranges, this.cleanRangeArgs.bind(this));
		} else if (typeof ranges === 'object') {
			cleanedRangeArray = MRSTypeCleaner.cleanArray(key, [ranges], this.cleanRangeArgs.bind(this));
		} else {
			if (typeof ranges !== 'number' || !Number.isInteger(ranges)) {
				const defaultRangeArray = this.defaultArgs.ranges;
				cleanedRangeArray = defaultRangeArray;
				MRSErrorHandler.throwWrongTypeReplaced(key, 'range or number', defaultRangeArray);
			} else {
				cleanedRangeArray = ranges;
			}
		}

		if (Array.isArray(cleanedRangeArray)) {
			cleanedRangeArray = cleanedRangeArray.map((cleanedRangeArgs: MRSRangeArgs, i: number) => new MRSRange(i, cleanedRangeArgs));
		}

		return cleanedRangeArray;
	}

	private getAvailableArgKeys(type: 'slider' | 'range'): string[] {
		let args: MRSArgs | MRSRangeArgs;
		const availableArgKeys: string[] = [];

		switch (type) {
			case 'slider':
				args = this.defaultArgs;
				break;
			case 'range':
				args = this.defaultRangeArgs;
				break;
		}
		this.iterateNestedArg(args, (key: string, _) => availableArgKeys.push(key));

		return availableArgKeys;
	}

	private cleanRangeArgs(key: string, rangeArgs: any): MRSRangeArgs {
		const defaultRangeArgs: MRSArgs = this.defaultRangeArgs,
			availableRangeArgKeys: string[] = this.getAvailableArgKeys('range');
		let validRangeArgs: boolean = true;

		MRSRange.requiredArgs.forEach((argKey: string) => {
			if (rangeArgs[argKey] === undefined) {
				MRSErrorHandler.throwRangeMissingArgRemoved(key, argKey);
				validRangeArgs = false;
			}
		});

		if (validRangeArgs) {
			this.iterateNestedArg(rangeArgs, (argKey: string, arg: any) => {
				const fullKey: string = `${key}.${argKey}`;
				if (availableRangeArgKeys.includes(argKey)) {
					const argCleaningFunction: (key: string, value: any, defaultValue: any) => any = this.getNestedArg(this._rangeArgsCleaningFunctions, argKey).bind(this),
						defaultArg: any = this.getNestedArg(defaultRangeArgs, argKey),
						cleanedArg: any = argCleaningFunction(fullKey, arg, defaultArg);

					this.setNestedArg(rangeArgs, argKey, cleanedArg);
				} else {
					MRSErrorHandler.throwUnavailableArgRemoved(fullKey);
					this.setNestedArg(rangeArgs, argKey, null, true);
				}
			});

			return { ...defaultRangeArgs, ...rangeArgs };
		}
	}

	private cleanArgs() {
		const args: MRSArgs = this.args,
			defaultArgs: MRSArgs = this.defaultArgs,
			availableArgKeys: string[] = this.getAvailableArgKeys('slider');

		this.iterateNestedArg(args, (argKey: string, arg: any) => {
			if (availableArgKeys.includes(argKey)) {
				const argCleaningFunction: (key: string, value: any, defaultValue: any) => any = this.getNestedArg(this._argsCleaningFunctions, argKey).bind(this),
					defaultArg: any = this.getNestedArg(defaultArgs, argKey),
					cleanedArg: any = argCleaningFunction(argKey, arg, defaultArg);

				this.setNestedArg(args, argKey, cleanedArg);
			} else {
				MRSErrorHandler.throwUnavailableArgRemoved(argKey);
				this.setNestedArg(args, argKey, null, true);
			}
		});
	}

	// arg validating

	private validateArgs() {
		this.cleanArgs();

		const args: MRSArgs = this.args;

		const getMinRequiredSize = (): number => {
			if (Array.isArray(args.ranges)) {
				let minRequiredSize: number = 0;

				args.ranges.forEach((range: MRSRange, i: number) => {
					const nextRange: MRSRange = args.ranges[i + 1];

					minRequiredSize += range.minSize + (nextRange && range.allowContact && nextRange.allowContact ? 0 : args.step);
				});

				return minRequiredSize;
			} else if (typeof args.ranges === 'number') {
				return (args.ranges * args.minSize) + (args.allowContact ? 0 : ((args.ranges - 1) * args.step));
			}
		};

		const firstRange = (): MRSRange => args.ranges[0];
		const lastRange = (): MRSRange => args.ranges[(args.ranges as MRSRange[]).length - 1];

		// autoMinMax = true forces limitedSizeMode = extendSize
		args.limitedSizeMode = args.autoMinMax ? MRSLimitedSizeMode.extendSize : args.limitedSizeMode;

		if (typeof args.ranges === 'number') {
			// ranges is still a number, so we have to create ranges

			// calculate min required size
			// if contact is not allowed, add a step between them
			const minRequiredSize: number = getMinRequiredSize();
			let givenSize: number;

			if (args.autoMinMax) {
				// autoMinMax activated, so we set size to min required size for now
				args.min = 0;
				args.max = minRequiredSize;
			} else {
				// calculate given size
				givenSize = args.max - args.min;

				// given size has to be >= min required size, otherwise adjust max
				if (minRequiredSize > givenSize) {
					args.max = args.min + minRequiredSize;
				}
			}

			// now (re)calculate the validated given size and create the ranges based on it
			givenSize = args.max - args.min;
			const ranges: MRSRange[] = [],
				rangeSize: number = (givenSize - (args.allowContact ? 0 : ((args.ranges - 1) * args.step))) / args.ranges,
				spaceBetweenRanges: number = args.allowContact ? 0 : args.step;
			let iPrevious: number;

			for (let i = 0; i < args.ranges; i++) {
				const rangeArgs: MRSRangeArgs = this.defaultRangeArgs;

				if (i === 0) {
					rangeArgs.start = args.min;
					rangeArgs.startFixed = args.fixToMin;
				} else {
					rangeArgs.start = ranges[iPrevious].end + spaceBetweenRanges;
					rangeArgs.startConnected = args.connectRanges ? true : false;
				}

				if (i === args.ranges - 1) {
					rangeArgs.end = args.max;
					rangeArgs.endFixed = args.fixToMax;
				} else {
					rangeArgs.end = rangeArgs.start + rangeSize;
					rangeArgs.endConnected = args.connectRanges ? true : false;
				}

				ranges.push(new MRSRange(i, rangeArgs));
				iPrevious = i;
			}

			args.ranges = ranges;
		} else if (Array.isArray(args.ranges)) {
			// ranges is an array of ranges already, validate them

			// make sure start > previous range end, end > start and maybe connect ranges
			let previousRange: MRSRange;

			for (let i = 0; i < args.ranges.length; i++) {
				const range: MRSRange = args.ranges[i],
					minSpaceBetweenRanges: number = previousRange && previousRange.allowContact && range.allowContact ? 0 : args.step,
					minStart: number = previousRange ? previousRange.end + minSpaceBetweenRanges : args.min,
					isFirstRange: boolean = !previousRange,
					isLastRange: boolean = i === args.ranges.length - 1;

				range.startConnected = isFirstRange ? false : (previousRange.endConnected ? true : range.startConnected);
				range.startFixed = args.fixToMin && isFirstRange || range.startConnected && previousRange.endFixed ? true : range.startFixed;
				range.start = minStart > range.start ? minStart : range.start;

				if (range.startConnected) {
					switch (args.connectMode) {
						case MRSConnectMode.keepStart:
							previousRange.end = range.start - minSpaceBetweenRanges;
							break;
						case MRSConnectMode.center:
							const spaceBetweenRanges: number = range.start - previousRange.end;
							let moveBy: number = spaceBetweenRanges / 2;

							if (minSpaceBetweenRanges > 0) {
								moveBy = Math.floor(moveBy / args.step) * args.step;
							}

							previousRange.end += moveBy;
							range.start -= (moveBy - minSpaceBetweenRanges);
							break;
						case MRSConnectMode.keepEnd:
							range.start = previousRange.end + minSpaceBetweenRanges;
							break;
					}
				}

				const minEnd: number = range.start + range.minSize,
					nextRange: MRSRange = args.ranges[i + 1];

				range.endConnected = isLastRange ? false : (nextRange.startConnected ? true : range.endConnected);
				range.endFixed = args.fixToMax && isLastRange || range.endConnected && nextRange.startFixed ? true : range.endFixed;
				range.end = range.end < minEnd ? minEnd : range.end;

				previousRange = range;
			}

			const extendSize = () => {
				args.min = args.autoMinMax || firstRange().start < args.min ? firstRange().start : args.min;
				args.max = args.autoMinMax || lastRange().end > args.max ? lastRange().end : args.max;
			};

			const shrinkRanges = () => {
				const givenSize: number = args.max - args.min,
					minRequiredSize: number = getMinRequiredSize();

				// check if it is even possible to shrink it to given size
				if (minRequiredSize > givenSize) {
					return false;
				}

				let isFirstRange: boolean = true,
					previousRangeEnd: number = args.min,
					isLastRange: boolean = true,
					previousRangeStart: number = args.max,
					previousRangeAllowContact: boolean,
					i: number = 0;

				while (i < (args.ranges as MRSRange[]).length) {
					const range: MRSRange = args.ranges[i],
						minSpaceBetweenRanges: number = !isFirstRange && previousRangeAllowContact && range.allowContact ? 0 : args.step,
						shrinkBy: number = previousRangeEnd - range.start + (isFirstRange ? 0 : minSpaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					isFirstRange = false;
					previousRangeEnd = range.shrinkBy(shrinkBy, 'start');
					previousRangeAllowContact = range.allowContact;
					i++;
				}

				i = (args.ranges as MRSRange[]).length - 1;

				while (i >= 0) {
					const range: MRSRange = args.ranges[i],
						minSpaceBetweenRanges: number = !isLastRange && previousRange.allowContact && range.allowContact ? 0 : args.step,
						shrinkBy: number = range.end - previousRangeStart + (isLastRange ? 0 : minSpaceBetweenRanges);

					if (shrinkBy <= 0) {
						break;
					}

					isLastRange = false;
					previousRangeStart = range.shrinkBy(shrinkBy, 'end');
					previousRangeAllowContact = range.allowContact;
					i--;
				}

				return true;
			};

			const shrinkRangesProportionally = () => {
				const givenSize: number = args.max - args.min,
					minRequiredSize: number = getMinRequiredSize();

				// check if it is even possible to shrink it to given size
				if (minRequiredSize > givenSize) {
					return false;
				}

				if (firstRange().start < args.min) {
					const originalStart: number = firstRange().start,
						originalEnd: number = lastRange().end > args.max ? lastRange().end : args.max,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let isFirstRange: boolean = true,
						previousRangeOriginalEnd: number = originalStart,
						previousRangeNewEnd: number = args.min,
						i: number = 0;

					while (i < (args.ranges as MRSRange[]).length) {
						const range: MRSRange = args.ranges[i],
							originalSpaceBetweenRanges: number = range.start - previousRangeOriginalEnd;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / args.step) * args.step,
							newStart: number;

						newSpaceBetweenRanges = !isFirstRange && !args.allowContact && newSpaceBetweenRanges < args.step ? args.step : newSpaceBetweenRanges;
						newStart = previousRangeNewEnd + newSpaceBetweenRanges;

						isFirstRange = false;
						previousRangeOriginalEnd = range.end;
						previousRangeNewEnd = range.shrinkProportionallyBy(sizeFactor, 'start', newStart, args.max);
						i++;
					}
				} else if (lastRange().end > args.max) {
					const originalStart: number = args.min,
						originalEnd: number = lastRange().end,
						originalSize: number = originalEnd - originalStart,
						sizeFactor: number = givenSize / originalSize;
					let isLastRange: boolean = true,
						previousRangeOriginalStart: number = originalEnd,
						previousRangeNewStart: number = args.max,
						i: number = (args.ranges as MRSRange[]).length - 1;

					while (i >= 0) {
						const range: MRSRange = args.ranges[i],
							originalSpaceBetweenRanges: number = previousRangeOriginalStart - range.end;
						let newSpaceBetweenRanges: number = Math.round((originalSpaceBetweenRanges * sizeFactor) / args.step) * args.step,
							newEnd: number;

						newSpaceBetweenRanges = !isLastRange && !args.allowContact && newSpaceBetweenRanges < args.step ? args.step : newSpaceBetweenRanges;
						newEnd = previousRangeNewStart - newSpaceBetweenRanges;

						isLastRange = false;
						previousRangeOriginalStart = range.start;
						previousRangeNewStart = range.shrinkProportionallyBy(sizeFactor, 'end', newEnd, args.min);
						i--;
					}
				} else {
					return false;
				}

				return true;
			};

			if (args.ranges.length > 0 && (firstRange().start < args.min || lastRange().end > args.max)) {
				switch (args.limitedSizeMode) {
					case MRSLimitedSizeMode.extendSize:
						extendSize();
						break;
					case MRSLimitedSizeMode.shrinkRanges:
						// in case shrinking ranges is not possible, extend size instead
						if (!shrinkRanges()) {
							MRSErrorHandler.throwImpossibleSizeModeReplaced('shrinkRanges', 'extendSize');
							extendSize();
						}
						break;
					case MRSLimitedSizeMode.shrinkRangesProportionally:
						// in case shrinking ranges proportionally is not possible, extend size instead
						if (!shrinkRangesProportionally()) {
							MRSErrorHandler.throwImpossibleSizeModeReplaced('shrinkRangesProportionally', 'extendSize');
							extendSize();
						}
						break;
				}
			}
		}

		(args.ranges as MRSRange[]).forEach((range: MRSRange, i: number) => {
			range.previousRange = i > 0 ? args.ranges[i - 1] : null;
			range.nextRange = i < (args.ranges as MRSRange[]).length - 1 ? args.ranges[i + 1] : null;
		});

		if (args.fixToMin) {
			firstRange().start = args.min;
		}

		if (args.fixToMax) {
			lastRange().end = args.max;
		}

		// set labels with filled placeholders
		const placeholderData = {
			min: args.min,
			max: args.max
		};

		const fillPlaceholders = (label: string): string => {
			let filledLabel: string = label;

			Object.keys(placeholderData).forEach((key: string) => {
				filledLabel = filledLabel.split(`#${key}#`).join(placeholderData[key]);
			});

			return filledLabel;
		};

		args.labels = {
			min: fillPlaceholders(args.labels.min),
			max: fillPlaceholders(args.labels.max)
		};
	}
}