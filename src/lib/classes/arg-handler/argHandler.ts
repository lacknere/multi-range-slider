import { iterateObject, getNestedProp } from '../../helpers/multidimensionalObject';
import Arg from './args/arg';
import ErrorHandler from '../error-handler/errorHandler';
import { InvalidArgRemovedWarning } from '../error-handler/warnings';

export default class ArgHandler {
	private _index: number = 0;
	private _args: any;

	constructor(args?: any) {
		if (args.index !== undefined) {
			this.index = args.index;
		}

		this._args = this.defaultArgs;

		this.initialize(args);
	}

	public get index(): number {
		return this._index;
	}

	public set index(index: number) {
		this._index = index;
	}

	get defaultArgs(): SliderArgs {
		return new SliderArgs(this);
	}

	public get args() {
		return this._args;
	}

	initialize(args: any) {
		iterateObject(args, (key: string, value: any) => {
			const arg: Arg = getNestedProp(this.args.value, key);

			if (key !== 'index' && value !== undefined) {
				if (arg instanceof Arg) {
					arg.value = value;
				} else {
					const preKey: string = this.args.key !== '' ? `${this.args.key}.` : '';
					ErrorHandler.throwWarning(new InvalidArgRemovedWarning(preKey + key));
				}
			}
		});
	}
}

// SliderArgs indirectly imports ArgHandler, so we need to import it, after ArgHandler is fully loaded.
import SliderArgs from './args/sliderArgs';