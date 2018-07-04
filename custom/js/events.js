$(() => {

  //bind event click view to show event history
  $('#btnShowEventHistoryData').click(showEventHistoryData);
  $('#btnIncidentsMap').click(showAllIncidentsMap)
  // set up time default when page onload 
  formatTodayEvent();
  showAllGuard();
})

function showAllIncidentsMap() {
  $('#modalEventMap').modal('show');
}

async function showEventHistoryData() {
  let fromDate = $('#fromDateTime').val();
  let toDate = $('#toDateTime').val();
  let GuardID = $('#selectGuardName').val();
  if (GuardID == null) GuardID = 1;

  if (checkTimeFormat(fromDate, toDate)) {
    let sentData = { GuardID, fromDate, toDate };
    let data = await Service.getEventHistoryData(sentData);
    $('#pagingToursControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        console.log(data);
        let $table = renderEventHistoryTable(data);
        $('.card-tour .table-responsive').html($table);
      }
    })
  }
}

function renderEventHistoryTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblEventHistory" style="min-height: 150px"></table>`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Zone</th>
        <th class="trn">Name</th>
        <th class="trn">Date</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">Point</th>
        <th class="trn">Checked</th>
        <th class="trn">Completion time</th>
        <th class="trn">Current</th>
        <th class="trn">Distance</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    let htmltBody = '';
    data.forEach((event, index) => {
      htmltBody +=
        `
        <tr>
          <td>${index + 1}</td>
          <td>${event.sZoneName}</td>
          <td>${event.sGuardName}</td>
          <td>${event.dDateTimeIntinial}</td>
          <td>${event.dDateTimeStart}</td>
          <td>${event.dDateTimeEnd}</td>
          <td>${event.iCountPoint}</td>
          <td>${event.iCheckedPoint}</td>
          <td>${event.iTimeComplete}</td>
          <td>${event.iTimeCurrent}</td>
          <td>${event.dDistance}</td>
          <td>
            <button class="btn btn-custom bg-main-color btn-custom-small" style=" margin-top:-5px" onClick = "showEventDetailsMap('${event.sCheckingCode}')">Map</button>
            <button class="btn btn-custom bg-main-color btn-custom-small" style=" margin-top:-5px; margin-left: 5px" onClick = "showEventHistoryDetails('${event.sCheckingCode}')">Details</button>
          </td>
         
        </tr>
      `
    })
    $tbody.html(htmltBody);
  } 

  $table.append($thead).append($tbody);
  return $table;
}

async function formatTodayEvent() {
  let GuardID = 0;
  let fromDate = null;
  let toDate = null;
  let sentData = { GuardID, fromDate, toDate };
  let data = await Service.getEventHistoryData(sentData);
  $('#pagingToursControl').pagination({
    dataSource: data,
    pageSize: 10,
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      console.log(data);
      let $table = renderEventHistoryTable(data);
      $('.card-tour .table-responsive').html($table);
    }
  })
}

function checkTimeFormat(from, to) {
  let valid = true;
  let errMsg = '';
  if (from == '' || to == '') {
    valid = false;
    errMsg += `Time can not be missed\n`;
  } else {
    let fromDate = new Date(from).getTime();
    let toDate = new Date(to).getTime();
    if (fromDate >= toDate) {
      valid = false;
      errMsg += 'From date must be smaller than end date\n';
    }
  }
  if (!valid) alert(errMsg);
  return valid;
}

async function showEventHistoryDetails(checkingCode) {
  let data = await Service.getEventHistoryDetails(checkingCode);
  renderTableEventHistoryDetails(data);
  $('#modalEventHistoryDetails').modal('show');
}

function renderTableEventHistoryDetails(data) {
  let $table = $('#tblEventHistoryDetails');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Name</th>
        <th class="trn">Point ID</th>
        <th class="trn">Status</th>
        <th class="trn">Datetime</th>
        <th class="trn">KindCheck</th>
        <th class="trn">#</th>
      </tr>
    `
  )
  if (data) {
    data.forEach(detail => {
      $tbody.append(`
        <tr>
          <td>${detail.sGuardName}</td>
          <td>${detail.iPointID}</td>
          <td>${detail.sStatus}</td>
          <td>${detail.dDateTimeHistory}</td>
          <td>${detail.KindCheck}</td>
          <td>${detail.iNo}</td>
        </tr>
      `)
    })
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

function renderModalEditEventHistoryDetails(data) {
  $('#modalEventHistoryDetailsEdit').modal('show');
}

function buildEventDetailsMap(event) {
    const map = L.map('mapEventDetails').setView([20.81715284, 106.77411238], 17);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      id: 'Techpro'
    }).addTo(map);
    var LeafIcon = L.Icon.extend({
      options: {
        iconSize: [15, 15]
      }
    });
    
    if(event){
      event.forEach(detail => {
        let lat = Number(detail.dPointLat);
        let lng = Number(detail.dPointLong);
        let pos = [lat, lng];
        if (lat != 0 || lng != 0){
          if(detail.sStatus == 'Checked'){
            let Checked = new LeafIcon({
              iconUrl: '../img/Checked.png'
            });
            L.marker(pos, {
              icon: Checked
            }).addTo(map)
            .bindPopup(`${detail.sGuardName} checked at ${detail.dDateTimeHistory}`)//guard name cheked at
            .openPopup();
          }else{
            let None = new LeafIcon({
              iconUrl: '../img/None.png'
            });
            L.marker(pos, {
              icon: None
            }).addTo(map);
          }
        }
      })
    }
}

async function showEventDetailsMap(checkingCode) {
  let $mapView = $('<div id="mapEventDetails" class="mymap" style="height:360px"></div>');
  $('#modalEventMap').find('.modal-body').html($mapView);
  let event = await Service.getEventHistoryDetails(checkingCode);
  $('#modalEventMap').modal('show');
  setTimeout(() => {buildEventDetailsMap(event)}, 500);
}

async function showAllGuard(){
  let guards = await Service.getGuardsData();
  renderGuardCombobox(guards)
}

function renderGuardCombobox(guards){
  $('#selectGuardName').html('');
  if(guards){
    guards.forEach(guard => {
      $('#selectGuardName').append(`<option value="${guard.iGuardId}">${guard.sGuardName}</option>`)
    });
  }
}
