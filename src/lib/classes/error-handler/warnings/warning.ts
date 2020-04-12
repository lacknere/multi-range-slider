export default class Warning {
	name: string;
	message: string;

	constructor() {
		this.name = this.constructor.name;
	}

	public toString(): string {
		if (this.message) {
			return `${this.name}: ${this.message}`;
		} else {
			return `${this.name}`;
		}
	}
}