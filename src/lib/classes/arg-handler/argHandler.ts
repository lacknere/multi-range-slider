import { LabelMinArg, LabelMaxArg, NameArg, StepArg, MinArg, MaxArg, AutoMinMaxArg, FixToMinArg, FixToMaxArg, MinSizeArg, RandomColorsArg, AllowContactArg, ConnectRangesArg, ConnectModeArg, LimitedSizeModeArg, TooltipModeSizeArg, TooltipModeStartEndArg, PostDataArg, ThumbSizeArg, Arg } from './args';
import { iterateObject, getNestedProp, nestedProp, getObjectKeys } from '../../helpers/multidimensionalObject';
import ErrorHandler from '../error-handler/errorHandler';
import { InvalidArgTypeReplacedWarning, InvalidArgRemovedWarning } from '../error-handler/warnings';

export default class ArgHandler {
	private _args = {
		labels: {
			min: new LabelMinArg(),
			max: new LabelMaxArg(),
		},
		name: new NameArg(),
		step: new StepArg(),
		min: new MinArg(),
		max: new MaxArg(),
		autoMinMax: new AutoMinMaxArg(),
		fixToMin: new FixToMinArg(),
		fixToMax: new FixToMaxArg(),
		minSize: new MinSizeArg(),
		randomColors: new RandomColorsArg(),
		allowContact: new AllowContactArg(),
		connectRanges: new ConnectRangesArg(),
		connectMode: new ConnectModeArg(),
		limitedSizeMode: new LimitedSizeModeArg(),
		tooltipMode: {
			size: new TooltipModeSizeArg(),
			startEnd: new TooltipModeStartEndArg(),
		},
		postData: new PostDataArg(),
		thumbSize: new ThumbSizeArg(),
	};

	constructor(args: any) {
		this.initialize(args);
	}

	public get args() {
		return this._args;
	}

	private initialize(args: any) {
		const isObject: boolean = typeof args === 'object';

		if (args === undefined || !isObject) {
			if (!isObject) {
				ErrorHandler.throwWarning(new InvalidArgTypeReplacedWarning('args', 'object', {}));
			}

			args = {};
		}

		iterateObject(args, (key: string, value: any) => {
			const arg: Arg = getNestedProp(this.args, key);

			if (value !== undefined) {
				if (arg instanceof Arg) {
					arg.value = value;
				} else {
					ErrorHandler.throwWarning(new InvalidArgRemovedWarning(key));
				}
			}
		});
	}
}