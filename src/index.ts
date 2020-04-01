interface HTMLElement {
	multiRangeSlider: (args: MRSArgs) => void;
	mrs: MRS;
}

(() => {
	HTMLElement.prototype.multiRangeSlider = function (args: MRSArgs) {
		this.mrs = new MRS(this, args);
	};
})();