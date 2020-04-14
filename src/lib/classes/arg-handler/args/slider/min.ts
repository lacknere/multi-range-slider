import Arg from '../arg';
import NumberCleaner from '../../cleaners/number';

export default class MinArg extends Arg {
	static key = 'min';
	static defaultValue: number = 0;
	static Cleaner = NumberCleaner;
}