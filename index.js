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
  var _;

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
  // var root = window || global; // window before global because of nwjs.io
  var root = global || window;

  if (hasDefine) { // AMD Module
    define(['lodash'], function(lodash) {
      _ = lodash;
      return I18n;
    });
  } else if (hasExports) { // Node.js Module
    _ = require('lodash');
    module.exports = I18n;
  } else { // Assign to the global object
    _ = root._;
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
    while(match) {
      var arg = args[match[1]];
      if (arg === undefined) {
        arg = keepPlaceholder ? match[0] : '';
      }
      t = t.replace(match[0], arg);
      match = regex.exec(t);
    }
    return t;
  }

  function _prepareArgs(args) {
    return _.extend({}, globals.all || {}, globals[activeLocale] || {}, args);
  }

  function _getSuffix(count) {
    // TODO: Ability to change this from outside (per language)
    return (count === 1 ? '_one' : '_other');
  }

  function setLocale(locale) {
    localeTranslations = translations[locale];
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
    _.extend(translations[locale], translationObj);
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
