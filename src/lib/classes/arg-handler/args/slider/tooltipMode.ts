import Arg from '../arg';
import { TooltipMode } from '../../../../enums/tooltipMode';
import TooltipModeCleaner from '../../cleaners/enum/tooltipMode';

export default abstract class TooltipModeArg extends Arg {
	static defaultValue: TooltipMode = TooltipMode.OnHover;
	static Cleaner = TooltipModeCleaner;
}