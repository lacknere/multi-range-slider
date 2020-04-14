import Arg from '../arg';
import { getThumbSize } from '../../../../helpers/thumbSize';
import NumberCleaner from '../../cleaners/number';

export default class ThumbSizeArg extends Arg {
	static key = 'thumbSize';
	static Cleaner = NumberCleaner;

	get defaultValue(): number {
		return getThumbSize();
	}
}