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
        showRouteMap();
      }, 100)
    }
  }); 
  $('#selectRouteZone').change((e) => {
    showPointsOnZone();
    showRoutesOnTable();
    $('#selectedPointsOnRoute').html('');
    showRouteMap();
  }) 
  $('#btnSaveSelectedPoints').click(showInsertRouteModal);
  $('#modalUpdateRouteGuard').find('.btn.btnSaveRouteUpdateGuard').click(updateRoute);

  $('#btnSaveInsertRoute').click(saveRoute);
  showSelectDevices();
  showAllZones();
  showPointsOnZone();
  showRoutesOnTable();
  // showGuardIdOnCombobox();
  // showZonesOnJcomboboxFilter();

  showRouteMap();
})

var arrSelectedPointsOnRoute = [];
var arrPointsOnZone = [];
var currentTotalDistance = 0;
var currentUpdateRoute = null;
var currentMapAllRoute = null;
var arrCurrentRoutesOnZone = [];
var currentSelectedRoutePolyline = null;

function showInsertRouteModal(){
  if(arrSelectedPointsOnRoute.length == 0) return showAlertError("No Points on route!!!", "Please choose point map to create a route", 6000);
  $('#txtInsertRouteName').val('');
  $('#txtInsertDistance').val(currentTotalDistance);
  $('#txtInsertSpeed').val('');
  $('#txtInsertMinTime').val('');
  $('#txtInsertCompletionTime').val('');
  $('#txtInsertTourExecute').val('');
  $('#modalInsertRoute').modal('show');
}

$('#txtInsertSpeed').keyup(e => showMinTime(e, true));
$('#txtInsertCompletionTime').keyup(e => showTourExecute(e, true));
$('#txtUpdateSpeed').keyup(e => showMinTime(e, false));
$('#txtUpdateCompletionTime').keyup(e => showTourExecute(e, false));

function showMinTime(e, insert){
  let val = e.target.value;
  let txtMinTime = $('.txtMinTime');
  let cond = !Validation.checkPositiveNumber(val);
  if(cond) return txtMinTime.val('');
  let speed = Number(val);
  let distance = $('#txtUpdateDistance').val();
  if(insert) distance = $('#txtInsertDistance').val();
  if(Validation.checkPositiveNumber(distance)) distance =  Number(distance);
  let minTime = Math.floor(distance/speed * 60);
  txtMinTime.val(minTime);
}

function showTourExecute(e){
  let val = e.target.value;
  let txtTourEx = $('.tourExecute');
  if(!Validation.checkPositiveNumber(val)) return txtTourEx.val('');
  let tourEx = 1440/Number(val);
  txtTourEx.val(tourEx);
}

// routeMap
function buildRouteMap(){
  let $mapArea = $(`<div id="routeMap" class="map"></div>`);
  $('.card-route-map').find('.card-body').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  currentMapAllRoute = new google.maps.Map($(`#routeMap`)[0], mapProp);
  let iconChecked = '../img/Checked.png';
  let iconRoutePoint = '../img/point.png';
  if(arrSelectedPointsOnRoute){
    currentSelectedRoutePolyline = buildPolylineRoute(arrSelectedPointsOnRoute, iconRoutePoint, 'red');
  }
  if(arrCurrentRoutesOnZone && arrCurrentRoutesOnZone.length > 0)
  arrCurrentRoutesOnZone.forEach(route => {
    arrPoints = JSON.parse(route.PointObject);
    buildPolylineRoute(arrPoints, iconChecked, 'green');
  })
}

function buildPolylineRoute(data, icon, strokeColor){
  let arrPointsCoordination = [];
  if(!data) return;
  data.forEach((point, index) => {
    const { dPointLat, dPointLong, iPointID } = point;
    let type = getTypeOfPoint(point);
    let lat = Number(dPointLat);
    let lng = Number(dPointLong);
    let pos = new google.maps.LatLng(lat, lng);
    let mes = `${index + 1} - ${type}`;
    arrPointsCoordination.push([lat, lng])
    let marker = createMarkerGoogleMap(pos, icon);
    marker.setMap(currentMapAllRoute);
    let infoWindow = createInfoWindowGoogleMap(mes);
    marker.addListener('click', () => {
      infoWindow.open(currentMapAllRoute, marker);
    })
  })
  let path = arrPointsCoordination.map(point => {
    return new google.maps.LatLng(point[0], point[1]);
  });
  let polyline = createPolylineGoogleMap(path, strokeColor);
  polyline.setMap(currentMapAllRoute);
  return polyline;
}

