Welcome to Joyride
=====================

Joyride is an easy to configure jQuery site tour wizard.

Installation Guide:      http://www.zurb.com/playground/jquery-joyride-feature-tour-plugin

Joyride is MIT-licensed and absolutely free to use.

Joyride 3.0 - In Progress (v3 branch)

New in 2.1 - June 26, 2013
* New `scroll` option.
* New `autoStart` option.
* Set tab focus to modal.
* Add ARIA support
* Patch for `destroy` method to check for joyride initialization.
* Add expose support; background darkens and target highlights.
* Localstorage support as alternative to cookies.
* Add option to set cookie path.
* Better tooltip alignment.
* Add top adjustment options on a per-tip basis.
* Other minor bug fixes.

New in 2.0.3 - January 4, 2013
* Better screen edge detection
* Source documentation updates

New in 2.0.2 - Novmeber 7, 2012
* Fix for off-screen detection in auto tooltip positioning
* Fix for older versions of jQuery back to 1.4.3
* jQuery 1.4.2 is no longer supported as it has issues with window resize
* Support lists in tooltip content
* Fix for reinitialization of plugin.

New in 2.0.1 - September 28, 2012
* Skip missing tooltip targets

New in 2.0 - September 28, 2012
* remove counters in favor of jQuery's in-built .next() method
* button text is now defined with a data-button attribute, data-text will be deprecated in 3.0
* edge-aware tooltips that reposition based on proximity to edge of screen (thanks to Jason from Hugo4GL for help with this)
* support for pause, resume, restart, and destroy; ex. https://gist.github.com/3430584
* support for jQuery 1.8.2, and 1.4.2+
* modal style tooltips (li elements without data-id or data-class)
* move tooltip templating to settings
* make cookie support an option
* you can now specify a `startOffset` for the index of the tooltip you want the tour to start on
* better support for right and left aligned tooltips
* override nub position on a per tooltip bases
* deprecate inline positioning of tooltips
* support for class based targeting with `data-class`
* both `postStepCallback` and `postRideCallback` now return a reference to the last tip index and jquery object
* more functionality, same size compressed (~12kb)

Documentation
==============

Comprehensive documentation is available on the Joyride homepage listed above.

Repo Contents
=============

* README
* DEMO - Demo specific files, not necessary to use the plugin
* joyride-2.1.css - Default Joyride styles, required
* jquery-1.10.1.js - A version of jQuery, required, 1.4.3+ is required
* jquery.joyride-2.1.js - The heart of Joyride, required
* modernizr.mq.js - A custom build of Modernizr with just mediaqueries
* jquery.cookie.js - required for cookie support.
* .gitignore - Those pesky DS_Store files...this is not part of the plugin

ZURB
====

Joyride was made by [ZURB](http://www.zurb.com), a product design company in Campbell, CA.

If Joyride knocks your socks off the way we hope it does and you want more, why not check out [our jobs](http://www.zurb.com/talent/jobs)?

MIT Open Source License
=======================

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
