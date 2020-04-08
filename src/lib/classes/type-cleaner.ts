class MRSTypeCleaner {
	static cleanDefaultType(key: string, value: any, defaultValue: any, type: 'string' | 'number'): any {
		if (typeof value === type) {
			return value;
		} else {
			if (defaultValue !== undefined) {
				MRSErrorHandler.throwWrongTypeReplaced(key, type, defaultValue);
				return defaultValue;
			} else {
				MRSErrorHandler.throwWrongTypeRemoved(key, type);
			}
		}
	}

	static cleanString(key: string, value: any, defaultValue?: string): string {
		return MRSTypeCleaner.cleanDefaultType(key, value, defaultValue, 'string');
	}

	static cleanNumber(key: string, value: any, defaultValue?: number): number {
		return MRSTypeCleaner.cleanDefaultType(key, value, defaultValue, 'number');
	}

	static cleanBoolean(key: string, value: any, defaultValue?: boolean): boolean {
		if (value === true || value === 1 || value === 'true') {
			return true;
		} else if (value === false || value === 0 || value === 'false') {
			return false;
		} else {
			if (defaultValue !== undefined) {
				MRSErrorHandler.throwWrongTypeReplaced(key, 'boolean', defaultValue);
				return defaultValue;
			} else {
				MRSErrorHandler.throwWrongTypeRemoved(key, 'boolean');
			}
		}
	}

	static cleanArray(key: string, array: any[], cleaningFunction: (key: string, value: any, defaultValue?: any) => any): any[] {
		const cleanedArray: any[] = [];

		array.forEach((value: any, i: number) => {
			const cleanedValue: any = cleaningFunction(`${key}.${i}`, value);

			if (cleanedValue) {
				cleanedArray.push(cleanedValue);
			}
		});

		return cleanedArray;
	}

	static cleanStringArray(key: string, array: any[]): string[] {
		return MRSTypeCleaner.cleanArray(key, array, MRSTypeCleaner.cleanString);
	}

	static cleanConnectMode(key: string, value: any, defaultValue: MRSConnectMode): MRSConnectMode {
		switch (value) {
			case 'keepStart':
				return MRSConnectMode.keepStart;
			case 'center':
				return MRSConnectMode.center;
			case 'keepEnd':
				return MRSConnectMode.keepEnd;
			case MRSConnectMode.keepStart:
			case MRSConnectMode.center:
			case MRSConnectMode.keepEnd:
				return value;
			default:
				MRSErrorHandler.throwWrongTypeReplaced(key, 'ConnectMode', defaultValue);
				return defaultValue;
		}
	}

	static cleanLimitedSizeMode(key: string, value: any, defaultValue: MRSLimitedSizeMode): MRSLimitedSizeMode {
		switch (value) {
			case 'extendSize':
				return MRSLimitedSizeMode.extendSize;
			case 'shrinkRanges':
				return MRSLimitedSizeMode.shrinkRanges;
			case 'shrinkRangesProportionally':
				return MRSLimitedSizeMode.shrinkRangesProportionally;
			case MRSLimitedSizeMode.extendSize:
			case MRSLimitedSizeMode.shrinkRanges:
			case MRSLimitedSizeMode.shrinkRangesProportionally:
				return value;
			default:
				MRSErrorHandler.throwWrongTypeReplaced(key, 'LimitedSizeMode', defaultValue);
				return defaultValue;
		}
	}

	static cleanTooltipMode(key: string, value: any, defaultValue: MRSTooltipMode): MRSTooltipMode {
		switch (value) {
			case 'never':
				return MRSTooltipMode.never;
			case 'always':
				return MRSTooltipMode.always;
			case 'onHover':
				return MRSTooltipMode.onHover;
			case MRSTooltipMode.never:
			case MRSTooltipMode.always:
			case MRSTooltipMode.onHover:
				return value;
			default:
				MRSErrorHandler.throwWrongTypeReplaced(key, 'TooltipMode', defaultValue);
				return defaultValue;
		}
	}
}