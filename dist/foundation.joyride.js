'use strict';
/*******************************************
 *                                         *
 * This Ride was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  var JOYRIDE_VERSION = '3.0.0';
  /**
   * Joyride module.
   * @module foundation.joyride
   * @requires foundation.util.keyboard
   * @requires foundation.Tooltip
   * @requires foundation.Reveal
   */

  var Joyride = function () {
    /**
     * Creates a new instance of Joyride.
     * @class
     * @param {jQuery} element - jQuery object (list) to be used as the structure.
     * @param {Object} options - object to extend the default configuration.
     */

    function Joyride(element, options) {
      _classCallCheck(this, Joyride);

      this.$element = element;
      this.options = $.extend({}, Joyride.defaults, this.$element.data(), options);
      this._init();
      Joyride.version = JOYRIDE_VERSION;

      Foundation.registerPlugin(this, 'Joyride');
      Foundation.Keyboard.register('Joyride', {
        'ltr': {
          'ARROW_RIGHT': 'next',
          'ARROW_LEFT': 'previous',
          'ESCAPE': 'close'
        },
        'rtl': {
          'ARROW_RIGHT': 'previous',
          'ARROW_LEFT': 'next'
        }
      });
    }

    /**
     * Initializes the joyride by rendering required markup
     * @private
     */


    _createClass(Joyride, [{
      key: '_init',
      value: function _init() {
        this.id = this.$element.attr('id') || Foundation.GetYoDigits(6, 'joyride');
        this.current = 0;
        this.$items = $([]); // initialize empty collection
        this.structure = this._parseList();
        this._render(this.structure);
        this._events();

        if (this.options.autostart) {
          this.start(-1);
        }
      }

      /**
       * Parses the list of the instance, stored in $element.
       * @private
       * @return {Array} structure
       */

    }, {
      key: '_parseList',
      value: function _parseList() {
        var structure = [];
        this.$element.find('li').each(function (i) {
          var item = $.extend({}, {
            text: $(this).html(),
            $target: $($(this).data('target')),
            isModal: !!!$($(this).data('target')).length,
            closable: Joyride.defaults.closable
          }, $(this).data());
          structure.push(item);
        });
        return structure;
      }

      /**
       * Creates the markup for the items.
       * Initializes instances of tooltip and reveal.
       * @private
       * @param {Array} structure the joyride's structure from _parseList
       * @return {Object} markup jQuery representation of the generated markup
       */

    }, {
      key: '_render',
      value: function _render(structure) {
        for (var s in structure) {
          var options = $.extend({}, this.options, structure[s]),
              // if specifc item has config, this should overwrite global settings
          $item;

          if (options.$target.length) {
            // target element exists, create tooltip
            var tooltip = new Foundation.Tooltip(structure[s].$target, {
              positionClass: options.position,
              disableHover: true,
              clickOpen: false,
              tooltipClass: 'tooltip joyride',
              triggerClass: '',
              hOffset: this.options.hOffset,
              vOffset: this.options.vOffset,
              showOn: 'all' // to avoid conflicts with standalone version when MQs are not set up properly. Should be somewhat rewritten
            });
            this.structure[s].item = tooltip;
            $item = tooltip.template;

            // add joyride class to target
            structure[s].$target.addClass(this.options.joyrideTargetClass);
          } else {
            // not target, create modal with Reveal
            var modal = new Foundation.Reveal($('<div class="reveal joyride"/>').appendTo($('body')));
            this.structure[s].item = modal;
            $item = modal.$element;
          }
          $item.attr({
            'data-index': s,
            'data-joyride-for': structure[s].target
          }).html(structure[s].text);
          if (options.keyboardAccess) {
            $item.attr('tabindex', '-1');
          }

          this.$items = this.$items.add($item);

          // add buttons
          if (structure[s].nextText || options.showNext && s < structure.length - 1 || structure[s].prevText || options.showPrev && s > 0) {
            var $buttons = $('<div class="joyride-buttons"/>');
            if (structure[s].prevText || options.showPrev && s > 0) {
              $buttons.append($(this.options.prevButton).text(options.prevText));
            }
            if (structure[s].nextText || options.showNext && s < structure.length - 1) {
              $buttons.append($(this.options.nextButton).text(options.nextText));
            }
            $item.append($buttons);
          }

          // add close button
          if (options.closable) {
            var $close = $(this.options.closeButton);
            $close.find('.show-for-sr').text(this.options.closeText);
            $item.prepend($close);
          }
        }
      }

      /**
       * Shows the item with the given index.
       * @param {Number} index of the item to be displayed
       * @fires Joyride#show
       */

    }, {
      key: 'showItem',
      value: function showItem(index) {
        var _this = this,
            openFn = function () {
          if (this.structure[index].isModal) {
            this.structure[index].item.open();
          } else {
            this.structure[index].item.show();
          }

          if (this.options.keyboardAccess) {
            this.$items.eq(index).focus();
          }
          this.current = index;

          /**
           * Fires when the item is shown.
           * @event Joyride#show
           */
          this.structure[index].$target.addClass(this.options.joyrideTargetActiveClass).trigger('show.zf.joyride');
          $('body').addClass(this.options.bodyActiveClass);
        };
        // scroll target into view if target exists
        if (this.structure[index].$target.length) {
          var scrollTo = Math.max(0, this.structure[index].$target.offset().top - this.options.scrollOffset),

          // total distance to scroll
          scrollDistance = Math.abs(scrollTo - $('body').scrollTop()),

          // if target is already near the view port, slow scrolling down (the 4 is randomly chosen because it fits the demo)
          scrollSpeed = Math.min(this.options.scrollSpeed, Math.abs(scrollDistance / (window.innerHeight * 4)) * this.options.scrollSpeed);
          $('html, body').stop().animate({
            'scrollTop': scrollTo
          }, scrollSpeed, 'swing', function () {
            openFn.apply(_this);
          });
        } else {
          openFn.apply(_this);
        }
      }

      /**
       * Hides the item with the given index.
       * @param {Number} index of the item to be hidden
       * @fires Joyride#hide
       */

    }, {
      key: 'hideItem',
      value: function hideItem(index) {
        if (this.structure[index].isModal) {
          this.structure[index].item.close();
        } else {
          this.structure[index].item.hide();
        }

        /**
         * Fires when the item is hidden.
         * @event Joyride#hide
         */
        this.structure[index].$target.removeClass(this.options.joyrideTargetActiveClass).trigger('hide.zf.joyride');
        $('body').removeClass(this.options.bodyActiveClass);
      }

      /**
       * Hides all items.
       */

    }, {
      key: 'hideAll',
      value: function hideAll() {
        for (var s in this.structure) {
          this.hideItem(s);
        }
      }

      /**
       * Shows the next item in the ride.
       * @private
       */

    }, {
      key: 'showNext',
      value: function showNext() {
        this.hideItem(this.current);
        this.showItem(this.current + 1);
      }

      /**
       * Shows the previous item in the ride.
       * @private
       */

    }, {
      key: 'showPrev',
      value: function showPrev() {
        this.hideItem(this.current);
        this.showItem(this.current - 1);
      }

      /**
       * Starts the ride.
       * @private
       * @return {Number} index - the index where to start, 0 by default
       */

    }, {
      key: 'start',
      value: function start() {
        var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        // Only hide all if this is not the initial start call (which calls with index = -1)
        if (index > -1) {
          this.hideAll();
        } else {
          // reset index to 0 to ensure proper start
          index = 0;
        }
        this.showItem(index);
      }

      /**
       * Adds event handlers for the modal.
       * @private
       */

    }, {
      key: '_events',
      value: function _events() {
        var _this = this;
        $('[data-joyride-start="#' + _this.id + '"]').click(function () {
          _this.start();
        });

        this.$items.on('click.zf.joyride', '[data-joyride-next]', function (e) {
          _this.showNext();
        }).on('click.zf.joyride', '[data-joyride-prev]', function (e) {
          _this.showPrev();
        }).on('click.zf.joyride', '[data-joyride-close]', function (e) {
          e.preventDefault();
          if (_this.structure[_this.current].closable) {
            _this.hideItem(_this.current);
          }
        }).on('keydown.zf.joyride', function (e) {
          var $element = $(this);
          Foundation.Keyboard.handleKey(e, 'Joyride', {
            next: function () {
              if ($element.data('index') < _this.structure.length - 1) {
                _this.showNext();
              }
            },
            previous: function () {
              if ($element.data('index') > 0) {
                _this.showPrev();
              }
            },
            close: function () {
              if (_this.structure[_this.current].closable) {
                _this.hideItem(_this.current);
              }
            },
            handled: function () {
              e.preventDefault();
            }
          });
        });
      }

      /**
       * Destroys an instance of a Joyride.
       * @fires Joyride#destroyed
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this.$element.hide();

        for (var s in this.structure) {
          this.structure[s].item.destroy();
          this.structure[s].$target.removeClass(this.options.joyrideTargetClass + ' ' + this.options.joyrideTargetActiveClass);
        }

        /**
         * Fires when the plugin has been destroyed.
         * @event Joyride#destroyed
         */
        this.$element.trigger('destroyed.zf.joyride');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return Joyride;
  }();

  Joyride.defaults = {
    /**
     * Autostart the joyride on page load.
     * @option
     * @example false
     */
    autostart: false,
    /**
     * Speed with which the page scrolls to the next stop.
     * @option
     * @example 1000
     */
    scrollSpeed: 1000,
    /**
     * Enable navigation via keyboard.
     * @option
     * @example true
     */
    keyboardAccess: true,
    /**
     * Class to be added to the joyride targets.
     * @option
     * @example 'joyride-target'
     */
    joyrideTargetClass: 'joyride-target',
    /**
     * Class to be added to the active joyride target.
     * @option
     * @example 'joyride-is-active-target'
     */
    joyrideTargetActiveClass: 'joyride-is-active-target',
    /**
     * Class to be added to the body if there is an active joyride item.
     * @option
     * @example 'joyride-is-active'
     */
    bodyActiveClass: 'joyride-is-open',
    /**
     * If the joyride elements should be closable.
     * @option
     * @example true
     */
    closable: true,
    /**
     * Text for the next button.
     * @option
     * @example 'Next'
     */
    nextText: 'Next',
    /**
     * Text for the previous button.
     * @option
     * @example 'Previous'
     */
    prevText: 'Previous',
    /**
     * Text for the close button (for accessibility purposes).
     * @option
     * @example 'Close'
     */
    closeText: 'Close',
    /**
     * Whether to show next button.
     * @option
     * @example true
     */
    showNext: true,
    /**
     * Whether to show previous button.
     * @option
     * @example true
     */
    showPrev: true,
    /**
     * Vertical offset for tooltips (see tooltip plugin configuration).
     * @option
     * @example true
     */
    vOffset: 10,
    /**
     * Horizontal offset for tooltips (see tooltip plugin configuration).
     * @option
     * @example true
     */
    hOffset: 12,
    /**
     * Offset while scrolling the window.
     * @option
     * @example 50
     */
    scrollOffset: 50,
    /**
     * Position of the tooltips (see tooltip plugin configuration).
     * @option
     * @example 'top center'
     */
    position: 'top center',
    /**
     * Templates for the close button.
     * @option
     * @example '<a href="#close" class="close" data-joyride-close><span aria-hidden="true">&times</span><span class="show-for-sr"></span></a>'
     */
    closeButton: '<a href="#close" class="close" data-joyride-close><span aria-hidden="true">&times</span><span class="show-for-sr"></span></a>',
    /**
     * Templates for the next button.
     * @option
     * @example '<button class="button" data-joyride-next></button>'
     */
    nextButton: '<button class="button" data-joyride-next></button>',
    /**
     * Templates for the pevious button.
     * @option
     * @example '<button class="button" data-joyride-prev></button>'
     */
    prevButton: '<button class="button" data-joyride-prev></button>'
  };

  // Window exports
  Foundation.plugin(Joyride, 'Joyride');

  return Joyride;
});