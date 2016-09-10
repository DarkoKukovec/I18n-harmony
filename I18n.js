/* global define */

;(function(){
  'use strict';

  var regex = /\$\{\s*([a-zA-Z0-9\-\_]+)\s*\}/g;
  var globals;
  var activeLocale;
  var translations;
  var defaultLocale;
  var defaultTranslations;
  var markMissing;
  var postProcessor;
  var suffixFunction;
  var keepPlaceholder;
  var findTranslation;
  var suffixSeparator;
  var nestingSeparator;

  var I18n = {
    't': translate,
    'add': addTranslation,
    'init': init,
    'has': has,
    set 'locale'(locale) { setLocale(locale); },
    get 'locale'() { return activeLocale; },
    get 'globals'() { return globals; }
  };

  var hasDefine = typeof define === 'function';
  var hasExports = typeof module !== 'undefined' && module['exports'];
  var root = (typeof window === 'undefined') ? global : /* istanbul ignore next */ window;

  /* istanbul ignore next */
  if (hasDefine) { // AMD Module
    define([], function() {
      return I18n;
    });
  } else if (hasExports) { // Node.js Module
    module['exports'] = I18n;
  } else { // Assign to the global object
    root['I18n'] = I18n;
  }

  function defaultPostProcessorFn(str) {
    return str.replace(/\n/g, '<br />');
  };

  function defaultSuffixFn(count) {
    return suffixSeparator +(count === 1 ? 'one' : 'other');
  };

  function defaultFindTranslation(key, translations) {
    if (translations[key]) {
      return translations[key];
    }

    var combined = key.split(nestingSeparator);
    var values = translations;
    while(combined.length && values) {
      var subkey = combined.shift();
      values = values[subkey];
    }
    return values;
  }

  function translate(key, args, locale) {
    args = args || {};
    var currentLocale = locale || activeLocale;
    if (!currentLocale) {
      throw new Error('Active locale is not set');
    }
    var t = getTranslation(key, args, false, currentLocale);
    if (t) {
      var str = interpolate(t, prepareArgs(args, currentLocale));
      if (postProcessor) {
        str = postProcessor(str, key, args);
      }
      return str;
    } else if (markMissing) {
      return currentLocale + ': ' + key;
    } else {
      return key;
    }
  }

  function has(key, args, includeDefault, locale) {
    args = args || {};
    var currentLocale = locale || activeLocale;
    if (!currentLocale) {
      throw new Error('Active locale is not set');
    }
    return typeof getTranslation(key, args, !includeDefault, currentLocale) !== 'undefined';
  }

  function getSuffix(key, args, locale) {
    if ('count' in args && suffixFunction) {
      return suffixFunction(args.count, key, args, locale);
    }
    return '';
  }

  function getTranslation(key, args, ignoreDefault, currentLocale) {
    var currentTranslations = translations[currentLocale] || {};
    var current = findTranslation(key + getSuffix(key, args, currentLocale), currentTranslations)
      || findTranslation(key, currentTranslations);
    if (!current && defaultTranslations && !ignoreDefault) {
      current = findTranslation(key + getSuffix(key, args, defaultLocale), defaultTranslations)
        || findTranslation(key, defaultTranslations);
    }
    return current;
  }

  function interpolate(t, args) {
    var match = regex.exec(t);
    var lastIndex = 0;
    while(match) {
      var arg = args[match[1]];
      if (arg === undefined) {
        arg = keepPlaceholder ? match[0] : '';
        lastIndex = keepPlaceholder ? regex.lastIndex : lastIndex;
      }
      t = t.replace(match[0], arg);
      regex.lastIndex = lastIndex; // Bug #1 - Need to reset the position in case the placeholder is longer than the value
      match = regex.exec(t);
    }
    return t;
  }

  function prepareArgs(args, currentLocale) {
    var prepared = {};
    extend(prepared, globals.all);
    extend(prepared, globals[currentLocale]);
    extend(prepared, args);
    return prepared;
  }

  function extend(original, additional) {
    additional = additional || {};
    for (var key in additional) {
      /* istanbul ignore else */
      if (additional.hasOwnProperty(key)) {
        original[key] = additional[key];
      }
    }
    return original;
  }

  function setLocale(locale) {
    activeLocale = locale;
  }

  function addTranslation() {
    var translationObj, locale;
    if (typeof arguments[0] === 'object') {
      translationObj = arguments[0];
      locale = arguments[1];
    } else {
      translationObj = {};
      translationObj[arguments[0]] = arguments[1];
      locale = arguments[2];
    }
    locale = locale || activeLocale;
    translations[locale] = translations[locale] || {};
    extend(translations[locale], translationObj);
  }

  function setOption(option, defaultOption) {
    return option === false ? null : (option || defaultOption);
  }

  function init(options) {
    keepPlaceholder = !!options['keepPlaceholder'];
    globals = setOption(options['globals'], {});
    markMissing = setOption(options['markMissing'], true);
    translations = setOption(options['translations'], {});
    postProcessor = setOption(options['postProcessor'], defaultPostProcessorFn);
    suffixFunction = setOption(options['suffixFunction'], defaultSuffixFn);
    findTranslation = setOption(options['findTranslation'], defaultFindTranslation);
    defaultLocale = options['default'] || null;
    suffixSeparator = options['suffixSeparator'] || '_';
    nestingSeparator = options['nestingSeparator'] || '.';
    defaultTranslations = translations[options['default']];
    setLocale(options['active']);
  }
})();
