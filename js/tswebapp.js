//CONFIG
var serverAddress = "http://127.0.0.1:1443/techswarm-webapp/server"; // if empty current server will be used
//CONFIG

var serverURLs;
var time = 0;
var lastUpdate = {
    status: new Date(0),
    sensors: new Date(0)
};

var elements;
var staticData;

//    /*accel: {
//     title: "Acceleration",
//     valueSuffix: 'g',
//     containers: [
//     {
//     type: 'chart',
//     chartType: 'spline',
//     id: 'telemetry-accel',
//     handle: {}
//     }
//     ]
//     },
//     magn: {
//     title: "Magnetic field",
//     valueSuffix: 'gauss',
//     containers: [
//     {
//     type: 'chart',
//     chartType: 'spline',
//     id: 'telemetry-magn',
//     handle: {}
//     }
//     ]
//     },
//     gyro: {
//     title: "Orientation",
//     valueSuffix: '°',
//     containers: [
//     {
//     type: 'chart',
//     chartType: 'spline',
//     id: 'telemetry-gyro',
//     handle: {}
//     }
//     ]
//     },
//     gps: {
//     title: "Position",
//     containers: [
//     {
//     type: 'map',
//     id: 'telemetry-gps',
//     handle: {}
//     }
//     ]
//     },*/


function getStatus() {
    "use strict";
    $.getJSON(serverAddress + serverURLs.statusCurrent, function (json) {
        setServerStatus(1);
        setCansatStatus(Boolean(json.connected));
        updateElement('mphase', json.phase);

        var timestamp = new Date(json.timestamp);

        if (Boolean(json.connected)) {
            var now = new Date();
            time = Math.floor(((now.getTime() - timestamp.getTime()) / 1000) + parseFloat(json.mission_time));
        } else {
            time = parseInt(json.mission_time);
        }
        updateElement('mtime', time);
        elements.mtime.event = setInterval(function () {
            updateElement('mtime', time);
            time++;
        }, 1000);

        if (json.phase === 'none' || json.phase === 'launch_preparation' || json.phase === 'mission_complete') {
            clearInterval(elements.mtime.event);
        }

        lastUpdate.status = timestamp;

    })
        .fail(function () {
            setServerStatus(0);
            setCansatStatus(-1);
            updateElement('mphase', 'none');
            clearInterval(elements.mtime.event);
        });
}

function getPlanetaryData() {
    "use strict";
    $.getJSON(serverAddress + serverURLs.planetaryData, function (json) {
        $.each(json[json.length - 1], function(key, value) {
           updateElement(key, value);
        });
    });
}

function getTimeStampFromDate(date) {
    "use strict";
    return "" + date.toISOString().replace('Z', '');
}

function getSensorData() {
    "use strict";
    $.getJSON(serverAddress + serverURLs.sensors + '?since=' + getTimeStampFromDate(lastUpdate.sensors), function (json) {
        $.each(json, function (sensorName, sensorData) {
            $.each(sensorData, function (index, table) {
                var timestamp = table.timestamp;
                if ((new Date(timestamp)).getTime() > lastUpdate.sensors.getTime()) {
                    lastUpdate.sensors = new Date(timestamp);
                }
                $.each(table, function (key, value) {
                    updateElement(key, value, timestamp);
                });
            });
        });
        updateElement('lastUpdate', lastUpdate.sensors.getHours() + ':' + lastUpdate.sensors.getMinutes() + ':' + lastUpdate.sensors.getSeconds());
    });
}

