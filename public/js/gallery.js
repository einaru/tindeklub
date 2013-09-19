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
		initImgGallery();
	});

	function initImgGallery() {

		var nav = $('#slider').find('nav'),
			wrapper = $('#wrapper'),
			swipeEnabled = false;

		yepnope({
			test: window.Swipe,
			nope: 'http://cdnjs.cloudflare.com/ajax/libs/swipe/2.0/swipe.min.js',
			callback: function() {
				if (window.Swipe) {
					swipeEnabled = true;
					initSwipe();
				}
			}
		});

		nav.on('click', 'a', function(e) {
			var index = $(this).index();

			e.preventDefault();

			loadImg(index);

			if (swipeEnabled) {
				slider.slide(index);
			}

			updateNav(index);
		});

		function initSwipe() {
			window.slider = new Swipe(document.getElementById('slider'), {
				callback: function(index, element) {
					updateNav(index);
					loadImg(index + 1);
				}
			});
			wrapper.on('touchstart', function(e) {
				loadImg(window.slider.getPos() + 1);
			});
		}

		function loadImg(index) {
			var imgs = $('#wrapper').find('img'),
				img = imgs.eq(index),
				imgSrc = img.data('imgsrc');

			if (!swipeEnabled) {
				// TODO make gallery work without swipe enabled also
			}

			if (img.attr('src') !== imgSrc) {
				img.on('load', function() {
					var $this = $(this);
					$this.hide();
					console.log('loading image: ' + index);
					$this.show();
				}).on('error', function() {
					console.log('error loading image: ' + index);
				});
				img.attr('src', imgSrc);
			}
		}

		function updateNav(index) {
			nav.find('a').removeClass('active');
			nav.find('a').eq(index).addClass('active');
		}

		loadImg(0);
		updateNav(0);
	}
})(Zepto);
