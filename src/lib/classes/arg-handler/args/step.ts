import Arg from './arg';
import NumberCleaner from '../cleaners/number';

export default class StepArg extends Arg {
	static key = 'step';
	static defaultValue: number = 1;
	static Cleaner = NumberCleaner;
}