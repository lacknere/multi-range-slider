import { Arg, LabelMinArg, LabelMaxArg, AutoMinMaxArg, FixToMinArg, FixToMaxArg, MinSizeArg, RandomColorsArg, AllowContactArg, ConnectRangesArg, ConnectModeArg, LimitedSizeModeArg, TooltipModeSizeArg, TooltipModeStartEndArg, PostDataArg, ThumbSizeArg, NameArg, StepArg, MinArg, MaxArg, RangesArg } from './slider/args';
import ObjectCleaner from '../cleaners/object';

export default class SliderArgs extends Arg {
	static key = '';
	static Cleaner = ObjectCleaner;

	get defaultValue(): object {
		return {
			labels: {
				min: new LabelMinArg(this.handler),
				max: new LabelMaxArg(this.handler),
			},
			name: new NameArg(this.handler),
			step: new StepArg(this.handler),
			min: new MinArg(this.handler),
			max: new MaxArg(this.handler),
			autoMinMax: new AutoMinMaxArg(this.handler),
			fixToMin: new FixToMinArg(this.handler),
			fixToMax: new FixToMaxArg(this.handler),
			minSize: new MinSizeArg(this.handler),
			randomColors: new RandomColorsArg(this.handler),
			allowContact: new AllowContactArg(this.handler),
			connectRanges: new ConnectRangesArg(this.handler),
			connectMode: new ConnectModeArg(this.handler),
			limitedSizeMode: new LimitedSizeModeArg(this.handler),
			tooltipMode: {
				size: new TooltipModeSizeArg(this.handler),
				startEnd: new TooltipModeStartEndArg(this.handler),
			},
			postData: new PostDataArg(this.handler),
			thumbSize: new ThumbSizeArg(this.handler),
			ranges: new RangesArg(this.handler),
		};
	}
}