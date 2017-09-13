/**
 * Created by hansel.tritama on 9/10/17.
 */
$("#CountDownTimer").TimeCircles({ time: { Days: { show: false }, Hours: { show: false }, Minutes: { show: false }, Seconds: { show: true } }});

var updateTime = function(){
    var date = $("#date").val();
    var time = $("#time").val();
    var datetime = date + ' ' + time + ':00';
    $("#DateCountdown").data('date', datetime).TimeCircles().start();
};

// Start and stop are methods applied on the public TimeCircles instance
$(".startTimer").click(function() {
    $("#CountDownTimer").TimeCircles().start();
});
$(".stopTimer").click(function() {
    $("#CountDownTimer").TimeCircles().stop();
});