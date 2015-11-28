/* global define */

;(function(){
  'use strict';

  var regex = /\$\{\s*([a-zA-Z0-9\-\_]+)\s*\}/g;
  var globals;
  var activeLocale;
  var translations;
  var localeTranslations;
  var defaultLocale;
  var defaultTranslations;
  var markMissing;
  var postProcessor;
  var suffixFunction;
  var keepPlaceholder;

  var I18n = {
    't': translate,
    'add': addTranslation,
    'init': init,
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

  var defaultPostProcessorFn = function(str) {
    return str.replace(/\n/g, '<br />');
  };

  var defaultSuffixFn = function(count) {
    return (count === 1 ? '_one' : '_other');
  };

  function translate(key, args) {
    args = args || {};
    if (!activeLocale) {
      throw new Error('Active locale is not set');
    }
    var t = getTranslation(key, args);
    if (t) {
      var str = interpolate(t, prepareArgs(args));
      if (postProcessor) {
        str = postProcessor(str);
      }
      return str;
    } else if (markMissing) {
      return activeLocale + ': ' + key;
    } else {
      return key;
    }
  }

  function getSuffix(key, args, locale) {
    if ('count' in args && suffixFunction) {
      return suffixFunction(args.count, key, args, locale);
    }
    return '';
  }

  function getTranslation(key, args) {
    var active = localeTranslations[key + getSuffix(key, args, activeLocale)] || localeTranslations[key];
    if (!active && defaultTranslations) {
      active = defaultTranslations[key + getSuffix(key, args, defaultLocale)] || defaultTranslations[key];
    }
    return active;
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

  function prepareArgs(args) {
    var prepared = {};
    extend(prepared, globals.all);
    extend(prepared, globals[activeLocale]);
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
    localeTranslations = translations[locale] || {};
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
    defaultLocale = options['default'] || null;
    defaultTranslations = translations[options['default']];
    setLocale(options['active']);
  }
})();
