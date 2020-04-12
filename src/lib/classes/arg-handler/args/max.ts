import Arg from './arg';
import NumberCleaner from '../cleaners/number';

export default class MaxArg extends Arg {
	static key = 'max';
	static defaultValue: number = 100;
	static Cleaner = NumberCleaner;
}