/*
	A jQuery extension used for getting a callback every time a style attribute has been changed on a DOM element
*/
(function($) {
    $.fn.styleChanged = function(callback) {
        this.attributeChanged('style', callback);
    }
})(jQuery);
