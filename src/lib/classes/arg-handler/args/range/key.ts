import RangeArg from './arg';
import StringCleaner from '../../cleaners/string';
import RangeArgHandler from '../../rangeArgHandler';

export default class KeyArg extends RangeArg {
	static key = 'key';
	static Cleaner = StringCleaner;

	get defaultValue(): string {
		return (this.handler as RangeArgHandler).index.toString();
	}
}