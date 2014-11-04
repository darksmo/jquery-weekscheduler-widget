jquery.weekSchedulerWidget.js
-------

[1]: <https://github.com/darksmo/jquery-weekscheduler-widget>

A week scheduler widget, ideal to be used as a popup to schedule an event to occur at a given week

[![Build Status](https://travis-ci.org/darksmo/jquery-weekscheduler-widget.svg?branch=master)](https://travis-ci.org/darksmo/jquery-weekscheduler-widget)

#### Example

Initialize with:

```html
```

```javascript
```

Destroy with:

```javascript
```

#### Demo

For live demos please visit the project webpage:

[http://darksmo.github.io/jquery-weekscheduler-widget/](http://darksmo.github.io/jquery-weekscheduler-widget/)

For a Quick Start, step-by-step guide, have a look at the source html of the following file:

[https://github.com/darksmo/jquery-weekscheduler-widget/blob/master/demo/index.html](https://github.com/darksmo/jquery-weekscheduler-widget/blob/master/demo/index.html)

#### Options

Option | Type | Default | Description
------ | ---- | ------- | -----------
defaultLanguage | string | en_GB | the `language_country` code the page to translate is initially in.
languages | object | {} | additional/custom language definitions
strings | object | {} | pointers to the original strings and their translations in various languages
showFlag | boolean | true | whether to show the flag on the widget
showLanguage | boolean | true | whether to show the language name on the widget
showCountry | boolean | true | whether to show the country name on the widget
onLanguageSelected | function | function (/*langCountryCode*/) { return true; } | a callback called as soon as the user selects the new language from the dropdown menu. Return true to trigger the translation or false to just select the language without translating.

#### Methods

Method | Argument | Description
------ | -------- | -----------
translate | string (languageCode) | translates the text in the given language programmatically, if no language code is specified, the default (initial) translation is used.
destroy | None | destroys the localization tool

#### JSDoc

See index.html in docs/ directory

#### Dependencies

jQuery 1.6.4+

#### License

Copyright (c) 2014 Savio Dimatteo

Licensed under the MIT license.
