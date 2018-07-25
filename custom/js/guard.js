$(() => {
  $('#formUpdateGuard').submit((e) => {
    e.preventDefault();
    updateGuard();
  });
  $('#formInsertGuard').submit(e => {
    e.preventDefault();
    insertGuard();
  });
  $('#btnShowGuardInsertModal').click(showGuardModalInsert);
  $('#btnSendMessageGuard').click(sendMessageGuard);
  showGuards();
})

var currentSendMessageGuard = null;

async function insertGuard(){
  let name = $('#txtInsertGuardName').val();
  let phone = $('#txtInsertGuardPhone').val();
  let username = $('#txtInsertGuardUsername').val();
  let password = $('#txtInsertGuardPassword').val();
  if(checkValidation(name, username, phone, password)){
    let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: password, iGuardIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertGuard(sentData);
    console.log(response);
    $('#modalInsertGuard').modal('hide');
    showAlertSuccess("Insert successfully!", "", 2000);
    showGuards();
  }
}

function checkValidation(name, username, phone, password){
  let valid = true;
  let errMsg = '';
  if(name == null || name.trim() == ''){
    valid = false;
    errMsg += 'Name must be filled in\n'
  } 
  if(username == null || username.trim() == ''){
    valid = false;
    errMsg += 'Username must be filled in\n'
  } 
  if(!/^[0-9]+$/.test(phone)){
    valid = false;
    errMsg += 'Phone must be number\n'
  } 
  if(password.trim().length < 4){
    valid = false;
    errMsg += 'Password must be longer than 4\n'
  } 
  if(!valid){
    showAlertError("Invalid data!", errMsg);
  }
  return valid;
}

async function updateGuard(){
  let id = $('#txtUpdateGuardID').val();
  let name = $('#txtUpdateGuardName').val();
  let phone = $('#txtUpdateGuardPhone').val();
  let username = $('#txtUpdateGuardUsername').val();
  if(checkValidation(name, username, phone, 'password')){
    let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 2 };
    let response = await Service.updateGuard(sentData);
    console.log(response);
    showAlertSuccess("Updated successfully!", "", 2000);
    showGuards();
  }
}

async function inActiveGuard(id){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    let sentData = { sGuardNameIN: 0, sGuardPhone: 0, sGuardUsername: 0, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 3 };
    let response = await Service.inActiveGuard(sentData);
    console.log(response);
    showAlertSuccess("Inactive successfully!", "", 2000);
    showGuards();
  }
}

