var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function () {
    HTMLElement.prototype.multiRangeSlider = function (args) {
        this.mrs = new MRS(this, args);
    };
})();
var MRS = /** @class */ (function () {
    function MRS(element, args) {
        this._defaultArgs = {
            name: 'multi-range-slider',
            step: 1,
            min: 0,
            max: 100,
            fixToMin: false,
            fixToMax: false,
            ranges: 1,
            connectRanges: false,
            allowContact: true,
        };
        this._defaultRangeProps = {
            start: 0,
            startFixed: false,
            startConnectedTo: null,
            end: 100,
            endFixed: false,
            endConnectedTo: null,
        };
        this._element = element;
        this._args = this.validateArgs(this.cleanArgs(__assign(__assign({}, this.defaultArgs), args)));
        this._slider = new MRS_Slider(this);
    }
    Object.defineProperty(MRS.prototype, "defaultArgs", {
        get: function () {
            return __assign({}, this._defaultArgs);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS.prototype, "defaultRangeProps", {
        get: function () {
            return __assign({}, this._defaultRangeProps);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    MRS.prototype.cleanArgs = function (args) {
        var defaultArgs = this.defaultArgs, cleanedArgs = {};
        var cleanDefaultType = function (key, type) {
            if (typeof args[key] === type) {
                cleanedArgs[key] = args[key];
            }
            else {
                cleanedArgs[key] = defaultArgs[key];
                MRS.logW("Property \"" + key + "\" is not of type " + type + "! Defaul value \"" + defaultArgs[key] + "\" is used instead.");
            }
        };
        var cleanBoolean = function (key) {
            if (args[key] === true || args[key] === 1 || args[key] === 'true') {
                cleanedArgs[key] = true;
            }
            else if (args[key] === false || args[key] === 0 || args[key] === 'false') {
                cleanedArgs[key] = false;
            }
            else {
                cleanedArgs[key] = defaultArgs[key];
                MRS.logW("Property \"" + key + "\" is not of type boolean! Defaul value \"" + defaultArgs[key] + "\" is used instead.");
            }
        };
        var cleanAndCreateRanges = function () {
            var ranges = args.ranges;
            var validRange = function (range) {
                return range.hasOwnProperty('start') && typeof range['start'] === 'number' && range.hasOwnProperty('end') && typeof range['end'] === 'number';
            };
            if (Array.isArray(ranges)) {
                // ranges is an array, check and create range objects
                var validRanges_1 = [];
                ranges.forEach(function (range, i) {
                    if (validRange(range)) {
                        validRanges_1.push(range);
                    }
                    else {
                        MRS.logW("Range on position " + i + " is invalid and was removed!");
                    }
                });
                cleanedArgs.ranges = validRanges_1.map(function (validRange, i) {
                    return new MRS_Range(i, validRange);
                });
            }
            else if (typeof ranges === 'object') {
                // ranges is a single object, check and create range object
                if (validRange(ranges)) {
                    cleanedArgs.ranges = [new MRS_Range(0, ranges)];
                }
                else {
                    MRS.logW("Range is invalid and was removed!");
                }
            }
            else {
                if (typeof ranges !== 'number' || !Number.isInteger(ranges)) {
                    ranges = defaultArgs.ranges;
                    MRS.logW("Property \"ranges\" is invalid! Defaul value \"" + defaultArgs.ranges + "\" is used instead.");
                }
                cleanedArgs.ranges = ranges;
            }
        };
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
    };
    MRS.prototype.validateArgs = function (args) {
        var defaultArgs = this.defaultArgs, validatedArgs = {};
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
            var givenSize = args.max - args.min, requiredSize = (args.ranges * validatedArgs.step) + (validatedArgs.allowContact ? 0 : ((args.ranges - 1) * validatedArgs.step));
            // given size has to be > required size, otherwise adjust max
            if (requiredSize > givenSize) {
                args.max = args.min + requiredSize;
            }
            // set min and max
            validatedArgs.min = args.min;
            validatedArgs.max = args.max;
            // now recalculate the validated given size and create the ranges based on it
            givenSize = validatedArgs.max - validatedArgs.min;
            var ranges = [], rangeSize = (givenSize - (validatedArgs.allowContact ? 0 : ((args.ranges - 1) * validatedArgs.step))) / args.ranges, spaceBetweenRanges = validatedArgs.allowContact ? 0 : validatedArgs.step, iPrevious = void 0;
            for (var i = 0; i < args.ranges; i++) {
                var rangeProps = this.defaultRangeProps;
                if (i === 0) {
                    rangeProps.start = validatedArgs.min;
                    rangeProps.startFixed = validatedArgs.fixToMin;
                }
                else {
                    rangeProps.start = ranges[iPrevious].end + spaceBetweenRanges;
                    rangeProps.startConnectedTo = validatedArgs.connectRanges ? iPrevious : null;
                }
                if (i === args.ranges - 1) {
                    rangeProps.end = validatedArgs.max;
                    rangeProps.endFixed = validatedArgs.fixToMax;
                }
                else {
                    rangeProps.end = rangeProps.start + rangeSize;
                    rangeProps.endConnectedTo = validatedArgs.connectRanges ? i + 1 : null;
                }
                ranges.push(new MRS_Range(i, rangeProps));
                iPrevious = i;
            }
            validatedArgs.ranges = ranges;
        }
        else if (Array.isArray(args.ranges)) {
            // TODO
        }
        return validatedArgs;
    };
    MRS.logM = function (message) {
        console.log(message);
    };
    MRS.logW = function (message) {
        console.warn(message);
    };
    MRS.logE = function (message) {
        console.error(message);
    };
    return MRS;
}());
var MRS_Range = /** @class */ (function () {
    function MRS_Range(index, range) {
        this._index = index;
        if (range) {
            this._start = range.start;
            this._startFixed = range.startFixed;
            this._startConnectedTo = range.startConnectedTo;
            this._end = range.end;
            this._endFixed = range.endFixed;
            this._endConnectedTo = range.endConnectedTo;
        }
    }
    Object.defineProperty(MRS_Range.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    return MRS_Range;
}());
var MRS_Slider = /** @class */ (function () {
    function MRS_Slider(mrs) {
        this._mrs = mrs;
        console.log(this.ranges);
        this.buildHTML();
    }
    Object.defineProperty(MRS_Slider.prototype, "mrs", {
        get: function () {
            return this._mrs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Slider.prototype, "ranges", {
        get: function () {
            return this.mrs.args.ranges;
        },
        enumerable: true,
        configurable: true
    });
    MRS_Slider.prototype.buildHTML = function () {
        var args = this.mrs.args;
        var element = this.mrs.element;
    };
    return MRS_Slider;
}());
