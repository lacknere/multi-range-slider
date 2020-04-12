import Cleaner from './cleaner';

export default abstract class BooleanCleaner extends Cleaner {
	static type = 'boolean';

	static clean(value: any): boolean {
		if (value === true || value === 1 || value === 'true') {
			return true;
		} else if (value === false || value === 0 || value === 'false') {
			return false;
		}
	}
}