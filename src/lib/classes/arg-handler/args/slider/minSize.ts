import Arg from '../arg';
import NumberCleaner from '../../cleaners/number';

export default class MinSizeArg extends Arg {
	static key = 'minSize';
	static defaultValue: number = 1;
	static Cleaner = NumberCleaner;
}