$(document).ready(function() {
    "use strict";
    $('#sidebar').sidebar({
        transition       : 'overlay',
        mobileTransition : 'overlay'
    })
        .sidebar('attach events', '.view-sidebar', 'toggle')
    ;
});

function setMissionPhase(phase) { // phase: 1 - Launch preparation, 2 - Launch, 3 - Descend, 4 - Ground operations, 5 - Mission complete
    "use strict";
    var i = 1;
    $('#mission-phase > div').each(function() {
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

function setSystemStatus(status) { // status: 0 - Connecting, -1 - Connection failed, 1 - Connected
    "use strict";
    if (status === 0) {
        $('#system-status').html("Connecting").css("color", "black").next().addClass("active");
    } else if (status === 1) {
        $('#system-status').html("Connected").css("color", "green").next().removeClass("active");
    } else if (status === -1) {
        $('#system-status').html("Connection failed!").css("color", "red").next().removeClass("active");;
    }
}