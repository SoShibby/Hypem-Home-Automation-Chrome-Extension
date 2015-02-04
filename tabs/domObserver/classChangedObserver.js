/*
	A jQuery extension used for getting a callback every time a class attribute has been added or removed from a DOM element
*/
(function($) {
    $.fn.classChanged = function(callback) {
        this.attributeChanged('class', callback);
    }
})(jQuery);
