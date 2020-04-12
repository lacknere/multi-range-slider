import Warning from './warning';

export default class InvalidArgTypeReplacedWarning extends Warning {
	constructor(key: string, validType: string, replacedBy: any) {
		super();

		this.message = `Argument "${key}" is not of type ${validType} and was replaced by "${replacedBy}".`;
	}
}