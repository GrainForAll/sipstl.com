// Init style shamelessly stolen from jQuery http://jquery.com
var Froogaloop = (function(){
    // Define a local copy of Froogaloop
    function Froogaloop(iframe) {
        // The Froogaloop object is actually just the init constructor
        return new Froogaloop.fn.init(iframe);
    }

    var eventCallbacks = {},
        hasWindowEvent = false,
        isReady = false,
        slice = Array.prototype.slice,
        playerDomain = '';

    Froogaloop.fn = Froogaloop.prototype = {
        element: null,

        init: function(iframe) {
            if (typeof iframe === "string") {
                iframe = document.getElementById(iframe);
            }

            this.element = iframe;

            // Register message event listeners
            playerDomain = getDomainFromUrl(this.element.getAttribute('src'));

            return this;
        },

        /*
         * Calls a function to act upon the player.
         *
         * @param {string} method The name of the Javascript API method to call. Eg: 'play'.
         * @param {Array|Function} valueOrCallback params Array of parameters to pass when calling an API method
         *                                or callback function when the method returns a value.
         */
        api: function(method, valueOrCallback) {
            if (!this.element || !method) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                params = !isFunction(valueOrCallback) ? valueOrCallback : null,
                callback = isFunction(valueOrCallback) ? valueOrCallback : null;

            // Store the callback for get functions
            if (callback) {
                storeCallback(method, callback, target_id);
            }

            postMessage(method, params, element);
            return self;
        },

        /*
         * Registers an event listener and a callback function that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to listen for.
         * @param callback (Function): Function that should be called when the event fires.
         */
        addEvent: function(eventName, callback) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null;


            storeCallback(eventName, callback, target_id);

            // The ready event is not registered via postMessage. It fires regardless.
            if (eventName != 'ready') {
                postMessage('addEventListener', eventName, element);
            }
            else if (eventName == 'ready' && isReady) {
                callback.call(null, target_id);
            }

            return self;
        },

        /*
         * Unregisters an event listener that gets called when the event fires.
         *
         * @param eventName (String): Name of the event to stop listening for.
         */
        removeEvent: function(eventName) {
            if (!this.element) {
                return false;
            }

            var self = this,
                element = self.element,
                target_id = element.id !== '' ? element.id : null,
                removed = removeCallback(eventName, target_id);

            // The ready event is not registered
            if (eventName != 'ready' && removed) {
                postMessage('removeEventListener', eventName, element);
            }
        }
    };

    /**
     * Handles posting a message to the parent window.
     *
     * @param method (String): name of the method to call inside the player. For api calls
     * this is the name of the api method (api_play or api_pause) while for events this method
     * is api_addEventListener.
     * @param params (Object or Array): List of parameters to submit to the method. Can be either
     * a single param or an array list of parameters.
     * @param target (HTMLElement): Target iframe to post the message to.
     */
    function postMessage(method, params, target) {
        if (!target.contentWindow.postMessage) {
            return false;
        }

        var url = target.getAttribute('src').split('?')[0],
            data = JSON.stringify({
                method: method,
                value: params
            });

        if (url.substr(0, 2) === '//') {
            url = window.location.protocol + url;
        }

        target.contentWindow.postMessage(data, url);
    }

    /**
     * Event that fires whenever the window receives a message from its parent
     * via window.postMessage.
     */
    function onMessageReceived(event) {
        var data, method;

        try {
            data = JSON.parse(event.data);
            method = data.event || data.method;
        }
        catch(e)  {
            //fail silently... like a ninja!
        }

        if (method == 'ready' && !isReady) {
            isReady = true;
        }

        // Handles messages from moogaloop only
        if (event.origin != playerDomain) {
            return false;
        }

        var value = data.value,
            eventData = data.data,
            target_id = target_id === '' ? null : data.player_id,

            callback = getCallback(method, target_id),
            params = [];

        if (!callback) {
            return false;
        }

        if (value !== undefined) {
            params.push(value);
        }

        if (eventData) {
            params.push(eventData);
        }

        if (target_id) {
            params.push(target_id);
        }

        return params.length > 0 ? callback.apply(null, params) : callback.call();
    }


    /**
     * Stores submitted callbacks for each iframe being tracked and each
     * event for that iframe.
     *
     * @param eventName (String): Name of the event. Eg. api_onPlay
     * @param callback (Function): Function that should get executed when the
     * event is fired.
     * @param target_id (String) [Optional]: If handling more than one iframe then
     * it stores the different callbacks for different iframes based on the iframe's
     * id.
     */
    function storeCallback(eventName, callback, target_id) {
        if (target_id) {
            if (!eventCallbacks[target_id]) {
                eventCallbacks[target_id] = {};
            }
            eventCallbacks[target_id][eventName] = callback;
        }
        else {
            eventCallbacks[eventName] = callback;
        }
    }

    /**
     * Retrieves stored callbacks.
     */
    function getCallback(eventName, target_id) {
        if (target_id) {
            return eventCallbacks[target_id][eventName];
        }
        else {
            return eventCallbacks[eventName];
        }
    }

    function removeCallback(eventName, target_id) {
        if (target_id && eventCallbacks[target_id]) {
            if (!eventCallbacks[target_id][eventName]) {
                return false;
            }
            eventCallbacks[target_id][eventName] = null;
        }
        else {
            if (!eventCallbacks[eventName]) {
                return false;
            }
            eventCallbacks[eventName] = null;
        }

        return true;
    }

    /**
     * Returns a domain's root domain.
     * Eg. returns http://vimeo.com when http://vimeo.com/channels is sbumitted
     *
     * @param url (String): Url to test against.
     * @return url (String): Root domain of submitted url
     */
    function getDomainFromUrl(url) {
        if (url.substr(0, 2) === '//') {
            url = window.location.protocol + url;
        }

        var url_pieces = url.split('/'),
            domain_str = '';

        for(var i = 0, length = url_pieces.length; i < length; i++) {
            if(i<3) {domain_str += url_pieces[i];}
            else {break;}
            if(i<2) {domain_str += '/';}
        }

        return domain_str;
    }

    function isFunction(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    function isArray(obj) {
        return toString.call(obj) === '[object Array]';
    }

    // Give the init function the Froogaloop prototype for later instantiation
    Froogaloop.fn.init.prototype = Froogaloop.fn;

    // Listens for the message event.
    // W3C
    if (window.addEventListener) {
        window.addEventListener('message', onMessageReceived, false);
    }
    // IE
    else {
        window.attachEvent('onmessage', onMessageReceived);
    }

    // Expose froogaloop to the global object
    return (window.Froogaloop = window.$f = Froogaloop);

})();$.fn.extend({
	tapClick:function(callback) {
		if ($('html').hasClass('touch')) {
			return $(this).bind('tap', callback);
		} else {
			return $(this).click(callback);
		}
	}
});var player = null;
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
}/*! Tappy! - a lightweight normalized tap event. Copyright 2013 @scottjehl, Filament Group, Inc. Licensed MIT */
(function( w, $, undefined ){

	// handling flag is true when an event sequence is in progress (thx androood)
	w.tapHandling = false;

	var tap = function( $els ){
		return $els.each(function(){

			var $el = $( this ),
				resetTimer,
				startY,
				startX,
				cancel,
				scrollTolerance = 10;

			function trigger( e ){
				$( e.target ).trigger( "tap", [ e, $( e.target ).attr( "href" ) ] );
				e.stopImmediatePropagation();
			}

			function getCoords( e ){
				var ev = e.originalEvent || e,
					touches = ev.touches || ev.targetTouches;

				if( touches ){
					return [ touches[ 0 ].pageX, touches[ 0 ].pageY ];
				}
				else {
					return null;
				}
			}

			function start( e ){
				if( e.touches && e.touches.length > 1 || e.targetTouches && e.targetTouches.length > 1 ){
					return false;
				}

				var coords = getCoords( e );
				startX = coords[ 0 ];
				startY = coords[ 1 ];
			}

			// any touchscroll that results in > tolerance should cancel the tap
			function move( e ){
				if( !cancel ){
					var coords = getCoords( e );
					if( coords && ( Math.abs( startY - coords[ 1 ] ) > scrollTolerance || Math.abs( startX - coords[ 0 ] ) > scrollTolerance ) ){
						cancel = true;
					}
				}
			}

			function end( e ){
				clearTimeout( resetTimer );
				resetTimer = setTimeout( function(){
					w.tapHandling = false;
					cancel = false;
				}, 1000 );

				if( e.ctrlKey || e.metaKey ){
					return;
				}

				e.preventDefault();

				// this part prevents a double callback from touch and mouse on the same tap

				// if a scroll happened between touchstart and touchend
				if( cancel || w.tapHandling && w.tapHandling !== e.type ){
					cancel = false;
					return;
				}

				w.tapHandling = e.type;
				trigger( e );
			}

			$el
				.bind( "touchstart MSPointerDown", start )
				.bind( "touchmove MSPointerMove", move )
				.bind( "touchend MSPointerUp", end )
				.bind( "click", end );
		});
	};

	// use special events api
	if( $.event && $.event.special ){
		$.event.special.tap = {
			add: function( handleObj ) {
				tap( $( this ), true );
			},
			remove: function( handleObj ) {
				tap( $( this ), false );
			}
		};
	}
	else{
		// monkeybind
		var oldBind = $.fn.bind;
		$.fn.bind = function( evt ){
			if( /(^| )tap( |$)/.test( evt ) ){
				tap( this );
			}
			return oldBind.apply( this, arguments );
		};
	}

}( this, jQuery ));
