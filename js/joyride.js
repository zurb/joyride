'use strict';
/*******************************************
 *                                         *
 * This Ride was created by Marius Olbertz *
 * Please thank Marius on GitHub /owlbertz *
 * or the web http://www.mariusolbertz.de/ *
 *                                         *
 ******************************************/

!(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery', 'foundation'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  /**
   * Joyride module.
   * @module foundation.joyride
   * @requires foundation.util.keyboard
   * @requires foundation.Tooltip
   * @requires foundation.Reveal
   */
  class Joyride {
    /**
     * Creates a new instance of Joyride.
     * @class
     * @param {jQuery} element - jQuery object (list) to be used as the structure.
     * @param {Object} options - object to extend the default configuration.
     */

    constructor(element, options) {
      this.$element = element;
      this.options = $.extend({}, Joyride.defaults, this.$element.data(), options);
      this._init();

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
    _init() {
      this.id = this.$element.attr('id') || Foundation.GetYoDigits(6, 'joyride');
      this.current = 0;
      this.$items = $([]); // initialize empty collection
      this.structure = this._parseList();
      this._render(this.structure);
      this._events();

      if (this.options.autostart) {
        this.start();
      }
    }

    /**
     * Parses the list of the instance, stored in $element.
     * @private
     * @return {Array} structure
     */
    _parseList() {
      var structure = [];
      this.$element.find('li').each(function(i) {
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
     * Creates the markup for the items
     * @private
     * @param {Array} structure the joyride's structure from _parseList
     * @return {Object} markup jQuery representation of the generated markup
     */
    _render(structure) {
      for (var s in structure) {
        var options = $.extend({}, this.options, structure[s]),// if specific item has config, this should overwrite global settings
          $item;

        if (options.$target.length) { // target element exists, create tooltip
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

        } else { // not target, create modal with Reveal
          var modal = new Foundation.Reveal($('<div class="reveal joyride"/>').appendTo($('body')));
          this.structure[s].item = modal;
          $item = modal.$element;
        }
        $item.attr({
          'data-index': s,
          'data-joyride-for': structure[s].target
        })
        .html(structure[s].text);
        if (options.keyboardAccess) {
          $item.attr('tabindex', '-1');
        }

        this.$items = this.$items.add($item);

        // add buttons
        if (
          (structure[s].nextText || (options.showNext && s < structure.length -1))
          || (structure[s].prevText || (options.showPrev && s > 0))
        ) {
          var $buttons = $('<div class="joyride-buttons"/>');
          if (structure[s].prevText || (options.showPrev && s > 0)) {
            $buttons.append($(this.options.prevButton).text(options.prevText));
          }
          if (structure[s].nextText || (options.showNext && s < structure.length -1)) {
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
     * Shows the item with the given index
     * @private
     * @param {Number} index of the item to be displayed
     */
    _showItem(index) {
      if (this.structure[index].isModal) {
        this.structure[index].item.open();
      } else {
        this.structure[index].item.show();
      }
      // scroll target into view if target exists
      if (this.structure[index].$target.length) {
        $('html, body').stop().animate({
          'scrollTop': Math.max(0, this.$items.eq(index).offset().top - this.options.scrollOffset)
        }, this.options.scrollSpeed);
      }
      if (this.options.keyboardAccess) {
         this.$items.eq(index).focus();
      }
      this.current = index;
    }

    /**
     * Hides the item with the given index
     * @private
     * @param {Number} index of the item to be hidden
     */
    _hideItem(index) {
      if (this.structure[index].isModal) {
        this.structure[index].item.close();
      } else {
        this.structure[index].item.hide();
      }
    }

    /**
     * Hides all items
     * @private
     */
    _hideAll() {
      for (var s in this.structure) {
        this._hideItem(s);
      }
    }

    /**
     * Shows the next item in the ride
     * @private
     */
    showNext() {
      this._hideItem(this.current);
      this._showItem(this.current + 1);
    }

    /**
     * Shows the previous item in the ride
     * @private
     */
    showPrev() {
      this._hideItem(this.current);
      this._showItem(this.current - 1);
    }

    /**
     * Starts the ride
     * @private
     * @return {Number} index - the index where to start, 0 by default
     */
    start(index) {
      var index = index || 0;
      this._hideAll();
      this._showItem(index);
    }

    /**
     * Adds event handlers for the modal.
     * @private
     */
    _events() {
      var _this = this;
      $('[data-joyride-start="#'+_this.id+'"]').click(function() {
        _this.start();
      });

      this.$items.on('click.zf.joyride', '[data-joyride-next]', function(e) {
        _this.showNext();
      }).on('click.zf.joyride', '[data-joyride-prev]', function(e) {
        _this.showPrev();
      }).on('click.zf.joyride', '[data-joyride-close]', function(e) {
        e.preventDefault();
        if (_this.structure[_this.current].closable) {
          _this._hideItem(_this.current);
        }
      }).on('keydown.zf.joyride', function(e) {
        var $element = $(this);
        Foundation.Keyboard.handleKey(e, 'Joyride', {
          next: function() {
            if ($element.data('index') < _this.structure.length - 1) {
              _this.showNext();
            }
          },
          previous: function() {
            if ($element.data('index') > 0) {
              _this.showPrev();
            }
          },
          close: function() {
            if (_this.structure[_this.current].closable) {
              _this._hideItem(_this.current);
            }
          },
          handled: function() {
            e.preventDefault();
          }
        });
      });
    }

    /**
     * Destroys an instance of a Joyride.
     * @fires Joyride#destroyed
     */
    destroy() {
      this.$element.hide();

      for (var s in this.structure) {
        this.structure[s].item.destroy();
      }

      /**
       * Fires when the plugin has been destroyed.
       * @event Joyride#destroyed
       */
      this.$element.trigger('destroyed.zf.joyride');

      Foundation.unregisterPlugin(this);
    }
  }

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
     * @example true
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
}));
