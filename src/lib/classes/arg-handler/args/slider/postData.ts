import Arg from '../arg';
import StringArrayCleaner from '../../cleaners/array/string';

export default class PostDataArg extends Arg {
	static key = 'postData';
	static defaultValue: string[] = [
		'start',
		'end',
		'size'
	];
	static Cleaner = StringArrayCleaner;
}