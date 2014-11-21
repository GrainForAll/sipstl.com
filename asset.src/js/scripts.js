var player = null;
var iphoneSwiper = null;
var activeIndex = 1;


// Swiper for small viewport only.
// We load it on both so we don't have to check for window resize.
$(function(){
	iphoneSwiper = $('.iphone-wrapper-small').find('.swiper-container').swiper({
		mode:'horizontal',
		loop: true,
		autoplay: 3000,
		pagination: '.pagination-wrapper-small',
		createPagination: true,
		paginationClickable: false
	});

	iphoneSwiper.startAutoplay();
});

$(function() {
	$('.swiper-pagination-switch').click(function() {
		if (!$(this).hasClass('swiper-active-switch')) {
			activeIndex = parseInt($(this).attr('data-index'), 10);
			_changePagination(activeIndex);
		}
	});

	$('.iphone-wrapper .left-arrow-wrapper').click(function() {
		activeIndex--;
		if (activeIndex < 1) {
			activeIndex = 6;
		}
		_changePagination(activeIndex);
	});

	$('.iphone-wrapper .right-arrow-wrapper').click(function() {
		activeIndex++;
		if (activeIndex > 6) {
			activeIndex = 1;
		}
		_changePagination(activeIndex);
	});

	$('.iphone-wrapper-small .left-arrow-wrapper').click(function() {
		iphoneSwiper.stopAutoplay();
		iphoneSwiper.swipePrev();
	});

	$('.iphone-wrapper-small .right-arrow-wrapper').click(function() {
		iphoneSwiper.stopAutoplay();
		iphoneSwiper.swipeNext();
	});

	$('.video-wrapper iframe').load(function() {

		player = $f(document.getElementById('promotional-video'));

		player.addEvent('ready', function(id) {
		
			player.addEvent('play', _onVideoPlay);
			player.addEvent('playProgress', _onVideoPlayProgress);
			player.addEvent('pause', _onVideoPause);
			player.addEvent('finish', _onVideoFinish);

			var played = localStorage.getItem('sipSTLVideoPlay');

			if (played !== 'true') {

				if ($('html').hasClass('no-touch')) {

					if ($(window).width() > 900) {
						player.api('play');
						localStorage.setItem('sipSTLVideoPlay', 'true');
					}
				}
			}
		});
	});
});

function _changePagination(index) {

	var activeItem = $('.iphone-wrapper').find('.swiper-slide[data-index=' + index + ']');
	$('.swiper-pagination-switch').each(function() {
		$(this).removeClass('swiper-active-switch');
	});

	$('.pagination-wrapper .swiper-pagination-switch[data-index=' + index + ']').addClass('swiper-active-switch');

	$('.iphone-wrapper').find('.swiper-slide').removeClass('visible-fade-slow');
	$('.iphone-wrapper').find('.swiper-slide[data-index=' + index + ']').addClass('visible-fade-slow');
}

function _onVideoFinish(id) {
	$('html, body').animate( { scrollTop: $('.iphone-wrapper').offset().top - 40 }, 1200, 'easeOutExpo', function() {});
}

function _onVideoPlay(id) {
	$('html, body').animate( { scrollTop: 0 }, 400, 'easeOutExpo', function() {
		$('body').addClass('video-playing');
	});
}

function _onVideoPlayProgress(id) {
}

function _onVideoPause(id) {
	$('body').removeClass('video-playing');
}

