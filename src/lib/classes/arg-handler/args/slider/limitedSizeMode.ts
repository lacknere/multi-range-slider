import Arg from '../arg';
import { LimitedSizeMode } from '../../../../enums/limitedSizeMode';
import LimitedSizeModeCleaner from '../../cleaners/enum/limitedSizeMode';

export default class LimitedSizeModeArg extends Arg {
	static key = 'limitedSizeMode';
	static defaultValue: LimitedSizeMode = LimitedSizeMode.ExtendSize;
	static Cleaner = LimitedSizeModeCleaner;
}