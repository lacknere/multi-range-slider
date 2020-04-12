import Warning from './warning';

export default class InvalidArgReplacedWarning extends Warning {
	constructor(key: string, replacedBy: any) {
		super();

		this.message = `Argument "${key}" is invalid and was replaced by "${replacedBy}".`;
	}
}