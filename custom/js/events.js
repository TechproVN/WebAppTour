$(async () => {

  //bind event click view to show event history
  $('#btnShowEventHistoryDataByGuard').click(() => {
    showEventHistoryData('guard')
  });
  $('#btnShowEventHistoryDataByRoute').click(() => {
    showEventHistoryData('route')
  });
  $('#btnShowEventHistoryDataByDevice').click(() => {
    showEventHistoryData('device');
  });
  $('#btnIncidentsMap').click(showAllIncidentsMap)
  // set up time default when page onload 
  formatTodayEvent();
  arrGuardList = await showGuardList();
  arrRouteList = await showRouteList();
  arrDeviceList = await showDeviceList();
  
  if(!arrGuardList) arrGuardList = [];
  if(!arrRouteList) arrRouteList = [];
  if(!arrDeviceList) arrDeviceList = [];

  showTourListsByDefault();
})

let arrGuardList = [];
let arrRouteList = [];
let arrDeviceList = [];
let headerTblTours = '';

async function showTourListsByDefault(){
  let { year, month, day, hour, min } = getCurrentDateTime();
  let fromDate = `${year}-${month}-${day} 00:00`;
  let toDate = `${year}-${month}-${day} ${hour}:${min}`;
  $(`#fromDateTime`).val(fromDate);
  $(`#toDateTime`).val(toDate);
  let sentData = { fromDate, toDate };
  sentData.GuardID = 1;
  console.log(JSON.stringify(sentData));
  data = await Service.getEventHistoryDataGuard(sentData);
  if(data){
    showToursListPagination(data, name, 'guard', fromDate, toDate);
  }else {
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function showAllIncidentsMap() {
  $('#modalEventMap').modal('show');
}

async function showEventHistoryData(type) {
  
  type = type[0].toUpperCase() + type.substring(1).toLowerCase();
 
  let fromDate = $(`#fromDateTime`).val();
  let toDate = $(`#toDateTime`).val();
  let id = $(`#select${type}Name`).val();

  if (checkTimeFormat(fromDate, toDate) && id) {
    let sentData = { fromDate, toDate };
    let data = null;
    let name = '';
    if(type.toLowerCase() == 'guard'){
      sentData.GuardID = id;
      let guard = arrGuardList.find(g => g.iGuardId == id.trim());
      name = guard.sGuardName;
      data = await Service.getEventHistoryDataGuard(sentData);
    }else if(type.toLowerCase() == 'route'){
      sentData.RouteID = id;
      let route = arrRouteList.find(r => r.iRouteID == id.trim());
      name = route.sRouteName;
      data = await Service.getEventHistoryRoute(sentData);
    }else if(type.toLowerCase() == 'device'){
      sentData.DeviceID = id;
      let device = arrDeviceList.find(d => d.iDeviceID == id.trim());
      name = device.sDeviceName;
      data = await Service.getEventHistoryDevice(sentData);
    }
    if(data){
      showToursListPagination(data, name, type,fromDate, toDate);
    }else {
      resetTblEventHistory();
      showAlertError("No data available", "", 3000);
    }
  }
  setDefaultLang();
}

function showToursListPagination(data, name, type, fromDate, toDate){
  headerTblTours = `<span class="trn">${type} Name</span>: ${name} - From: ${fromDate} -> To: ${toDate}`;
  $('.headerTblTours').html(headerTblTours)
  $('#totalTours').html(`<strong class="trn">Total tours</strong>: ${data.length}`)
  $('#pagingToursControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      // template method of yourself
      let $table = renderEventHistoryTable(data);
      $('.card-tour .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblEventHistory(){
  $('#totalTours').html('');
  $('#pagingToursControl').html('');
  $('#tblEventHistory').html('');
  $('.headerTblTours').html('');
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
        <th class="trn">Route</th>
        <th class="trn">Name</th>
        <th class="trn">Device</th>
        <th class="trn">Date</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">Point</th>
        <th class="trn">Checked</th>
        <th class="trn">Timing</th>
        <th class="trn">Current</th>
        <th class="trn">Distance</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((event, index) => {
      const { sZoneName, sRouteName, sGuardName, sDeviceName, dDateTimeIntinial, dDateTimeStart, dDateTimeEnd, iCountPoint, iCheckedPoint, iTimeComplete, iTimeCurrent, dDistance, sCheckingCode } = event;
      $tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sGuardName}</td>
          <td>${sDeviceName}</td>
          <td>${dDateTimeIntinial}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>${iCountPoint}</td>
          <td>${iCheckedPoint}</td>
          <td>${iTimeComplete}</td>
          <td>${iTimeCurrent}</td>
          <td>${dDistance}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="trn">Action</span>
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom btn-success btn-custom-small dropdown-item trn" style=" margin-top:-5px" onClick = "showEventDetailsMap('${sCheckingCode}')">Map</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item trn" style=" margin-top:-5px; margin-left: 5px" onClick = "showEventHistoryDetails('${sCheckingCode}')">Details</button>
              </div>
            </div>
          </td>
        </tr>
      `)
    })
  } 
  $table.append($thead).append($tbody);
  return $table;
}

async function formatTodayEvent() {
  let GuardID = 0;
  let fromDate = null;
  let toDate = null;
  let sentData = { GuardID, fromDate, toDate };
  let data = await Service.getEventHistoryDataGuard(sentData);
  if(data){
    showToursListPagination();
  }else{
    resetTblEventHistory();
    showAlertError("No data available", "", 3000);
  }
}



function checkTimeFormat(from, to) {
  let valid = true;
  let errMsg = '';
  if (from == '' || to == '') {
    valid = false;
    errMsg += `Please choose date time\n`;
  } else {
    let fromDate = new Date(from).getTime();
    let toDate = new Date(to).getTime();
    if (fromDate >= toDate) {
      valid = false;
      errMsg += 'Start date must be sooner than end date\n';
    }
  }
  if (!valid) showAlertError("Invalid date", errMsg, 6000);
  return valid;
}

async function showEventHistoryDetails(checkingCode) {
  let data = await Service.getEventHistoryDetails(checkingCode);
  renderTableEventHistoryDetails(data);
  setDefaultLang();
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

function buildEventDetailsMap(event){
  let lat = CENTER_POS_MAP_VIEW[0];
  let lng = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, lat, lng);
  let mymap = new google.maps.Map($('#mapEventDetails')[0], mapProp);
  if(event){
    event.forEach(detail => {
      let lat = Number(detail.dPointLat);
      let lng = Number(detail.dPointLong);
      let pos = new google.maps.LatLng(lat, lng);
      
      if (lat != 0 || lng != 0){
        if(detail.sStatus == 'Checked'){
          let mes = `${detail.sGuardName} checked at ${detail.dDateTimeHistory}`
          let icon = '../img/Checked.png';
          let marker = createMarkerGoogleMap(pos, icon);
          marker.setMap(mymap);
          let infoWindow = createInfoWindowGoogleMap(mes);
          infoWindow.open(mymap, marker);
        }else{
          let icon = '../img/None.png';
          let marker = createMarkerGoogleMap(pos, icon);
          marker.setMap(mymap);
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
  setTimeout(() => {buildEventDetailsMap(event)}, 0);
}
