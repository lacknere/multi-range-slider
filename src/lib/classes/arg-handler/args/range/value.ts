import RangeArg from './arg';
import NumberCleaner from '../../cleaners/number';

export default abstract class ValueArg extends RangeArg {
	static defaultValue: number = 0;
	static Cleaner = NumberCleaner;
}