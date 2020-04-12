import Arg from './arg';
import BooleanCleaner from '../cleaners/boolean';

export default class ConnectRangesArg extends Arg {
	static key = 'connectRanges';
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}