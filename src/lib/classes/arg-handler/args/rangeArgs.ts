import Arg from './arg';
import ObjectCleaner from '../cleaners/object';
import RangesArg from './slider/ranges';
import { KeyArg, StartValueArg, StartFixedArg, StartConnectedArg, EndValueArg, EndFixedArg, EndConnectedArg } from './range/args';

export default class RangeArgs extends Arg {
	static Cleaner = ObjectCleaner;

	get key(): string {
		return `${RangesArg.key}[${this.value.key.value}]`;
	}

	get defaultValue(): object {
		return {
			key: new KeyArg(this.handler),
			start: {
				value: new StartValueArg(this.handler),
				fixed: new StartFixedArg(this.handler),
				connected: new StartConnectedArg(this.handler),
			},
			end: {
				value: new EndValueArg(this.handler),
				fixed: new EndFixedArg(this.handler),
				connected: new EndConnectedArg(this.handler),
			},
		};
	}
}