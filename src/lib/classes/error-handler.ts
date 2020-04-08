class MRSErrorHandler {
	// warning/error messages

	static throwUnavailableArgRemoved(key: string) {
		MRSErrorHandler.logW(`Argument "${key}" is not available and was removed!`);
	}

	static throwWrongTypeReplaced(key: string, type: string, defaultValue: any) {
		MRSErrorHandler.logW(`Argument "${key}" is not of type ${type} and was replaced by default value "${defaultValue}"!`);
	}

	static throwWrongTypeRemoved(key: string, type: string) {
		MRSErrorHandler.logW(`Argument "${key}" is not of type ${type} and was removed!`);
	}

	static throwImpossibleSizeModeReplaced(mode: string, replaceMode: string) {
		MRSErrorHandler.logW(`LimitedSizeMode.${mode} is not possible with the given arguments and was replaced by LimitedSizeMode.${replaceMode}!`);
	}

	static throwRangeMissingArgRemoved(key: string, argKey: string) {
		MRSErrorHandler.logW(`Range "${key}" is missing required argument "${argKey}" and was removed!`);
	}

	// logging

	static logO(object: any) {
		// tslint:disable-next-line:no-console
		console.log(object);
	}

	static logW(message: string) {
		// tslint:disable-next-line:no-console
		console.warn(message);
	}

	static logE(message: string) {
		// tslint:disable-next-line:no-console
		console.error(message);
	}
}