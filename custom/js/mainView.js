$(() => {

  showGuardInfo();
  showEventsInfo();
  showCurrentMapGuard();
  
})

async function showGuardInfo() {
  let data = await Service.getGuardsData();
  if(data){ 
    renderGuardTable(data);
    renderJcombobox(data);
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
      const {iGuardId, sGuardName, dLastUpdateTime, dSpeedCurrent, bOnline} = guard
      let className = '';
      if(bOnline == 'SOS') className = 'red-text';
      if(bOnline == 'Online') className = 'green-text';
      $tbody.append(`
        <tr>
          <td>${iGuardId}</td>
          <td>${sGuardName}</td>
          <td>${dLastUpdateTime}</td>
          <td>${dSpeedCurrent}</td>
          <td class="${className}">${bOnline}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
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

