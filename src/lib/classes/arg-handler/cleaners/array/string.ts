import ArrayCleaner from './array';
import StringCleaner from '../string';

export default abstract class StringArrayCleaner extends ArrayCleaner {
	static type = 'string[]';
	static ItemCleaner = StringCleaner;
}