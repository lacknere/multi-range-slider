import Arg from '../arg';
import StringCleaner from '../../cleaners/string';

export default abstract class LabelArg extends Arg {
	static defaultValue: string = 'Label';
	static Cleaner = StringCleaner;
}