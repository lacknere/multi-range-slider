import ObjectCleaner from './object';
import RangeArgHandler from '../rangeArgHandler';

export default abstract class RangeCleaner extends ObjectCleaner {
	static clean(value: any, index?: number) {
		const range: any = super.clean(value);

		if (range !== undefined) {
			range.index = index;
			return new RangeArgHandler(range);
		}
	}
}