
$(() => {

  $('#btnSendSMSGuards').click(sendSMSGuards);
  $('#btnShowModalSendSMSGuards').click(showModalSendSMSGuards)
  $('#btnAttendance').click(makeAttendance);
  $('#txtSearchGuardName').keyup(filterGuards);
  $('#selectGuardGroup').change(filterGuards)
  
  showGuardGroups();
  showCurrentMapGuard();
  showGuardInfo();

})

const audioSOS = new Audio('../custom/audio/alert.wav');

let arrCurrentGuardsSentSMS = [];
let arrCurrentGuards = [];
let arrFilterGuards = [];
let checkedAllGuardFilter = false;
let mainMapGuard = null;


function filterGuardByGroup(arr, groupID){
  if(groupID == 0) return arr;
  return arr.filter(g => g.iGuardGroupID == groupID)
}

function filterGuardByName(arr, value){
  if(!Validation.checkEmpty(value)) return arr;
  value = removeUnicode(value);
  return arr.filter(g => {
    let name = removeUnicode(g.sGuardName).toLowerCase();
    return name.indexOf(value.toLowerCase()) > -1
  });
}

function filterGuards(){
  let groupID = $('#selectGuardGroup').val();
  let name = $('#txtSearchGuardName').val();
  let arrFilterName = filterGuardByName(arrCurrentGuards, name);
  arrFilterGuards = filterGuardByGroup(arrFilterName, groupID);
  renderGuardTable(arrFilterGuards);
  if(checkedAllGuardFilter) {
    arrCurrentGuardsSentSMS.length = 0;
    arrFilterGuards.forEach(guard => {
      arrCurrentGuardsSentSMS.push(guard);
    })
  }
}

async function makeAttendance(){
  if(arrCurrentGuardsSentSMS.length == 0)
    return showAlertError("You have not chosen guard", "Please choose at least 1", 4000);
    let list = selectGuardWithOnlineOrSOS();
    if(list.length == 0) return showAlertError("No online guard is chosen!!", "Please choose guard online or sos");
  let sure = await showAlertWarning("Are you sure", "");
  if(sure){
    let arrID = list.map(g => g.iGuardId);
    let sentData = { iGuardID: arrID };
    let response = await Service.makeAttendance(sentData);
    console.log(response);
    showAlertSuccess("Successfully", "", 3000);
  }
}

async function sendSMSGuards(){
  let sMessageContent = $('#textareaSendSMSGuards').val();
  let arrID = [];
  let listOfGuardsToSendSMS = selectGuardWithOnlineOrSOS();
  if(listOfGuardsToSendSMS.length > 0){
    listOfGuardsToSendSMS.forEach(g => arrID.push(g.iGuardId));
    let sentData = { sMessageContent, iGuardID: arrID };
    console.log(JSON.stringify(sentData));
    let response = await Service.sendSMSToGuards(sentData);
    console.log(response);
    showAlertSuccess("Send message successfully", "", 2000);
    $('#modalSendSMSGuards').modal('hide');
    resetSMSAfterSending();
  } 
}

function selectGuardWithOnlineOrSOS(){
  return arrCurrentGuardsSentSMS.filter(g => {
    let { bOnline } = g;
    return bOnline.toLowerCase() == 'online' || bOnline.toLowerCase() == 'sos';
  })
}

function resetSMSAfterSending(){
  $('#tblGuard').find('tbody .checkbox-guard-sendSMS').prop({'checked': false});
  $('#tblGuard').find('thead .checkbox-all-guards').prop({'checked': false});
  arrCurrentGuardsSentSMS.length = 0;
}

