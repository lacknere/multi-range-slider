import Arg from '../arg';
import StringCleaner from '../../cleaners/string';

export default class LabelArg extends Arg {
	static key = 'labels.Label';
	static defaultValue: string = 'Label';
	static Cleaner = StringCleaner;
}