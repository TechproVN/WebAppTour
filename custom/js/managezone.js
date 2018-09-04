
$(() => {
  $('#btnSaveUpdateZone').click(updateZone);
  $('#btnShowInsertZoneModal').click(showInsertZoneModal);
  $('#btnInsertZone').click(insertZone);
  $('#btnClearZoneMap').click(clearCurrentInsertedZone)
  showZones();
})

var arrCurrentInsertedPointsZone = [];
var mapInsertedZone = null;
let currentPolygonZoneInsertMap = null;
function clearCurrentInsertedZone(){
  arrCurrentInsertedPointsZone = [];
  buildInsertZoneMap(mapInsertedZone, arrCurrentInsertedPointsZone);
}

function renderZoneOnJcombobox(data) {
  if (data) {
      $('.selectRouteZone').html('');
      data.forEach(zone => {
        $('.selectRouteZone').append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
      })
  }
}

async function inActiveZone(zone){
  const { iZoneID, sZoneName } = zone
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    let sentData = { iZoneIDIN: iZoneID, bStatusIN: 3, sZoneNameIN: 0, sZoneLatLongIN: 0 }
    let response = await Service.inActiveZone(sentData);
    showZones();
    showAlertSuccess("Inactive successfully!", "", 2000);
  }
}

async function insertZone(){
  let zoneName = $('#txtInsertZoneName').val();
  if(Validation.checkEmpty(zoneName) && arrCurrentInsertedPointsZone.length > 2){
    let sentData = { iZoneIDIN: 0, sZoneNameIN: zoneName, bStatusIN: 1, sZoneLatLongIN: arrCurrentInsertedPointsZone };
    let response = await Service.insertZone(sentData);
    showAlertSuccess("Inserted successfully!", "", 2000);
    arrCurrentInsertedPointsZone = [];
    showZones();
  }else{
    showAlertError("Invalid data", "Name must be filled, the number of selected points must over 2", 3000);
  }
}

async function updateZone(){
  let iZoneIDIN = $('#txtUpdateZoneID').val();
  let sZoneNameIN = $('#txtUpdateZoneName').val();
  if(Validation.checkEmpty(sZoneNameIN)){
    let sentData = { iZoneIDIN, sZoneNameIN, bStatusIN: 2, sZoneLatLongIN: 0 };
    let response = await Service.updateZone(sentData);
    showZones();
    showAlertSuccess("Updated successfully", "", 2000);
  }else{
    showAlertError("Invalid data", "Zone name must be filled", 3000);
  }
}

function renderZonesTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblZones"></table>`);
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">ID</th>
        <th class="trn">Name</th>
        <th class="trn">Address</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if(data){
    data.forEach((zone, index) => {
      const { iZoneID, sZoneName, sZoneAddress } = zone;
      //console.log(typeof sZoneLatLong);
      //console.log(typeof JSON.parse(sZoneLatLong));
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${iZoneID}</td>
          <td>${sZoneName}</td>
          <td>${sZoneAddress}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateZoneModal btn-custom-small trn">Update</button>
            <button class="btn btn-custom bg-main-color btnInactiveZone btn-custom-small trn">Lock</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowUpdateZoneModal').last().click(function(){
        showUpdateZoneModal(zone)
      })
      $tbody.find('.btnInactiveZone').last().click(function(){
        inActiveZone(zone)
      })
    })
  } 
  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateZoneModal(zone){
  const { iZoneID, sZoneName } = zone;
  $('#txtUpdateZoneID').val(iZoneID);
  $('#txtUpdateZoneName').val(sZoneName);
  $('#modalUpdateZone').modal('show');
}

async function showZones(){
  let zones = await Service.getAllZones();
  if(zones){
    $('#totalZones').html(`<strong class="trn">Total Zones</strong>: ${zones.length}`);
    renderZoneOnJcombobox(zones);
    $('#pagingZonesControl').pagination({
      dataSource: zones,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (zones, pagination) {
        let $table = renderZonesTable(zones);
        $('.card-zone .table-responsive').html($table);
        setDefaultLang();
      }
    })
  } else{
    resetTblZone();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblZone(){
  $('#totalZones').html('');
  $('#pagingZonesControl').html('');
  $('#tblZones').find('tbody').html('');
}

function buildInsertZoneMap(){
  $mapArea = $('<div id="mapInsertZone" style="height: 450px"></div>');
  $('#modalInsertZone').find('.modal-body .insertZoneMap').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  mapInsertedZone = new google.maps.Map($(`#mapInsertZone`)[0], mapProp);
  let icon = '../img/Checked.png';

  google.maps.event.addListener(mapInsertedZone, 'click', function(event) {
    handleClickOnMapZone(event);
  });

  if(arrCurrentInsertedPointsZone.length > 0){
    arrCurrentInsertedPointsZone.forEach(point => {
      let lat = point[0];
      let lng = point[1];
      let pos = new google.maps.LatLng(lat, lng);
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mapInsertedZone);
    })
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
}

function handleClickOnMapZone(event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  //arrNewAddedPoints.push([lat, lng]);
  $('.latPoint').text(lat);  
  $('.longPoint').text(lng);  
  let icon = '../img/Checked.png';
  let marker = createMarkerGoogleMap(pos, icon);
  marker.setMap(mapInsertedZone);
  arrCurrentInsertedPointsZone.push([lat, lng]);
  //console.log(arrCurrentInsertedPointsZone);
  if(mapInsertedZone){
    if(currentPolygonZoneInsertMap)
    currentPolygonZoneInsertMap.setMap(null);
    drawPolygon(mapInsertedZone, arrCurrentInsertedPointsZone);
  }
}

function drawPolygon(map, latlngs){
  let path = latlngs.map(point => {
    return new google.maps.LatLng(point[0], point[1]);
  });
  currentPolygonZoneInsertMap = createPolygonGooglemap(path);
  currentPolygonZoneInsertMap.setMap(map);
}

function showInsertZoneModal(){
  $('#modalInsertZone').modal('show');
  setTimeout(() => {
    buildInsertZoneMap();
  }, 0);
}