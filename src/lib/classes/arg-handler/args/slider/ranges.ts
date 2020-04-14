import Arg from '../arg';
import RangeArrayCleaner from '../../cleaners/array/range';
import RangeArgHandler from '../../rangeArgHandler';

export default class RangesArg extends Arg {
	static key = 'ranges';
	static Cleaner = RangeArrayCleaner;

	get defaultValue(): RangeArgHandler[] {
		return (() => [new RangeArgHandler({ index: 0 })])();
	}
}