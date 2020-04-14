import Arg from '../arg';
import BooleanCleaner from '../../cleaners/boolean';

export default class AllowContactArg extends Arg {
	static key = 'allowContact';
	static defaultValue: boolean = true;
	static Cleaner = BooleanCleaner;
}