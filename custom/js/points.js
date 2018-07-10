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
  console.log(data);
  renderZoneOnJcombobox(data);
  showPointsData();
}

function renderZoneOnJcombobox(data) {
  console.log(data);
  
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
        <th class="trn">Zone</th>
        <th class="trn">ID</th>
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
          <td>${sZoneName}</td>
          <td>${iPointID}</td>
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
  let mapProp = {
    center: new google.maps.LatLng(20.81715284, 106.77411238),
    zoom: 14,
  };
  let mymap = new google.maps.Map($(`#${id}`)[0], mapProp);
  let icon = '../img/Checked.png';

  google.maps.event.addListener(mymap, 'click', function(event) {
    handleClickPointMap(mymap, event);
  });

  //show all points
  if(points && points.length > 0){
    points.forEach(point => {
      const { iPointID, dPointLat, dPointLong } = point;
      let mes = `ID: ${iPointID}`;
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
  let $mapArea = $('<div id="mapPoint" class="mymap" style="height:400px"></div>'); 
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
    console.log(data);
    if(data) arrCurrentPointsOnZone = [...data];
    else arrCurrentPointsOnZone = [];
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
  }
}

function showInsertPointModal(){
  currentUpdatedPoint = null;
  let $mapArea = $('<div id="mapPointInsert" class="mymap"></div>'); 
  $('#insertPointMap').html($mapArea);
  $('#modalInsertPoint').modal('show');
  setTimeout(() => {
    buildPointsMap(arrCurrentPointsOnZone, 'mapPointInsert');
  }, TIME_OUT_SHOW_MAP_ON_MODAL);
}

function showUpdatePointModal(point){
  const {iPointID, sPointCode, sZoneName, dPointLat, dPointLong, dDateTimeAdd, sPointName, sPointNote } = point
  currentUpdatedPoint = point;
  let $mapArea = $('<div id="mapPointUpdate" class="mymap"></div>'); 
  $('#updatePointMap').html($mapArea);

  let lat = Number(dPointLat);
  let lng = Number(dPointLong);
  $('#txtUpdatepointCode').val(sPointCode);
  $('#txtUpdatePointNote').val(sPointNote);
  $('#txtUpdatePointName').val(sPointName);
  if(lat == 0 && lng == 0){
    $('#latUpdatePoint').text('');
    $('#longUpdatePoint').text('');
    $('#txtUpdatepointCode').attr({'disabled': false});
    currentUpdatedPoint.GPS = false;
  }else{
    $('#latUpdatePoint').text(dPointLat);
    $('#longUpdatePoint').text(dPointLong);
    $('#txtUpdatepointCode').attr({'disabled': true});
    currentUpdatedPoint.GPS = true;
  }
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
    let sentData = {iPointIDIN: iPointID, bStatusIN: 4, iZoneIDIN: 0,  sPointCodeIN: 0, dGPSLatIN: 0, dGPSLongIN: 0};
    // {"iPointIDIN":"78","bStatusIN":4,"iZoneIDIN":null,"sPointCodeIN":null,"dGPSLatIN":null,"dGPSLongIN":null}
    console.log(JSON.stringify(sentData))
    let response = await Service.inActivePoint(sentData);
    console.log(response);
    showPointsData();
    showAlertSuccess("Lock successfully!", "", 2000);
  }
}

async function updatePoint(){
  let { iPointID, iZoneID, GPS } = currentUpdatedPoint;
  let lat = Number($('#latUpdatePoint').text());
  let lng = Number($('#longUpdatePoint').text());
  let pointCode = $('#txtUpdatepointCode').val();
  let sentData;
  if(!GPS){
    sentData = { 
      bStatusIN: 2, 
      dGPSLatIN: 0, 
      dGPSLongIN: 0, 
      sPointCodeIN: pointCode, 
      iPointIDIN: iPointID, 
      iZoneIDIN: iZoneID
    };
  }else{
    sentData = { 
      bStatusIN: 3, 
      dGPSLatIN: lat, 
      dGPSLongIN: lng, 
      sPointCodeIN: pointCode, 
      iPointIDIN: iPointID, 
      iZoneIDIN: iZoneID 
    };
  }
  let response = await Service.updatePoint(sentData);
  showPointsData();
  console.log(response);
  showAlertSuccess("Update successfully!", "", 2000);
}

async function insertPoint(){
  let lat = $('#latInsertPoint').text();
  let lng = $('#longInsertPoint').text();
  let zoneId = $('#selectZoneInsertPoint').val();
  let pointCode = $('#txtInsertPointCode').val();
  let name = $('#txtInsertPointName').val();
  let note = $('#txtInsertPointNote').val();
  let radio = $('#modalInsertPoint').find('input[name="radioGPS"]');
  var sentData = null;
  if(!radio[0].checked && !radio[1].checked)
    return showAlertError("Invalid data", "You have to check GPS or QRCode", 3000);
  if(checkValidInsertPoint(name, note)){
    if(radio[0].checked){
      if(lat.trim() == '' || lng.trim() == '') 
        return showAlertError("Invalid data", "You have not chosen point on map", 3000);
      sentData = { dGPSLatIN: Number(lat), dGPSLongIN: Number(lng), iZoneIDIN: zoneId, sPointCodeIN: 0, bStatusIN: 1, iPointIDIN: 0 };
    }else if(radio[1].checked){
      if(pointCode.trim() == '') return showAlertError("Invalid data", "Point code must be filled", 3000);
      sentData = { dGPSLatIN: 0, dGPSLongIN: 0, iZoneIDIN: zoneId, sPointCodeIN: pointCode, bStatusIN: 1, iPointIDIN: 0 };
    }
    let data = await Service.insertPoint(sentData);
    showPointsData();
    console.log(data);
    showAlertSuccess("Insert successfully!", "", 2000); 
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
