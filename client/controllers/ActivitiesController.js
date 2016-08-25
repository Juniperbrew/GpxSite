ActivitiesController.$inject = ['$scope','$http', 'api', "format", "vars"];

function ActivitiesController($scope, $http, api, format, vars) {
    var vm = this;
    var checkpointsForPace = 10;
    var routePath;

    api.getActivities().
    then(function(result) {
        vm.activities = result;
    });

    vm.selected = function(id) {
        console.log("selected: "+id);
        api.getActivity(id).then(function(result) {
            vm.selectedActivity = result;
            loadActivity(result);
        });
        window.scrollTo(0, 0);
    };

    function loadActivity(gpx) {
        var route = gpx[0].gpx.trk.trkseg.trkpt;
        var path = [];
        var bounds = new google.maps.LatLngBounds();

        var startPoint = route[0];
        var start = new google.maps.LatLng(startPoint.lat, startPoint.lon);
        var startTime = new Date(startPoint.time);
        vm.date = startTime;

        var endPoint = route[route.length - 1];
        var endTime = new Date(endPoint.time);

        var durationMilli = endTime - startTime;
        vm.duration = format.getTimeStamp(durationMilli);

        var elevationDataArray = [];
        elevationDataArray.push(["Time", "Elevation"]);

        var paceDataArray = [];
        paceDataArray.push(["Time", "Pace"]);
        var paceCounter = checkpointsForPace;
        var paceMeasurement = 0;

        var lastPoint = start;
        for (i = 0; i < route.length; i++) {
            var p = route[i];
            var lat = parseFloat(p.lat);
            var lon = parseFloat(p.lon);
            var elevation = parseFloat(p.ele);
            var time = new Date(p.time);
            var point = new google.maps.LatLng(lat, lon);
            path.push(point);
            bounds.extend(point);

            elevationDataArray.push([time, elevation]);

            paceMeasurement += lastPoint.kmTo(point);
            paceCounter--;
            if (paceCounter == 0) {
                var duration = (time - startTime) / (1000 * 60);
                paceDataArray.push([time, duration / paceMeasurement]);
                paceMeasurement = 0;
                startTime = time;
                paceCounter = checkpointsForPace;
            }
            lastPoint = point;
        }

        if (routePath !== undefined) {
            routePath.setMap(null);
        }
        routePath = new google.maps.Polyline({
            path: path,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });
        vm.length = routePath.inKm().toFixed(2);
        var paceMin = (durationMilli / (1000 * 60)) / vm.length;
        vm.averagePace = format.formatPace((durationMilli / (1000)) / vm.length);
        vars.map.fitBounds(bounds);
        routePath.setMap(vars.map);

        var elevationData = google.visualization.arrayToDataTable(elevationDataArray);
        var elevationChart = new google.visualization.LineChart(document.getElementById('elevationChart'));
        elevationChart.draw(elevationData, null);

        var paceData = google.visualization.arrayToDataTable(paceDataArray);
        var paceChart = new google.visualization.LineChart(document.getElementById('paceChart'));
        var options = {
            title: 'Pace',
            legend: 'none',
            vAxis: {
                viewWindow: {
                    max: paceMin + 3,
                    min: paceMin - 3
                }
            }
        };

        paceChart.draw(paceData, options);
        vm.hide = false;
    }
}

module.exports = ActivitiesController