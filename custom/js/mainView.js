
$(() => {

  $('#btnSendSMSGuards').click(sendSMSGuards);
  $('#btnShowModalSendSMSGuards').click(showModalSendSMSGuards)
  $('#btnAttendance').click(makeAttendance);
  $('#txtSearchGuardName').keyup(filterGuards);
  $('#selectGuardGroup').change(filterGuards)
  // showEventsInfo();
  showGuardGroups();
  showCurrentMapGuard();
  showGuardInfo();
})

const audioSOS = new Audio('../custom/audio/alert.wav');

let arrCurrentGuardsSentSMS = [];
let arrCurrentGuards = [];

function filterGuardByGroup(arr, groupID){
  if(groupID == 0) return arr;
  return arr.filter(g => g.iGuardGroupID == groupID)
}

function filterGuardByName(arr, value){
  value = removeUnicode(value);
  if(!Validation.checkEmpty(value)) return arr;
  return arr.filter(g => {
    let name = removeUnicode(g.sGuardName).toLowerCase();
    return name.indexOf(value.toLowerCase()) > -1
  });
}

function filterGuards(){
  let groupID = $('#selectGuardGroup').val();
  let name = $('#txtSearchGuardName').val();
  let arrFilterName = filterGuardByName(arrCurrentGuards, name);
  let filter = filterGuardByGroup(arrFilterName, groupID);
  renderGuardTable(filter);
}

async function makeAttendance(){
  if(arrCurrentGuardsSentSMS.length == 0)
    return showAlertError("You have not chosen guard", "Please choose at least 1", 4000);
  let sure = await showAlertWarning("Are you sure", "");
  if(sure){
    let arrID = arrCurrentGuardsSentSMS.map(g => g.iGuardId);
    let sentData = { iGuardID: arrID };
    let response = await Service.makeAttendance(sentData);
    console.log(response);
    showAlertSuccess("Successfully", "", 3000);
  }
}

async function sendSMSGuards(){
  let sMessageContent = $('#textareaSendSMSGuards').val();
  let arrID = [];
  arrCurrentGuardsSentSMS.forEach(g => arrID.push(g.iGuardId));
  let sentData = { sMessageContent, iGuardID: arrID };
  console.log(JSON.stringify(sentData));
  let response = await Service.sendSMSToGuards(sentData);
  console.log(response);
  showAlertSuccess("Send message successfully", "", 2000);
  $('#modalSendSMSGuards').modal('hide');
  resetSMSAfterSending();
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
    arrCurrentGuardsSentSMS.forEach(g => {
      const { sGuardName } = g;
      guardNames += `${sGuardName}, `;
    })
    guardNames = guardNames.substring(0, guardNames.length - 2);
    $('#guardNameList').text(guardNames);
    $('#modalSendSMSGuards').modal('show');
  }else{
    showAlertError("You have not chosen guard", "Please choose at least 1");
  }
  
}

async function showGuardInfo() {
  let data = await Service.getGuardsData();
  if(data){ 
    arrCurrentGuards = data.slice(); 
    filterGuards();
    renderJcombobox(data);
    let sosChecking = data.some(g => g.bOnline.toLowerCase() == 'sos');
    if(sosChecking){
      audioSOS.play();
      let sure = await showAlertWarning('There are SOS warning situations', "");
      audioSOS.pause();
    }
  }else{
    arrCurrentGuards.length = 0;
  }
}

function renderJcombobox(data) {
  if (data) {
    $('#selectGuardName').append('<option value="0">All</option>');
    data.forEach(guard => {
      $('#selectGuardName').append(`<option value="${guard.iGuardId}">${guard.sGuardName}</option>`)
    })
  }
}

function renderGuardTable(data) {
  let $table = $('#tblGuard')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">
        <input type="checkbox" class="checkbox-all-guards">
      </th>
      <th class="trn">No.</th>
      <th class="trn">Name</th>
      <th class="trn">Last visited</th>
      <th class="trn">Speed</th>
    </tr>
  `
  )
  
  if (data) {
    data.forEach(guard => {
      const { iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline } = guard
      let icon = '';
      let className = '';
      if(bOnline == 'SOS') {
        icon = '<i class="fa fa-exclamation-triangle" aria-hidden="true" style="color: red"></i>';
        className = 'red-text';
      }
      if(bOnline == 'Online') {
        icon = '<i class="fa fa-circle" aria-hidden="true" style="color: green"></i>';
        className = 'green-text';
      }

      $tbody.append(`
        <tr>
          <td class="trn">
            <input type="checkbox" class="checkbox-guard-sendSMS" data-idguard = "${iGuardId}">
          </td>
          <td>${iGuardId}</td>
          <td class="${className}">${icon} ${sGuardName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
        </tr>
      `)
      // ${bOnline}
      let $ele = $tbody.find('.checkbox-guard-sendSMS').last()
      $ele.change((e) => {
        let { checked } = e.target;
        if(!checked){
          $thead.find('.checkbox-all-guards').prop({'checked': false});
        }
        checkOneGuard(e, guard);
      })
      let cond = arrCurrentGuardsSentSMS.some(g => g.iGuardId == iGuardId);
      if(cond) $ele.prop({'checked': true});
    })
  }
  let $checkboxHead = $thead.find('.checkbox-all-guards')
  $checkboxHead.change((e) => {
    checkAllGuards(e);
    $tbody.find('.checkbox-guard-sendSMS').each((index, ele) => {
      let { checked } = e.target;
      if(checked){
        $(ele).prop({'checked': true});
      }else{
        $(ele).prop({'checked': false});
      }
    })
  })
  let l1 = arrCurrentGuardsSentSMS.length;
  let l2 = arrCurrentGuards.length;
  if(l1 == l2){
    $checkboxHead.prop({'checked': true});
  }else{
    $checkboxHead.prop({'checked': false});
  }

  $table.append($thead).append($tbody);
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
  arrCurrentGuardsSentSMS.length = 0;
  if(checked){
      arrCurrentGuards.forEach(guard => {
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
  let mymap = new google.maps.Map($('#mapid')[0], mapProp);
  if(data){
    data.forEach(guard => {
      let { dGuardLatCurrent, dGuardLongCurrent, dLastUpdateTime, sGuardName, bOnline
      } = guard;
      let mes = `${sGuardName} - ${dLastUpdateTime}`;
      let lat = Number(dGuardLatCurrent);
      let lng = Number(dGuardLongCurrent);
      let pos =  new google.maps.LatLng(lat,lng);
      if(bOnline.trim('').toLowerCase() == 'online'){
        let icon = '../img/Guard.png';
        let marker = createMarkerGoogleMap(pos, icon);
        marker.setMap(mymap);
        let infoWindow = createInfoWindowGoogleMap(mes);
        infoWindow.open(mymap, marker);
      }
      if(bOnline.trim().toLowerCase() == 'sos'){
        let icon = '../img/alert.png';
        let marker = createMarkerGoogleMap(pos, icon);
        marker.setMap(mymap);
        let infoWindow = createInfoWindowGoogleMap(mes);
        infoWindow.open(mymap, marker);
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





