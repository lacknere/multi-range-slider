import Cleaner from '../cleaner';

export default abstract class EnumCleaner extends Cleaner {
	static clean(value: any): any {
		if (Object.values(this.type).includes(value)) {
			return value;
		}
	}
}