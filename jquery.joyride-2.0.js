/*
 * jQuery Foundation Joyride Plugin 2.0
 * http://foundation.zurb.com
 * Copyright 2012, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

/*jslint unparam: true, browser: true, indent: 2 */

;(function ($) {
  'use strict';

  var settings = {
    'tipLocation'          : 'bottom',  // 'top' or 'bottom' in relation to parent
    'nubPosition'          : 'auto',    // override on a per tooltip bases 
    'scrollSpeed'          : 300,       // Page scrolling speed in milliseconds
    'timer'                : 5000,         // 0 = no timer , all other numbers = timer in milliseconds
    'startTimerOnClick'    : true,     // true or false - true requires clicking the first button start the timer
    'nextButton'           : true,      // true or false to control whether a next button is used
    'tipAnimation'         : 'fade',     // 'pop' or 'fade' in each tip
    'tipAnimationFadeSpeed': 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
    'cookieMonster'        : false,     // true or false to control whether cookies are used
    'cookieName'           : 'joyride', // Name the cookie you'll use
    'cookieDomain'         : false,     // Will this cookie be attached to a domain, ie. '.notableapp.com'
    'tipContainer'         : 'body',    // Where will the tip be attached if not inline
    'inline'               : false,     // true or false, if true the tip will be attached after the element
    'postRideCallback'     : $.noop,    // A method to call once the tour closes (canceled or complete)
    'postStepCallback'     : $.noop,    // A method to call after each step
    'template' : { // HTML segments for tip layout
      'link'    : '<a href="#close" class="joyride-close-tip">X</a>',
      'timer'   : '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator">',
      'tip'     : '<div class="joyride-tip-guide"><span class="joyride-nub">',
      'wrapper' : '<div class="joyride-content-wrapper">',
      'button'  : '<a href="#" class="joyride-next-tip small nice radius yellow button">'
    }
  },
  methods = {
    init : function (opts) {
      return this.each(function () {
        settings = $.extend(settings, opts);

        // non configureable settings
        settings.$content_el = $(this);
        settings.body_offset = $(settings.tipContainer).children('*').first().position();
        settings.$tip_content = $('li', settings.$content_el);
        settings.attempts = 0;

        if (settings.timer > 0) window.interval_id = null;

        // can we create cookies?
        if (!$.isFunction($.cookie())) {
          settings.cookieMonster = false;
        }

        // generate the tips and insert into dom.
        if(!settings.cookieMonster || !$.cookie(settings.cookieName)) {
          settings.$tip_content.each(function (index) {
            methods.create({$li : $(this), index : index});
          });

          // show first tip
          if (!settings.startTimerOnClick && settings.timer > 0) {
            methods.show('init');
            methods.startTimer();
          } else {
            methods.show('init');
          }
        }

        $(document).on('click', '.joyride-next-tip', function (e) {
          e.preventDefault();

          if (settings.$current_tip.next().length === 0) {
            methods.end();
          } else if (settings.timer > 0) {
            methods.hide();
            methods.show();
            methods.startTimer();
          } else {
            methods.hide();
            methods.show();
          }
        });

        $('.joyride-close-tip').on('click', function (e) {
          methods.end();
        });

        // register event delegations (window.resize, etc)

      });
    },
    tip_template : function (opts) {
      var $blank, content;
      
      opts.tip_class = opts.tip_class || '';

      $blank = $(settings.template.tip);
      content = $.trim($(opts.li).html()) + 
        methods.button_text(opts.button_text) + 
        settings.template.link + 
        methods.timer_instance(opts.index);

      $blank.append($(settings.template.wrapper));
      $blank.first().attr('data-index', opts.index);
      $('.joyride-content-wrapper', $blank).append(content);

      return $blank[0];
    },
    timer_instance : function (index) {
      var txt;

      if (index === 0 && settings.startTimerOnClick && settings.timer > 0 || settings.timer === 0) {
        txt = '';
      } else {
        txt = $(settings.template.timer)[0].outerHTML;
      }
      return txt;
    },
    button_text : function (txt) {
      if (settings.nextButton) {
        txt = $.trim(txt) || 'Next';
        txt = $(settings.template.button).append(txt)[0].outerHTML;
      } else {
        txt = '';
      }
      return txt;
    },
    create : function (opts) {
      // backwards compatability with data-text attribute
      var buttonText = opts.$li.data('button') || opts.$li.data('text'),
          tipClass = opts.$li.attr('class'),
          $tip_content = $(methods.tip_template({
            tip_class : tipClass,
            index : opts.index,
            button_text : buttonText,
            li : opts.$li
          }));

      if (settings.inline) {
        $tip_content.insertAfter('#' + opts.$li.data('id'));
      } else {
        $(settings.tipContainer).append($tip_content);
      }
    },
    show : function (init) {
      var opts = {},
          tipSettings = {};

      methods.set_li(init);
      settings.attempts = 0;

      if (settings.$li.next()) {
        // parse options
        $.each((settings.$li.data('options') || ':').split(';'),
          function (i, s) {
            var p = s.split(':');
            if (p.length == 2) {
              opts[$.trim(p[0])] = $.trim(p[1]);
            }
          }
        );

        tipSettings = $.extend({}, settings, opts);

        // scroll and position tooltip
        methods.scroll_to();
        methods.position(tipSettings);

        if (settings.tipAnimation === "pop") {
          $('.joyride-timer-indicator').width(0);
          if (settings.timer > 0) {

            settings.$next_tip.show()
              .find('.joyride-timer-indicator')
              .animate({width: $('.joyride-timer-indicator-wrap', settings.$next_tip)
              .width()}, settings.timer);
          } else {
            settings.$next_tip.show();
          }
        } else if (settings.tipAnimation === "fade") {
          $('.joyride-timer-indicator').width(0);
          if (settings.timer > 0) {
            settings.$next_tip.fadeIn(settings.tipAnimationFadeSpeed)
              .find('.joyride-timer-indicator')
              .animate({width: $('.joyride-timer-indicator-wrap', settings.$next_tip)
              .width()}, settings.timer);
          } else {
            settings.$next_tip.fadeIn(settings.tipAnimationFadeSpeed);
          }
        }

        settings.$current_tip = settings.$next_tip;

        if (settings.postStepCallback !== $.noop) {
          settings.postStepCallback(prevCount);
        }

      } else {
        methods.end();
      }

    },
    hide : function () {
      // add animate out support here
      settings.$current_tip.hide();
    },
    set_li : function (init) {
      if (!init) {
        settings.$li = settings.$li.next();
        methods.set_next_tip();
      } else {
        settings.$li = settings.$tip_content.first();
        methods.set_next_tip();
        settings.$current_tip = settings.$next_tip;
      }
      methods.set_target();
    },
    set_next_tip : function () {
      settings.$next_tip = $('.joyride-tip-guide[data-index=' + settings.$li.index() + ']');
    },
    set_target : function () {
      var id = settings.$li.data('id');
      if (id) {
        settings.$target = $('#' + id);
      } else {
        settings.$target = $('body');
      }
    },
    scroll_to : function () {
      var window_half, tipOffset;

      // only scroll if target if off screen
      if (!methods.visible(methods.corners(settings.$target))) {
        window_half = $(window).height() / 2,
        tipOffset = Math.ceil(settings.$target.offset().top - window_half);

        $("html, body").animate({
          scrollTop: tipOffset
        }, settings.scrollSpeed);
      }
    },
    position : function (tipSettings) {
      var half_fold = Math.ceil($(window).height() / 2),
          tip_position = settings.$next_tip.offset(),
          $nub = $('.joyride-nub', settings.$next_tip),
          nub_height = Math.ceil($nub.outerHeight() / 2);

      // tip must not be "display: none" to calculate position
      settings.$next_tip.css('visibility', 'hidden');
      settings.$next_tip.show();

      console.log(settings.$target.selector);

      if (settings.$target.selector !== 'body') {

        // TODO: add mobile positioning
        // TODO: Refine left and right positioning

        if (settings.inline) {
          if (methods.bottom(tipSettings)) {
            console.log('bottom inline');
            settings.$next_tip.css({top: (settings.$target.outerHeight() + nub_height)});
            methods.nub_position($nub, tipSettings.nubPosition, 'top');
          } else if (methods.top(tipSettings)) {
            console.log('top inline');
            settings.$next_tip.css({top: (- settings.$next_tip.outerHeight() - nub_height)});
            methods.nub_position($nub, tipSettings.nubPosition, 'bottom');
          } else if (methods.right(tipSettings)) {
            console.log('right inline');
            settings.$next_tip.css({left: (settings.$target.outerWidth() + settings.$next_tip.outerWidth())});
            methods.nub_position($nub, tipSettings.nubPosition, 'left');
          } else if (methods.left(tipSettings)) {
            console.log('left inline');
            settings.$next_tip.css({left: (settings.$target.outerWidth() - settings.$next_tip.outerWidth())});
            methods.nub_position($nub, tipSettings.nubPosition, 'right');
          }
        } else {
          if (methods.bottom(tipSettings)) {
            console.log('bottom absolute');
            settings.$next_tip.css({
              top: (settings.$target.offset().top + nub_height + settings.$target.outerHeight()),
              left: settings.$target.offset().left});
            methods.nub_position($nub, tipSettings.nubPosition, 'top');
          } else if (methods.top(tipSettings)) {
            console.log('top absolute');
            settings.$next_tip.css({
              top: (settings.$target.offset().top - settings.$next_tip.outerHeight() - nub_height),
              left: settings.$target.offset().left});
            methods.nub_position($nub, tipSettings.nubPosition, 'bottom');
          } else if (methods.right(tipSettings)) {
            console.log('right absolute');
            settings.$next_tip.css({
              top: settings.$target.offset().top,
              left: (settings.$target.outerWidth() + settings.$next_tip.outerWidth())});
            methods.nub_position($nub, tipSettings.nubPosition, 'left');
          } else if (methods.left(tipSettings)) {
            console.log('left absolute');
            settings.$next_tip.css({
              top: settings.$target.offset().top - settings.$target.outerHeight(),
              left: (settings.$target.offset().left)});
            methods.nub_position($nub, tipSettings.nubPosition, 'right');
          }

          if (!methods.visible(methods.corners(settings.$next_tip)) && settings.attempts < 1) {
            $nub.removeClass('bottom')
                 .removeClass('top')
                 .removeClass('right')
                 .removeClass('left');

            tipSettings.tipLocation = methods.invert_pos(tipSettings.tipLocation);
            settings.attempts++;
            methods.position(tipSettings);
          }
        }
      } else {
        console.log('is modal!');
        // show modal styling
        // append mobal curtain
        // show modal curtain if not visible
        // position modal
      }

      settings.$next_tip.hide();
      settings.$next_tip.css('visibility', 'visible');
    },
    bottom : function (tipSettings) {
      return (tipSettings.tipLocation === "bottom");
    },
    top : function (tipSettings) {
      return (tipSettings.tipLocation === "top");
    },
    right : function (tipSettings) {
      return (tipSettings.tipLocation === "right");
    },
    left : function (tipSettings) {
      return (tipSettings.tipLocation === "left");
    },
    corners : function (el) {
      var w = $(window),
          right = w.width() + w.scrollLeft(),
          bottom = w.height() + w.scrollTop();    
      
      return [
        el.offset().top <= w.scrollTop(),
        right <= el.offset().left + el.width(),
        bottom <= el.offset().top + el.height(),
        w.scrollLeft() >= el.offset().left
      ];
    },
    visible : function (hidden_corners) {
      var i = hidden_corners.length;
      while (i--) {
        if (hidden_corners[i]) return false;
      }
      return true;
    },
    invert_pos : function (pos) {
      if (pos === 'right') {
        return 'left';
      } else if (pos === 'top') {
        return 'bottom';
      } else if (pos === 'bottom') {
        return 'top';
      } else {
        return 'right';
      }
    },
    nub_position : function (nub, pos, def) {
      if (pos === 'auto') {
        nub.addClass(def);
      } else {
        nub.addClass(pos);
      }
    },
    startTimer : function () {
      clearInterval(interval_id);
      window.interval_id = setInterval(function () {
        methods.hide();
        methods.show();
      }, settings.timer);
    },
    end : function () {
      clearInterval(interval_id);

      if (settings.cookieMonster) {
        $.cookie(settings.cookieName, 'ridden', { expires: 365, domain: settings.cookieDomain });
      }

      settings.$current_tip.hide();

      if (settings.postRideCallback !== $.noop) {
        settings.postRideCallback();
      }
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