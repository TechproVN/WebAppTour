$(() => {
  // enable alert 

  $('.alert').alert();
  $( ".sortable" ).sortable({
    update: function(event, ui){
      let alerts = $(event.target).find('.alert');
      arrSelectedPointsOnRoute = [];
      Array.from(alerts).forEach(alert => {
        let id = alert.dataset.point
        let point = arrPointsOnZone.find(p => p.iPointID == id.trim());
        arrSelectedPointsOnRoute.push(point);
      })
      showDistanceAndTimeOfRoute();
      setTimeout(() => {
        showRouteMap(arrSelectedPointsOnRoute);
      }, 100)
    }
  }); 
  $('#selectRouteZone').change(() => {
    showPointsOnZone();
    $('#selectedPointsOnRoute').html('');
    showRouteMap(null);
  }) 
  $('#btnSaveSelectedPoints').click(saveRoute);
  showSelectDevices();
  showRouteMap();
  showAllZones();
  showPointsOnZone();
  showRoutesOnTable();
})

var arrSelectedPointsOnRoute = [];
var arrPointsOnZone = [];
var currentTotalDistance = 0;
var currentTimeCompleted = 0;
var currentUpdateRoute = null;
// routeMap
function buildRouteMap(data){
  let $mapArea = $(`<div id="routeMap" class="map"></div>`);
  $('.card-route-map').find('.card-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#routeMap`)[0], mapProp);
  let icon = '../img/Checked.png';
  
  if(data){
    let arrPointsCoordination = [];
    data.forEach((point, index) => {
      const { dPointLat, dPointLong, iPointID, iQRCode, iRFID} = point;
      let type = 'GPS';
      if(iQRCode != '') type = 'QRCode';
      if(iRFID != '') type = 'RFID';
      let lat = Number(dPointLat);
      let lng = Number(dPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      let mes = `${index + 1} - ${iPointID} - ${type}`;
      arrPointsCoordination.push([lat, lng])
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
    let path = arrPointsCoordination.map(point => {
      return new google.maps.LatLng(point[0], point[1]);
    });
    let polyline = createPolylineGoogleMap(path);
    polyline.setMap(mymap);
  }
}

function buildRouteMapOnModal(data){
  let $mapArea = $(`<div id="routeMapOnModal" class="map"></div>`);
  $('#modalViewMapRoute').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#routeMapOnModal`)[0], mapProp);
  let icon = '../img/Checked.png';

  if(data){
    let arrPointsCoordination = [];
    data.forEach((point, index) => {
      const { dPointLat, dPointLong, iQRCode, iRFID } = point;
      let type = 'GPS';
      if(iQRCode != '') type = 'QRCode';
      if(iRFID != '') type = 'RFID';
      let lat = Number(dPointLat);
      let lng = Number(dPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      let mes = `${index + 1} - ${type}`;
      arrPointsCoordination.push([lat, lng])
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
    let path = arrPointsCoordination.map(point => {
      return new google.maps.LatLng(point[0], point[1]);
    });
    let polyline = createPolylineGoogleMap(path);
    polyline.setMap(mymap);
  }
}

function showRouteMap(data){
  buildRouteMap(data);
}

function renderZoneOnJcombobox(data) {
  $('.selectZones').html('');
  if (data) {
    data.forEach(zone => {
      $('.selectZones').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}

async function showZonesOnJcomboboxFilter(){
  let data = await Service.getAllZones();
  renderZoneOnJcomboboxFilter(data);
}

async function showAllZones(){
  let data = await Service.getAllZones();
  renderZoneOnJcombobox(data);
}

async function showPointsOnZone(){
  let iZoneID = $('#selectRouteZone').val();
  if(!iZoneID) iZoneID = 1;
  let sentData = { iZoneID };
  let points = await Service.getPointsDataOnZone(sentData);
  if(points) arrPointsOnZone = points.slice();
  else arrPointsOnZone = [];
  arrSelectedPointsOnRoute = [];
  renderPointsOnZone(points);
}

function renderPointsOnZone(points){
  $('#pointsOnZone').html('');
  if(points){
    points.forEach(point => {
      const { iPointID, dPointLat, dPointLong, iQRCode, iRFID } = point;
        let type = 'GPS';
        if(iQRCode != '') type = 'QRCode';
        if(iRFID != '') type = 'RFID';
        $('#pointsOnZone').append(`
        <li class="list-group-item">
          <input type="checkbox" class="checkbox-custom checkboxPoint" style="margin-right: 10px" value="${iPointID}">
          <span class="point">${iPointID} - ${type}</span>
        </li>
      `)
      $('#pointsOnZone').find('.checkboxPoint').last().change(function(e){
        showSelectedPointWhenCheckbox(e, point);
      })
    })
  }
}

function showSelectedPointWhenCheckbox(e, point){
  let { checked, value } = e.target;
  if(checked){
    arrSelectedPointsOnRoute.push(point);
    renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  }else{
    let index = arrSelectedPointsOnRoute.findIndex(point => point.iPointID == value);
    arrSelectedPointsOnRoute.splice(index, 1);
    renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  }
  showDistanceAndTimeOfRoute();
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  }, 100)
}

function showSelectedPointWhenRemoveAlert(point){
  let index = arrSelectedPointsOnRoute.findIndex(p => point.iPointID == p.iPointID);
  arrSelectedPointsOnRoute.splice(index, 1);
  renderListOfSelectedPoints(arrSelectedPointsOnRoute);
  let checkboxes = $('#pointsOnZone').find('.checkboxPoint');
  Array.from(checkboxes).forEach(checkbox => {
    if($(checkbox).val().trim() == point.iPointID){
      $(checkbox).prop({checked: false});
    }
  })
  showDistanceAndTimeOfRoute();
  setTimeout(() => {
    showRouteMap(arrSelectedPointsOnRoute);
  }, 100)
}

function showDistanceAndTimeOfRoute(){
  if(arrSelectedPointsOnRoute.length > 0){
    let totalDistance = calDistanceOfRoute(arrSelectedPointsOnRoute);
    currentTotalDistance = totalDistance;
    $('.sumOfDistance').html(`<strong class="trn">Total distance</strong>: ${totalDistance.toFixed(1)}km`);
    let time = totalDistance / 25 * 60;
    currentTimeCompleted = time;
    $('.timeCompleted').html(`<strong class="trn">Time completed</strong>: ${parseInt(time)} min`)
  }else{
    $('.sumOfDistance').text('');
    $('.timeCompleted').text('');
  }
  setDefaultLang();
}

function renderListOfSelectedPoints(selectedPoints){
  $('#selectedPointsOnRoute').html('');
  if(selectedPoints){
    selectedPoints.forEach(point => {
      const { iPointID, dPointLat, dPointLong, iQRCode, iRFID } = point;
      let type = 'GPS';
      if(iQRCode != '') type = 'QRCode';
      if(iRFID != '') type = 'RFID';
      $('#selectedPointsOnRoute').append(`
        <div class="alert alert-success alert-dismissible fade show" role="alert" data-point="${iPointID}" style="cursor: pointer;">${iPointID} - ${type}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `)
      $('#selectedPointsOnRoute').find('.alert').last().on('closed.bs.alert', function(e){
        showSelectedPointWhenRemoveAlert(point)
      })
    })
  }
}

async function saveRoute(){
  let RouteName = $('#txtSaveRouteName').val();
  if(arrSelectedPointsOnRoute.length == 0) return showAlertError("Invalid save", "Please choose points", 3000);
  if(!Validation.checkEmpty(RouteName)) return showAlertError("Invalid save", "Please enter route name", 3000);
  let arrPoints = arrSelectedPointsOnRoute.map((p, index) => {
    const { iPointID } = p;
    return {PointID: iPointID, No: index + 1}
  })
  let Distance = Number(currentTotalDistance.toFixed(1));
  let TimeComplete = parseInt(currentTimeCompleted);
  let ZoneID = $('#selectRouteZone').val();
  let sentData = { RouteID: 0, RouteName, bStatusIN: 1, Point: arrPoints, ZoneID, TimeComplete, Distance };
  console.log(JSON.stringify(sentData));
  let response = await Service.saveRoute(sentData);
  console.log(response);
  showAlertSuccess("Save successfully!", "", 2000);
  resetAfterSavingRoute();
}

function resetAfterSavingRoute(){
  $('#txtSaveRouteName').val('');
  arrSelectedPointsOnRoute.length = 0;
  renderListOfSelectedPoints(null);
  $('.sumOfDistance').text('');
  $('.timeCompleted').text('');
  buildRouteMap(null);
  showPointsOnZone();
}

async function deleteRoute(route){
  let sure = await showAlertWarning("Are you sure", "");
  if(sure){
    const { iRouteID } = route;
    let sentData = { RouteID: iRouteID, bStatusIN: 2, RouteName: 0, Point: null, ZoneID: 0, TimeComplete: 0, Distance: 0 }
    console.log(JSON.stringify(sentData));
    let response = await Service.deleteRoute(sentData);
    console.log(response);
    showRoutesOnTable();
    showAlertSuccess("Locked successfully!", "", 3000);
  } 
}

async function showRoutesOnTable(){
  let zoneId = $('#selectZonesFilter').val();
  if(!zoneId) zoneId = 0;
  let sentData = { iZoneIDIN: zoneId };
  let routes = await Service.getRoutesOnZone(sentData);
  if(routes){
    $('#totalRoutes').html(`<strong class="trn">Total Routes</strong> ${routes.length}`);
    $('#pagingRoutesControl').pagination({
      dataSource: routes,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderTableRoutes(data);
        $('.card-route .table-responsive').html($table);
        setDefaultLang();
      }
    })
  }else{
    resetTblRoutes();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblRoutes(){
  $('#totalRoutes').html('');
  $('#pagingRoutesControl').html('');
  $('#tblRoutes').find('tbody').html('');
}

function renderTableRoutes(routes){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblRoutes"></table>`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Zone</th>
        <th class="trn">Route</th>
        <th class="trn">Device</th>
        <th class="trn">Completion time</th>
        <th class="trn">Speed</th>
        <th class="trn">Distance</th>
        <th class="trn">Datetime updated</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (routes) {
    routes.forEach(route => {
      const { sDeviceName, dDateTimeUpdate, dDistance, iSpeed, iTimeComplete, sRouteName, sZoneName } = route;
      $tbody.append(`
        <tr>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sDeviceName}</td>
          <td>${iTimeComplete}</td>
          <td>${iSpeed}</td>
          <td>${dDistance}</td>
          <td>${dDateTimeUpdate}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-success btnRouteViewMap btn-custom-small dropdown-item trn">Map</button>
                <button class="btn btn-custom btn-info btnRouteUpdateGuard btn-custom-small dropdown-item trn">Update Route</button>
                <button class="btn btn-custom btn-warning btnInactiveRoute btn-custom-small dropdown-item trn">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnRouteViewMap').last().click(function(){
        showRouteViewMapModal(route);
      })
    })
  }
  $table.append($thead).append($tbody);
  return $table;
}

async function showRouteViewMapModal(route){
  const { iRouteID } = route;
  let sentData = { iRouteID };
  let data = await Service.getRouteDetailsData(sentData);
  $('#modalViewMapRoute').modal('show');
  setTimeout(() => {
    buildRouteMapOnModal(data);
  }, TIME_OUT_SHOW_MAP_ON_MODAL);
}



function calDistanceOfRoute(points){
  let sumOfDistance = 0;
  points.forEach((point, index) => {
    if(index != points.length - 1){
      const { dPointLat, dPointLong } = point;
      let lat1 = Number(dPointLat);
      let lon1 = Number(dPointLong);
      const lat2 = Number(points[index + 1].dPointLat);
      const lon2 = Number(points[index + 1].dPointLong);
      let R = 6371; // km
      let φ1 = toRadian(lat1);
      let φ2 = toRadian(lat2);
      let Δφ = toRadian(lat2-lat1);
      let Δλ = toRadian(lon2-lon1);

      let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            let d = R * c;
      sumOfDistance += d;
    }
  })
  return sumOfDistance;
}

function toRadian(degree) {
  return degree * Math.PI/180;
}
