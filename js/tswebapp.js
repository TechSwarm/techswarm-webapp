$(document).ready(function() {
    "use strict";
    $('#sidebar').sidebar({
        transition       : 'overlay',
        mobileTransition : 'overlay'
    })
        .sidebar('attach events', '.view-sidebar', 'toggle');
});

function setMissionPhase(phase) { // phase: 1 - Launch preparation, 2 - Launch, 3 - Descend, 4 - Ground operations, 5 - Mission complete
    "use strict";
    var i = 1;
    $('#mission-phase').find('> div').each(function() {
        if(i < phase) {
            $(this).removeClass("disabled active");
        }
        else if(i === phase) {
            $(this).addClass("active").removeClass("disabled");
        }
        else {
            $(this).removeClass("active").addClass("disabled");
        }
        i++;
    });
}

function setServerStatus(status) { // status: 0 - Connecting, -1 - Connection failed, 1 - Connected
    "use strict";
    if (status === 0) {
        $('#status-server').html("Connecting").css("color", "black").parent().next().find('.loader').addClass("active");
        $('#status-cansat').html(" – ").css("color", "black");
    } else if (status === 1) {
        $('#status-server').html("Connected").css("color", "green").parent().next().find('.loader').removeClass("active");
    } else if (status === -1) {
        $('#status-server').html("Connection failed!").css("color", "red").parent().next().find('.loader').removeClass("active");
        $('#status-cansat').html(" – ").css("color", "black");
    }
}

function setCansatStatus(status) { // status: 0 - Unknown , -1 - Offline, 1 - Online
    "use strict";
    if (status === 0) {
        $('#status-cansat').html(" – ").css("color", "black");
    } else if (status === 1) {
        $('#status-cansat').html("Online").css("color", "green");
    } else if (status === -1) {
        $('#status-cansat').html("Offline").css("color", "black");
    }
}