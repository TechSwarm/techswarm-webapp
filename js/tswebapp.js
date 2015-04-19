//CONFIG
var serverAddress = ""; // if empty current server will be used
//CONFIG

var elements;
elements = {
    temp: {
        type: 'chart',
        chartType: 'spline',
        title: "Temperature",
        valueSuffix: '°C',
        container: 'telemetry-temp',
        handle: {}
    },
    humi: {
        type: 'chart',
        chartType: 'spline',
        title: "Humidity",
        valueSuffix: '%',
        container: 'telemetry-humi',
        handle: {}
    },
    pres: {
        type: 'chart',
        chartType: 'spline',
        title: "Pressure",
        valueSuffix: 'hPa',
        container: 'telemetry-pres',
        handle: {}
    },
    accel: {
        type: 'chart',
        chartType: 'spline',
        title: "Acceleration",
        valueSuffix: 'g',
        container: 'telemetry-accel',
        handle: {}
    },
    magn: {
        type: 'chart',
        chartType: 'spline',
        title: "Magnetic field",
        valueSuffix: 'gauss',
        container: 'telemetry-magn',
        handle: {}
    },
    gyro: {
        type: 'chart',
        chartType: 'spline',
        title: "Orientation",
        valueSuffix: '°',
        container: 'telemetry-gyro',
        handle: {}
    },
    gps: {
        type: 'map',
        title: "Position",
        container: 'telemetry-gps',
        handle: {}
    }
};

function initialiseElement(name, data) {
    "use strict";
    if (elements[name].type === 'map') {
        elements[name].Handler = new GMaps({
            div: '#' + elements[name].container,
            lat: 50.06222, //TODO: set this to current ground station position
            lng: 19.928808  //
        });
    }
    else if (elements[name].type === 'chart') {
        elements[name].handle = new Highcharts.Chart({
            chart: {
                renderTo: elements[name].container,
                type: elements[name].chartType
            },
            title: {
                text: elements[name].title
            },
            credits: {
                enabled: false
            },
            yAxis: {
                labels: {
                    format: '{value}' + elements[name].valueSuffix
                }
            },
            tooltip: {
                valueSuffix: elements[name].valueSuffix
            },
            series: data
        });
    }
}

function setMissionPhase(phase) { // phase: 1 - Launch preparation, 2 - Launch, 3 - Descend, 4 - Ground operations, 5 - Mission complete
    "use strict";
    var i = 1;
    $('#mission-phase').find('> div').each(function () {
        if (i < phase) {
            $(this).removeClass("disabled active");
        }
        else if (i === phase) {
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
        setCansatStatus(0);
    } else if (status === 1) {
        $('#status-server').html("Connected").css("color", "green").parent().next().find('.loader').removeClass("active");
    } else if (status === -1) {
        $('#status-server').html("Connection failed!").css("color", "red").parent().next().find('.loader').removeClass("active");
        setCansatStatus(0);
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

$(document).ready(function () {
    "use strict";
    $('#sidebar').sidebar({
        transition: 'overlay',
        mobileTransition: 'overlay',
        dimPage: false
    })
        .sidebar('attach events', '.view-sidebar', 'toggle');

    $('.sidebar.menu .item')
        .tab()
    ;

    if (serverAddress === "") {
        serverAddress = window.location.host;
    }

});