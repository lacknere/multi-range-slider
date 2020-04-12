export default abstract class Cleaner {
	static type: any;

	static clean(value: any, key?: string): any {
		if (typeof value === this.type) {
			return value;
		}
	}
}