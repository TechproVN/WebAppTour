<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title>Guard Map</title>
</head>

<body>
  
 <div class="container-fluid">
    <div id="mapid" style="position: absolute; top: 0; left: 0; width:100%; height: 100%; float:left"></div>
 </div>

  <!-- Google Map API -->
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2JtN93nl-xarvyDCUu5QOVtFNMJk0S-A"></script>

  <script>

    var URL_OBJECT, sCheckingCode, iGuardID;
    const APP_DOMAIN = 'http://115.79.27.219/tracking/';

    URL_OBJECT = getUrlVars();
    if(URL_OBJECT){
      sCheckingCode = URL_OBJECT['sCheckingCode'];
      iGuardID = URL_OBJECT['iGuardID'];
      buildMap(iGuardID, sCheckingCode);
    }

    function createMarkerGoogleMap(pos, urlIcon){
      var icon = createIconGoogleMap(urlIcon);
      var marker = new google.maps.Marker({
        position: pos,
        // animation: google.maps.Animation.BOUNCE,
        icon: icon
      });
      return marker;
    }

    function createInfoWindowGoogleMap(content){
      var infoWindow = new google.maps.InfoWindow({
          content:content
        });
        return infoWindow
    }

    function createIconGoogleMap(url){
      var icon = {
        url: url, // url
        scaledSize: new google.maps.Size(17, 17), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
      };
      return icon;
    }

    function createPolylineGoogleMap(path){
      var polyline = new google.maps.Polyline({
        path: path,
        strokeColor: "red",
        strokeOpacity: 0.8,
        strokeWeight: 4
      });
      return polyline;
    }

    function createPolygonGooglemap(path){
      var polygon = new google.maps.Polygon({
        path: path,
        strokeColor: "green",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "green",
        fillOpacity: 0.4
      });
      return polygon;
    }

    function createMapPropGoogleMap(zoom, lat, lng){
      var mapProp = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom,
      };
      return mapProp;
    }

    function getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
          vars[key] = value;
      });
      return vars;
  }

    function getGuardGPSCurrent(sentData) {
      var id = sentData.iGuardID;
      var url = 'http://115.79.27.219/tracking/api/GetGuardGPSCurrent.php?iGuardID=' + id;
      var data = fetch(url);
      var jsonData = data.json();
      if(!Array.isArray(jsonData)) return null;
      if(jsonData.length == 0) return null;
      return jsonData;
    }

    function getPointChecking(sentData) {
      var code = sentData.sCheckingCode;
      var url = 'http://115.79.27.219/tracking/api/?sCheckingCode=' + code;
      var data = fetch(url);
      var jsonData = data.json();
      if(!Array.isArray(jsonData)) return null;
      if(jsonData.length == 0) return null;
      return jsonData;
    }
  
    function buildMap(iGuardID, sCheckingCode){
      var sentGuardData = iGuardID;
      var guardGPSCurrent = getGuardGPSCurrent(sentGuardData);
      console.log(guardGPSCurrent);
      const { dGuardLatCurrent, dGuardLongCurrent, sMessage, bOnline } = guardGPSCurrent[0];
      var latGuard = Number(dGuardLatCurrent);
      var lngGuard = Number(dGuardLongCurrent);
      var mapProp = createMapPropGoogleMap(18, latGuard, lngGuard)
      var mapArea = document.getElementById('mapid');
      var mymap = new google.maps.Map(mapArea, mapProp);
      
      var urlGuard = '../img/Guard.png';
      var mainPos = new google.maps.LatLng(latGuard, lngGuard);
      var guardMarker = createMarkerGoogleMap(mainPos, urlGuard);
  
      guardMarker.setMap(mymap);
      var infoWindowGuard = createInfoWindowGoogleMap(sMessage);
      infoWindowGuard.open(mymap, guardMarker);
      const pointChekingSentData = { iGuardID, sCheckingCode };
      var checkingPointData = getPointChecking(pointChekingSentData);
      if(checkingPointData){
        checkingPointData.forEach(checkedPoint => {
          var { Lat, Long, Status, Message, ImageUrl } = checkedPoint;
          var url = '';
          switch(Status){
            case 1: 
              url = '../img/Checked.png'; 
              break;
            case 2: 
              url = '../img/None.png'; 
              break;
            case 3: 
              url = '../img/Waiting.png'; 
              break;
            case 4: 
              url = '../img/error.png'; 
              break;
          }
          var pos = new google.maps.LatLng(Lat, Long);
          var marker = createMarkerGoogleMap(pos, url);
          marker.setMap(mymap);
          var mes = Message;
          if(Status == 4){
            mes = `${Message}<br><img src="${APP_DOMAIN}${ImageUrl}" class="img-fluid">`
            var infoWindow = createInfoWindowGoogleMap(mes);
            google.maps.event.addListener(marker, 'click', function() {
              infoWindow.open(mymap, marker);
            });
          }else{
            var infoWindow = createInfoWindowGoogleMap(mes);
            infoWindow.open(mymap, marker);
          }
        })
      }
    }
  
  </script>
</body>

</html>