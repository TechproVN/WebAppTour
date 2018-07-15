$(() => {
  
  $('#btnPointsData').click(showPointsData);
  $('#btnMapAllPoints').click(function(){
    showPointsMap()
  })
  $('#btnShowInsertPointModal').click(showInsertPointModal);
  $('#btnUpdatePoint').click(updatePoint);
  $('#btnInsertPoint').click(insertPoint);

  showAllZones();
  
})

var arrNewAddedPoints = [];
var arrCurrentPointsOnZone = [];
var arrZones = [];
let currentUpdatedPoint = null;

async function showAllZones() {
  let data = await Service.getAllZones();
  arrZones = [];
  if(data) arrZones = data;
  renderZoneOnJcombobox(data);
  showPointsData();
}

function renderZoneOnJcombobox(data) {
  if (data) {
    for(let i = 0; i < $('.selectZones').length; i++){
      $('.selectZones').eq(i).html('');
      data.forEach(zone => {
        $('.selectZones').eq(i).append(`<option value="${zone.iZoneID}">${zone.sZoneName}</option>`)
      })
    }
  }
}

function renderPointsTable(data) {
  // let $table = $('#tblPoints');
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblPoints"></table>`)
  // $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">ID</th>
        <th class="trn">Zone</th>
        <th class="trn">Name</th>
        <th class="trn">Note</th>
        <th class="trn">GPS</th>
        <th class="trn">QRCode</th>
        <th class="trn">RFID</th>
        <th class="trn">Datetime updated</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((point) => {
      const {sZoneName, sPointCode, dDateTimeAdd, iPointID, sPointName, sPointNote, iGPS, iQRCode, iRFID} = point;
      $tbody.append(`
        <tr>
          <td>${iPointID}</td>
          <td>${sZoneName}</td>
          <td>${sPointName}</td>
          <td>${sPointNote}</td>
          <td>${iGPS}</td>
          <td>${iQRCode}</td>
          <td>${iRFID}</td>
          <td>${dDateTimeAdd}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Action
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-info btnPointUpdate btn-custom-small dropdown-item">Update</button>
                <button class="btn btn-custom btn-danger btnPointDelete btn-custom-small dropdown-item" style="margin-left:-5px">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnPointUpdate').last().click(function(){
        showUpdatePointModal(point);
      })
      $tbody.find('.btn.btnPointDelete').last().click(function(){
        inActivePoint(point);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function buildPointsMap(points, id){
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#${id}`)[0], mapProp);
  let icon = '../img/Checked.png';

  google.maps.event.addListener(mymap, 'click', function(event) {
    handleClickPointMap(mymap, event);
  });

  //show all points
  if(points && points.length > 0){
    points.forEach(point => {
      const { iPointID, dPointLat, dPointLong, iQRCode, iRFID } = point;
      let type = checkPointType(iQRCode, iRFID);
      let mes = `ID: ${iPointID} - ${type}`;
      let lat = Number(dPointLat);
      let lng = Number(dPointLong)
      let pos = new google.maps.LatLng(lat, lng);
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function checkPointType(QRCode, RFID){
  if(QRCode != '') return 'QRCode';
  if(RFID != '') return 'RFID';
  return 'GPS';
}

function handleClickPointMap(mymap, event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  let mes = `${lat} - ${lng}`;
  $('.latPoint').text(lat);  
  $('.longPoint').text(lng);  
  let icon = '../img/Checked.png';
  let marker = createMarkerGoogleMap(pos, icon);
  marker.setMap(mymap);
}

function showPointsMap(){
  let $mapArea = $('<div id="mapPoint" class="mymap" style="height:450px"></div>'); 
  $('#modalMapPoint').find('.modal-body').html($mapArea);
  $('#modalMapPoint').modal('show');
  setTimeout(() => {
    buildPointsMap(arrCurrentPointsOnZone, 'mapPoint');
  }, TIME_OUT_SHOW_MAP_ON_MODAL);
}

async function showPointsData() {
  let zoneId = $('#jcomboboxZone').val();
  if(zoneId){
    let sentData = { iZoneID: zoneId };
    let data = await Service.getPointsDataOnZone(sentData);
    arrCurrentPointsOnZone = [];
    if(data) {
      arrCurrentPointsOnZone = [...data];
      $('#totalPoints').html(`<strong>Total Points:</strong> ${data.length}`)
      $('#pagingPointsControl').pagination({
        dataSource: data,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
          // template method of yourself
          let $table = renderPointsTable(data);
          $('.card-points .table-responsive').html($table);
        }
      })
    }else{
      resetTblPoints();
      showAlertError("No data available", "", 3000);
    }
  }
}

function resetTblPoints(){
  $('#totalPoints').html('');
  $('#pagingPointsControl').html('');
  $('#tblPoints').find('tbody').html('');
}

function showInsertPointModal(){
  currentUpdatedPoint = null;
  let $mapArea = $('<div id="mapPointInsert" class="mymap"></div>'); 
  $('#insertPointMap').html($mapArea);
  $('#latInsertPoint').text('');
  $('#longInsertPoint').text('');
  $('#txtInsertPointCode').val('');
  $('#txtInsertPointName').val('');
  $('#txtInsertPointNote').val('');
  $('#modalInsertPoint').modal('show');
  setTimeout(() => {
    buildPointsMap(arrCurrentPointsOnZone, 'mapPointInsert');
  }, TIME_OUT_SHOW_MAP_ON_MODAL);
}

function showUpdatePointModal(point){
  const {iPointID, dPointLat, dPointLong, sPointName, sPointNote, iQRCode, iRFID, sPointCode } = point
  currentUpdatedPoint = Object.assign({}, point);
  let $mapArea = $('<div id="mapPointUpdate" class="mymap"></div>'); 
  $('#updatePointMap').html($mapArea);
  let lat = Number(dPointLat);
  let lng = Number(dPointLong);
  let pointCode = '';
  if(iQRCode.trim() == '' && iRFID.trim() == ''){
    $('#txtUpdatepointCode').attr({'disabled': true});
    currentUpdatedPoint.GPS = true;
  }else{
    $('#txtUpdatepointCode').attr({'disabled': false});
    pointCode = sPointCode
    currentUpdatedPoint.GPS = false;
  }
  console.log(sPointCode);
  $('#txtUpdatepointCode').val(pointCode);
  $('#txtUpdatePointNote').val(sPointNote);
  $('#txtUpdatePointName').val(sPointName);
  $('#latUpdatePoint').text(dPointLat);
  $('#longUpdatePoint').text(dPointLong);
    
  $('#modalUpdatePoint').modal('show');
  setTimeout(() => {
    buildPointsMap([point], 'mapPointUpdate');
  }, TIME_OUT_SHOW_MAP_ON_MODAL);
}

async function inActivePoint(point){
  //delete point here
  const {  iPointID } = point;
  let sure = await showAlertWarning("Are you sure!", "");
  if(sure){
    let zoneId = $('#selectZoneInsertPoint').val();
    let sentData = { iPointIDIN: iPointID, bStatusIN: 3, iZoneIDIN: zoneId,  sPointCodeIN: 0, dGPSLatIN: 0, dGPSLongIN: 0 };
    // {"iPointIDIN":"78","bStatusIN":4,"iZoneIDIN":null,"sPointCodeIN":null,"dGPSLatIN":null,"dGPSLongIN": null}
    console.log(JSON.stringify(sentData))
    let response = await Service.inActivePoint(sentData);
    console.log(response);
    showPointsData();
    showAlertSuccess("Lock successfully!", "", 2000);
  }
}

async function updatePoint(){
  let { iPointID, iZoneID, GPS, iQRCode, iRFID } = currentUpdatedPoint;
  let lat = Number($('#latUpdatePoint').text());
  let lng = Number($('#longUpdatePoint').text());
  let pointCode = $('#txtUpdatepointCode').val();
  let name = $('#txtUpdatePointName').val();
  let note = $('#txtUpdatePointNote').val();
  // sPointNameIN   sPointNoteIN
  if(checkValidInsertPoint(name, note)){
    let sentData;
    if(!GPS){
      if(!Validation.checkEmpty(pointCode)) return showAlertError("Point code is empty", "Please fill in", 6000);
      if(iQRCode != '') {
        sQRCodeIN = pointCode;
        sRFIDCodeIN = 0;
      }
      else {
        sRFIDCodeIN = pointCode;
        sQRCodeIN = 0;
      }
      sentData = { 
        bStatusIN: 2, 
        dGPSLatIN: lat, 
        dGPSLongIN: lng, 
        sQRCodeIN,
        sRFIDCodeIN,
        sPointNameIN: name,
        sPointNoteIN: note,
        iPointIDIN: iPointID, 
        iZoneIDIN: iZoneID,
      };
    } else{
      sentData = { 
        bStatusIN: 2, 
        dGPSLatIN: lat, 
        dGPSLongIN: lng, 
        sQRCodeIN: 0,
        sRFIDCodeIN: 0,
        sPointNameIN: name,
        sPointNoteIN: note,
        iPointIDIN: iPointID, 
        iZoneIDIN: iZoneID 
      };
    }
    console.log(JSON.stringify(sentData));
    let response = await Service.updatePoint(sentData);
    console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    
    if(Result == '1'){
      showPointsData();
      showAlertSuccess("Update successfully!", "", 3000);
    } else{
      showAlertError("Update unsuccessfully", Msg, 6000);
    }
  }
}

async function insertPoint(){
  let lat = $('#latInsertPoint').text();
  let lng = $('#longInsertPoint').text();
  let zoneId = $('#selectZoneInsertPoint').val();
  let pointCode = $('#txtInsertPointCode').val();
  let name = $('#txtInsertPointName').val();
  let note = $('#txtInsertPointNote').val();
  let radio = $('#modalInsertPoint').find('input[name="radioIPChecked"]');
  let sentData = null;
  console.log(lat);
  if(checkValidInsertPoint(name, note)){
    if(lat.trim() == '' || lng.trim() == '') 
        return showAlertError("Invalid data", "You have not chosen point on map", 3000);
    if(radio[0].checked){
        console.log('qrcode');
      sentData = { dGPSLatIN: Number(lat), dGPSLongIN: Number(lng), iZoneIDIN: zoneId, sQRCodeIN: pointCode, sRFIDCodeIN: 0, bStatusIN: 1, iPointIDIN: 0, sPointNameIN: name, sPointNoteIN: note };
    } else if(radio[1].checked){
      sentData = { dGPSLatIN: Number(lat), dGPSLongIN: Number(lng), iZoneIDIN: zoneId, sRFIDCodeIN: pointCode, sQRCodeIN: 0, bStatusIN: 1, iPointIDIN: 0, sPointNameIN: name, sPointNoteIN: note };
    }else{
      sentData = { dGPSLatIN: Number(lat), dGPSLongIN: Number(lng), iZoneIDIN: zoneId, bStatusIN: 1, iPointIDIN: 0, sPointNameIN: name, sPointNoteIN: note, sQRCodeIN: 0, sRFIDCodeIN: 0 }; 
    }
    console.log(JSON.stringify(sentData));
    let response = await Service.insertPoint(sentData);
    console.log(response);
    let { Result, Msg } = JSON.parse(response)[0];
    console.log(Result);
    if(Result == '1'){
      showAlertSuccess("Insert successfully!", "", 2000); 
      showPointsData();
      $('#modalInsertPoint').modal('hide');
    } else{
      showAlertError("Insert unsuccessfully", Msg, 6000);
    }
    // iZoneIDIN      dGPSLatIN    dGPSLongIN   iPointIDIN   bStatusIN   sPointNameIN   sPointNoteIN
  }
}

function checkValidInsertPoint(name, note){
  let valid = true;
  let msgErr = '';
  if(!Validation.checkEmpty(name)){
    msgErr += 'Point name must be filled\n'
    valid = false;
  }
  if(!Validation.checkEmpty(note)){
    msgErr += 'Point note must be filled\n'
    valid = false;
  }
  if(!valid){
    showAlertError("Invalid data", msgErr, 3000);
  }
  return valid;
}
