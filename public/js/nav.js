(function(w) {
	$(document).ready(function() {
		$('body').addClass('js');
		var $menu = $('#menu');
		var $navToggle = $('#nav-toggle');

		$navToggle.click(function() {
			$navToggle.toggleClass('active');
			$menu.toggleClass('active');
			return false;
		});
	});
})(this);
