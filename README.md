jquery.weekSchedulerWidget.js
-------

[1]: <https://github.com/darksmo/jquery-weekscheduler-widget>

A week scheduler widget, ideal to be used as a popup to schedule an event to occur at a given time and days in week.

[![Build Status](https://travis-ci.org/darksmo/jquery-weekscheduler-widget.svg?branch=master)](https://travis-ci.org/darksmo/jquery-weekscheduler-widget)

#### Example

Initialize with:

```html
    <div id="widget"></div>
```

```javascript
    $('#widget').weekSchedulerWidget();
```

Destroy with:

```javascript
    $('#widget').weekSchedulerWidget('destroy');
```

#### Demo

For live demos please visit the project webpage:

[http://darksmo.github.io/jquery-weekscheduler-widget/](http://darksmo.github.io/jquery-weekscheduler-widget/)

For a Quick Start, step-by-step guide, have a look at the source html of the following file:

[https://github.com/darksmo/jquery-weekscheduler-widget/blob/master/demo/index.html](https://github.com/darksmo/jquery-weekscheduler-widget/blob/master/demo/index.html)

#### Options and Callbacks

Option | Type | Default | Description
------ | ---- | ------- | -----------
localization | object | see below | localization of the widget, including months and day names
minutesPrecision | number | 15 | the granularity of the minutes picker, the default is indicating to schedule at the 15th minute of the hour
startDate | Date | `new Date()` | the day of the week we want to start from in the week picker
endDate | Date | a date object ending one month later than startDate | the day of the week we want to end to in the week picker
firstDayOfWeek | number | 1 | what day is the first day of the week for you; `0 = sunday 6 = saturday`
lastDayOfWeek | number | 0 | what day is the last day of the week for you; `0 = sunday 6 = saturday`
hideOnStart | boolean | false | whether to hide the widget at start time
onBeforeShow | function | `function () { return true; }` | a callback called before the widget is shown
onAfterShow | function | `function () { }` | a callback called after the widget is shown
onBeforeHide | function | `function () { return true; }` | a callback called before the widget is hidden 
onAfterHide | function | `function () { }` | a callback called after the widget is hidden

The `localization` option default is too long to fit in the table. But it looks like this:

    localization: {
        title: 'Schedule item',
        week: 'Week',
        days: 'Days',
        time: 'Time',
        hour: 'Hour',
        minute: 'Minute',
        confirm: 'Add',
        cancel: 'Cancel',
        to: 'to',
        /* 
         * Must start with the first day specified in
         * firstDayOfWeek and end with the one corresponding to
         * lastDayOfWeek 
         * */
        dayNames: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        monthNames: ['January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August', 'September', 'October',
            'November', 'December'
        ]
    },

#### Events thrown

You can listen on the following events via something like `$("#widget").on("onConfirm.weekSchedulerWidget", function () { ... });`

Events | Data | Description
------ | ---- | -----------
onConfirm.weekSchedulerWidget | none | user clicked confirm
onCancel.weekSchedulerWidget | none | user clicked cancel
onWeekSelected.weekSchedulerWidget | none | user changed week from the dropdown


#### Methods

Method | Argument | Description
------ | -------- | -----------
show | None | show the widget
hide | None | hide the widget
SeelgetSelectedDates | None | get the current selection of the user represented as an array of Date objects
getSelection | None | get the current selection of the user in the form of an object
setDates | Array[Date] | set the current selection via an array of Dates
setDatesWithState | Array[Date] | set the current selection via an array of `{ date: Date object, state: "indeterminate" or "checked" }`
setDays | Array[number] | select the currently selected days (takes an array of days to select like [3, 5, 6] where 0=sunday and 6=saturday)
setDaysWithState | Array[object] | same as setDays, but an array of `{ day: number, state: "indeterminate" /* or "checked" */ }` is passed
setHour | number | select the given hour
setMinutes | number | select the given minutes
setWeek | Date | select the week in which the given Date object falls
destroy | None | destroys the widget

#### JSDoc

See index.html in docs/ directory

#### Dependencies

jQuery 1.6.4+

#### License

Copyright (c) 2014 Savio Dimatteo

Licensed under the MIT license.
