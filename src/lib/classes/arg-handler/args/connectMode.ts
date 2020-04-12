import Arg from './arg';
import { ConnectMode } from '../../../enums/connectMode';
import ConnectModeCleaner from '../cleaners/enum/connectMode';

export default class ConnectModeArg extends Arg {
	static key = 'connectMode';
	static defaultValue: ConnectMode = ConnectMode.Center;
	static Cleaner = ConnectModeCleaner;
}