/*
	A jQuery extension used for getting a callback every time an attribute has been changed on a DOM element
*/
(function($) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    $.fn.attributeChanged = function(attributeName, callback) {
		if (MutationObserver) {
            var options = {
                subtree: false,
                attributes: true
            };

            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(e) {
					if(e.attributeName === attributeName){		//Check if the attribute that has been changed is the one we are looking for. Valid attributeNames are id, class, style etc.
						callback();								//Report back that the attribute we are looking for has been changed
					}
                });
            });

            return this.each(function() {
                observer.observe(this, options);
            });

        }
    }
})(jQuery);