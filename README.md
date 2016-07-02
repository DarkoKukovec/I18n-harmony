# I18n-harmony

[![Code Climate](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/gpa.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony)
[![Test Coverage](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/coverage.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/coverage)
[![Build Status](https://travis-ci.org/DarkoKukovec/I18n-harmony.svg?branch=master)](https://travis-ci.org/DarkoKukovec/I18n-harmony)
[![Dependency Status](https://david-dm.org/DarkoKukovec/I18n-harmony.svg)](https://david-dm.org/DarkoKukovec/I18n-harmony)
[![devDependency Status](https://david-dm.org/DarkoKukovec/I18n-harmony/dev-status.svg)](https://david-dm.org/DarkoKukovec/I18n-harmony#info=devDependencies)

I18n library that's using ES2015 [template string](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) syntax (but with reduced functionality).

Minified: ~1.3KB (~750B gziped)

Also supports:
* Global variables (either per locale or for all of them)
* Translation postProcessor

## How to install

* Bower: ``bower install i18n-harmony``
* npm: ``npm install i18n-harmony``

Dependencies: None

Works as a AMD (Require.js) module, CommonJS (node.js) module or as a global library.

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
* postProcessor
  * function that will be executed just before the ``t`` function returns the result
  * receives three argument - the interpolated string, translation key and received arguments
  * default function will replace newlines with line breaks
* suffixFunction
  * function that decides which suffix should be used based on the count argument
  * gets four arguments: count, key, options (passed to the ``t`` function) and current locale (either active or default)
  * it should return a suffix that will be appended to the key
  * default function returns ``"_one"`` if count is 1, and ``"_other"`` in all other cases
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

#### t(key, [options])
Get the interpolated string. Options is an object with local variables, and count parameter

#### has(key, [options], [includeDefault=false])
Check if the translation key exists in the active locale (if includeDefault is set as true, it will also check the default locale)

### Properties

#### locale
Get or set the active locale

#### globals (read-only)
Get the globals object - object can be edited, but not replaced.

## Changelog

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