function showModalSendSMSGuards(){
  if(arrCurrentGuardsSentSMS.length > 0){
    $('#textareaSendSMSGuards').val('');
    let guardNames = '';
    let listOfGuardsToSendSMS = selectGuardWithOnlineOrSOS();
    if(listOfGuardsToSendSMS.length == 0) return showAlertError("No guard is online!!!", "Please choose guard is online or sos");
    listOfGuardsToSendSMS.forEach(g => {
      const { sGuardName } = g;
      guardNames += `${sGuardName}, `;
    })
    guardNames = guardNames.substring(0, guardNames.length - 2);
    $('#guardNameList').text(guardNames);
    $('#modalSendSMSGuards').modal('show');
  } else{
    showAlertError("You have not chosen guard", "Please choose at least 1");
  }
  
}

function showNumOfGuardsTypes(total, online, sos){
  $('#totalNumOfGuard').html(`<strong class="trn">Totals</strong>: ${total}`);
  $('#totalNumOfGuardSOS').html(`<strong class="trn red-text">SOS</strong>: ${sos}`);
  $('#totalNumOfGuardOnline').html(`<strong class="trn green-text">Online</strong>: ${online}`);
}

async function showGuardInfo() {
  let data = await Service.getGuardsData();
  if(data){ 
    arrCurrentGuards = data.slice(); 
    let onlineNum = getNumOfOnline(data);
    let sosNum = getnumOfSOS(data);
    let total = data.length;
    showNumOfGuardsTypes(total, onlineNum, sosNum);
    setTimeout(() => {
      filterGuards();
    }, 100);
    showSOSNotification(data);
  } else {
    arrCurrentGuards.length = 0;
  }
  setDefaultLang();
}

async function showSOSNotification(guards){
  let sosChecking = guards.some(g => g.bOnline.toLowerCase() == 'sos');
  if(sosChecking){
    audioSOS.play();
    await showAlertWarning('There are SOS warning situations', "");
    audioSOS.pause();
  }
}

function renderGuardTable(data) {
  let $table = $('#tblGuard')
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(`
    <tr>
      <th class="trn">
        <input type="checkbox" class="checkbox-all-guards">
      </th>
      <th class="trn">#</th>
      <th class="trn text-left">Name</th>
      <th class="trn">Last login</th>
      <th class="trn">Speed (km/h)</th>
      <th class="trn">Idling Time(min)</th>
    </tr>
  `)
  let $checkboxHead = $thead.find('.checkbox-all-guards');
  if (data) {
    data.forEach((guard, index) => {
      const { iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline, iIdlingTime } = guard
      let icon = '';
      let className = '';
      if(bOnline == 'SOS') {
        icon = '<i class="fa fa-exclamation-triangle red-text" aria-hidden="true"></i>';
        className = 'red-text';
      }else if(bOnline == 'Online') {
        icon = '<i class="fa fa-circle green-text" aria-hidden="true"></i>';
        className = 'green-text';
        if(Number(dSpeedCurrent) < 3) className = `orange-text`
      }
      
      $tbody.append(`
        <tr>
          <td class="trn">
            <input type="checkbox" class="checkbox-guard-sendSMS">
          </td>
          <td>${index + 1}</td>
          <td class="text-left ${className}">${icon} ${sGuardName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
          <td>${iIdlingTime}</td>
        </tr>
      `)
      let $ele = $tbody.find('.checkbox-guard-sendSMS').last();
      $ele.change(e => {
        let { checked } = e.target;
        if(!checked){
          $checkboxHead.prop({'checked': false});
          checkedAllGuardFilter = false;
        }else{
          showOneCurrentGuardOnMap(guard);
        }
        checkOneGuard(e, guard);
      })
      if(!checkedAllGuardFilter){
        let cond = arrCurrentGuardsSentSMS.some(g => g.iGuardId == iGuardId);
        if(cond) $ele.prop({'checked': true});
      }
    })
  }
  $checkboxHead.change(e => { 
    checkAllGuards(e) 
    let { checked } = e.target;
    $tbody.find('.checkbox-guard-sendSMS').prop({'checked': checked});
  })
  if(checkedAllGuardFilter) {
    $checkboxHead.prop({'checked': true});
    $tbody.find('.checkbox-guard-sendSMS').prop({'checked': true});
  }
  else $checkboxHead.prop({'checked': false});
  $table.append($thead).append($tbody);
}

