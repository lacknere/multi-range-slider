import Arg from './arg';
import BooleanCleaner from '../cleaners/boolean';

export default class AutoMinMaxArg extends Arg {
	static key = 'autoMinMax';
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}