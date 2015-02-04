/*
	A jQuery extension used for getting a callback every time a child element has been added or removed from a DOM element
*/
(function($) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    $.fn.childChanged = function(callback) {
		if (MutationObserver) {
            var options = {
                childList: true,
				characterData: true,
				subtree: true
            };

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
					callback();
                });
            });

            return this.each(function() {
                observer.observe(this, options);
            });

        }
    }
})(jQuery);