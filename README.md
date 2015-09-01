# I18n-harmony

[![Code Climate](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/gpa.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony)
[![Test Coverage](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/badges/coverage.svg)](https://codeclimate.com/github/DarkoKukovec/I18n-harmony/coverage)

I18n library that's using ES2015 [template string](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/template_strings) syntax (but with reduced functionality).

Also supports:
* Global variables (either per locale or for all of them)
* Translation postProcessor

## How to install

* Bower: ``bower install DarkoKukovec/I18n-harmony``
* npm: ``npm install DarkoKukovec/I18n-harmony``

Dependency: lodash 3.x

Works as a AMD (Require.js) module, CommonJS (node.js) module or as a global library.

## Documentation

### Methods

#### init(options)
Initializes the library. Options:
* translations
  * Object with locales as keys and maps of translations as values
* translationPath
  * location of the translation files
  * direct path to json if loadAll is used
  * path to the folder if loadSingle is used
* globals
  * keys are locale names or "all"
  * values are maps of global variables
* markMissing (default: ``true``)
  * if a translation is missing, it will add ``locale: `` in front of the key when it's returned by the ``t`` function
* postProcessor
  * function that will be executed just before the ``t`` function returns the result
  * receives one argument - the interpolated string
  * default function will replace newlines with line breaks
* active
  * active locale
* keepPlaceholder (default: ``false``)
  * keep the placeholder if the variable isn't defined

#### add(key, translation, [locale=activeLocale])
Add a translation to the locale

#### add(translations, [locale=activeLocale])
Add multiple translations to the locale. The first argument is a map of all the translations that should be added.

#### t(key, [options])
Get the interpolated string. Options is an object with local variables, and count parameter

### Properties

#### locale
Get or set the active locale

#### globals (read-only)
Get the globals object - object can be edited, but not replaced.

### Count
If count property exists in the options argument of the ``t`` function, it will try to find the special version of the translation that's customized for multiple phrasings. The key will in this case have a ``_one`` sufix (if count is 1), or ``_other`` sufix (for all other values of count). If the key doesn't exist, it will fallback to the original translation key.

TODO: Add ability to define custom functions (per locale) to determine which suffix should be used.
