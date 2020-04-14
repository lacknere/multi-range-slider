import Cleaner from '../cleaners/cleaner';
import Validator from '../validators/validator';
import ArgHandler from '../argHandler';
import ErrorHandler from '../../error-handler/errorHandler';
import { InvalidArgTypeReplacedWarning, InvalidArgReplacedWarning } from '../../error-handler/warnings';

export default abstract class Arg {
	static key: string;
	static defaultValue: any;
	static Cleaner: typeof Cleaner;
	static Validator: typeof Validator = Validator;

	_initialized: boolean = false;
	_handler: ArgHandler;
	_value: any;
	_listeners = {
		onChange: []
	};

	constructor(handler: ArgHandler, value?: any) {
		this._handler = handler;
		this.value = value;
	}

	get key(): string {
		return (this.constructor as typeof Arg).key;
	}

	get defaultValue(): any {
		return (this.constructor as typeof Arg).defaultValue;
	}

	get Cleaner(): typeof Cleaner {
		return (this.constructor as typeof Arg).Cleaner;
	}

	get Validator(): typeof Validator {
		return (this.constructor as typeof Arg).Validator;
	}

	get handler(): ArgHandler {
		return this._handler;
	}

	get value(): any {
		return this._value;
	}

	set value(value: any) {
		if (this._initialized) {
			value = this.clean(value);

			if (value === undefined) {
				ErrorHandler.throwWarning(new InvalidArgTypeReplacedWarning(this.key, this.Cleaner.type, this.defaultValue));
				value = this.defaultValue;
			}

			value = this.validate(value);

			if (value === undefined) {
				ErrorHandler.throwWarning(new InvalidArgReplacedWarning(this.key, this.defaultValue));
				value = this.defaultValue;
			}

			this._value = value;
			this.callListeners('onChange');
		} else {
			this._value = this.defaultValue;
			this._initialized = true;
		}
	}

	public set onChange(listener: () => void) {
		this._listeners.onChange.push(listener);
	}

	clean(value: any): any {
		return this.Cleaner.clean(value, this.key);
	}

	validate(value: any): any {
		return this.Validator.validate(value);
	}

	callListeners(key: string) {
		this._listeners[key].forEach(
			(listener: () => void) => listener()
		);
	}
}