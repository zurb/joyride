# Joyride
Some plugin for Foundation 6.

## Installation
To install joyride you can either use NPM or download the files directly.


## Usage

* `npm start` - Calls the build process
* `npm test` - Runs the tests
* `npm run test:javascript` - Runs tests for JavaScript with Mocha using PhantomJS
* `npm run test:visual` - Runs visual tests/live demos

### Foundation plugin

### Standalone plugin

### Using UMD

```js
// Configure requireJS paths for the modules
requirejs.config({
  packages: [{
    name: 'jquery',
    location: '../node_modules/jquery/dist',
    main: 'jquery'
  },{
    name: 'what-input',
    location: '../node_modules/jquery/dist',
    main: 'jquery'
  },{
    name: 'joyride',
    location: '../dist',
    main: 'foundation.joyride'
  }, {
    name: 'foundation',
    location: '../node_modules/foundation-sites/dist',
    main: 'foundation'
  }]
});
requirejs(['jquery', 'what-input', 'foundation', 'joyride'], function(Joyride, Foundation, jQuery) {
  // initialize Foundation
  $(document).foundation();
});
```

## Testing

* `npm run test:javascript` to run JavaScript tests with Mocha using PhantomJS
* `npm run test:visual` to run visual regression tests

## Contributing

Check out our [contributing guide](http://foundation.zurb.com/develop/contribute.html) to learn how you can contribute to this plugin. You can also browse the [Help Wanted](https://github.com/zurb/joyride/labels/help%20wanted) tag in our issue tracker to find things to do.