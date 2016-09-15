# Joyride
Joyride is an easy to configure site tour wizard for [Foundation for Sites](https://github.com/zurb/foundation-sites).

## Installation
To install joyride you can either use NPM (comming soon) or download the files directly.

* `npm start` - Calls the build process and opens the demo in your browser.
* `npm test` - Runs the JavaScript tests.
* `npm run test:javascript` - Runs tests for JavaScript with Mocha using PhantomJS.
* `npm run test:visual` - Runs visual tests/live demos.


## Usage
All versions of joyride depend on jQuery and [what-input](https://github.com/ten1seven/what-input). While jQuery is mandatory, what-input is used for styling purposes and not necessary for joyride to work.

Regardless of the way you use joyride, you need to initialize it like all Foundation plugins by calling:

```js
$(document).foundation();
```

The following HTML is an example on how to use joyride. You can also have a look at the visual test cases in the `test/visual/` folder.

```html
<ol data-joyride data-autostart="true" id="docs-joyride">
  <li data-target="#basic-joyride">
    <p>This is the default one without settings</p>
  </li>
  <li data-target="#footer" data-position="bottom" data-closable="false">
    <p>This one isn't closable</p>
  </li>
  <li>
    <p>If no target is specified, you create a modal.</p>
  </li>
  <li data-target="#open-issues">
    <p>Your ride ends here!</p>
    <p class="text-center">
      <button class="button success" data-joyride-close>OK, thanks!</button>
    </p>
  </li>
</ol>
```

### Foundation plugin
Originally, joyride is a plugin for Foundation for Sites and leaverages existing plugins and functionalities of the framework.
To use joyride with Foundation, just include the files into your page right after the Foundation files. Then follow the example above to create the ride. 

### Standalone plugin
To make joyride available for a broader amount of users, it is also available as a standalone plugin. All relevant Foundation functionalities are bundled with the joyride files, so joyride can still benefit from them.
To use joyride with Foundation, just include the files into your page right and follow the example above to create the ride. 

### Using script loader
Joyride can be used by including its files via HTML-tags and also the most popular script loaders, such as RequireJS. This is done by leveraging UMD.

## Testing

* `npm run test:javascript` to run JavaScript tests with Mocha using PhantomJS.
* `npm run test:visual` to run visual regression tests.

## Contributing

Check out our [contributing guide](http://foundation.zurb.com/develop/contribute.html) to learn how you can contribute to this plugin. You can also browse the [Help Wanted](https://github.com/zurb/joyride/labels/help%20wanted) tag in our issue tracker to find things to do.