function getTypeOfPoint(point){
  const { iQRCode, iRFID} = point;
  let type = 'GPS';
  if(iQRCode != '') type = 'QRCode';
  if(iRFID != '') type = 'RFID';
  return type;
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

async function showRouteMap(){
  let iZoneID = $('#selectRouteZone').val();
  let sentData = { iZoneID };
  arrCurrentRoutesOnZone = await Service.getRouteCreatedData(sentData);
  buildRouteMap();
}

function renderZoneOnJcombobox(data) {
  $('.selectZones').html('');
  if (data) {
    data.forEach(zone => {
      $('.selectZones').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
    })
  }
}

// function renderZoneOnJcomboboxFilter(data) {
//   $('#selectZonesFilter').html('');
//   $('#selectZonesFilter').append(`<option value="0">All</option>`)
//   if (data) {
//     data.forEach(zone => {
//       $('#selectZonesFilter').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
//     })
//   }
// }

// async function showZonesOnJcomboboxFilter(){
//   let data = await Service.getAllZones();
//   renderZoneOnJcomboboxFilter(data);
// }

async function showAllZones(){
  let data = await Service.getAllZones();
  renderZoneOnJcombobox(data);
}

async function showPointsOnZone(){
  let iZoneID = $('#selectRouteZone').val();
  if(!iZoneID) iZoneID = 1;
  let sentData = { iZoneID };
  let points = await Service.getPointsDataOnZone(sentData);
  console.log(points);
  if(points) arrPointsOnZone = points.slice();
  else arrPointsOnZone = [];
  arrSelectedPointsOnRoute = [];
  renderPointsOnZone(points);
}

function renderPointsOnZone(points){
  $('#pointsOnZone').html('');
  console.log(points);
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
    currentTotalDistance = Number(totalDistance.toFixed(2));
  }
}

