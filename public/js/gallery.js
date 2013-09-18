/*
 * gallery.js
 *
 * Copyright (c) 2013 Einar Uvsløkk
 * GNU General Public License (GPL) version 3 or later
 */

;(function($) {

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

		/*
		 * Image gallery
		 */
		yepnope({
			load: 'http://cdnjs.cloudflare.com/ajax/libs/swipe/2.0/swipe.min.js',
			complete: function() {
				if (window.Swipe) {
					window.slider = new Swipe(document.getElementById('slider'), {
						callback: function(index, element) {
							console.log('index = ' + index);
							updateNav(index);
							loadImg(index + 1);
						}
					});
				}
			}
		});

		var nav = $('#slider').find('nav');

		nav.on('click', 'a', function(e) {
			var index = $(this).index();
			e.preventDefault();

			slider.slide(index, 300);

			updateNav(index);
			loadImg(index);
		});

		function loadImg(index) {
			var img = $('#wrapper').find('img').eq(index);
			img.attr('src', img.data('imgsrc'));
		}

		function updateNav(index) {
			nav.find('a').removeClass('active');
			nav.find('a').eq(index).addClass('active');
		}

		loadImg(0);
		updateNav(0);
	});
})(Zepto);
