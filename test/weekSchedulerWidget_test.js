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
              days: [1, 4, 0],
              hour: 21,
              minutes: 25
          };

          var datesSelection = $('#widget').weekSchedulerWidget('_getSelectedDates', fakeSelection);

          equal(datesSelection[2].toDateString(), 'Sun Feb 09 2014', 'obtained Sun 9 February 2014');
          equal(datesSelection[2].getDay(), 0, 'Got sunday');
          equal(datesSelection[2].getDate(), 9, 'Got the 9th');
          equal(datesSelection[2].getMonth(), 1, 'Got February');
          equal(datesSelection[2].getHours(), 21, '21:xx');
          equal(datesSelection[2].getMinutes(), 25, 'xx:25');

          equal(datesSelection[0].toDateString(), 'Mon Feb 03 2014', 'obtained Mon 3 Feb 2014');
          equal(datesSelection[0].getDay(), 1, 'Got monday');
          equal(datesSelection[0].getDate(), 3, 'Got the 3rd');
          equal(datesSelection[0].getMonth(), 1, 'Got February');
          equal(datesSelection[0].getHours(), 21, '21:xx');
          equal(datesSelection[0].getMinutes(), 25, 'xx:25');

          equal(datesSelection[1].toDateString(), 'Thu Feb 06 2014', 'obtained Thu 6 Feb 2014');
          equal(datesSelection[1].getDay(), 4, 'Got thursday');
          equal(datesSelection[1].getDate(), 6, 'Got the 6th');
          equal(datesSelection[1].getMonth(), 1, 'Got February');
          equal(datesSelection[1].getHours(), 21, '21:xx');
          equal(datesSelection[1].getMinutes(), 25, 'xx:25');

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



