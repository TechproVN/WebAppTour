
$(() => {

  $('#btnSendSMSGuards').click(sendSMSGuards);
  $('#btnShowModalSendSMSGuards').click(showModalSendSMSGuards)
  showGuardInfo();
  showEventsInfo();
  showCurrentMapGuard();
  
})

let arrCurrentGuardsSentSMS = [];
let arrCurrentGuards = [];

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
    arrCurrentGuards = data;
    renderGuardTable(data);
    renderJcombobox(data);
  }else{
    arrCurrentGuards = [];
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
        <input type="checkbox" class="custom-checkbox checkbox-all-guards">
      </th>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Last visted</th>
      <th class="trn">Speed</th>
      <th class="trn">Status</th>
    </tr>
  `
  )
  
  if (data) {
    data.forEach(guard => {
      const { iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline } = guard
      let className = '';
      if(bOnline == 'SOS') className = 'red-text';
      if(bOnline == 'Online') className = 'green-text';
      $tbody.append(`
        <tr>
          <td class="trn">
            <input type="checkbox" class="custom-checkbox checkbox-guard-sendSMS" data-idguard = "${iGuardId}">
          </td>
          <td>${iGuardId}</td>
          <td>${sGuardName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
          <td class="${className}">${bOnline}</td>
        </tr>
      `)
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

function renderEventsTable(data) {
  let $table = $('#tblEvents')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Code</th>
      <th class="trn">Zone</th>
      <th class="trn">Name</th>
      <th class="trn">Date</th>
      <th class="trn">Started</th>
      <th class="trn">Finished</th>
      <th class="trn">Completion time</th>
      <th class="trn">Current</th>
      <th class="trn">Distance</th>
    </tr>
  `
  )
  if (data) {
    data.forEach(event => {
      $tbody.append(`
        <tr>
          <td>${event.sCheckingCode}</td>
          <td>${event.sZoneName}</td>
          <td>${event.sGuardName}</td>
          <td>${event.dDateTimeIntinial}</td>
          <td>${event.dDateTimeStart}</td>
          <td>${event.dDateTimeEnd}</td>
          <td>${event.iTimeComplete}</td>
          <td>${event.iTimeCurrent}</td>
          <td>${event.dDistance}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
}

async function showEventsInfo() {
  let data = await Service.getEventsData();
  if (data) renderEventsTable(data);
}

async function showCurrentMapGuard(){
  let data = await Service.getGuardsData();
  if(data) buildCurrentMapGuard(data);
}

function buildCurrentMapGuard(data){
  $mapArea = $('<div class="map" id="mapid" style="height: 350px"></div>');
  $('.card-map-guard').find('.card-body').html($mapArea);
  var mymap = L.map('mapid').setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(mymap);

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });

  var Alert = new LeafIcon({
       iconUrl: '../img/alert.png'
    });
 
  var Guard = new LeafIcon({
       iconUrl: '../img/Guard.png'
    });

  L.icon = function (options) {
    return new L.Icon(options);
  };
  if(data){
    data.forEach(guard => {
      let {dGuardLatCurrent, dGuardLongCurrent, dLastUpdateTime, sGuardName, bOnline
      } = guard;
      let mes = `${sGuardName} - ${dLastUpdateTime}`;
      let pos = [Number(dGuardLatCurrent), Number(dGuardLongCurrent)];
      if(bOnline.trim('').toLowerCase() == 'online'){
        L.marker(pos, {
          icon: Guard
        }).bindTooltip(mes, {
          permanent: true,
          interactive: true
        }).addTo(mymap);
      }
      if(bOnline.trim().toLowerCase() == 'sos'){
        console.log('sos')
        L.marker(pos, {
          icon: Alert
        }).bindTooltip(mes, {
          permanent: true,
          interactive: true
        }).addTo(mymap);
      }
    })
  }
}

