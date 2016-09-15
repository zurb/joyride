/**
 * Configuration file for the gulp tasks.
 *
 * @author Marius Olbertz
 * @version 0.1gu
 */
module.exports = {
  name: 'joyride',
  srcPath: '',
  destPath: 'dist/',
  buildPath: '_build/',
  pluginPath: '_build/',
  foundationPath: 'node_modules/foundation-sites',
  css: {
    compatibility: ['last 2 versions', 'ie 10', 'Android >= 4.1'], // compatibility for auto prefixer
    components: [
      'tooltip',
      'reveal'
    ]
  },
  javascript: {
    dependencies: [ // define JS dependencies for this project to concat
      'node_modules/foundation-sites/js/foundation.core.js',
      'node_modules/foundation-sites/js/foundation.util.*.js',
      'node_modules/foundation-sites/js/foundation.tooltip.js',
      'node_modules/foundation-sites/js/foundation.reveal.js',
      'dist/foundation.joyride.js'
    ]
  }
};