//   //////////////////////////////////////////////////////////////////////////////
//   module('_buildStringReferenceMapping', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
// 
//   test('reference mapping run contains ids', function () {
//     $('#qunit-fixture').append(commonFixtures.idsOnly);
// 
//     // causes reference mapping to be run
//     var refMappingObj = $('#dropdown').localizationTool({
//         strings : {
//             'id:mainHeading' : {},
//             'id:secondaryHeading' : {},
//             'id:paragraph': {}
//         }
//     }).data('refMappingObj');
// 
//     // let's see if it contains the 3 ids
//     equal(refMappingObj.hasOwnProperty('id:mainHeading'), true, 'id:mainHeading found');
//     equal(refMappingObj.hasOwnProperty('id:secondaryHeading'), true, 'id:secondaryHeading found');
//     equal(refMappingObj.hasOwnProperty('id:paragraph'), true, 'id:paragraph found');
//   });
// 
//   test('entry of reference mapping is correct', function() {
//     $('#qunit-fixture').append(commonFixtures.idsOnly);
// 
//     // causes reference mapping to be run
//     var refMappingObj = $('#dropdown').localizationTool({
//         strings : {
//             'id:mainHeading' : {},
//         }
//     }).data('refMappingObj');
// 
//     // let's see if it contains the 3 ids
//     deepEqual(refMappingObj['id:mainHeading'], {
//         originalText : 'Hello World!',
//         isAttribute: false,
//         domNodes: [ $('#mainHeading') ]
//     }, 'got expected structure');
//   });
// 
// 
// 
//   //////////////////////////////////////////////////////////////////////////////
//   module('init', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
// 
//   test('no exception thrown when translating multiple class', function () {
//     $('#qunit-fixture').append([
//         '<div class="title">hello</div>',
//         '<div class="foo">world</div>'
//     ].join(''));
// 
//     // causes reference mapping to be run
//     var thrown = 0;
//     try {
//         $('#dropdown').localizationTool({
//             strings : {
//                 'class:title' : {
//                     'it_IT': 'ciao',
//                     'en_GB': 'hello',
//                 },
//                 'class:foo' : {
//                     'it_IT': 'mondo',
//                     'en_GB': 'world'
//                 }
//             }
//         });
//     }
//     catch (e) {
//         thrown = 1;
//     }
// 
//     equal(thrown, 0, 'no exceptions thrown');
// 
//   });
// 
//   test('flag is disabled', function () {
//     // causes reference mapping to be run
//     $('#dropdown').localizationTool({
//         'showFlag' : false
//     });
// 
//     equal(
//         $('#qunit-fixture').find('.ltool-language-flag').length,
//         0, 
//         'flag is not displayed'
//     );
//   });
// 
//   test('language is disabled', function () {
//     // causes reference mapping to be run
//     $('#dropdown').localizationTool({
//         'showLanguage' : false
//     });
// 
//     equal(
//         $('#qunit-fixture').find('.ltool-language-name').length,
//         0, 
//         'language is not displayed'
//     );
//   });
// 
//   test('country is disabled', function () {
//     // causes reference mapping to be run
//     $('#dropdown').localizationTool({
//         'showCountry' : false
//     });
// 
//     equal(
//         $('#qunit-fixture').find('.ltool-language-country').length,
//         0, 
//         'country is not displayed'
//     );
//   });
// 
//   test('default language appears once', function () {
// 
//     $('#qunit-fixture').append([
//         '<div id="title">hello</div>',
//         '<div id="subtitle">world</div>'
//     ].join(''));
// 
//     // causes reference mapping to be run
//     $('#dropdown').localizationTool({
//         'defaultLanguage' : 'it_IT',
//         'strings' : {
//             'id:title' : {
//                 'en_GB': 'hello',
//                 'it_IT': 'ciao'
//             },
//             'id:subtitle': {
//                 'en_GB': 'world',
//                 'it_IT': 'mondo'
//             }
//         }
//     });
// 
//     equal(
//         $('#qunit-fixture').find('.it_IT').length,
//         1, 
//         'Italian appears only once'
//     );
//   });
// 
// 
// 
//   //////////////////////////////////////////////////////////////////////////////
//   module('translate', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
// 
//   test('language selected callback is called after selection', function () {
// 
//     $('#qunit-fixture').append([
//         '<div id="title">hello</div>',
//         '<div id="subtitle">world</div>'
//     ].join(''));
// 
//     var gotCalledWith;
// 
//     $('#dropdown').localizationTool({
//         'onLanguageSelected' : function (countryCode) {
//             gotCalledWith = countryCode;
//             return false;
//         },
//         'strings' : {
//             'id:title' : {
//                 'en_GB': 'hello',
//                 'it_IT': 'ciao'
//             },
//             'id:subtitle': {
//                 'en_GB': 'world',
//                 'it_IT': 'mondo'
//             }
//         }
//     });
// 
//     $('#dropdown').localizationTool('_onLanguageSelected', $('<li class="en_GB"></li>'));
// 
//     equal(gotCalledWith, 'en_GB', 'got called');
//     
//   });
// 
//   test('ids are translated as expected', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h1 id="translateThis">This is something</h1>',
//         '<p id="translateThisToo">This is something bad!</p>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'id:translateThis' : {
//                 it_IT : 'Ciò &egrave; qualcosa',
//             },
//             'id:translateThisToo' : {
//                 it_IT : "Ci&ograve; è qualcos'altro"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     equal($('#translateThis').html(), 'Ciò è qualcosa', 'translated as expected');
//     equal($('#translateThisToo').html(), "Ciò è qualcos'altro");
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     equal($('#translateThis').html(), 'This is something', 'translated back as expected');
//     equal($('#translateThisToo').html(), 'This is something bad!');
// 
//   });
// 
//   test('attributes are translated', function () {
// 
//     $('#qunit-fixture').append([
//         '<h1 class="localized">This is something</h1>',
//         '<input type="text" class="localized" placeholder="insert your email here"></input>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'class::class:localized' : { // translate the class attribute
//                 it_IT: "localizzato"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check
//     equal($('h1').hasClass('localized'), false, 'no "localized" exists on h1');
//     equal($('input[type=text]').hasClass('localized'), false, 'no "localized" exists on input');
// 
//     equal($('h1').hasClass('localizzato'), true, '"localizzato" found on h1');
//     equal($('input[type=text]').hasClass('localizzato'), true, '"localizzato" found on input');
// 
//   });
// 
//   test('specific attributes are translated', function () {
// 
//     $('#qunit-fixture').append([
//         '<h1 class="localized">This is something</h1>',
//         '<input type="text" class="localized" placeholder="insert your email here"></input>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'placeholder::class:localized' : {
//                 it_IT: "localizzato"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check
//     equal($('input[type=text]').attr('placeholder'), 'localizzato', 'placeholder attribute was translated');
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     equal($('input[type=text]').attr('placeholder'), 'insert your email here', 'placeholder attribute was translated back');
// 
//   });
// 
//   test('classes are translated as expected', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h1 class="localized">This is something</h1>',
//         '<p class="localized">This is something</p>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'class:localized' : {
//                 it_IT : "Questo è qualcosa"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     $('.localized').each(function (i, e) {
//         equal($(e).html(), 'Questo è qualcosa', 'translated as expected ' + i);
//     });
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     $('.localized').each(function (i, e) {
//         equal($(e).html(), 'This is something', 'translated back as expected ' + i);
//     });
//   });
// 
//   test('ids have precedence over class translation', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h1 id="priority" class="localized">This is something</h1>',
//         '<p class="localized">This is something</p>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'id:priority': {
//                 it_IT : "Priority!"
//             },
//             'class:localized' : {
//                 it_IT : "Questo è qualcosa"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     equal($('#priority').html(), 'Priority!', 'id translated according to id rule');
//     equal($('p.localized').html(), 'Questo è qualcosa', 'the remaining class is translated as expected');
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     $('.localized').each(function (i, e) {
//         equal($(e).html(), 'This is something', 'translated back as expected ' + i);
//     });
//   });
// 
//   test('throws error when attempting to translate classes elements containing different text', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something else</p>'
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'class:localized' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
//   test('throws error when attempting to translate classes elements containing elements other than text', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p class="localized">This <b>is</b> something</p>',
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'class:localized' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
//   test('throws error when attempting to translate multiple classes elements and one of them contains multiple sub-elements', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p class="localized">This <b>is</b> something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something</p>'
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'class:localized' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
//   test('elements are translated as expected', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h5>This is something</h5>',
//         '<h5>This is something</h5>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'element:h5' : {
//                 it_IT : "Questo è qualcosa"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     $('h5').each(function (i, e) {
//         equal($(e).html(), 'Questo è qualcosa', 'translated as expected ' + i);
//     });
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     $('h5').each(function (i, e) {
//         equal($(e).html(), 'This is something', 'translated back as expected ' + i);
//     });
//   });
// 
//   test('classes have precedence over element translation', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h5 class="priority">This is something</h5>',
//         '<h5>This is something</h5>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'class:priority': {
//                 it_IT : "Priority!"
//             },
//             'element:h5' : {
//                 it_IT : "Questo è qualcosa"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     equal($('h5.priority').html(), 'Priority!', 'id translated according to id rule');
//     equal($('h5:not(.priority)').html(), 'Questo è qualcosa', 'the remaining element is translated as expected');
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     $('h5').each(function (i, e) {
//         equal($(e).html(), 'This is something', 'translated back as expected ' + i);
//     });
//   });
// 
//   test('ids have precedence over element translation', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<h5 id="priority">This is something</h5>',
//         '<h5>This is something</h5>'
//     ].join(''));
// 
//     // initialize
//     $('#dropdown').localizationTool({
//         strings : {
//             'id:priority': {
//                 it_IT : "Priority!"
//             },
//             'element:h5' : {
//                 it_IT : "Questo è qualcosa"
//             }
//         }
//     });
// 
//     // trigger translation
//     $('#dropdown').localizationTool('translate', 'it_IT');
// 
//     // check all is translated as expected
//     equal($('h5#priority').html(), 'Priority!', 'id translated according to id rule');
//     equal($('h5:not(#priority)').html(), 'Questo è qualcosa', 'the remaining class is translated as expected');
// 
//     // reset back to english
//     $('#dropdown').localizationTool('translate');
// 
//     // check all is translated back as expected
//     $('h5').each(function (i, e) {
//         equal($(e).html(), 'This is something', 'translated back as expected ' + i);
//     });
//   });
// 
//   test('throws error when attempting to translate elements containing different text', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p class="localized">This is something</p>',
//         '<p class="localized">This is something else</p>'
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'class:localized' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
//   test('throws error when attempting to translate elements containing elements other than text', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p>This <b>is</b> something</p>',
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'element:p' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
//   test('throws error when attempting to translate multiple classes elements and one of them contains multiple sub-elements', function () {
//     // fixture
//     $('#qunit-fixture').append([
//         '<p">This <b>is</b> something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>',
//         '<p">This is something</p>'
//     ].join(''));
// 
//     // initialize
//     throws(
//         function () {
//             $('#dropdown').localizationTool({
//                 strings : {
//                     'element:p' : {
//                         it_IT : "Questo è qualcosa"
//                     }
//                 }
//             });
//         }, 'Throws exception'
//     );
// 
//   });
// 
// 
//   
//   //////////////////////////////////////////////////////////////////////////////
//   module('_findSubsetOfUsedLanguages', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
// 
//   test('one language in common', function () {
//     var commonLanguages = $('#dropdown')
//         .localizationTool({})
//         .localizationTool('_findSubsetOfUsedLanguages',
//             {
//                 'string1' : {
//                    'it_IT' : 'translation1',
//                    'es_ES' : 'translation2',
//                    'fr_FR' : 'translation3',
//                 },
//                 'string2' : {
//                    'de_DE' : 'translation4',
//                    'es_ES' : 'translation5',
//                    'br_PT' : 'translation6'
//                 },
//                 'string3' : {
//                    'en_US' : 'translation7',
//                    'es_ES' : 'translation8',
//                    'en_AU' : 'translation9'
//                 }
//             }
//         );
// 
//     deepEqual(commonLanguages, ['es_ES', 'en_GB']);
//   });
// 
//   test('no language in common', function () {
//     var commonLanguages = $('#dropdown')
//         .localizationTool({})
//         .localizationTool('_findSubsetOfUsedLanguages',
//             {
//                 'string1' : {
//                    'it_IT' : 'translation1',
//                    'jp_JP' : 'translation2',
//                    'fr_FR' : 'translation3',
//                 },
//                 'string2' : {
//                    'de_DE' : 'translation4',
//                    'es_ES' : 'translation5',
//                    'br_PT' : 'translation6'
//                 },
//                 'string3' : {
//                    'en_US' : 'translation7',
//                    'es_ES' : 'translation8',
//                    'en_AU' : 'translation9'
//                 }
//             }
//         );
// 
//     deepEqual(commonLanguages, ['en_GB']);
//   });
// 
//   test('all languages in common', function () {
//     var commonLanguages = $('#dropdown')
//         .localizationTool({})
//         .localizationTool('_findSubsetOfUsedLanguages',
//             {
//                 'string1' : {
//                    'it_IT' : 'translation1',
//                    'jp_JP' : 'translation2',
//                    'fr_FR' : 'translation3',
//                 },
//                 'string2' : {
//                    'it_IT' : 'translation1',
//                    'jp_JP' : 'translation2',
//                    'fr_FR' : 'translation3',
//                 },
//                 'string3' : {
//                    'it_IT' : 'translation1',
//                    'jp_JP' : 'translation2',
//                    'fr_FR' : 'translation3',
//                 }
//             }
//         );
// 
//     deepEqual(commonLanguages, [ "fr_FR", "it_IT", "jp_JP", "en_GB" ]);
// 
//   });
// 
//   test('no strings defined', function () {
//     var commonLanguages = $('#dropdown')
//         .localizationTool({})
//         .localizationTool('_findSubsetOfUsedLanguages', {});
// 
//     deepEqual(commonLanguages, ['en_GB']);
//   });
// 
// 
// 
// 
//   //////////////////////////////////////////////////////////////////////////////
//   module('_languageCodeToOrdinal', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
//   test('converts language codes to ordinal numbers', function () {
//     var $dropdown = $('#dropdown').localizationTool({
//         strings: {
//             'string1' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             },
//             'string2' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             },
//             'string3' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             }
//         }
//     });
// 
//     equal($dropdown.localizationTool('_languageCodeToOrdinal', 'it_IT'),
//         1, 'got expected ordinal number for it_IT'
//     );
//     equal($dropdown.localizationTool('_languageCodeToOrdinal', 'jp_JP'),
//         2, 'got expected ordinal number for jp_JP'
//     );
//     equal($dropdown.localizationTool('_languageCodeToOrdinal', 'fr_FR'),
//         0, 'got expected ordinal number for fr_FR'
//     );
//     equal($dropdown.localizationTool('_languageCodeToOrdinal', 'en_GB'),
//         3, 'default language'
//     );
// 
//     throws(function () {
//         $dropdown.localizationTool('_languageCodeToOrdinal', 'fooFie!');
//     });
//   });
// 
// 
// 
// 
//   //////////////////////////////////////////////////////////////////////////////
//   module('_ordinalToLanguageCode', { setup: function () {
//     addDropdownWidgetFunc();
//   }});
//   test('converts language codes to ordinal numbers', function () {
//     var $dropdown = $('#dropdown').localizationTool({
//         strings: {
//             'string1' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             },
//             'string2' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             },
//             'string3' : {
//                'it_IT' : 'translation1',
//                'jp_JP' : 'translation2',
//                'fr_FR' : 'translation3',
//             }
//         }
//     });
// 
//     equal($dropdown.localizationTool('_ordinalToLanguageCode', 1),
//         'it_IT', 'got expected language code number for ordinal 1'
//     );
//     equal($dropdown.localizationTool('_ordinalToLanguageCode', 2),
//         'jp_JP', 'got expected language code number for ordinal 2'
//     );
//     equal($dropdown.localizationTool('_ordinalToLanguageCode', 0),
//         'fr_FR', 'got expected language code number for ordinal 0'
//     );
//     equal($dropdown.localizationTool('_ordinalToLanguageCode', 3),
//         'en_GB', 'got expected language code number for ordinal 3'
//     );
// 
//     // NOTE: string input
//     equal($dropdown.localizationTool('_ordinalToLanguageCode', "2"),
//         'jp_JP', 'got expected language code number for ordinal 2'
//     );
// 
//     throws(function () {
//         $dropdown.localizationTool('_ordinalToLanguageCode', 4);
//     }, 'out of right bound of array');
// 
//     throws(function () {
//         $dropdown.localizationTool('_ordinalToLanguageCode', -1);
//     }, 'out of left bound of array');
//   });

}(jQuery));
