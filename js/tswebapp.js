//CONFIG
var serverAddress = ""; // if empty current server will be used
//CONFIG

var elements;
elements = {
    temp: {
        title: "Temperature",
        valueSuffix: '°C',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-temp',
                handle: {}
            }
        ]
    },
    humi: {
        title: "Humidity",
        valueSuffix: '%',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-humi',
                handle: {}
            }
        ]
    },
    pres: {
        title: "Pressure",
        valueSuffix: 'hPa',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-pres',
                handle: {}
            }
        ]
    },
    accel: {
        title: "Acceleration",
        valueSuffix: 'g',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-accel',
                handle: {}
            }
        ]
    },
    magn: {
        title: "Magnetic field",
        valueSuffix: 'gauss',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-magn',
                handle: {}
            }
        ]
    },
    gyro: {
        title: "Orientation",
        valueSuffix: '°',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-gyro',
                handle: {}
            }
        ]
    },
    gps: {
        title: "Position",
        containers: [
            {
                type: 'map',
                id: 'telemetry-gps',
                handle: {}
            }
        ]
    },
    time: {
        title: "Mission time",
        containers: [
            {
                type: 'value',
                id: 'dashboard-1-1'
            }
        ]
    }
};

function updateElement(elementName, data) {
    "use strict";
    $.each(elements[elementName].containers, function (key, container) {
        if (container.type === 'map') {
            //TODO: Add map updating with polyline drawing
        }
        else if (container.type === 'chart') {
            //TODO: Add chart updating
        }

        else if (container.type === 'value') {
            $('#' + container.id).html('<div class="ui statistic"><div class="label">' + elements[elementName].title + '</div><div class="value">' + data + '</div>');
        }

    });
}

function initialiseElement(elementName, data) {
    "use strict";
    $.each(elements[elementName].containers, function (key, container) {
        if (container.type === 'map') {
            container.handle = new GMaps({
                div: '#' + container.id,
                disableDefaultUI: true,
                lat: 50.062203, //TODO: set this to current ground station position
                lng: 19.928722  //
            });
            container.handle.addMarker({
                lat: 50.062203,
                lng: 19.928722,
                title: 'Ground Station'
            });
        }
        else if (container.type === 'chart') {
            container.handle = new Highcharts.Chart({
                chart: {
                    renderTo: container.id,
                    type: container.chartType
                },
                title: {
                    text: elements[elementName].title
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    labels: {
                        format: '{value}' + elements[elementName].valueSuffix
                    }
                },
                tooltip: {
                    valueSuffix: elements[elementName].valueSuffix
                },
                series: data
            });
        }
        else if (container.type === 'value') {
            console.log(1234);
            $('#' + container.id).html('<div class="ui statistic"><div class="label">' + elements[elementName].title + '</div><div class="value">' + data + '</div>');
        }

    });
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

function initialiseApp() {
    "use strict";
    $('#sidebar').sidebar({
        transition: 'overlay',
        mobileTransition: 'overlay',
        dimPage: false
    })
        .sidebar('attach events', '.view-sidebar', 'toggle');

    $('.sidebar.menu .item').tab();

    if (serverAddress === "") {
        serverAddress = window.location.host;
    }
}

function AJAXemulation() { //emulates connecting to server!
    "use strict"; //not only connect to non existing server but does it in strict mode!!!
    setTimeout(function () {
        setServerStatus(1);
        setCansatStatus(1);
        setMissionPhase(3);

        $.each(elements, function (index, value) {
            initialiseElement(index);
        });

    }, 2000);
}

$(document).ready(function () {
    "use strict";
    initialiseApp();

    AJAXemulation();

});