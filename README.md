# I18n-harmony

[![i18n-harmony](https://img.shields.io/npm/v/i18n-harmony.svg?maxAge=2592000)](https://www.npmjs.com/package/i18n-harmony)
![i18n-harmony](https://img.shields.io/bower/v/i18n-harmony.svg?maxAge=2592000)

[![Code Climate](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/gpa.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony)
[![Test Coverage](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/coverage.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/coverage)
[![Build Status](https://travis-ci.org/DarkoKukovec/I18n-harmony.svg?branch=master)](https://travis-ci.org/DarkoKukovec/I18n-harmony)

[![Dependency Status](https://david-dm.org/DarkoKukovec/I18n-harmony.svg)](https://david-dm.org/DarkoKukovec/I18n-harmony)
[![devDependency Status](https://david-dm.org/DarkoKukovec/I18n-harmony/dev-status.svg)](https://david-dm.org/DarkoKukovec/I18n-harmony#info=devDependencies)

I18n library that's using ES2015 [template string](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) syntax (but with reduced functionality).

Minified: ~1.6KB (~870B gziped)

Also supports:
* Global variables (either per locale or for all of them)
* Translation postProcessor

## How to install

* Bower: ``bower install i18n-harmony``
* npm: ``npm install i18n-harmony``

Dependencies: None

Works as a AMD (Require.js) module, CommonJS (node.js) module or as a global library.

## Features

### Global & local (per locale) variables
* Variables you don't need to define every time you use a translation
* Priority: inline, local, global.

### Nested translations
* If you want more than key-value, you can nest them and use ``nestingSeparator`` to separate the keys
* Example: ``I18n.t('profile.name')``

### Plural support
* When you pass ``count`` to the ``t`` function, it will check if the string should be in plural
* By default, singular will be when count is 1, and plural otherwise
* By default, the key will get the suffix ``_one`` or ``_other``
* The behaviour can be tweaked using the ``suffixSeparator`` or ``suffixFunction``

### Fallbacks
* Default locale: In case you don't have all phrases translated, you can fall back to the default locale (``default``)
* Missing locale: In case the key is not found, the key will be returned, but it can be prefixed with the locale in order to simplify debugging (``markMissing``)
* Missing variable: If a variable is not defined, the placeholder can be either removed or it can stay in the final translation (``keepPlaceholder``)
* If needed, you can use the ``has`` method if a certain translation exists

### Post processing
* Sometimes, there is a need to do some post processing before the translation is ready
* Default behaviour is to replace all occurances of ``"\n"`` with ``"<br />"``, but it can be overriden with the ``postProcessor`` option

## Documentation

### Methods

#### init(options)
Initializes the library. Options:
* translations
  * Object with locales as keys and maps of translations as values
* globals
  * keys are locale names or "all"
  * values are maps of global variables
* markMissing (default: ``true``)
  * if a translation is missing, it will add ``locale: `` in front of the key when it's returned by the ``t`` function
* preProcessor
  * function that will execute before the translation key is used to find the translation when `t` and `has` functions are executed
  * receives the same three arguments as the `t` function
  * useful in cases where the translation keys have changed, but the code is still using old keys (e.g. during refactoring)
* postProcessor
  * function that will be executed just before the ``t`` function returns the result
  * receives three argument - the interpolated string, translation key and received arguments
  * default function will replace newlines with line breaks
* findTranslation
  * Default function will try to get the key directly and if it doesn't succeed, it will split the key with ``nestingSeparator`` and try to find the nested value
  * Function receives the key and object with translations and should return the translation that should be used
* nestingSeparator (default: ``"."``)
  * The separator used for nesting
  * Not relevant if ``findTranslation`` function is defined
* suffixFunction
  * function that decides which suffix should be used based on the count argument
  * gets four arguments: count, key, options (passed to the ``t`` function) and current locale (either active or default)
  * it should return a suffix that will be appended to the key
  * default function returns ``"_one"`` if count is 1, and ``"_other"`` in all other cases
* suffixSeparator (default: ``"_"``)
  * Separator used for suffix
  * In order to use nesting, set this value to the same value as ``nestingSeparator``
  * Not relevant if ``suffixFunction`` function is defined
* active
  * active locale
* default (default: ``null``)
  * default locale that will be used as fallback if the phrase doesn't exist in the active locale
* keepPlaceholder (default: ``false``)
  * keep the placeholder if the variable isn't defined

#### add(key, translation, [locale=activeLocale])
Add a translation to the locale

#### add(translations, [locale=activeLocale])
Add multiple translations to the locale. The first argument is a map of all the translations that should be added.

#### t(key, [options], [locale=activeLocale])
Get the interpolated string. Options is an object with local variables, and count parameter

#### has(key, [options], [includeDefault=false], [locale=activeLocale])
Check if the translation key exists in the active locale (if includeDefault is set as true, it will also check the default locale)

### Properties

#### locale
Get or set the active locale

#### globals (read-only)
Get the globals object - object can be edited, but not replaced.

## Changelog

### 1.5
* Nested keys ([Usage example](https://github.com/DarkoKukovec/I18n-harmony/blob/master/test/tests.js#L459))
* New option: ``findTranslation``
* New option: ``nestingSeparator``
* New option: ``suffixSeparator``

### 1.4
* Added optional ``locale`` parameter to the ``t`` and ``has`` functions

### 1.3
* Added key and args parameters to the postProcessor function
* ``has`` function to check if a translation key exists

### 1.2
* Default locale
* Suffix function

### 1.1
* Minified version
* Readme fixes

### 1.0
* Initial release
