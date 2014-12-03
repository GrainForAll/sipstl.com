var player = null;
var iphoneSwiper = null;
var iphoneSwiperInterval = null;
var activeIndex = 1;
var playedBefore = true;

// var played = localStorage.getItem('sipSTLVideoPlay');
// if (played === 'true') {
	// playedBefore = true;
// }


$(function() {
	$('.video-wrapper iframe').load(function() {

		player = $f(document.getElementById('promotional-video'));

		player.addEvent('ready', function(id) {
		
			player.addEvent('play', _onVideoPlay);
			player.addEvent('playProgress', _onVideoPlayProgress);
			player.addEvent('pause', _onVideoPause);
			player.addEvent('finish', _onVideoFinish);

			if (!playedBefore && !isTouch() && ($(window).width() > 900)) {
				// player.api('play');
				// localStorage.setItem('sipSTLVideoPlay', 'true');
			}
		});
	});

	iphoneSwiper = $('.iphone-wrapper-small').find('.swiper-container').swiper({
		mode:'horizontal',
		loop: true,
		autoplay: 3000,
		pagination: '.pagination-wrapper-small',
		createPagination: true,
		paginationClickable: false
	});

	iphoneSwiper.startAutoplay();

	var imgLoadiPhoneWrapperLarge = imagesLoaded($('.iphone-wrapper'));
		imgLoadiPhoneWrapperLarge.on('done', function() {
			$('.iphone-wrapper').addClass('visible-fade-slow');
			$('.pagination-wrapper').addClass('visible-fade-slow');
		});

	var imgLoadiPhoneWrapperSmall = imagesLoaded($('.iphone-wrapper-small'));
		imgLoadiPhoneWrapperLarge.on('done', function() {
			$('.iphone-wrapper-small').addClass('visible-fade-slow');
			$('.pagination-wrapper-small').addClass('visible-fade-slow');
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

	$('.swiper-pagination-switch').tapClick( function() {
		if (!$(this).hasClass('swiper-active-switch')) {
			activeIndex = parseInt($(this).attr('data-index'), 10);
			_changePagination(activeIndex);
		}
	});

	_startPaginationCycle();

	$('.video-outer-wrapper').addClass('visible-fade-ultra-slow');
	$('.content-outer-wrapper').addClass('visible-fade-slow');

});


/*
 * Pagination functions (only for large pagination, which is handled through custom functions)
*/
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



/*
 * Vimeo event functions
*/
function _onVideoPlay(id) {
	if (!playedBefore && !isTouch()) {
		$('html, body').animate( { scrollTop: 0 }, 400, 'easeOutExpo', function() {
			$('body').addClass('video-playing');
			$('.logo-wrapper').slideUp();
			$('.content-outer-wrapper').removeClass('visible-fade-slow');
		});
	} else {
		$('html, body').animate( { scrollTop: 0 }, 400, 'easeOutExpo', function() {});
	}
}

function _onVideoPlayProgress(id) {
}

function _onVideoPause(id) {
	if (!playedBefore && !isTouch()) {
		$('body').removeClass('video-playing');
		$('.logo-wrapper').slideDown();
		$('.content-outer-wrapper').addClass('visible-fade-slow');
	}
}

function _onVideoFinish(id) {
	$('html, body').animate( { scrollTop: $('.iphone-wrapper').offset().top - 40 }, 1200, 'easeOutExpo', function() {});
}