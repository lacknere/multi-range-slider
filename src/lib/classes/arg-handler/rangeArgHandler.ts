import ArgHandler from './argHandler';

export default class RangeArgHandler extends ArgHandler {
	get defaultArgs(): RangeArgs {
		return new RangeArgs(this);
	}
}

// RangeArgs indirectly imports RangeArgHandler, so we need to import it, after ArgHandler is fully loaded.
import RangeArgs from './args/rangeArgs';
