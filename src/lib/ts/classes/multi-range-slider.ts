type MRS_Args = {
    name?: string;
    step?: number;
    min?: number;
    max?: number;
    fixToMin?: boolean;
    fixToMax?: boolean;
    ranges?: number | MRS_Range[];
    connectRanges?: boolean;
    allowContact?: boolean;
}

class MRS {
    private _defaultArgs: MRS_Args = {
        name: 'multi-range-slider',
        step: 1,
        min: 0,
        max: 100,
        fixToMin: false,
        fixToMax: false,
        ranges: 1,
        connectRanges: false,
        allowContact: true,
    }
    private _defaultRangeProps: any = {
        start: 0,
        startFixed: false,
        startConnectedTo: null,
        end: 100,
        endFixed: false,
        endConnectedTo: null,
    }

    private _element: HTMLElement;
    private _args: MRS_Args;
    private _slider: MRS_Slider;

    constructor(element: HTMLElement, args: any) {
        this._element = element;
        this._args = this.validateArgs(this.cleanArgs({ ...this.defaultArgs, ...args }));
        this._slider = new MRS_Slider(this);
    }

    public get defaultArgs(): MRS_Args {
        return { ...this._defaultArgs };
    }

    public get defaultRangeProps(): any {
        return { ...this._defaultRangeProps };
    }

    public get element(): HTMLElement {
        return this._element;
    }

    public get args(): MRS_Args {
        return this._args;
    }

    private cleanArgs(args: any): MRS_Args {
        let defaultArgs: MRS_Args = this.defaultArgs,
            cleanedArgs: MRS_Args = {};

        let cleanDefaultType = (key: string, type: string) => {
            if (typeof args[key] === type) {
                cleanedArgs[key] = args[key];
            } else {
                cleanedArgs[key] = defaultArgs[key];
                MRS.logW(`Property "${key}" is not of type ${type}! Defaul value "${defaultArgs[key]}" is used instead.`);
            }
        }

        let cleanBoolean = (key: string) => {
            if (args[key] === true || args[key] === 1 || args[key] === 'true') {
                cleanedArgs[key] = true;
            } else if (args[key] === false || args[key] === 0 || args[key] === 'false') {
                cleanedArgs[key] = false;
            } else {
                cleanedArgs[key] = defaultArgs[key];
                MRS.logW(`Property "${key}" is not of type boolean! Defaul value "${defaultArgs[key]}" is used instead.`);
            }
        }

        let cleanAndCreateRanges = () => {
            let ranges: any = args.ranges;
            let validRange = (range: Object): boolean => {
                return range.hasOwnProperty('start') && typeof range['start'] === 'number' && range.hasOwnProperty('end') && typeof range['end'] === 'number';
            }

            if (Array.isArray(ranges)) {
                // ranges is an array, check and create range objects
                let validRanges: Object[] = [];

                ranges.forEach((range: Object, i: number) => {
                    if (validRange(range)) {
                        validRanges.push(range);
                    } else {
                        MRS.logW(`Range on position ${i} is invalid and was removed!`);
                    }
                });

                cleanedArgs.ranges = validRanges.map((validRange: any, i: number) => {
                    return new MRS_Range(i, validRange);
                });
            } else if (typeof ranges === 'object') {
                // ranges is a single object, check and create range object
                if (validRange(ranges)) {
                    cleanedArgs.ranges = [new MRS_Range(0, ranges)];
                } else {
                    MRS.logW(`Range is invalid and was removed!`);
                }
            } else {
                if (typeof ranges !== 'number' || !Number.isInteger(ranges)) {
                    ranges = defaultArgs.ranges;
                    MRS.logW(`Property "ranges" is invalid! Defaul value "${defaultArgs.ranges}" is used instead.`);
                }

                cleanedArgs.ranges = ranges;
            }
        }

        cleanDefaultType('name', 'string');
        cleanDefaultType('step', 'number');
        cleanDefaultType('min', 'number');
        cleanDefaultType('max', 'number');
        cleanBoolean('fixToMin');
        cleanBoolean('fixToMax');
        cleanAndCreateRanges();
        cleanBoolean('connectRanges');
        cleanBoolean('allowContact');

        return cleanedArgs;
    }

    private validateArgs(args: MRS_Args): MRS_Args {
        let defaultArgs: MRS_Args = this.defaultArgs,
            validatedArgs: MRS_Args = {};

        // set bools, nothing to validate here
        validatedArgs.fixToMin = args.fixToMin;
        validatedArgs.fixToMax = args.fixToMax;
        validatedArgs.connectRanges = args.connectRanges;
        validatedArgs.allowContact = args.allowContact;

        if (typeof args.ranges === 'number') {
            // ranges is still a number, so we still have to create ranges

            // step has to be > 0
            validatedArgs.step = args.step > 0 ? args.step : defaultArgs.step;

            // calculate given and required size (step, ranges, allowContact)
            // minimal size of range = step; if contact is not allowed, add a step between them
            let givenSize: number = args.max - args.min,
                requiredSize: number = (args.ranges * validatedArgs.step) + (validatedArgs.allowContact ? 0 : ((args.ranges - 1) * validatedArgs.step));

            // given size has to be > required size, otherwise adjust max
            if (requiredSize > givenSize) {
                args.max = args.min + requiredSize;
            }

            // set min and max
            validatedArgs.min = args.min;
            validatedArgs.max = args.max;

            // now recalculate the validated given size and create the ranges based on it
            givenSize = validatedArgs.max - validatedArgs.min;
            let ranges: MRS_Range[] = [],
                rangeSize: number = (givenSize - (validatedArgs.allowContact ? 0 : ((args.ranges - 1) * validatedArgs.step))) / args.ranges,
                spaceBetweenRanges: number = validatedArgs.allowContact ? 0 : validatedArgs.step,
                iPrevious: any;

            for (let i = 0; i < args.ranges; i++) {
                let rangeProps = this.defaultRangeProps;

                if (i === 0) {
                    rangeProps.start = validatedArgs.min;
                    rangeProps.startFixed = validatedArgs.fixToMin;
                } else {
                    rangeProps.start = ranges[iPrevious].end + spaceBetweenRanges;
                    rangeProps.startConnectedTo = validatedArgs.connectRanges ? iPrevious : null;
                }

                if (i === args.ranges - 1) {
                    rangeProps.end = validatedArgs.max;
                    rangeProps.endFixed = validatedArgs.fixToMax;
                } else {
                    rangeProps.end = rangeProps.start + rangeSize;
                    rangeProps.endConnectedTo = validatedArgs.connectRanges ? i + 1 : null;
                }

                ranges.push(new MRS_Range(i, rangeProps));
                iPrevious = i;
            }

            validatedArgs.ranges = ranges;
        } else if (Array.isArray(args.ranges)) {
            // TODO
        }

        return validatedArgs;
    }

    static logM(message: string) {
        console.log(message);
    }

    static logW(message: string) {
        console.warn(message);
    }

    static logE(message: string) {
        console.error(message);
    }
}