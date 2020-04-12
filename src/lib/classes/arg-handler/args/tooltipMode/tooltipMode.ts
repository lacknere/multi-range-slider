import Arg from '../arg';
import { TooltipMode } from '../../../../enums/tooltipMode';
import TooltipModeCleaner from '../../cleaners/enum/tooltipMode';

export default class TooltipModeArg extends Arg {
	static key = 'tooltipMode.tooltip';
	static defaultValue: TooltipMode = TooltipMode.OnHover;
	static Cleaner = TooltipModeCleaner;
}