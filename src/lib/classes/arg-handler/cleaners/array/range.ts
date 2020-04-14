import ArrayCleaner from './array';
import RangeCleaner from '../range';
import RangeArgHandler from '../../rangeArgHandler';

export default abstract class RangeArrayCleaner extends ArrayCleaner {
	static type = 'number, object or object[]';
	static ItemCleaner = RangeCleaner;

	static clean(value: any, key: string): object[] {
		if (!Array.isArray(value)) {
			if (typeof value === 'object') {
				value = [value];
			} else if (typeof value === 'number') {
				const ranges: object[] = [];

				for (let i = 0; i < value; i++) {
					ranges.push({});
				}

				value = ranges;
			}
		}

		return super.clean(value, key);
	}
}