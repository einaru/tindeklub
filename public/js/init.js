(function(w) {
	$(document).ready(function() {

		/*
		 * Responsive navigation
		 */
		$('body').addClass('js');
		var $nav = $('#menu');
		var $navToggle = $('#nav-toggle');
		$navToggle.click(function() {
			$navToggle.toggleClass('active');
			$nav.toggleClass('active');
			return false;
		});

	});
})(this);
