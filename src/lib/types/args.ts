import { ConnectMode, LimitedSizeMode, TooltipMode } from '../enums/enums';

export type Args = {
	labels?: {
		min?: string;
		max?: string;
	};
	name?: string;
	step?: number;
	min?: number;
	max?: number;
	autoMinMax?: boolean;
	fixToMin?: boolean;
	fixToMax?: boolean;
	minSize?: number;
	allowContact?: boolean;
	randomColors?: boolean;
	connectRanges?: boolean;
	connectMode?: ConnectMode;
	limitedSizeMode?: LimitedSizeMode;
	tooltipMode?: {
		size?: TooltipMode;
		startEnd?: TooltipMode;
	};
	postData?: string[];
	ranges?: any[];
	thumbWidth?: number;
};