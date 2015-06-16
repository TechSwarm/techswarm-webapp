function getLocation() {
    "use strict";
    navigator.geolocation.getCurrentPosition(function (newPosition) {
        $('#admin-location-lat').val(newPosition.coords.latitude);
        $('#admin-location-lon').val(newPosition.coords.longitude);
    });
}

function AJAXpost(url, data) {
    "use strict";
    var req = new XMLHttpRequest();
    req.onreadystatechange=function() {
        if (req.readyState==4 && req.status==201) {
            alert("Success!");
        } else if (req.readyState==4 && req.status==401) {
            alert("Wrong username/password!");
        } else if (req.readyState==4 && req.status==400) {
            alert("Wrong data!");
        } else if (req.readyState==4) {
            alert("ERROR!");
        }
    };
    req.open('POST', url, true);
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.setRequestHeader("Authorization", "Basic " + btoa($('#admin-auth-user').val() + ":" + $('#admin-auth-pass').val()));
    req.send(data);
}

function sendLocation() {
    "use strict";
    var postdata = 'timestamp=' + getTimeStampFromDate(new Date()) + '000&latitude=' + $('#admin-location-lat').val() + '&longitude=' + $('#admin-location-lon').val();
    AJAXpost(serverAddress + config.serverURLs.groundStation, postdata);
}

function sendStatus() {
    "use strict";
    var newTime = ($('#admin-time-update-no').is(':checked')) ? time : $('#admin-time-new').val();
    var postdata = 'timestamp=' + getTimeStampFromDate(new Date()) + '000&phase=' + $('#admin-states-current').val() + '&connected=' + $('#admin-status-cansat').is(':checked') + '&mission_time=' + newTime;
    AJAXpost(serverAddress + config.serverURLs.status, postdata);
}

function initialiseAdmin () {
    "use strict";
    $('#sidebar').append('<a class="item" data-tab="admin">Settings</a>');

    $('#admin-getLocation').on('click', getLocation);
    $('#admin-location-send').on('click', sendLocation);
    $('#admin-status-send').on('click', sendStatus);
    $('#admin-states').on('click', function (event) {
        console.log(event);
        $('#admin-states').children().each(function () {
           $(this).removeClass('active');
        });

        $('#admin-states-current').val($('#' + event.target.id).addClass('active').data('key'));
    });
}
