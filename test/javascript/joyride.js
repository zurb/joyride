describe('Joyride', function() {
  var plugin;
  var $html;
  var templateHtml = '<div><h2 id="target-1">Target 1</h2><h2 id="target-2">Target 2</h2>'
    +'<ol data-joyride data-autostart="true">'
      + '<li data-target="#target-1">'
        + '<h3>First</h3>'
      + '</li>'
      + '<li data-target="#target-2">'
        + '<h3>Second</h3>'
      + '</li>'
    + '</ol></div>';

  afterEach(function() {
    plugin.destroy();
    $html.remove();
  });

  describe('constructor()', function() {
    it('stores the element and plugin options', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});

      plugin.$element.should.be.an('object');
      plugin.options.should.be.an('object');
    });
  });

  describe('_init()', function() {
    it('hides the joyride list', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});

      plugin.$element.should.have.attr('data-joyride');
      plugin.$element.should.be.hidden;
    });
  });

  describe('_render()', function() {
    it('creates tooltips for stops with target', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});

      plugin.structure[0].item.$element.should.have.attr('data-tooltip');
    });

    it('creates reveal modals for stops without target', function() {
      $html = $(templateHtml);
      $html.find('li').removeAttr('data-target');
      $html.appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});

      plugin.structure[0].item.$element.should.have.attr('data-reveal');
    });
  });

  describe('start()', function() {
    it('starts joyride automatically', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      $(plugin.$items[0]).should.be.visible;
    });

    it('starts joyride by clicking', function() {
      $html = $(templateHtml);
      $html.find('[data-joyride]').attr({'data-autostart': false, 'id': 'test-joyride'});

      var $button = $('<button class="button" data-joyride-start="#test-joyride">Start</button>');
      $html.append($button);
      $html.appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      
      $button.trigger('click');

      $(plugin.$items[0]).should.have.attr('aria-hidden', 'false');
    });
  });

  describe('showItem()', function() {
    var index = 1;

    it('shows item with given index', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showItem(index);

      $(plugin.$items[index]).should.be.visible;
    });

    it('adds class to active targets', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showItem(index);

      $(plugin.structure[index].$target).should.have.class('joyride-is-active-target');
    });

    it('adds class to body', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showItem(index);

      $('body').should.have.class('joyride-is-open');
    });
  });

  describe('hideItem()', function() {
    var index = 1;

    it('hides item with given index', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.hideItem(index);

      $(plugin.$items[index]).should.not.be.visible;
    });

    it('removes class to active targets', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.hideItem(index);

      $(plugin.structure[index].$target).should.not.have.class('joyride-is-active-target');
    });

    it('removes class to body', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.hideItem(index);

      $('body').should.not.have.class('joyride-is-open');
    });
  });

  describe('showNext()', function() {
    it('hides the current element', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showNext();
      $(plugin.$items[0]).should.have.attr('aria-hidden', 'true');
    });

    it('shows the next element', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showNext();
      $(plugin.$items[1]).should.have.attr('aria-hidden', 'false');    
    });
  });

  describe('showPrev()', function() {
    it('hides the current element', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showNext();
      plugin.showPrev();
      $(plugin.$items[1]).should.have.attr('aria-hidden', 'true');
    });

    it('shows the previous element', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.Joyride($html.find('[data-joyride]'), {});
      plugin.start();

      plugin.showNext();
      plugin.showPrev();
      $(plugin.$items[0]).should.have.attr('aria-hidden', 'false');    
    });
  });
});
