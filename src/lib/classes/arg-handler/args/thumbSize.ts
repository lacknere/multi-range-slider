import Arg from './arg';
import { getThumbSize } from '../../../helpers/thumbSize';
import NumberCleaner from '../cleaners/number';

export default class ThumbSizeArg extends Arg {
	static key = 'thumbSize';
	static defaultValue: () => number = getThumbSize;
	static Cleaner = NumberCleaner;
}