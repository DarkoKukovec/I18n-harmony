var assert = require('assert');
var I18n = require('../index');
var globalTranslations = require('./mock/translations.js');

describe('I18n', function() {
  describe('Initialization', function() {
    it('should initialize all inline translations', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-2'), 'Is this just fantasy?');
    });
  });

  describe('Missing translation', function() {
    it('should mark a missing translation with the locale code', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-42'), 'queen: phrase-42');
    });

    it('should return the translation key if the translation is not defined', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-42'), 'phrase-42');
    });
  });

  describe('Variable interpolation', function() {
    it('should interpolate a local variable into the translated string', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-1', { thingy: 'life'}), 'Is this the real life?');
    });

    it('should use local variable instead of global if both are defined', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-4'), 'No Escape from reality.');
    });

    it('Should use local variable instead of language variable if both are defined', function() {
      I18n.init({
        translations: globalTranslations,
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
      }), 'No Escape from taxes.');
    });

    it('should update the variable value if it was changed after initialization', function() {
      I18n.init({
        translations: globalTranslations,
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

      assert.equal(I18n.t('phrase-4'), 'No Escape from taxes.');
    });
  });

  describe('Quantity', function() {
    before(function() {
      I18n.init({
        translations: globalTranslations,
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
    });

    it('Should choose the single quantity if count is 1', function() {

      assert.equal(I18n.t('phrase-3', { disaster: 'landslide', count: 1}), 'Caught in a landslide,', 'Single quantity passed');
    });

    it('should choose multi quantity if count is not 1', function() {
      assert.equal(I18n.t('phrase-3', { disaster: 'landslides', count: 2}), 'Caught in landslides,', 'Multi quantity passed');
    });
  });

  describe('PostProcessor', function() {
    it('should not replace the newline character if postProcessor is disabled', function() {
      I18n.init({
        translations: globalTranslations,
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
      }), 'Open your eyes,\nLook up to the sky and see,');
    });

    it('should execute the custom defined postProcessor function', function() {
      I18n.init({
        translations: globalTranslations,
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
      }), '0pen y0ur eyes,\nL00k up t0 the sky and see,');
    });

    it('should replace newlines with breaks if the default postProcessor is used', function() {
      I18n.init({
        translations: globalTranslations,
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
      }), 'Open your eyes,<br />Look up to the sky and see,');
    });
  });

  describe('Custom phrases', function() {
    it('should support adding new custom phrases', function() {
      I18n.init({
        translations: cloneObj(globalTranslations), // Make sure we don't polute the default translations object
        active: 'queen'
      });

      I18n.add('phrase-6', 'I\'m just a ${what}, I need no sympathy,');

      assert.equal(I18n.t('phrase-6', {
        what: 'poor boy'
      }), 'I\'m just a poor boy, I need no sympathy,');
    });

    it('should interpolate the correct global variable into the custom phrase', function() {
      I18n.init({
        translations: cloneObj(globalTranslations), // Make sure we don't polute the default translations object
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

      I18n.add('phrase-6', '${why} I\'m ${hard} come, ${hard} go,');

      assert.equal(I18n.t('phrase-6', {
        what: 'poor boy'
      }), 'Because I\'m easy come, easy go,');
    });


    describe('Multiple custom phrases', function() {
      before(function() {
        I18n.init({
          translations: cloneObj(globalTranslations), // Make sure we don't polute the default translations object
          active: 'queen'
        });

        I18n.add({'phrase-6': 'I\'m just a ${what}, I need no sympathy,',
          'phrase-1': '${greeting}, is it me you\'re looking for?'
        });
      });

      it('should support the option to add multiple custom phrases', function() {
        assert.equal(I18n.t('phrase-6', {
          what: 'poor boy'
        }), 'I\'m just a poor boy, I need no sympathy,');
      });

      it('should override the original phrase with the custom one if keys match', function() {
        assert.equal(I18n.t('phrase-1', {
          greeting: 'Hello'
        }), 'Hello, is it me you\'re looking for?', 'Correct custom override');
      });
    });
  });

  describe('Missing data', function() {
    it('should remove the placeholder if the variable is not defined', function() {
      I18n.init({
        translations: globalTranslations,
        active: 'queen',
        globals: {
          all: {
            what: 'this'
          }
        }
      });

      assert.equal(I18n.t('phrase-1'), 'Is this the real ?');
    });

    it('should keep the placeholder if keepPlaceholder is set, and the variable is not defined', function() {
      I18n.init({
        translations: globalTranslations,
        active: 'queen',
        keepPlaceholder: true,
        globals: {
          all: {
            what: 'this'
          }
        }
      });

      assert.equal(I18n.t('phrase-1'), 'Is this the real ${ thingy}?');
    });
  });

  describe('Locale change', function() {
    // TODO
  })
});

// Quick & dirty deep clone of an object
function cloneObj(obj) {
  return JSON.parse(JSON.stringify(obj));
}
