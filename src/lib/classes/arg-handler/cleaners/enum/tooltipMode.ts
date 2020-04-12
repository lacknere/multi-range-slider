import EnumCleaner from './enum';
import { TooltipMode } from '../../../../enums/tooltipMode';

export default abstract class TooltipModeCleaner extends EnumCleaner {
	static type = TooltipMode;
}