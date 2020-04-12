import Warning from './warning';

export default class InvalidArgRemovedWarning extends Warning {
	constructor(key: string) {
		super();

		this.message = `Argument "${key}" does not exist and was removed.`;
	}
}