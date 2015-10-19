/* global define */

;(function(){
  'use strict';

  var regex = /\$\{\s*([a-zA-Z0-9\-\_]+)\s*\}/g;

  // Global variables available in all translations
  var globals;
  var activeLocale;
  var translations;
  var localeTranslations;
  var markMissing = true;
  var postProcessor;
  var keepPlaceholder;

  var I18n = {
    t: translate,
    add: addTranslation,
    init: init,
    set locale(locale) { setLocale(locale); },
    get locale() { return activeLocale; },
    get globals() { return globals; }
  };

  var hasDefine = typeof define === 'function';
  var hasExports = typeof module !== 'undefined' && module.exports;
  var root = (typeof window === 'undefined') ? global : window;

  if (hasDefine) { // AMD Module
    define([], function() {
      return I18n;
    });
  } else if (hasExports) { // Node.js Module
    module.exports = I18n;
  } else { // Assign to the global object
    root.I18n = I18n;
  }

  // Default postProcessor - replace newlines with line breaks
  var basePostProcessor = function(str) {
    return str.replace(/\n/g, '<br />');
  };

  function translate(key, args) {
    args = args || {};
    if (!activeLocale) {
      throw new Error('Active locale is not set');
    }
    var t;
    if ('count' in args) {
      var suffix = _getSuffix(args.count);
      t = localeTranslations[key + suffix] || localeTranslations[key];
    } else {
      t = localeTranslations[key];
    }
    if (t) {
      var str = _interpolate(t, _prepareArgs(args));
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

  function _interpolate(t, args) {
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

  function _getSuffix(count) {
    // TODO: Ability to change this from outside (per language)
    return (count === 1 ? '_one' : '_other');
  }

  function _prepareArgs(args) {
    var prepared = {};
    _extend(prepared, globals.all);
    _extend(prepared, globals[activeLocale]);
    _extend(prepared, args);
    return prepared;
  }

  function _extend(original, additional) {
    additional = additional || {};
    for (var key in additional) {
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
    _extend(translations[locale], translationObj);
  }

  function init(options) {
    translations = options.translations || {};
    keepPlaceholder = options.keepPlaceholder;
    globals = options.globals || {};
    markMissing = options.markMissing === false ? false : markMissing;
    postProcessor = options.postProcessor === false ?
      null : (options.postProcessor || basePostProcessor);
    setLocale(options.active);
  }

})();
