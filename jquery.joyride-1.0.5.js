/*
 * jQuery Foundation Tooltip Plugin 2.0.0
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

;(function ($) {
  'use strict';
  // +++++++++++++++++++
    //   Defaults
    // +++++++++++++++++++
    var settings = {
      'tipLocation': 'bottom', // 'top' or 'bottom' in relation to parent
      'scrollSpeed': 300, // Page scrolling speed in milliseconds
      'timer': 0, // 0 = no timer, all other numbers = timer in milliseconds
      'startTimerOnClick': false, // true or false - true requires clicking the first button start the timer
      'nextButton': true, // true or false to control whether a next button is used
      'tipAnimation': 'pop', // 'pop' or 'fade' in each tip
      'tipAnimationFadeSpeed': 300, // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      'cookieMonster': false, // true or false to control whether cookies are used
      'cookieName': 'JoyRide', // Name the cookie you'll use
      'cookieDomain': false, // Will this cookie be attached to a domain, ie. '.notableapp.com'
      'tipContainer': 'body', // Where will the tip be attached if not inline
      'inline': false, // true or false, if true the tip will be attached after the element
      'postRideCallback': $.noop, // A method to call once the tour closes (canceled or complete)
      'postStepCallback': $.noop // A method to call after each step
    },
    methods = {
      init : function (opts) {
        return this.each(function () {
          settings = $.extend(settings, opts);

          // non configureable settings
          settings.$content_el = $(this);
          settings.body_offset = $(settings.tipContainer).children('*').first().position();
          settings.$tip_content = $('li', settings.$content_el);
          settings.cnt = settings.skip_cnt = 0;
          settings.prev_cnt = -1;

          console.log(methods.tip_template({tip_class : 'yay', index : 1, tip : settings.$tip_content.first(), timer_instance : ''}))

        });
      },
      tip_template : function (opts) {
        var $blank, content;

        opts = opts || {};

        if (settings.nextButton) {
          opts.button_text = opts.button_text || 'Next';
          opts.button_text = '<a href="#" class="joyride-next-tip small nice radius yellow button">' + opts.button_text + '</a>';
        } else {
          opts.button_text = '';
        }
        
        opts.timer_instance = opts.timer_instance || '';
        opts.tip_class = opts.tip_class || '';
        opts.index = opts.index || 0;

        if (settings.index === 0 && settings.startTimerOnClick && settings.timer > 0 || settings.timer === 0) {
          opts.timer_instance = '';
        } else {
          opts.timer_instance = $('<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator">')[0];
        }

        $blank = $('<div class="joyride-tipe-guide"><span class="joyride-nub"></span><div class="joyride-content-wrapper">'),
        content = $.trim($(opts.tip).html()) + opts.button_text + '<a href="#close" class="joyride-close-tip">X</a>' + opts.timer_instance;

        $blank.attr('id', 'joyRidePopup' + opts.index);
        return $('.joyride-content-wrapper', $blank).append(content)[0];
      }
    };

  $.fn.joyride = function (method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  method + ' does not exist on jQuery.joyride');
    }
  };
}(jQuery));