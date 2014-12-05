(function ($) {
    $('.tabs .button').click(function (e) {
        var $this = $(this);
        $('.tabs .button').addClass('disabled');
        $this.removeClass('disabled');

        // display the correct tab
        $('.tab').addClass('hidden');
        var targetTab = $this.attr('href');
        $(targetTab).removeClass('hidden');

        e.preventDefault();
        return false;
    });

    $("#btnDemo").click(function () {
        $("#widget").weekSchedulerWidget('show');
    });

    $("#widget").weekSchedulerWidget({
        startDate: new Date(),
        endDate: new Date(2028, 12, 5),
        hideOnStart: true
    }).on("onConfirm.weekSchedulerWidget", function () {
        $(this).weekSchedulerWidget('hide');
        //
        var selectedDates = $(this).weekSchedulerWidget('getSelectedDates'); 
        var i;
        var html = ['<h3>Item Schedule</h3><ul>'];
        for (i=0; i < selectedDates.length; i++) {
            var date = selectedDates[i].date;
            html.push('<li>' + date.toString() + '</li>');
        }
        html.push('</ul>');
        $("#widgetDates").html(html);
    }).on("onCancel.weekSchedulerWidget", function () {
        $(this).weekSchedulerWidget('hide');
    });

})(jQuery);
