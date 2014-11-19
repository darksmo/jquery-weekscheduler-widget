(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  var commonFixtures = {
    'widget' : '<div id="widget"></div>',
  };

  /*
   * Some helpers here...
   */
  var addMarkupToFixture = function (markupName) {
    return function () {
        // append dropdown widget to qunit-fixture
        var $fixture = $('#qunit-fixture');

        $fixture.append(commonFixtures[markupName]);
    };
  };
  var addInitializedMarkupToFixture = function (markupName, options) {
    return function () {
        // first add the markup
        (addMarkupToFixture(markupName))();

        // then initialize it
        if (typeof options !== 'undefined') {
            $("#widget").weekSchedulerWidget(options);
        }
        else {
            $("#widget").weekSchedulerWidget();
        }
    };
  };


  
  module('basic tests', { setup: addMarkupToFixture('widget') });

  test('is chainable', function () {
      ok($('#widget').weekSchedulerWidget().addClass('initialized'),
        'add class from chaining');

      equal($('#widget').hasClass('initialized'), true, 
        'element is chainable after initialization');
  });

  /* 
   * Convention: testMethod contains the name of the method to be tested.
   */
  (function () {
      var testMethod = '_getWidgetHtml';

      module(testMethod, {
        setup: addInitializedMarkupToFixture('widget')
      });

      test('returns html in string format', function () {
        var html = $('#widget').weekSchedulerWidget(testMethod);
        notEqual(html, '');
        notEqual(html, undefined);
        notEqual(html, 0);
        equal(typeof(html), 'string');
      });
  })();


  /*
   * Consistency: all tests are wrapped into a function
   */
  (function () {
      module('init', {
          setup: addMarkupToFixture('widget')
      });

      test('shows the widget at start time based on the provided parameter', function () {
          $('#widget').weekSchedulerWidget(); // defaults to shown
          equal($('#widget').css('display'), 'block');
      });

      test('hides the widget at start time based on the provided parameter', function () {
          $('#widget').weekSchedulerWidget({
              hideOnStart : true
          }); // defaults to shown
          equal($('#widget').css('display'), 'none');
      });

      test('no callbacks triggered with initially visible widget', function () {
            var triggeredCount = {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            };

            $("#widget").weekSchedulerWidget({
                hideOnStart: false,
                onBeforeShow : function () { triggeredCount.onBeforeShow++; },
                onBeforeHide: function () { triggeredCount.onBeforeHide++; },
                onAfterShow : function () { triggeredCount.onAfterShow++; },
                onAfterHide: function () { triggeredCount.onAfterHide++; },
            });

            deepEqual(triggeredCount, {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            });
      });

      test('no callbacks triggered with initially invisible widget', function () {
            var triggeredCount = {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            };

            $("#widget").weekSchedulerWidget({
                hideOnStart: true,
                onBeforeShow : function () { triggeredCount.onBeforeShow++; },
                onBeforeHide: function () { triggeredCount.onBeforeHide++; },
                onAfterShow : function () { triggeredCount.onAfterShow++; },
                onAfterHide: function () { triggeredCount.onAfterHide++; },
            });

            deepEqual(triggeredCount, {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            });
      });
  })();


  (function () {
      var testMethod = '_getDaysMarkup';

      module(testMethod, {
        setup: addMarkupToFixture('widget')
      });


      test('returns radio buttons when the corresponding option is specified', function () {
        // initialize the widget
        $("#widget").weekSchedulerWidget({
            singleDaySelect: true
        });

        // check
        equal($("#widget input[type=radio]").length, 7, "found seven radio options");
      });

      test('returns checkboxes when the corresponding option is specified', function () {
        // initialize the widget
        $("#widget").weekSchedulerWidget({
            singleDaySelect: false
        });

        // check
        equal($("#widget input[type=checkbox]").length, 7, "found seven checkbox options");
      });
  })();

  (function () {
      var testMethod = 'setDays';

      module(testMethod, {
        setup: addMarkupToFixture('widget')
      });

      test('throws exception if we try to set multiple days on a singleDaySelect widget', function () {
        $("#widget").weekSchedulerWidget({
            singleDaySelect : true
        });

        throws(function () {
            $("#widget").weekSchedulerWidget('setDays', [2,3,4]);
        }, "Exception was thrown");
      });

  })();

  (function () {
      var testMethod = 'setSingleDaySelect';

      module(testMethod, {
        setup: addMarkupToFixture('widget')
      });

      test('error is thrown if more than one days are selected in the widget before singleDaySelect is called', function () {
        // initialize the widget
        $("#widget").weekSchedulerWidget({
            singleDaySelect: false
        })
        .weekSchedulerWidget('setDays', [1,2,5]);

        throws(function () {
            $("#widget").weekSchedulerWidget('setSingleDaySelect', true);
        }, 'error is thrown because more than two days are selected');

        // all is fine if we set the number of days to nothing
        $("#widget").weekSchedulerWidget('setDays', []);
        ok($("#widget").weekSchedulerWidget('setSingleDaySelect', true), "all is fine if we set the number of days to nothing");
        
       });

      test('returns radio buttons when the singleDaySelect is set to true', function () {
        // initialize the widget
        $("#widget").weekSchedulerWidget({
            singleDaySelect: false
        });

        // check
        equal($("#widget input[type=radio]").length, 0, "found no radios");
        equal($("#widget input[type=checkbox]").length, 7, "found checkboxes");

        // call the method
        $("#widget").weekSchedulerWidget('setSingleDaySelect', true);

        // all should be reversed
        equal($("#widget input[type=radio]").length, 7, "found radios");
        equal($("#widget input[type=checkbox]").length, 0, "found no checkboxes");

        // call the method
        $("#widget").weekSchedulerWidget('setSingleDaySelect', false);

        // check
        equal($("#widget input[type=radio]").length, 0, "found no radios");
        equal($("#widget input[type=checkbox]").length, 7, "found checkboxes");

      });

  })();




  (function () {
      var testMethod = '_getWeekOfDay';

      module(testMethod, {
        setup: addInitializedMarkupToFixture('widget')
      });


      test('returns expected date range', function () {
        var d = new Date(2014, 8, 11); // 11 Sept 2014
        var daysArray = $('#widget').weekSchedulerWidget(testMethod, d);
        equal(daysArray[0].toDateString(), 'Mon Sep 08 2014', 'obtained Mon 8 September');
        equal(daysArray[1].toDateString(), 'Sun Sep 14 2014', 'obtained Sun 14 September');
      });

      test('returns expected date range on exact start date', function () {
        var d = new Date(2014, 8, 8); // 8 Sept 2014
        var daysArray = $('#widget').weekSchedulerWidget(testMethod, d);
        equal(daysArray[0].toDateString(), 'Mon Sep 08 2014', 'obtained Mon 8 September');
        equal(daysArray[1].toDateString(), 'Sun Sep 14 2014', 'obtained Sun 14 September');
      });

      test('returns expected date range on exact end date', function () {
        var d = new Date(2014, 8, 14); // 8 Sept 2014
        var daysArray = $('#widget').weekSchedulerWidget(testMethod, d);
        equal(daysArray[0].toDateString(), 'Mon Sep 08 2014', 'obtained Mon 8 September');
        equal(daysArray[1].toDateString(), 'Sun Sep 14 2014', 'obtained Sun 14 September');
      });

      test('the first and the last day are precise when it comes to hours/minutes/seconds', function () {
        var d = new Date(2014, 8, 14); // 8 Sept 2014
        var daysArray = $('#widget').weekSchedulerWidget(testMethod, d);
        equal(daysArray[0].toDateString(), 'Mon Sep 08 2014', 'obtained Mon 8 September');
        equal(daysArray[1].toDateString(), 'Sun Sep 14 2014', 'obtained Sun 14 September');

        equal(daysArray[0].getSeconds(), 0, 'got 0 seconds for beginning of week');
        equal(daysArray[1].getSeconds(), 59, 'got 59 seconds for end of week');

        equal(daysArray[0].getMinutes(), 0, 'got 0 minutes for beginning of week');
        equal(daysArray[1].getMinutes(), 59, 'got 59 minutes for end of week');

        equal(daysArray[0].getHours(), 0, 'got 0 hour for beginning of week');
        equal(daysArray[1].getHours(), 23, 'got 23 hours for end of week');
            
      });
  })();


  (function () {
      var testMethod = '_getWeeksMarkup';

      module(testMethod, {
        setup: addInitializedMarkupToFixture('widget')
      });

      test('returns html in string format', function () {
        var html = $('#widget').weekSchedulerWidget(testMethod, new Date(), new Date());
        notEqual(html, '');
        notEqual(html, undefined);
        notEqual(html, 0);
        equal(typeof(html), 'string');
      });

      test('returns weeks that include the specified dates', function () {
        var startDate = new Date(2014, 5, 4);
        var endDate = new Date(2014, 5, 25);
        var html = $('#widget').weekSchedulerWidget(testMethod, startDate, endDate);
        ok( html.search('2 June 2014 to 8 June 2014') > 0, 'found week 2/6/2014 - 8/6/2014');
        ok( html.search('9 June 2014 to 15 June 2014') > 0, 'found week 9/6/2014 - 15/6/2014');
        ok( html.search('16 June 2014 to 22 June 2014') > 0, 'found week 16/6/2014 - 22/6/2014');
        ok( html.search('23 June 2014 to 29 June 2014') > 0, 'found week 23/6/2014 - 29/6/2014');
      });
  })();

  
  (function () {
      module('eventTriggering', {
          setup: addInitializedMarkupToFixture('widget')
      });

      test('triggers events', function () {

        var triggeredCount = {
            onConfirm: 0,
            onCancel: 0
        };
        

        $('#widget').bind('onConfirm.weekSchedulerWidget', function () {
            triggeredCount.onConfirm++;
        });
        $('#widget').bind('onCancel.weekSchedulerWidget', function () {
            triggeredCount.onCancel++;
        });

        $("#widget").find('.weekSchedulerWidgetButtonCancel').trigger($.Event('click'));
        $("#widget").find('.weekSchedulerWidgetButtonConfirm').trigger($.Event('click'));

        equal(triggeredCount.onConfirm, 1, 'onConfirm was triggere once');
        equal(triggeredCount.onCancel, 1, 'onCancel was triggered once');
      });
  })();

  (function () {
      var testMethod = '_buildDayMapping';

      module(testMethod, {
        setup: addInitializedMarkupToFixture('widget')
      });

      test('correct day mappings are generated', function () {
          // sat -> sun
          deepEqual(
              $("#widget").weekSchedulerWidget('_buildDayMapping', 1, 0),
              [1, 2, 3, 4, 5, 6, 0]
          );

          // thu -> wed
          deepEqual(
              $("#widget").weekSchedulerWidget('_buildDayMapping', 4, 3),
              [4, 5, 6, 0, 1, 2, 3]
          );

          // invalid indices
          throws(function () {
              $("#widget").weekSchedulerWidget('_buildDayMapping', 2, 5);
          }, 'error is thrown for invalid indices (too narrow)');

          throws(function () {
              $("#widget").weekSchedulerWidget('_buildDayMapping', 501, 500);
          }, 'error is thrown for invalid indices (too big)');

          throws(function () {
              $("#widget").weekSchedulerWidget('_buildDayMapping', -4, -5);
          }, 'error is thrown for invalid indices (negative)');
      });
  })();

  (function () {
      var testMethod = '_getSelectedDates';

      module(testMethod, {
        setup: addInitializedMarkupToFixture('widget')
      });

      test('date objects obtained from the selection look right', function () {
          var fakeSelection = {
              week: [ new Date(2014, 1, 3), new Date(2014, 1, 9) ], // 3 monday Feb 2014, 9 sunday Feb 2014
              days: [
                { day: 1, state: "checked"}, 
                { day: 4, state: "checked"},
                { day: 0, state: "state-is-passed-through"}
              ],
              hour: 21,
              minutes: 25
          };

          var datesSelection = $('#widget').weekSchedulerWidget('_getSelectedDates', fakeSelection);

          equal(datesSelection[2].date.toDateString(), 'Sun Feb 09 2014', 'obtained Sun 9 February 2014');
          equal(datesSelection[2].date.getDay(), 0, 'Got sunday');
          equal(datesSelection[2].date.getDate(), 9, 'Got the 9th');
          equal(datesSelection[2].date.getMonth(), 1, 'Got February');
          equal(datesSelection[2].date.getHours(), 21, '21:xx');
          equal(datesSelection[2].date.getMinutes(), 25, 'xx:25');
          equal(datesSelection[2].state, "state-is-passed-through", 'got checked state');

          equal(datesSelection[0].date.toDateString(), 'Mon Feb 03 2014', 'obtained Mon 3 Feb 2014');
          equal(datesSelection[0].date.getDay(), 1, 'Got monday');
          equal(datesSelection[0].date.getDate(), 3, 'Got the 3rd');
          equal(datesSelection[0].date.getMonth(), 1, 'Got February');
          equal(datesSelection[0].date.getHours(), 21, '21:xx');
          equal(datesSelection[0].date.getMinutes(), 25, 'xx:25');
          equal(datesSelection[0].state, "checked", 'got checked state');

          equal(datesSelection[1].date.toDateString(), 'Thu Feb 06 2014', 'obtained Thu 6 Feb 2014');
          equal(datesSelection[1].date.getDay(), 4, 'Got thursday');
          equal(datesSelection[1].date.getDate(), 6, 'Got the 6th');
          equal(datesSelection[1].date.getMonth(), 1, 'Got February');
          equal(datesSelection[1].date.getHours(), 21, '21:xx');
          equal(datesSelection[1].date.getMinutes(), 25, 'xx:25');
          equal(datesSelection[1].state, "checked", 'got checked state');

      });

  })();

  (function () {
      module('setSelectionWithState', {
          setup: addMarkupToFixture('widget')
      });

      test('State is set according to the input array of date/state', function () {
            $("#widget").weekSchedulerWidget({
                startDate : new Date(2014, 10, 10),
                endDate : new Date(2014, 10, 11),
            });

            var monday = new Date(2014, 10, 10); 
            var tuesday = new Date(2014, 10, 11);
            var sunday = new Date(2014, 10, 16);

            equal(monday.getDay(), 1, 'monday is monday');
            equal(tuesday.getDay(), 2, 'tuesday is tuesday');
            equal(sunday.getDay(), 0, 'sunday is sunday');

            $("#widget").weekSchedulerWidget('setDatesWithState', [
                { date: monday, state: 'checked' },
                { date: tuesday, state: 'indeterminate' },
                { date: sunday, state: 'checked' }
            ]);

            equal($("#widget #weekSchedulerWidgetDayMon").prop('checked'), true, "monday is checked");
            equal($("#widget #weekSchedulerWidgetDayMon").prop('indeterminate'), false, "monday is checked");

            equal($("#widget #weekSchedulerWidgetDayTue").prop('indeterminate'), true, "tuesday is indeterminate");
            equal($("#widget #weekSchedulerWidgetDayTue").prop('checked'), false, "tuesday is not checked");

            equal($("#widget #weekSchedulerWidgetDaySun").prop('checked'), true, "sunday is checked");
            equal($("#widget #weekSchedulerWidgetDaySun").prop('indeterminate'), false, "sunday is not indeterminate");

            deepEqual( $("#widget").weekSchedulerWidget('getSelection'), {
                "days": [
                    { "day": 1, "state": "checked" },
                    { "day": 2, "state": "indeterminate" },
                    { "day": 0, "state": "checked" }
                ],
                "hour": "1",
                "minutes": "0",
                "week": [
                    new Date(2014, 10, 10, 0, 0, 0),
                    new Date(2014, 10, 16, 23, 59, 59)
                ]
            } , "gets the right selection");

      });
  })();

  (function () {
      module('hide', {
          setup: addInitializedMarkupToFixture('widget')
      });

      test('callbacks are triggered', function () {
            var triggeredCount = {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            };

            $("#widget").weekSchedulerWidget({
                hideOnStart: false,
                onBeforeShow : function () { triggeredCount.onBeforeShow++; return true;},
                onBeforeHide: function () { triggeredCount.onBeforeHide++; return true;},
                onAfterShow : function () { triggeredCount.onAfterShow++;},
                onAfterHide: function () { triggeredCount.onAfterHide++;},
            });

            $('#widget').weekSchedulerWidget('hide');
            $('#widget').weekSchedulerWidget('show');

            deepEqual(triggeredCount, {
                onBeforeShow : 1,
                onBeforeHide : 1,
                onAfterShow : 1,
                onAfterHide : 1
            });
      });

      test('if the widget is already shown no callbacks are triggered', function () {
            var triggeredCount = {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            };

            $("#widget").weekSchedulerWidget({
                hideOnStart: false,
                onBeforeShow : function () { triggeredCount.onBeforeShow++; return true;},
                onBeforeHide: function () { triggeredCount.onBeforeHide++; return true;},
                onAfterShow : function () { triggeredCount.onAfterShow++;},
                onAfterHide: function () { triggeredCount.onAfterHide++;},
            });

            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');

            deepEqual(triggeredCount, {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            }, 'no callbacks are triggered on multiple show');


            $('#widget').weekSchedulerWidget('hide');
            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');
            $('#widget').weekSchedulerWidget('show');

            deepEqual(triggeredCount, {
                onBeforeShow : 1,
                onBeforeHide : 1,
                onAfterShow : 1,
                onAfterHide : 1
            }, 'callbacks are triggered only once');
 
      });

      test('if the widget is already hidden, no callbacks are triggered', function () {
            var triggeredCount = {
                onBeforeShow : 0,
                onBeforeHide : 0,
                onAfterShow : 0,
                onAfterHide : 0
            };

            $("#widget").weekSchedulerWidget({
                hideOnStart: false,
                onBeforeShow : function () { triggeredCount.onBeforeShow++; return true;},
                onBeforeHide: function () { triggeredCount.onBeforeHide++; return true;},
                onAfterShow : function () { triggeredCount.onAfterShow++;},
                onAfterHide: function () { triggeredCount.onAfterHide++;},
            });

            $('#widget').weekSchedulerWidget('hide');
            $('#widget').weekSchedulerWidget('hide');
            $('#widget').weekSchedulerWidget('hide');
            $('#widget').weekSchedulerWidget('hide');

            deepEqual(triggeredCount, {
                onBeforeShow : 0,
                onBeforeHide : 1,
                onAfterShow : 0,
                onAfterHide : 1
            });
 
      });

  })();

}(jQuery));
