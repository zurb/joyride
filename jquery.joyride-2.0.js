/*
 * jQuery Foundation Tooltip Plugin 2.0
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
    'scrollSpeed'          : 300,       // Page scrolling speed in milliseconds
    'timer'                : 0,         // 0 = no timer, all other numbers = timer in milliseconds
    'startTimerOnClick'    : false,     // true or false - true requires clicking the first button start the timer
    'nextButton'           : true,      // true or false to control whether a next button is used
    'tipAnimation'         : 'pop',     // 'pop' or 'fade' in each tip
    'tipAnimationFadeSpeed': 300,       // when tipAnimation = 'fade' this is speed in milliseconds for the transition
    'cookieMonster'        : false,     // true or false to control whether cookies are used
    'cookieName'           : 'JoyRide', // Name the cookie you'll use
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
          methods.hide();
          methods.show();
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
        txt = $(settings.template.timer)[0];
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
      var buttonText = opts.$li.data('text'),
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

      methods.position(tipSettings);

      settings.$next_tip.show();

      settings.$current_tip = settings.$next_tip;

      // mehots.animate();

      // methods.scroll_to();

      // methods.hide_prev();

      // do timer stuff

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
        settings.$target = 'modal';
      }
    },
    position : function (tipSettings) {
      var half_fold = Math.ceil($(window).height() / 2),
          tip_position = settings.$next_tip.offset(),
          parent_height = settings.$target.outerHeight(),
          tip_height = settings.$next_tip.outerHeight(),
          $nub = $('.joyride-nub', settings.$next_tip),
          nub_height = Math.ceil($nub.outerHeight() / 2),
          tip_offset = 0,
          left = tip_position.left - settings.body_offset.left;

      // tip must not be "display: none" to calculate position
      settings.$next_tip.css('visibility', 'hidden');
      settings.$next_tip.show();

      if (settings.inline) {
        if (methods.bottom(tipSettings)) {
          settings.$next_tip.css({top: (parent_height + nub_height)});
          $nub.addClass('top').css('left', left);
        } else if (methods.top(tipSettings)) {
          settings.$next_tip.css({top: (- tip_height - nub_height)});
          $nub.addClass('bottom').css('left', left);
        } else if (methods.right(tipSettings)) {
          // position right
        } else {
          // position left
        }
      } else {

      }

      settings.$next_tip.hide();
      settings.$next_tip.css('visibility', 'visible');
    },
    bottom : function (tipSettings) {
      return ((tipSettings.tipLocation === "bottom" && methods.border_safe('bottom')) || 
        (tipSettings.tipLocation === "top" && !methods.border_safe('top'))) ? true : false;
    },
    top : function (tipSettings) {
      return ((tipSettings.tipLocation === "top" && methods.border_safe('top')) || 
        (tipSettings.tipLocation === "bottom" && !methods.border_safe('bottom'))) ? true : false;
    },
    right : function (tipSettings) {
      return ((tipSettings.tipLocation === "right" && methods.border_safe('right')) || 
        (tipSettings.tipLocation === "left" && !methods.border_safe('left'))) ? true : false;
    },
    left : function (tipSettings) {
      return ((tipSettings.tipLocation === "left" && methods.border_safe('left')) || 
        (tipSettings.tipLocation === "right" && !methods.border_safe('right'))) ? true : false;
    },
    border_safe : function (pos) {
      return true;
    },
    startTimer : function () {

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