export const iterateObject = (object: any, callback: (key: string, value: any) => any, toType?: string) => {
	const splitKeys: string[] = [];

	const iterate = (obj: object) => {
		for (const objKey in obj) {
			if (obj.hasOwnProperty(objKey)) {
				splitKeys.push(objKey);
				const nestedObj: any = obj[objKey];

				if (typeof nestedObj === 'object' && !Array.isArray(nestedObj) && !(toType && nestedObj.constructor.name === toType)) {
					iterate(nestedObj);
				} else {
					const fullKey: string = splitKeys.join('.');

					const returnObj = callback(fullKey, nestedObj);
					if (returnObj !== undefined) {
						obj[objKey] = returnObj;
					}

					splitKeys.pop();
				}
			}
		}

		splitKeys.pop();
	};

	iterate(object);
};

export const getObjectKeys = (object: any, toType?: string): string[] => {
	const objKeys: string[] = [];

	iterateObject(object, (key: string, _) => {
		objKeys.push(key);
	}, toType);

	return objKeys;
};

export const getNestedProp = (object: any, key: string): any => {
	const splitKeys: string[] = key.split('.');

	if (splitKeys.length === 1) {
		return object[key];
	}

	let prop: any = object[splitKeys[0]];

	splitKeys.shift();
	splitKeys.forEach((splitKey: string) => {
		if (prop !== undefined) {
			prop = prop[splitKey];
		}
	});

	return prop;
};

export const setNestedProp = (object: any, key: string, value: any, deleteProp: boolean = false) => {
	let schema: any = object;  // a moving reference to internal objects within object
	const splitKeys: string[] = key.split('.'),
		keysLength: number = splitKeys.length;

	for (let i = 0; i < keysLength - 1; i++) {
		const propKey = splitKeys[i];

		if (!schema[propKey]) {
			schema[propKey] = {};
		}
		schema = schema[propKey];
	}

	if (!deleteProp) {
		schema[splitKeys[keysLength - 1]] = value;
	} else {
		delete schema[splitKeys[keysLength - 1]];
	}
};

export const nestedProp = (mode: 'get' | 'set' | 'delete', object: any, key: string, setValue?: any) => {
	let schema: any = object;  // a moving reference to internal objects within object
	const splitKeys: string[] = key.split('.'),
		keysLength: number = splitKeys.length;

	for (let i = 0; i < keysLength - 1; i++) {
		const propKey = splitKeys[i];

		if (mode === 'set' && !schema[propKey]) {
			schema[propKey] = {};
		}
		schema = schema[propKey];
	}

	const finalKey: string = splitKeys[keysLength - 1];

	switch (mode) {
		case 'get':
			return schema[finalKey];
		case 'set':
			schema[finalKey] = setValue;
			break;
		case 'delete':
			delete schema[finalKey];
			break;
	}
};