interface HTMLElement {
	multiRangeSlider: (args: MRS_Args) => void;
	mrs: MRS;
}

(() => {
	HTMLElement.prototype.multiRangeSlider = function (args: MRS_Args) {
		this.mrs = new MRS(this, args);
	};
})();