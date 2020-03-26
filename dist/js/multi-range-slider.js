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
var MRS_LimitedSizeMode;
(function (MRS_LimitedSizeMode) {
    MRS_LimitedSizeMode[MRS_LimitedSizeMode["extendSize"] = 0] = "extendSize";
    MRS_LimitedSizeMode[MRS_LimitedSizeMode["shrinkRanges"] = 1] = "shrinkRanges";
    MRS_LimitedSizeMode[MRS_LimitedSizeMode["shrinkRangesProportionally"] = 2] = "shrinkRangesProportionally";
})(MRS_LimitedSizeMode || (MRS_LimitedSizeMode = {}));
var MRS = /** @class */ (function () {
    function MRS(element, args) {
        this._defaultArgs = {
            name: 'multi-range-slider',
            step: 1,
            min: 0,
            max: 100,
            autoMinMax: false,
            fixToMin: false,
            fixToMax: false,
            allowContact: true,
            ranges: 1,
            connectRanges: false,
            limitedSizeMode: MRS_LimitedSizeMode.extendSize,
        };
        this._defaultRangeProps = {
            start: 0,
            startFixed: false,
            startConnectedTo: null,
            end: 100,
            endFixed: false,
            endConnectedTo: null,
            minSize: 1,
        };
        this._element = element;
        this._args = this.validateArgs(__assign(__assign({}, this.defaultArgs), args));
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
        var _this = this;
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
                var cleanedRanges_1 = [];
                ranges.forEach(function (range, i) {
                    if (validRange(range)) {
                        cleanedRanges_1.push(new MRS_Range(i, __assign(__assign({}, _this.defaultRangeProps), range)));
                    }
                    else {
                        MRS.logW("Range on position " + i + " is invalid and was removed!");
                    }
                });
                cleanedArgs.ranges = cleanedRanges_1.map(function (cleanedRange, i) {
                    return new MRS_Range(i, cleanedRange);
                });
            }
            else if (typeof ranges === 'object') {
                // ranges is a single object, check and create array with range object
                if (validRange(ranges)) {
                    cleanedArgs.ranges = [new MRS_Range(0, __assign(__assign({}, _this.defaultRangeProps), ranges))];
                }
                else {
                    cleanedArgs.ranges = 1;
                    MRS.logW("Range is invalid and was replaced by default range!");
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
        var cleanLimitedSizeMode = function () {
            switch (args.limitedSizeMode) {
                case 'extendSize':
                    cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.extendSize;
                    break;
                case 'shrinkRanges':
                    cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.shrinkRanges;
                    break;
                case 'shrinkRangesProportionally':
                    cleanedArgs.limitedSizeMode = MRS_LimitedSizeMode.shrinkRangesProportionally;
                    break;
                case MRS_LimitedSizeMode.extendSize:
                case MRS_LimitedSizeMode.shrinkRanges:
                case MRS_LimitedSizeMode.shrinkRangesProportionally:
                    cleanedArgs.limitedSizeMode = args.limitedSizeMode;
                    break;
                default:
                    cleanedArgs.limitedSizeMode = defaultArgs.limitedSizeMode;
                    break;
            }
        };
        cleanDefaultType('name', 'string');
        cleanDefaultType('step', 'number');
        // need to validate step here and set it as default range min size
        // step has to be > 0
        cleanedArgs.step = cleanedArgs.step > 0 ? cleanedArgs.step : defaultArgs.step;
        this._defaultRangeProps.minSize = cleanedArgs.step;
        cleanDefaultType('min', 'number');
        cleanDefaultType('max', 'number');
        cleanBoolean('autoMinMax');
        cleanBoolean('fixToMin');
        cleanBoolean('fixToMax');
        cleanBoolean('allowContact');
        cleanAndCreateRanges();
        cleanBoolean('connectRanges');
        cleanLimitedSizeMode();
        return cleanedArgs;
    };
    MRS.prototype.validateArgs = function (args) {
        args = this.cleanArgs(args);
        var defaultArgs = this.defaultArgs, validatedArgs = {};
        var getMinRequiredSize = function (rangesLength) {
            return (rangesLength * validatedArgs.step) + (validatedArgs.allowContact ? 0 : ((rangesLength - 1) * validatedArgs.step));
        };
        // step has already been validated
        validatedArgs.step = args.step;
        // set min and max and change them later if needed
        validatedArgs.min = args.min;
        validatedArgs.max = args.max;
        // set bools and limitedSizeMode (autoMinMax = true forces extendSize)
        validatedArgs.autoMinMax = args.autoMinMax;
        validatedArgs.fixToMin = args.fixToMin;
        validatedArgs.fixToMax = args.fixToMax;
        validatedArgs.allowContact = args.allowContact;
        validatedArgs.connectRanges = args.connectRanges;
        validatedArgs.limitedSizeMode = validatedArgs.autoMinMax ? MRS_LimitedSizeMode.extendSize : args.limitedSizeMode;
        if (typeof args.ranges === 'number') {
            // ranges is still a number, so we still have to create ranges
            // calculate min required size
            // minimal size of range = step; if contact is not allowed, add a step between them
            var minRequiredSize = getMinRequiredSize(args.ranges), givenSize = void 0;
            if (validatedArgs.autoMinMax) {
                // autoMinMax activated, so we set size to min required size
                validatedArgs.min = 0;
                validatedArgs.max = minRequiredSize;
            }
            else {
                // calculate given size
                givenSize = validatedArgs.max - validatedArgs.min;
                // given size has to be > min required size, otherwise adjust max
                if (minRequiredSize > givenSize) {
                    validatedArgs.max = validatedArgs.min + minRequiredSize;
                }
            }
            // now (re)calculate the validated given size and create the ranges based on it
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
            // ranges is an array of ranges already, validate them
            // make sure start > previous range end, end > start and connect if connectRanges = true
            var previousRange = void 0, spaceBetweenRanges = validatedArgs.allowContact ? 0 : validatedArgs.step;
            for (var i = 0; i < args.ranges.length; i++) {
                var range = args.ranges[i], minStart = previousRange ? previousRange.end + spaceBetweenRanges : null, firstRange = !previousRange, lastRange = i === args.ranges.length - 1;
                range.start = previousRange ? (range.start < minStart || validatedArgs.connectRanges ? minStart : range.start) : range.start;
                range.startFixed = validatedArgs.fixToMin && firstRange;
                range.startConnectedTo = validatedArgs.connectRanges && !firstRange ? previousRange.index : null;
                var minEnd = range.start + validatedArgs.step;
                range.end = range.end < minEnd ? minEnd : range.end;
                range.endFixed = validatedArgs.fixToMax && lastRange;
                range.endConnectedTo = validatedArgs.connectRanges && !lastRange ? i + 1 : null;
                previousRange = range;
            }
            validatedArgs.ranges = args.ranges;
            var extendSize = function () {
                validatedArgs.ranges = validatedArgs.ranges;
                var firstRange = validatedArgs.ranges[0], lastRange = validatedArgs.ranges[validatedArgs.ranges.length - 1];
                validatedArgs.min = validatedArgs.autoMinMax || firstRange.start < validatedArgs.min ? firstRange.start : validatedArgs.min;
                validatedArgs.max = validatedArgs.autoMinMax || lastRange.end > validatedArgs.max ? lastRange.end : validatedArgs.max;
            };
            var shrinkRanges = function () {
                validatedArgs.ranges = validatedArgs.ranges;
                var givenSize = validatedArgs.max - validatedArgs.min, minRequiredSize = getMinRequiredSize(validatedArgs.ranges.length);
                // check if it is even possible to shrink it to given size
                if (minRequiredSize > givenSize) {
                    return false;
                }
                var firstRange = true, previousRangeEnd = validatedArgs.min, lastRange = true, previousRangeStart = validatedArgs.max, spaceBetweenRanges = validatedArgs.allowContact ? 0 : validatedArgs.step, i = 0;
                while (i < validatedArgs.ranges.length) {
                    var range = validatedArgs.ranges[i], shrinkBy = previousRangeEnd - range.start + (firstRange ? 0 : spaceBetweenRanges);
                    if (shrinkBy <= 0) {
                        break;
                    }
                    firstRange = false;
                    previousRangeEnd = range.shrinkBy(shrinkBy, 'start');
                    i++;
                }
                i = validatedArgs.ranges.length - 1;
                while (i >= 0) {
                    var range = validatedArgs.ranges[i], shrinkBy = range.end - previousRangeStart + (lastRange ? 0 : spaceBetweenRanges);
                    console.log(range.end);
                    console.log(previousRangeStart);
                    if (shrinkBy <= 0) {
                        break;
                    }
                    lastRange = false;
                    previousRangeStart = range.shrinkBy(shrinkBy, 'end');
                    i--;
                }
                return true;
            };
            if (validatedArgs.ranges.length > 0) {
                switch (validatedArgs.limitedSizeMode) {
                    case MRS_LimitedSizeMode.extendSize:
                        extendSize();
                        break;
                    case MRS_LimitedSizeMode.shrinkRanges:
                        // in case shrinking ranges is not possible, extend size instead
                        if (!shrinkRanges()) {
                            extendSize();
                        }
                        break;
                    case MRS_LimitedSizeMode.shrinkRangesProportionally:
                        break;
                }
            }
        }
        if (validatedArgs.fixToMin) {
            validatedArgs.ranges[0].start = validatedArgs.min;
        }
        if (validatedArgs.fixToMax) {
            validatedArgs.ranges[validatedArgs.ranges.length - 1].end = validatedArgs.max;
        }
        console.log(validatedArgs);
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
        this._start = range.start;
        this._startFixed = range.startFixed;
        this._startConnectedTo = range.startConnectedTo;
        this._end = range.end;
        this._endFixed = range.endFixed;
        this._endConnectedTo = range.endConnectedTo;
        this._minSize = range.minSize;
    }
    Object.defineProperty(MRS_Range.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "start", {
        get: function () {
            return this._start;
        },
        set: function (start) {
            this._start = start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "end", {
        get: function () {
            return this._end;
        },
        set: function (end) {
            this._end = end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "minSize", {
        get: function () {
            return this._minSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "size", {
        get: function () {
            return this.end - this.start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "isShrinkable", {
        get: function () {
            return this.size > this._minSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "startFixed", {
        set: function (startFixed) {
            this._startFixed = startFixed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "startConnectedTo", {
        set: function (startConnectedTo) {
            this._startConnectedTo = startConnectedTo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "endFixed", {
        set: function (endFixed) {
            this._endFixed = endFixed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Range.prototype, "endConnectedTo", {
        set: function (endConnectedTo) {
            this._endConnectedTo = endConnectedTo;
        },
        enumerable: true,
        configurable: true
    });
    // shrink range, reposition it and return new range start/end
    MRS_Range.prototype.shrinkBy = function (value, from) {
        var maxShrink = this.size - this.minSize, shrinkBy = value > maxShrink ? maxShrink : value, leftover = value - shrinkBy;
        switch (from) {
            case 'start':
                this.start += value;
                this.end += leftover;
                return this.end;
            case 'end':
                this.start -= leftover;
                this.end -= value;
                return this.start;
        }
    };
    return MRS_Range;
}());
var MRS_Slider = /** @class */ (function () {
    function MRS_Slider(mrs) {
        this._mrs = mrs;
        console.log(this.ranges);
        this.buildHTML();
    }
    Object.defineProperty(MRS_Slider.prototype, "args", {
        get: function () {
            return this._mrs.args;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Slider.prototype, "element", {
        get: function () {
            return this._mrs.element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MRS_Slider.prototype, "ranges", {
        get: function () {
            return this._mrs.args.ranges;
        },
        enumerable: true,
        configurable: true
    });
    MRS_Slider.prototype.buildHTML = function () {
        var args = this.args;
        var element = this.element;
    };
    return MRS_Slider;
}());
