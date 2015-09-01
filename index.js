;(function($){
  'use strict';

  var regex = /\$\{\s*([a-zA-Z0-9\-\_]+)\s*\}/g;

  // Global variables available in all translations
  var globals;
  var activeLocale;
  var translations;
  var localeTranslations;
  var markMissing = true;
  var translationPath;
  var postProcessor;
  var keepPlaceholder;

  var I18n = {
    t: translate,
    add: addTranslation,
    init: init,
    loadSingle: loadSingle,
    loadAll: loadAll,
    set locale(locale) { setLocale(locale); },
    get locale() { return activeLocale; },
    get globals() { return globals; }
  };

  var hasDefine = typeof define === 'function';
  var hasExports = typeof module !== 'undefined' && module.exports;
  var root = window || global; // window before global because of nwjs.io

  if (hasDefine) { // AMD Module
    define(['jquery'], function(jQuery) {
      $ = jQuery;
      return I18n;
    });
  } else if (hasExports) { // Node.js Module
    $ = $ || require('jquery');
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
    var match;
    while(match = regex.exec(t)) {
      var arg = args[match[1]];
      if (arg === undefined) {
        arg = keepPlaceholder ? match[0] : '';
      }
      t = t.replace(match[0], arg);
    }
    return t;
  }

  function _prepareArgs(args) {
    return $.extend({}, globals.all || {}, globals[activeLocale] || {}, args);
  }

  function _getSuffix(count) {
    // TODO: Ability to change this from outside (per language)
    return (count === 1 ? '_one' : '_other');
  }

  function setLocale(locale) {
    if (!translations[locale]) {
      console.warn('There are no traslations for ' + locale);
    }
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
    $.extend(translations[locale], translationObj);
  }

  function init(options) {
    translations = options.translations || {};
    translationPath = options.translationPath;
    keepPlaceholder = options.keepPlaceholder;
    globals = options.globals || {};
    markMissing = options.markMissing === false ? false : markMissing;
    postProcessor = options.postProcessor === false ?
      null : (options.postProcessor || basePostProcessor);
    if (options.active) {
      setLocale(options.active);
    }
  }

  function loadSingle(locale) {
    if (!translationPath) {
      throw new Error('Path is not defined');
    }
    locale = locale || activeLocale;
    return $.ajax(translationPath + locale + '.json').done(function(response) {
      addTranslation(response, locale);
      if (locale === activeLocale) {
        setLocale(locale);
      }
    });
  }

  function loadAll() {
    if (!translationPath) {
      throw new Error('Path is not defined');
    }
    return $.ajax(translationPath).done(function(response) {
      $.each(response, function(locale, phrases) {
        addTranslation(phrases, locale);
      });
      setLocale(activeLocale);
    });
  }

})($);
