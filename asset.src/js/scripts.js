var player = null;
var iphoneSwiper = null;
var iphoneSwiperInterval = null;
var activeIndex = 1;
var playedBefore = false;

var played = localStorage.getItem('sipSTLVideoPlay');
if (played == 'true') {
	playedBefore = true;
}



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

	_startPaginationCycle();

	var imgLoadiPhoneWrapperLarge = imagesLoaded($('.iphone-wrapper'));

	// Once images are loaded
	imgLoadiPhoneWrapperLarge.on('done', function() {
		$('.iphone-wrapper').addClass('visible-fade-slow');
		$('.pagination-wrapper').addClass('visible-fade-slow');
	});

	var imgLoadiPhoneWrapperSmall = imagesLoaded($('.iphone-wrapper-small'));

	// Once images are loaded
	imgLoadiPhoneWrapperLarge.on('done', function() {
		$('.iphone-wrapper-small').addClass('visible-fade-slow');
		$('.pagination-wrapper-small').addClass('visible-fade-slow');
	});


	

	$('.swiper-pagination-switch').tapClick( function() {
		if (!$(this).hasClass('swiper-active-switch')) {
			activeIndex = parseInt($(this).attr('data-index'), 10);
			_changePagination(activeIndex);
		}
	});



	$('.iphone-wrapper .left-arrow-wrapper').tapClick( function() {
		_stopPaginationCycle();
		activeIndex--;
		if (activeIndex < 1) {
			activeIndex = 6;
		}
		_changePagination(activeIndex);
	});

	$('.iphone-wrapper .right-arrow-wrapper').tapClick( function() {
		_stopPaginationCycle();
		activeIndex++;
		if (activeIndex > 6) {
			activeIndex = 1;
		}
		_changePagination(activeIndex);
	});

	$('.iphone-wrapper-small .left-arrow-wrapper').tapClick( function() {
		iphoneSwiper.stopAutoplay();
		iphoneSwiper.swipePrev();
	});

	$('.iphone-wrapper-small .right-arrow-wrapper').tapClick( function() {
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

			if (!playedBefore) {

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

function _startPaginationCycle() {

	iphoneSwiperInterval = setInterval(function(){

		activeIndex++;
		if (activeIndex > 6) {
			activeIndex = 1;
		}
		_changePagination(activeIndex);

	}, 2000);
}

function _stopPaginationCycle() {
	clearInterval(iphoneSwiperInterval);
}

function _changePagination(index) {

	var activeItem = $('.iphone-wrapper').find('.swiper-slide[data-index=' + index + ']');
	$('.pagination-wrapper .swiper-pagination-switch').each(function() {
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
	if (!playedBefore) {
		$('html, body').animate( { scrollTop: 0 }, 400, 'easeOutExpo', function() {
			$('body').addClass('video-playing');
		});
	} else {
		$('html, body').animate( { scrollTop: 0 }, 400, 'easeOutExpo', function() {});
	}
}

function _onVideoPlayProgress(id) {
}

function _onVideoPause(id) {
	if (!playedBefore) {
		$('body').removeClass('video-playing');
	}
}