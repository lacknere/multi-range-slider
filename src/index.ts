import { Args } from './lib/types/args';
import MultiRangeSlider from './lib/classes/multiRangeSlider';

declare global {
	interface HTMLElement {
		multiRangeSlider: (args: Args) => void;
		multiRangeSliderInstance: MultiRangeSlider;
	}
}

(() => {
	HTMLElement.prototype.multiRangeSlider = function (args: Args) {
		this.multiRangeSliderInstance = new MultiRangeSlider(this, args);
	};
})();