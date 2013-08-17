// Avoid `console` errors in browsers that lack a console.
(function() {
  var method;
  var noop = function () {};
  var methods = [
  'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
  'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
  'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
  'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());

/***************************************
 * Page load sizing
 ***************************************/
(function(){
  // var sections = $('#main > section');

  // Dynamically change the height of the hero page main screen
  $('#hero').css('height', $(window).height() - 95);
  // sections.css('height', $(window).height() - 98);
}());

/***************************************
 * Nav Scrolling and Updating
 ***************************************/
(function(){
  'use strict';

  var w = $(window)
    , items = $('#main section,#hero')
    , offset = 108
    , selected;

  $(window).bind('scroll', function(){
    items.each(function(i, item){
      if ( (w.scrollTop() + offset) >= item.offsetTop
        && (w.scrollTop() + offset) <= (item.offsetTop + item.offsetHeight)
      ) {
        if (selected) {
          selected.removeClass('selected');
        }
        selected = $("li[data-nav='" + item.id +"']");
        selected.addClass('selected');
      }

    });
  });

  $('nav li').bind('click', function(e){
    $.smoothScroll({
      scrollTarget: '#' + this.innerText
    , offset: -97
    });
  });
}());

/***************************************
 * Sticky Nav Bar 
 ***************************************/
(function(){
  var isFixed = false
    , isSmall = false
    , nav = $('nav')
    , img = $('#logo')
    , navBottom = nav.length && nav.offset().top
    , imgTop = img.offset().top
    , w = $(window)
    , spacer = $('#nav-spacer');
    // 70px different for the logo

  $(window).on('scroll', function(){
    if (w.scrollTop() >= navBottom && !isFixed){
      isFixed = true;
      nav.addClass('fixed-menu');
      spacer.removeClass('hidden');
    } else if (w.scrollTop() < navBottom && isFixed) {
      isFixed = false;
      nav.removeClass('fixed-menu');
      spacer.addClass('hidden');
    }

    console.log(imgTop, w.scrollTop());

    if (w.scrollTop() >= imgTop && !isSmall) {
      isSmall = true;
      img.addClass('small-logo');
      img.removeClass('big-logo');
    } else if (w.scrollTop() < imgTop && isSmall) {
      isSmall = false;
      img.removeClass('small-logo');
      img.addClass('big-logo');
    }
  });

}());
