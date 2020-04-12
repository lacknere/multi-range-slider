import Warning from './warning';

export default class InvalidArgTypeRemovedWarning extends Warning {
	constructor(key: string, validType: string) {
		super();

		this.message = `Argument "${key}" is not of type ${validType} and was removed.`;
	}
}