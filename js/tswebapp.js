//CONFIG
var serverAddress = "http://127.0.0.1:1443/techswarm-webapp/server"; // if empty current server will be used
//CONFIG

var serverURLs;
serverURLs = {
    status: "/status",
    statusCurrent: "/status/current",
    groundStation: "/gsinfo",
    groundStationCurrent: "/gsinfo/current",
    sensors: "/bulk/imu,sht,gps",
    planetaryData: "/planetarydata",
    photos: "/photos"
};

var time = 0;
var lastUpdate = {
    status: new Date(0),
    sensors: new Date(0)
};

var elements;
elements = {
    temperature: {
        title: "Temperature",
        valueSuffix: '°C',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-temp',
                handle: {}
            },
            {
                type: 'value',
                id: 'dashboard-2-1'
            }
        ]
    },
    humidity: {
        title: "Humidity",
        valueSuffix: '%',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-humi',
                handle: {}
            },
            {
                type: 'value',
                id: 'dashboard-2-2'
            }
        ]
    },
    pressure: {
        title: "Pressure",
        valueSuffix: ' hPa',
        containers: [
            {
                type: 'chart',
                chartType: 'spline',
                id: 'telemetry-pres',
                handle: {}
            },
            {
                type: 'value',
                id: 'dashboard-2-3'
            }
        ]
    },
    accelX: {
        title: "Acceleration X",
        valueSuffix: ' g',
        containers: [
            {
                type: 'value',
                id: 'dashboard-3-1'
            }
        ]
    },
    accelY: {
        title: "Acceleration Y",
        valueSuffix: ' g',
        containers: [
            {
                type: 'value',
                id: 'dashboard-3-2'
            }
        ]
    },
    accelZ: {
        title: "Acceleration Z",
        valueSuffix: ' g',
        containers: [
            {
                type: 'value',
                id: 'dashboard-3-3'
            }
        ]
    },
    gyroX: {
        title: "Orientation X",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-4-1'
            }
        ]
    },
    gyroY: {
        title: "Orientation Y",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-4-2'
            }
        ]
    },
    gyroZ: {
        title: "Orientation Z",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-4-3'
            }
        ]
    },
    magnetX: {
        title: "Magnetic field X",
        valueSuffix: ' gauss',
        containers: [
            {
                type: 'value',
                id: 'dashboard-5-1'
            }
        ]
    },
    magnetY: {
        title: "Magnetic field Y",
        valueSuffix: ' gauss',
        containers: [
            {
                type: 'value',
                id: 'dashboard-5-2'
            }
        ]
    },
    magnetZ: {
        title: "Magnetic field Z",
        valueSuffix: ' gauss',
        containers: [
            {
                type: 'value',
                id: 'dashboard-5-3'
            }
        ]
    },
    /*accel: {
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
    },*/
    latitude: {
        title: "Latitude",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-6-1'
            }
        ]
    },
    longitude: {
        title: "Longitude",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-6-2'
            }
        ]
    },
    altitude: {
        title: "Altitude",
        valueSuffix: 'm',
        containers: [
            {
                type: 'value',
                id: 'dashboard-6-3'
            }
        ]
    },
    speedOverGround: {
        title: "Speed over ground",
        valueSuffix: 'm/s',
        containers: [
            {
                type: 'value',
                id: 'dashboard-7-1'
            }
        ]
    },
    direction: {
        title: "Direction",
        valueSuffix: '°',
        containers: [
            {
                type: 'value',
                id: 'dashboard-7-2'
            }
        ]
    },
    activeSatellites: {
        title: "Active GPS satellites",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-7-3'
            }
        ]
    },
    fixType: {
        title: "GPS fix",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-9-1'
            }
        ]
    },
    satellitesInView: {
        title: "GPS satellites in view",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-9-2'
            }
        ]
    },
    pdop: {
        title: "GPS positional dilution of precision",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-8-3'
            }
        ]
    },
    hdop: {
        title: "GPS horizontal dilution of precision",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-8-1'
            }
        ]
    },
    vdop: {
        title: "GPS vertical dilution of precision",
        valueSuffix: '',
        containers: [
            {
                type: 'value',
                id: 'dashboard-8-2'
            }
        ]
    },
    quality: {
        containers: []
    },
    timestamp: {
        containers: []
    },

    mtime: {
        title: "Mission time",
        event: {},
        containers: [
            {
                type: 'value',
                id: 'dashboard-1-1'
            }
        ]
    },
    mphase: {
        title: "Phase",
        containers: [
            {
                type: 'value',
                id: 'dashboard-1-2'
            },
            {
                type: 'phase_steps'
            }
        ]
    },
    lastUpdate: {
        title: "Last update",
        containers: [
            {
                type: 'value',
                id: 'dashboard-1-3'
            }
        ]

    },

};


