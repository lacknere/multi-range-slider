import Cleaner from '../cleaner';
import ErrorHandler from '../../../error-handler/errorHandler';
import { InvalidArgTypeRemovedWarning } from '../../../error-handler/warnings';

export default abstract class ArrayCleaner extends Cleaner {
	static ItemCleaner: typeof Cleaner;

	static clean(value: any, key: string): any[] {
		if (Array.isArray(value)) {
			return value.map(
				(item: any, index: number) => this.ItemCleaner.clean(item, index)
			).filter((item: any, i: number) => {
				const invalidType: boolean = item === undefined;

				if (invalidType) {
					ErrorHandler.throwWarning(new InvalidArgTypeRemovedWarning(`${key}[${i}]`, this.ItemCleaner.type));
				}

				return !invalidType;
			});
		}
	}
}