function updateElement(elementName, data, timestamp) {
    "use strict";
    try {
        $.each(elements[elementName].containers, function (key, container) {
            try {
                if (container.type === 'map') {
                    //TODO: Add map updating with polyline drawing
                }
                else if (container.type === 'chart') {
                    container.handle.series.addPoint();
                }

                else if (container.type === 'value') {
                    var text = ' – ';
                    if (data !== undefined) {
                        text = data.toString().replace('_', ' ');
                        if (elements[elementName].valueSuffix !== undefined) {
                            text += elements[elementName].valueSuffix;
                        }
                    }
                    $('#' + container.id).html('<div class="centered"><div class="ui small statistic"><div class="label">' + elements[elementName].title + '</div><div class="value">' + text + '</div></div>');
                }

                else if (container.type === 'image') {
                    $('#' + container.id).html('<img src="' + serverAddress + serverURLs.photos + data + '">');
                }

                else if (container.type === 'phase_steps') {
                    var phaseNumber = 0;
                    if (data === 'launch_preparation') {
                        phaseNumber = 1;
                    } else if (data === 'launch' || phase === 'countdown') {
                        phaseNumber = 2;
                    } else if (data === 'descend') {
                        phaseNumber = 3;
                    } else if (data === 'ground_operations') {
                        phaseNumber = 4;
                    } else if (data === 'mission_complete') {
                        phaseNumber = 5;
                    }

                    var i = 1;
                    $('#mission-phase').find('> div').each(function () {
                        if (i < phaseNumber) {
                            $(this).removeClass("disabled active");
                        }
                        else if (i === phaseNumber) {
                            $(this).addClass("active").removeClass("disabled");
                        }
                        else {
                            $(this).removeClass("active").addClass("disabled");
                        }
                        i++;
                    });
                }
            }
            catch (exception) {
            }
        });
    }
    catch (exception) {
    }
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
        } else if (container.type === 'chart') {
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
        } else if (container.type === 'gauge') {
            container.handle = new Highcharts.Chart({
                chart: {
                    renderTo: container.id,
                    type: 'solidgauge'
                },
                title: {
                    text: elements[elementName].title
                },
                pane: {
                    center: ['50%', '85%'],
                    size: '140%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },
                tooltip: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                yAxis: {
                    stops: [
                        [0.1, '#55BF3B'], // green
                        [0.5, '#DDDF0D'], // yellow
                        [0.9, '#DF5353'] // red
                    ],
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    title: {
                        y: -70
                    },
                    labels: {
                        y: 16
                    }
                },
                lotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                }


            });

        }
    });
}



function setServerStatus(status) { // status: -1 - Connecting, 0 - Connection failed, 1 - Connected
    "use strict";
    if (status === -1) {
        $('#status-server').html("Connecting").css("color", "black").parent().next().find('.loader').addClass("active");
        setCansatStatus(-1);
    } else if (status === 1) {
        $('#status-server').html("Connected").css("color", "green").parent().next().find('.loader').removeClass("active");
    } else if (status === 0) {
        $('#status-server').html("Connection failed!").css("color", "red").parent().next().find('.loader').removeClass("active");
        setCansatStatus(-1);
    }
}

function setCansatStatus(status) { // status: -1 - Unknown , 0 - Offline, 1 - Online
    "use strict";
    if (status === -1) {
        $('#status-cansat').html(" – ").css("color", "black");
    } else if (status === 1) {
        $('#status-cansat').html("Online").css("color", "green");
    } else if (status === 0) {
        $('#status-cansat').html("Offline").css("color", "black");
    }
}

function loadStaticData() {
    "use strict";
    $.each(staticData, function(key, value) {
       updateElement(key, value);
    });
}

function gridPrinter(x, y, container) {
    "use strict";
    var grid = "";
    for (var i = 1; i <= y; i++) {
        grid += '<div class="row">';
        for (var j = 1; j <= x; j++) {
            grid += '<div class="column" id="' + container + '-' + i + '-' + j + '"></div>';
        }
        grid += '</div>';
    }
    $('#' + container).append(grid);
}

function initialiseApp() {
    "use strict";
    loadStaticData();
   getStatus();
    getSensorData();
}

function getConfig() {
    "use strict";
    $.getJSON(serverAddress + '/webapp.config', function(json) {
        serverURLs = json.serverURLs;
        staticData = json.staticData;
        elements = json.elements;
        initialiseApp();
    });
}

function initialisePage() {
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
    gridPrinter(3, 9, 'dashboard');
    gridPrinter(3, 4, 'pdata');
    getConfig();
}


$(document).ready(function () {
    "use strict";
    initialisePage();
});