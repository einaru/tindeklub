/* vim: set ts=4 sw=4 sts=4 noet: */
;(function(w) {
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

	/*
	 * Initialize the image gallery carousel
	 */
	function initImgGallery() {

		var container = $('#img-container'),
			nav = $('#img-gallery').find('nav'),
			imgList = Object,
			swipeEnabled = false;

		function buildGallery() {

			container.html('<div id="img-list"><ul/></div>');
			imgList = $('#img-list');

			var arr = '';

			nav.find('a').each(function() {
				var $this = $(this),
					href = $this.attr('href');

				arr += '<li data-imgsrc="' + href + '"></li>';
			});

			imgList.find('ul').append(arr);

			nav.on('click', 'a', function(e) {

				var index = $(this).parent().index();

				e.preventDefault();

				if (swipeEnabled) {
					swiper.slide(index, 300);
				}

				loadImg(index);
				updateNav(index);

			});

			Modernizr.load({
				test: Modernizr.touch && Modernizr.csstransitions,
				yep: '/js/vendor/swipe.js',
				complete: function() {
					if (w.Swipe) {
						swipeEnabled = true;
						initSwipe();
					}
				}
			});

			// Load initial image
			loadImg(0);
			updateNav(0);
		}

		function initSwipe() {
			w.swiper = new Swipe(document.getElementById('img-list'), {
				callback: function(e, index, el) {
					updateNav(index);
					loadImg(index + 1);
				}
			});

			$('#img-list').on('touchstart', function(e) {
				loadImg(w.swiper.getPos() + 1);
			});
		}

		function loadImg(index) {

			var lis = imgList.find('li'),
				li = lis.eq(index),
				imgSrc = li.data('imgsrc'),
				placeholder = 'http://placehold.it/400x300&text=No image';

			if (!swipeEnabled) {
				lis.hide();
				li.show();
			}

			if (li.html() === '') {
				var img = $('<img>');

				li.addClass('loading');

				img.on('load', function() {
					$(this).hide();
					li.removeClass('loading');
					$(this).show();
				}).on('error', function() {
					console.log('Error loading image: ' + imgSrc);
					$(this).attr('src', placeholder);
					nav.hide();
				}).attr('src', imgSrc);

				img.appendTo(li);
			}
		}

		function updateNav(index) {

			nav.find('li').removeClass('active');
			nav.find('li').eq(index).addClass('active');

		}

		buildGallery();
	}
})(this);
