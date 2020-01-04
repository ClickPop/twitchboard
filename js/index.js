console.clear();

var userAgent = navigator.userAgent,
    ipAddy;

$('#agent').html(userAgent);

$.getJSON('https://api.ipify.org?format=jsonp&callback=?', function(json) {
    ipAddy = json.ip;
    $('#ip').html(ipAddy);
});
