//CONFIG
var serverAddress = "http://127.0.0.1:1443/techswarm-webapp/server"; // if empty current server will be used
//CONFIG

var serverURLs;
var time = 0;
var lastUpdate = {
    status: new Date(0),
    sensors: new Date(0),
    planetaryData: new Date(0)
};

var elements;
var staticData;

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
    $.getJSON(serverAddress + serverURLs.planetaryData + '?since=' + getTimeStampFromDate(lastUpdate.planetaryData), function (json) {
        lastUpdate.planetaryData = new Date(json[json.length - 1].timestamp);
        $.each(json[json.length - 1], function(key, value) {
           updateElement(key, value);
        });
    });
}

function getTimeStampFromDate(date) {
    "use strict";
    date.setMilliseconds(date.getMilliseconds() + 1);
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
                console.log('not implemented');
            }
            else if (container.type === 'chart') {
                var chart = $('#' + container.id);
                if (chart.highcharts() === undefined) {
                    initialiseElement(elementName);
                }
                if (container.series === undefined) {
                    chart.highcharts().addSeries({
                        name: container.seriesName,
                        type: container.chartType,
                        data: []
                    }, true, false);
                    container.series = chart.highcharts().series.length - 1;
                }
                chart.highcharts().series[container.series].addPoint([(new Date(timestamp)).getTime(), data], true, false);
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
          } catch (exception) {console.log(exception);}
        });
    } catch (exception) {}
}

function initialiseElement(elementName) {
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
            $('#' + container.id).highcharts({
                chart: {
                    type: container.chartType
                },
                title: {
                    text: container.chartName
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: container.legend
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        format: '{value}' + elements[elementName].valueSuffix
                    }
                },
                xAxis: {
                    type: 'datetime'
                },
                tooltip: {
                    valueSuffix: elements[elementName].valueSuffix
                },
                series: []
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
    getPlanetaryData();
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

    $('.sidebar.menu .item').tab({
        onTabLoad: function () {
            $(window).trigger('resize');
        }
    });

    if (serverAddress === "") {
        serverAddress = window.location.host;
    }
    gridPrinter(3, 9, 'dashboard');
    gridPrinter(3, 4, 'pdata');
    gridPrinter(1, 7, 'telemetry');
    getConfig();
}


$(document).ready(function () {
    "use strict";
    initialisePage();
});