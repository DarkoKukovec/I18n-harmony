$(function() {
  QUnit.module('Async tests');

  QUnit.test('Load all', function(assert) {
    var done = assert.async();

    I18n.init({
      translationPath: 'mock/translations.json',
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    I18n.loadAll().done(function() {
      assert.equal(I18n.t('phrase-2'), 'Is this just fantasy?', 'All async translations were loaded');
      done();
    });
  });

  QUnit.test('Load single', function(assert) {
    var done = assert.async();

    I18n.init({
      translationPath: 'mock/',
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    I18n.loadSingle('queen').done(function() {
      assert.equal(I18n.t('phrase-2'), 'Is this just fantasy?', 'Queen async translations were loaded');
      done();
    });
  });

  /* --------------------- */

  QUnit.module('Sync tests');

  QUnit.test('Init inline translations', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-2'), 'Is this just fantasy?', 'All inline translations were loaded');
  });

  QUnit.test('Check missing translation', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-42'), 'queen: phrase-42', 'Correct missing translation value');
  });

  QUnit.test('Check quiet missing translation', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen',
      markMissing: false
    });

    assert.equal(I18n.t('phrase-42'), 'phrase-42', 'Correct missing translation value');
  });

  QUnit.test('Test local data', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-1', { thingy: 'life'}), 'Is this the real life?', 'Local data correctly interpolated');
  });

  QUnit.test('Test quantity data', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-3', { disaster: 'landslide', count: 1}), 'Caught in a landslide,', 'Single quantity passed');
    assert.equal(I18n.t('phrase-3', { disaster: 'landslides', count: 2}), 'Caught in landslides,', 'Multi quantity passed');
  });

  QUnit.test('Test locale global over all global', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-4'), 'No Escape from reality.', 'Correct locale global');
  });

  QUnit.test('Test local override', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-4', {
      what: 'taxes'
    }), 'No Escape from taxes.', 'Correct local value');
  });

  QUnit.test('Test global update', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen'
    });

    I18n.globals.queen.what = 'taxes';

    assert.equal(I18n.t('phrase-4'), 'No Escape from taxes.', 'Correct global update');
  });

  QUnit.test('Test multiline', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen',
      postProcessor: false
    });

    assert.equal(I18n.t('phrase-5', {
      visionDevices: 'eyes',
      theThingAboveEarth: 'sky'
    }), 'Open your eyes,\nLook up to the sky and see,', 'Correct multiline');
  });

  QUnit.test('Test custom postProcessor', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen',
      postProcessor: function(str) {
        return str.replace(/o/gi, '0');
      }
    });

    assert.equal(I18n.t('phrase-5', {
      visionDevices: 'eyes',
      theThingAboveEarth: 'sky'
    }), '0pen y0ur eyes,\nL00k up t0 the sky and see,', 'Correct postProcessor result');
  });

  QUnit.test('Test multiline with line break', function(assert) {
    I18n.init({
      translations: window.translations,
      globals: {
        all: {
          what: 'this'
        },
        queen: {
          solution: 'Escape',
          what: 'reality'
        }
      },
      active: 'queen'
    });

    assert.equal(I18n.t('phrase-5', {
      visionDevices: 'eyes',
      theThingAboveEarth: 'sky'
    }), 'Open your eyes,<br />Look up to the sky and see,', 'Correct multiline');
  });

  QUnit.test('Test custom phrase', function(assert) {
    I18n.init({
      translations: window.translations,
      active: 'queen'
    });

    I18n.addTranslation('phrase-6', 'I\'m just a ${what}, I need no sympathy,');

    assert.equal(I18n.t('phrase-6', {
      what: 'poor boy'
    }), 'I\'m just a poor boy, I need no sympathy,', 'Correct custom phrase');
  });

  QUnit.test('Test custom phrase with global', function(assert) {
    I18n.init({
      translations: window.translations,
      active: 'queen',
      globals: {
        all: {
          hard: 'easy'
        },
        queen: {
          why: 'Because'
        }
      }
    });

    I18n.addTranslation('phrase-6', '${why} I\'m ${hard} come, ${hard} go,');

    assert.equal(I18n.t('phrase-6', {
      what: 'poor boy'
    }), 'Because I\'m easy come, easy go,', 'Correct custom phrase');
  });

  // TODO: Change locales

});
