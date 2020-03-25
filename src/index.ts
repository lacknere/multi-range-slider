interface HTMLElement {
    multiRangeSlider: Function
    mrs: MRS
}

(function () {
    HTMLElement.prototype.multiRangeSlider = function (args: MRS_Args) {
        this.mrs = new MRS(this, args);
    }
})()