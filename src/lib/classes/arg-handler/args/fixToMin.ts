import Arg from './arg';
import BooleanCleaner from '../cleaners/boolean';

export default class FixToMinArg extends Arg {
	static key = 'fixToMin';
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}