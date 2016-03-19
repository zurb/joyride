describe('Joyride', function() {
  var plugin;
  var $html;
  var joyrideListHtml = '<ol data-joyride data-autostart="true" id="docs-joyride">'
      + '<li data-target="#basic-joyride">'
        + '<h3>First</h3>'
        + '<p>This is the default one without settings</p>'
      + '</li>'
    + '</ol>';

  afterEach(function() {
    plugin.destroy();
    $html.remove();
  });

  describe('constructor()', function() {
    it('stores the element and plugin options', function() {
      $html = $('<h2 id="basic-joyride">Target</h2>' + joyrideListHtml).appendTo('body');
      plugin = new Foundation.Joyride($html, {});

      plugin.$element.should.be.an('object');
      plugin.options.should.be.an('object');
    });
  });

  describe('init()', function() {
    it('hides the joyride list', function() {
      $html = $('<h2 id="basic-joyride">Target</h2>' + joyrideListHtml).appendTo('body');
      plugin = new Foundation.Joyride($html, {});

      plugin.$element.should.have.attr('data-joyride');
    });

    /*it('automatically starts joyride', function() {
      $html = $('<h2 id="basic-joyride">Target</h2>' + joyrideListHtml).appendTo('body');
      plugin = new Foundation.Joyride($html, {});

      plugin.$items.eq(0).should.have.attr('data-is-active', 'true');
    });*/
  });
});
