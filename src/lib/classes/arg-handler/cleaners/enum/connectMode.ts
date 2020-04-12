import EnumCleaner from './enum';
import { ConnectMode } from '../../../../enums/connectMode';

export default abstract class ConnectModeCleaner extends EnumCleaner {
	static type = ConnectMode;
}