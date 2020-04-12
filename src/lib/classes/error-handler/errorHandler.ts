import Warning from './warnings/warning';

export default abstract class ErrorHandler {
	static throwError(error: Error) {
		throw error;
	}

	static throwWarning(warning: Warning) {
		// tslint:disable-next-line: no-console
		console.warn(warning.toString());
	}
}