function renderListOfSelectedPoints(selectedPoints){
  $('#selectedPointsOnRoute').html('');
  if(selectedPoints){
    selectedPoints.forEach(point => {
      const { iPointID } = point;
      let type = getTypeOfPoint(point);
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
  let routeName = $('#txtInsertRouteName').val();
  let type = $('.txtInsertRouteType').prop('checked');
  console.log(type);
  let speed = $('#txtInsertSpeed').val();
  let minTime = $('#txtInsertMinTime').val();
  let maxTime = $('#txtInsertCompletionTime').val();
  let tourEx = $('#txtInsertTourExecute').val();
  let iDeviceID = $('#selectInsertRouteDevice').val();
  if(!validateRouteData(routeName, speed, minTime, maxTime, tourEx)) 
  return $('#modalInsertRoute').modal('show'); 
  let arr_1 = arrSelectedPointsOnRoute.map((p, index) => {
    const { iPointID } = p;
    return { PointID: iPointID, No: index + 1 }
  })
  let arrPoints = arr_1.slice();
  if(!type) {
    let arr_2 = arrPoints.concat(arr_1.reverse());
    arr_2.splice(arr_1.length, 1);
    arrPoints = arr_2;
  }
  let iZoneID = $('#selectRouteZone').val();
  let sentData = { iRouteID: 0, sRouteName: routeName, bStatusIN: 1, Point: arrPoints, iZoneID, iTimeComplete: maxTime, dDistance: currentTotalDistance, iMinTime: minTime, iTourExecute: tourEx, iDeviceID, iSpeed: speed};
  console.log(JSON.stringify(sentData));
  let response = await Service.saveRoute(sentData);
  console.log(response);
  $('#modalInsertRoute').modal('show');
  showAlertSuccess("Save successfully!", "", 2000);
  showRoutesOnTable();
  resetAfterSavingRoute();
}

function validateRouteData(name, speed, min, max, tourEx){
  let err = '';
  let valid = true;
  if(!Validation.checkEmpty(name)) {
    err += 'Name is required!!\n';
    valid = false;
  }
  if(!Validation.checkPositiveNumber(speed)) {
    err += 'Speed must be positive number!!\n';
    valid = false;
  }
  if(!Validation.checkPositiveNumber(min)) {
    err += 'Min Time must be positive number!!\n';
    valid = false;
  }
  if(!Validation.checkPositiveNumber(max)) {
    err += 'Time Completion must be positive number!!\n';
    valid = false;
  }
  if(!Validation.checkPositiveNumber(tourEx)) {
    err += 'TourExecute must be positive number!!\n';
    valid = false;
  }
  if(!valid) showAlertError('Invalid data!!', err);
  return valid;
}

function resetAfterSavingRoute(){
  $('#txtSaveRouteName').val('');
  arrSelectedPointsOnRoute.length = 0;
  renderListOfSelectedPoints(null);
  $('.sumOfDistance').text('');
  $('.timeCompleted').text('');
  buildRouteMap();
  showPointsOnZone();
}

async function deleteRoute(route){
  let sure = await showAlertWarning("Are you sure", "");
  if(sure){
    const { iRouteID } = route;
    let sentData = { iRouteID: iRouteID, bStatusIN: 3, sRouteName: 0, Point: null, iZoneID: 0, iTimeComplete: 0, dDistance: 0, iMinTime: 0, iTourExecute: 0, iDeviceID:0, iSpeed:0};
    //let sentData = { RouteID: 0, RouteName: routeName, bStatusIN: 1, Point: arrPoints, ZoneID, TimeComplete: maxTime, Distance: currentTotalDistance, MinTime: minTime, TourExecute: tourEx, iDeviceID};
    //console.log(JSON.stringify(sentData));
    console.log(sentData);
    let response = await Service.deleteRoute(sentData);
    console.log(response);
    showRoutesOnTable();
    showAlertSuccess("Locked successfully!", "", 3000);
  } 
}

async function showRoutesOnTable(){
  let zoneId = $('#selectRouteZone').val();
  if(!zoneId) zoneId = 0;
  let sentData = { iZoneID: zoneId };
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
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Zone</th>
        <th class="trn">Route</th>
        <th class="trn">Device</th>
        <th class="trn">Distance</th>
        <th class="trn">Speed</th>
        <th class="trn">Min time</th>
        <th class="trn">Max time</th>
        <th class="trn">Tour execute</th>
        <th class="trn">Updated</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (routes) {
    routes.forEach((route, index) => {
      const { sDeviceName, dDateTimeUpdate, dDistance, iSpeed, iTimeComplete, sRouteName, sZoneName, iMinTime, iTourExecute} = route;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sDeviceName}</td>
          <td>${dDistance} km</td>
          <td>${iSpeed} km/h</td>
          <td>${iMinTime} min</td>
          <td>${iTimeComplete} min</td>
          <td>${iTourExecute}</td>
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
      $tbody.find('.btn.btnRouteUpdateGuard').last().click(function(){
        showUpdateRouteGuardModal(route);
      })
      $tbody.find('.btn.btnRouteViewMap').last().click(function(){
        showRouteViewMapModal(route);
      })
      $tbody.find('.btn.btnInactiveRoute').last().click(function(){
        deleteRoute(route);
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

function showUpdateRouteGuardModal(route){
  currentUpdateRoute = Object.assign({}, route);
  const { bActive, dDateTimeUpdate, dDistance, iGuardID, iRouteID, iMinTime, iTimeComplete, iTourExecute, iZoneID, sRouteName, sZoneName, sGuardName, iSpeed, iDeviceID
  } = route;
  $('#routeUpdateInfo').text(`Route - ${sRouteName} on zone ${sZoneName}`)
  $('#txtUpdateRouteName').val(sRouteName);
  $('#txtUpdateDistance').val(dDistance);
  $('#txtUpdateSpeed').val(iSpeed);
  $('#txtUpdateMinTime').val(iMinTime);
  $('#txtUpdateCompletionTime').val(iTimeComplete);
  $('#txtUpdateTourExecute').val(iTourExecute);
  $('#selectUpdateRouteDevice').val(iDeviceID);
  $('#modalUpdateRouteGuard').modal('show');
}

async function showGuardIdOnCombobox(){
  let guards = await Service.getPersonalGuardsInfo();
  $('.selectGuards').html('');
  guards.forEach(guard => {
    const { iGuardID, sGuardName } = guard;
    $('.selectGuards').append(`<option value="${iGuardID}">${sGuardName}</option>`)
  })
}

async function updateRoute(){
  const { iRouteID } = currentUpdateRoute;
  let iDeviceID = $('#selectUpdateRouteDevice').val(); 
  let iTimeComplete = $('#txtUpdateCompletionTime').val();
  let iMinTime = $('#txtUpdateMinTime').val();
  let iSpeed = $('#txtUpdateSpeed').val();
  let sRouteName = $('#txtUpdateRouteName').val();
  let iTourExecute =  $('#txtUpdateTourExecute').val();
  if(!validateRouteData(sRouteName, iSpeed, iMinTime, iTimeComplete, iTourExecute)) return;
  let sentData = { iDeviceID, iRouteID, iSpeed, iTimeComplete, sRouteName, dDistance: 0, iMinTime, iTourExecute, iZoneID: 0, Point: null, bStatusIN: 2};
  //let sentData = { RouteID: 0, RouteName: routeName, bStatusIN: 1, Point: arrPoints, ZoneID, TimeComplete: maxTime, Distance: currentTotalDistance, MinTime: minTime, TourExecute: tourEx, iDeviceID};
  console.log(JSON.stringify(sentData));
  let response = await Service.updateRouteDetail(sentData);
  showRoutesOnTable();
  console.log(response);
  showAlertSuccess("Updated successfully!", "", 3000);
}