function showOneCurrentGuardOnMap(guard){
  let { dGuardLatCurrent, dGuardLongCurrent, bOnline } = guard;
  let cond = bOnline.toLowerCase() == 'online' || bOnline.toLowerCase() == 'sos';
  if(mainMapGuard && cond){
    console.log(guard); 
    let lat = Number(dGuardLatCurrent);
    let lng = Number(dGuardLongCurrent);
    mainMapGuard.setCenter(new google.maps.LatLng(lat, lng));
    mainMapGuard.setZoom(18);
  }
}

function checkOneGuard(e, guard){
  let { checked } = e.target;
  let { iGuardId } = guard;
  if(checked){
    arrCurrentGuardsSentSMS.push(guard);
  }else{
    let index = arrCurrentGuardsSentSMS.findIndex(g => g.iGuardId == iGuardId);
    arrCurrentGuardsSentSMS.splice(index, 1);
  }
}

function checkAllGuards(e){
  let { checked } = e.target;
  checkedAllGuardFilter = checked;
  arrCurrentGuardsSentSMS.length = 0;
  if(checked){
      arrFilterGuards.forEach(guard => {
      arrCurrentGuardsSentSMS.push(guard);
    })
  }
}

async function showCurrentMapGuard(){
  let data = await Service.getGuardsData();
  if(data) buildCurrentMapGuard(data);
}

function buildCurrentMapGuard(data){
  $mapArea = $('<div class="map guard-map" id="mapid"></div>');
  $('.card-map-guard').find('.card-body').html($mapArea);
  let mapProp = {
    center: new google.maps.LatLng(20.81715284, 106.77411238),
    zoom: 15,
  };
  mainMapGuard = new google.maps.Map($('#mapid')[0], mapProp);
  if(data){
    data.forEach(guard => {
      let { dGuardLatCurrent, dGuardLongCurrent, sGuardName, bOnline
      } = guard;
      let mes = `${sGuardName}`;
      let lat = Number(dGuardLatCurrent);
      let lng = Number(dGuardLongCurrent);
      let pos =  new google.maps.LatLng(lat,lng);
      if(bOnline.trim('').toLowerCase() == 'online'){
        let icon = '../img/Guard.png';
        let marker = createMarkerGoogleMap(pos, icon);
        marker.setMap(mainMapGuard);
        let infoWindow = createInfoWindowGoogleMap(mes);
        infoWindow.open(mainMapGuard, marker);
      }
      if(bOnline.trim().toLowerCase() == 'sos'){
        let icon = '../img/alert.png';
        let marker = createMarkerGoogleMap(pos, icon);
        marker.setMap(mainMapGuard);
        let infoWindow = createInfoWindowGoogleMap(mes);
        infoWindow.open(mainMapGuard, marker);
      }
    })
  }
}

async function showGuardGroups(){
  let data = await Service.getGroup();
  $('#selectGuardGroup').html('');
  $('#selectGuardGroup').append(`<option value="0">All</option>`)
  if(data){
    data.forEach(group => {
      const { iGuardGroupID, sGroupName } = group;
      $('#selectGuardGroup').append(`<option value="${iGuardGroupID}">${sGroupName}</option>`);
    })
  }
}

function renderGuardJcombobox(data) {
  $('#selectGuardName').html()
  if (data) {
    $('#selectGuardName').append('<option value="0">All</option>');
    data.forEach(guard => {
      $('#selectGuardName').append(`<option value="${guard.iGuardId}">${guard.sGuardName}</option>`)
    })
  }
}

function getNumOfOnline(data){
  let onlineNum = data.filter(g => g.bOnline.toLowerCase() == 'online').length;
  return onlineNum;
}

function getnumOfSOS(data){
  let sosNum = data.filter(g => g.bOnline.toLowerCase() == 'sos').length;
  return sosNum
}





