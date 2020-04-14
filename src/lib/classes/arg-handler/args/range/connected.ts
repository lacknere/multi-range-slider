import RangeArg from './arg';
import BooleanCleaner from '../../cleaners/boolean';

export default abstract class ConnectedArg extends RangeArg {
	static defaultValue: boolean = false;
	static Cleaner = BooleanCleaner;
}