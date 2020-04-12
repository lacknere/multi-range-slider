import Arg from './arg';
import BooleanCleaner from '../cleaners/boolean';

export default class RandomColorsArg extends Arg {
	static key = 'randomColors';
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}