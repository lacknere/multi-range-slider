import EnumCleaner from './enum';
import { LimitedSizeMode } from '../../../../enums/limitedSizeMode';

export default abstract class LimitedSizeModeCleaner extends EnumCleaner {
	static type = LimitedSizeMode;
}