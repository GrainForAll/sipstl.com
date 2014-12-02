function isTouch(){return $("html").hasClass("touch")}function _startPaginationCycle(){iphoneSwiperInterval=setInterval(function(){activeIndex++,activeIndex>6&&(activeIndex=1),_changePagination(activeIndex)},2e3)}function _stopPaginationCycle(){clearInterval(iphoneSwiperInterval)}function _changePagination(index){$(".iphone-wrapper").find(".swiper-slide[data-index="+index+"]");$(".pagination-wrapper .swiper-pagination-switch").each(function(){$(this).removeClass("swiper-active-switch")}),$(".pagination-wrapper .swiper-pagination-switch[data-index="+index+"]").addClass("swiper-active-switch"),$(".iphone-wrapper").find(".swiper-slide").removeClass("visible-fade-slow"),$(".iphone-wrapper").find(".swiper-slide[data-index="+index+"]").addClass("visible-fade-slow")}function _onVideoPlay(){playedBefore||isTouch()?$("html, body").animate({scrollTop:0},400,"easeOutExpo",function(){}):$("html, body").animate({scrollTop:0},400,"easeOutExpo",function(){$("body").addClass("video-playing"),$(".logo-wrapper").slideUp(),$(".content-outer-wrapper").removeClass("visible-fade-slow")})}function _onVideoPlayProgress(){}function _onVideoPause(){playedBefore||isTouch()||($("body").removeClass("video-playing"),$(".logo-wrapper").slideDown(),$(".content-outer-wrapper").addClass("visible-fade-slow"))}function _onVideoFinish(){$("html, body").animate({scrollTop:$(".iphone-wrapper").offset().top-40},1200,"easeOutExpo",function(){})}var Froogaloop=function(){function Froogaloop(iframe){return new Froogaloop.fn.init(iframe)}function postMessage(method,params,target){if(!target.contentWindow.postMessage)return!1;var url=target.getAttribute("src").split("?")[0],data=JSON.stringify({method:method,value:params});"//"===url.substr(0,2)&&(url=window.location.protocol+url),target.contentWindow.postMessage(data,url)}function onMessageReceived(event){var data,method;try{data=JSON.parse(event.data),method=data.event||data.method}catch(e){}if("ready"!=method||isReady||(isReady=!0),event.origin!=playerDomain)return!1;var value=data.value,eventData=data.data,target_id=""===target_id?null:data.player_id,callback=getCallback(method,target_id),params=[];return callback?(void 0!==value&&params.push(value),eventData&&params.push(eventData),target_id&&params.push(target_id),params.length>0?callback.apply(null,params):callback.call()):!1}function storeCallback(eventName,callback,target_id){target_id?(eventCallbacks[target_id]||(eventCallbacks[target_id]={}),eventCallbacks[target_id][eventName]=callback):eventCallbacks[eventName]=callback}function getCallback(eventName,target_id){return target_id?eventCallbacks[target_id][eventName]:eventCallbacks[eventName]}function removeCallback(eventName,target_id){if(target_id&&eventCallbacks[target_id]){if(!eventCallbacks[target_id][eventName])return!1;eventCallbacks[target_id][eventName]=null}else{if(!eventCallbacks[eventName])return!1;eventCallbacks[eventName]=null}return!0}function getDomainFromUrl(url){"//"===url.substr(0,2)&&(url=window.location.protocol+url);for(var url_pieces=url.split("/"),domain_str="",i=0,length=url_pieces.length;length>i&&3>i;i++)domain_str+=url_pieces[i],2>i&&(domain_str+="/");return domain_str}function isFunction(obj){return!!(obj&&obj.constructor&&obj.call&&obj.apply)}var eventCallbacks={},isReady=!1,playerDomain=(Array.prototype.slice,"");return Froogaloop.fn=Froogaloop.prototype={element:null,init:function(iframe){return"string"==typeof iframe&&(iframe=document.getElementById(iframe)),this.element=iframe,playerDomain=getDomainFromUrl(this.element.getAttribute("src")),this},api:function(method,valueOrCallback){if(!this.element||!method)return!1;var self=this,element=self.element,target_id=""!==element.id?element.id:null,params=isFunction(valueOrCallback)?null:valueOrCallback,callback=isFunction(valueOrCallback)?valueOrCallback:null;return callback&&storeCallback(method,callback,target_id),postMessage(method,params,element),self},addEvent:function(eventName,callback){if(!this.element)return!1;var self=this,element=self.element,target_id=""!==element.id?element.id:null;return storeCallback(eventName,callback,target_id),"ready"!=eventName?postMessage("addEventListener",eventName,element):"ready"==eventName&&isReady&&callback.call(null,target_id),self},removeEvent:function(eventName){if(!this.element)return!1;var self=this,element=self.element,target_id=""!==element.id?element.id:null,removed=removeCallback(eventName,target_id);"ready"!=eventName&&removed&&postMessage("removeEventListener",eventName,element)}},Froogaloop.fn.init.prototype=Froogaloop.fn,window.addEventListener?window.addEventListener("message",onMessageReceived,!1):window.attachEvent("onmessage",onMessageReceived),window.Froogaloop=window.$f=Froogaloop}();$.fn.extend({tapClick:function(callback){return $("html").hasClass("touch")?$(this).bind("tap",callback):$(this).click(callback)}});var player=null,iphoneSwiper=null,iphoneSwiperInterval=null,activeIndex=1,playedBefore=!0;$(function(){$(".video-wrapper iframe").load(function(){player=$f(document.getElementById("promotional-video")),player.addEvent("ready",function(){player.addEvent("play",_onVideoPlay),player.addEvent("playProgress",_onVideoPlayProgress),player.addEvent("pause",_onVideoPause),player.addEvent("finish",_onVideoFinish),!playedBefore&&!isTouch()&&$(window).width()>900})}),iphoneSwiper=$(".iphone-wrapper-small").find(".swiper-container").swiper({mode:"horizontal",loop:!0,autoplay:3e3,pagination:".pagination-wrapper-small",createPagination:!0,paginationClickable:!1}),iphoneSwiper.startAutoplay();var imgLoadiPhoneWrapperLarge=imagesLoaded($(".iphone-wrapper"));imgLoadiPhoneWrapperLarge.on("done",function(){$(".iphone-wrapper").addClass("visible-fade-slow"),$(".pagination-wrapper").addClass("visible-fade-slow")});imagesLoaded($(".iphone-wrapper-small"));imgLoadiPhoneWrapperLarge.on("done",function(){$(".iphone-wrapper-small").addClass("visible-fade-slow"),$(".pagination-wrapper-small").addClass("visible-fade-slow")}),$(".iphone-wrapper .left-arrow-wrapper").tapClick(function(){_stopPaginationCycle(),activeIndex--,1>activeIndex&&(activeIndex=6),_changePagination(activeIndex)}),$(".iphone-wrapper .right-arrow-wrapper").tapClick(function(){_stopPaginationCycle(),activeIndex++,activeIndex>6&&(activeIndex=1),_changePagination(activeIndex)}),$(".iphone-wrapper-small .left-arrow-wrapper").tapClick(function(){iphoneSwiper.stopAutoplay(),iphoneSwiper.swipePrev()}),$(".iphone-wrapper-small .right-arrow-wrapper").tapClick(function(){iphoneSwiper.stopAutoplay(),iphoneSwiper.swipeNext()}),$(".swiper-pagination-switch").tapClick(function(){$(this).hasClass("swiper-active-switch")||(activeIndex=parseInt($(this).attr("data-index"),10),_changePagination(activeIndex))}),_startPaginationCycle(),$(".video-outer-wrapper").addClass("visible-fade-ultra-slow"),$(".content-outer-wrapper").addClass("visible-fade-slow")}),function(w,$){w.tapHandling=!1;var tap=function($els){return $els.each(function(){function trigger(e){$(e.target).trigger("tap",[e,$(e.target).attr("href")]),e.stopImmediatePropagation()}function getCoords(e){var ev=e.originalEvent||e,touches=ev.touches||ev.targetTouches;return touches?[touches[0].pageX,touches[0].pageY]:null}function start(e){if(e.touches&&e.touches.length>1||e.targetTouches&&e.targetTouches.length>1)return!1;var coords=getCoords(e);startX=coords[0],startY=coords[1]}function move(e){if(!cancel){var coords=getCoords(e);coords&&(Math.abs(startY-coords[1])>scrollTolerance||Math.abs(startX-coords[0])>scrollTolerance)&&(cancel=!0)}}function end(e){if(clearTimeout(resetTimer),resetTimer=setTimeout(function(){w.tapHandling=!1,cancel=!1},1e3),!e.ctrlKey&&!e.metaKey){if(e.preventDefault(),cancel||w.tapHandling&&w.tapHandling!==e.type)return void(cancel=!1);w.tapHandling=e.type,trigger(e)}}var resetTimer,startY,startX,cancel,$el=$(this),scrollTolerance=10;$el.bind("touchstart MSPointerDown",start).bind("touchmove MSPointerMove",move).bind("touchend MSPointerUp",end).bind("click",end)})};if($.event&&$.event.special)$.event.special.tap={add:function(){tap($(this),!0)},remove:function(){tap($(this),!1)}};else{var oldBind=$.fn.bind;$.fn.bind=function(evt){return/(^| )tap( |$)/.test(evt)&&tap(this),oldBind.apply(this,arguments)}}}(this,jQuery);