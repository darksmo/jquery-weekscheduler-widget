/**
 * @fileOverview Contains the code for jQuery.localizationTool
 * 
 * @author Savio Dimatteo <darksmo@gmail.com>
 */

(function($) {

    var methods = {
        /**
         * Returns the ordinal number corresponding to the given language code,
         * or throws in case the given language code is not defined.
         * NOTE: this method operates on the active languages, therefore
         * $this.data('activeLanguageCodeArray') must be available when the
         * method is called.
         *
         * @name _languageCodeToOrdinal
         * @function
         * @access private
         * @param {string} lanuageCode - the language code to convert to ordinal
         * @returns {number} ordinal - the converted ordinal
         */
        'publicMethod' : function () {

        },
        /**
         * Returns the language code corresponding to the given ordinal number.
         * It throws in case the given ordinal number does not correspond to any
         * language code.
         * NOTE: this method operates on the active languages, therefore
         * $this.data('activeLanguageCodeArray') must be available when the
         * method is called.
         *
         * @name _ordinalToLanguageCode
         * @function
         * @access private
         * @param {number} ordinal - the ordinal number to convert into a language code
         * @returns {string} languageCode - the converted language code
         */
        '_privateMethod' : function () {

        },
        /**
         * Initialises the week scheduler widget.
         * @name init
         * @function
         * @param {object} [options] - the user options
         * @access public
         * @returns jqueryObject
         */
        'init' : function(options) {

            var settings = $.extend({

            }, options);

            return this.each(function() {
                // save settings
                var $this = $(this);

                $this.data('settings', settings);

                // save instance specific data...
            });
        }
    };

    var __name__ = 'weekSchedulerWidget';

    /**
     * jQuery Week Scheduler Widget - a jQuery widget to schedule an item on a chosen week
     *
     * @memberOf jQuery.fn
     */
    $.fn[__name__] = function(method) {
        /*
         * Just a router for method calls
         */
        if (methods[method]) {
            if (this.data('initialized') === true) {
                // call a method
                return methods[method].apply(this,
                    Array.prototype.slice.call(arguments, 1)
                );
            }
            else {
                throw new Error('method ' + method + ' called on an uninitialized instance of ' + __name__);
            }
        }
        else if (typeof method === 'object' || !method) {
            // call init, user passed the settings as parameters
            this.data('initialized', true);
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Cannot call method ' + method);
        }
    };
})(jQuery);
