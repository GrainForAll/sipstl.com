$.fn.extend({
	tapClick:function(callback) {
		if ($('html').hasClass('touch')) {
			return $(this).bind('tap', callback);
		} else {
			return $(this).click(callback);
		}
	}
});