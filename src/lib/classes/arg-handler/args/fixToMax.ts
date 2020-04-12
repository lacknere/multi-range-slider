import Arg from './arg';
import BooleanCleaner from '../cleaners/boolean';

export default class FixToMaxArg extends Arg {
	static key = 'fixToMax';
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}