function updateStatus() {
    "use strict";
    $.getJSON(serverAddress + serverURLs.statusCurrent, function(json) {
        setServerStatus(1);
        setCansatStatus(Boolean(json.connected));
        updateElement('mphase', json.phase);

        var timestamp = new Date(json.timestamp);

        if(Boolean(json.connected)) {
            var now = new Date();
            time = Math.floor(((now.getTime() - timestamp.getTime())/1000) + parseFloat(json.mission_time));
        } else {
            time = parseInt(json.mission_time);
        }
        updateElement('mtime', time);
        elements.mtime.event = setInterval(function () {
            updateElement('mtime', time);
            time++;
        }, 1000);

        if(json.phase==='none' || json.phase==='launch_preparation' || json.phase==='mission_complete') {
            clearInterval(elements.mtime.event);
        }

        lastUpdate.status = timestamp;

    })
        .fail(function() {
            setServerStatus(0);
            setCansatStatus(-1);
            updateElement('mphase', 'none');
            clearInterval(elements.mtime.event);
        });
}

function getTimeStampFromDate(date) {
    "use strict";
    return "" + date.toISOString().replace('Z', '');
}

function getSensorData() {
    "use strict";
    $.getJSON(serverAddress + serverURLs.sensors + '?since=' + getTimeStampFromDate(lastUpdate.sensors), function(json) {
        $.each(json, function(sensorName, sensorData) {
            $.each(sensorData, function(index, table) {
                var timestamp = table.timestamp;
                if((new Date(timestamp)).getTime()>lastUpdate.sensors.getTime()) {
                    lastUpdate.sensors = new Date(timestamp);
                }
                $.each(table, function(key, value) {
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
                    container.handle.series.addPoint()
                }

                else if (container.type === 'value') {
                    var Valsuffix = elements[elementName].valueSuffix;
                    if (Valsuffix === undefined) {
                        Valsuffix = '';
                    }
                    $('#' + container.id).html('<div class="centered"><div class="ui small statistic"><div class="label">' + elements[elementName].title + '</div><div class="value">' + data.toString().replace('_', ' ') + Valsuffix + '</div></div>');
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
            catch (exception) {}
        });
    }
    catch (exception) {}
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

        } else if (container.type === 'value') {
            $('#' + container.id).html('<div class="ui statistic"><div class="label">' + elements[elementName].title + '</div><div class="value">' + data + '</div>');
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

function gridPrinter(x, y, container) {
    "use strict";
    var grid="";
    for(var i = 1; i<=y; i++) {
        grid += '<div class="row">';
        for(var j = 1; j<=x; j++) {
            grid += '<div class="column" id="' + container + '-' + i + '-' + j +'"></div>';
        }
        grid += '</div>';
    }
    $('#' + container).append(grid);
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
    gridPrinter(3, 9, 'dashboard');
}


$(document).ready(function () {
    "use strict";
    initialiseApp();

    updateStatus();

    getSensorData();
});