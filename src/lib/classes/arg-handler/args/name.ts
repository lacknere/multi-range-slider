import Arg from './arg';
import StringCleaner from '../cleaners/string';

export default class NameArg extends Arg {
	static key = 'name';
	static defaultValue: string = 'multi-range-slider';
	static Cleaner = StringCleaner;
}