function renderGuardTable(guards){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblGuards"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Phone</th>
      <th class="trn">Username</th>
      <th class="trn">Active</th>
    </tr>
  `
  )
  if (guards) {
    guards.forEach(guard => {
      const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
      $tbody.append(`
        <tr>
          <td>${iGuardID}</td>
          <td>${sGuardName}</td>
          <td>${sGuardPhone}</td>
          <td>${sGuardUserName}</td>
          <td>${bActive}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnInactiveGuard trn">Lock</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item btnShowUpdateGuardModal trn">Update</button>
                <button class="btn btn-custom btn-warning btn-custom-small dropdown-item btnShowModalResetPassword trn">Reset Password</button>
                <button class="btn btn-custom btn-primary btn-custom-small dropdown-item btnShowModalSendMessage trn">Send Message</button>
                <button class="btn btn-custom btn-success btn-custom-small dropdown-item btnShowMapGuardCurrentPos trn">View map</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnInactiveGuard').last().click(() => {
          inActiveGuard(iGuardID);
      })
      $tbody.find('.btn.btnShowUpdateGuardModal').last().click(() => {
        showGuardModalUpdate(guard);
      })
      $tbody.find('.btn.btnShowModalResetPassword').last().click(() => {
        showGuardModalResetPass(guard);
      })
      $tbody.find('.btn.btnShowModalSendMessage').last().click(() => {
        showModalSendMessage(guard);
      })
      $tbody.find('.btn.btnShowMapGuardCurrentPos').last().click(() => {
        showModalGuardCurrentPos(guard);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showModalGuardCurrentPos(guard){
  let { iGuardID } = guard;
  buildCurrentPosGuardMap(iGuardID);
  $('#modalShowMapGuardCurrentPos').modal('show');
}

function showModalSendMessage(guard){
  const { iGuardID, sGuardName } = guard;
  currentSendMessageGuard = guard;
  $('#txtSendMessageGuardName').val(sGuardName);
  $('#textAreaSendMessage').val('')
  $('#modalSendMessageGuard').modal('show');
}

async function sendMessageGuard(){
  const { iGuardID } = currentSendMessageGuard;
  let sMessageContent = $('#textAreaSendMessage').val();
  let sentData = { iGuardID: [iGuardID], sMessageContent };
  let response = await Service.sendMessageGuard(sentData);
  console.log(response);
  $('#modalSendMessageGuard').modal('hide');
  showAlertSuccess("Send successfully!", "", 2000);
}

function showGuardModalResetPass(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
}

function showGuardModalUpdate(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
  $('#txtUpdateGuardID').val(iGuardID);
  $('#txtUpdateGuardPhone').val(sGuardPhone);
  $('#txtUpdateGuardName').val(sGuardName);
  $('#txtUpdateGuardUsername').val(sGuardUserName);
  $('#modalUpdateGuard').modal('show');
}

function showGuardModalInsert(){
  $('#formInsertGuard')[0].reset();
  $('#modalInsertGuard').modal('show');
}

async function showGuards(){
  let guards = await Service.getPersonalGuardsInfo();
  if(guards){
    console.log(guards)
    $('#totalGuards').html(`<strong class="trn">Total Guards</strong>:  ${guards.length}`);
    $('#pagingGuardsControl').pagination({
      dataSource: guards,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (guards, pagination) {
        let $table = renderGuardTable(guards);
        $('.card-guard .table-responsive').html($table);
      }
    })
  }else{
    resetTblPersonalGuardInfo();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblPersonalGuardInfo(){
  $('#totalGuards').html('');
  $('#pagingGuardsControl').html('');
  $('#tblGuards').find('tbody').html('');
}

async function buildCurrentPosGuardMap(iGuardID, sCheckingCode){
  let $mapArea = $('<div id="guardCurrentPosMapArea" style="widht:100%; height:400px"></div>');
  $('#modalShowMapGuardCurrentPos').find('.modal-body').html($mapArea);
  let sentGuardData = { iGuardID };
  let guardGPSCurrent = await Service.getGuardGPSCurrent(sentGuardData);
  console.log(guardGPSCurrent);
  const { dGuardLatCurrent, dGuardLongCurrent, sMessage, bOnline } = guardGPSCurrent[0];
  let latGuard = Number(dGuardLatCurrent);
  let lngGuard = Number(dGuardLongCurrent);
  let mapProp = createMapPropGoogleMap(18, latGuard, lngGuard)
  let mymap = new google.maps.Map($('#guardCurrentPosMapArea')[0], mapProp);
  
  let urlGuard = '../img/Guard.png';
  console.log(latGuard);
  console.log(lngGuard)
  let mainPos = new google.maps.LatLng(latGuard, lngGuard);
  let guardMarker = createMarkerGoogleMap(mainPos, urlGuard);

  guardMarker.setMap(mymap);
  let infoWindowGuard = createInfoWindowGoogleMap(sMessage);
  infoWindowGuard.open(mymap, guardMarker);
  if(sCheckingCode){
    const pointChekingSentData = { iGuardID, sCheckingCode };
    let checkingPointData = await Service.getPointChecking(pointChekingSentData);
    if(checkingPointData){
      checkingPointData.forEach(checkedPoint => {
        let { Lat, Long, Status, Message, ImageUrl } = checkedPoint;
        let url = '';
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
        let pos = new google.maps.LatLng(Lat, Long);
        let marker = createMarkerGoogleMap(pos, url);
        marker.setMap(mymap);
        let mes = Message;
        if(Status == 4){
          mes = `${Message}<br><img src="${APP_DOMAIN}${ImageUrl}" class="img-fluid">`
          let infoWindow = createInfoWindowGoogleMap(mes);
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(mymap, marker);
          });
        }else{
          let infoWindow = createInfoWindowGoogleMap(mes);
          infoWindow.open(mymap, marker);
        }
      })
    }
  }
}

