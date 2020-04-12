import TooltipModeArg from './tooltipMode';
import { TooltipMode } from '../../../../enums/tooltipMode';

export default class TooltipModeSizeArg extends TooltipModeArg {
	static key = 'tooltipMode.size';
	static defaultValue = TooltipMode.Always;
}