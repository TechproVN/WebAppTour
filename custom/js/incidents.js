
$(() => {

  $('#btnIncidentsData').click(showIncidentsData);
  $('#btnIncidentsMap').click(function(){
    showAllIncidentMap(arrIncidents);
  })
  formatTodayIncident();

})

const arrIncidents = [];

async function showIncidentsData() {
  let datetime = $('#incidentDatetime').val();
  if(datetime == '') return showAlertError('No datetime', "Please choose datetime!", 6000);
  let sentData = { dDateTime: changeFormatDateTime(datetime) };
  let data = await Service.getIncidentsData(sentData);
  arrIncidents.length = 0;
  if(data) {
    $('#totalIncidents').html(`<strong class="trn">Total incidents</strong>: ${data.length}`);
    $('#pagingIncidentsControl').pagination({
      dataSource: data,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        console.log(data);
        let $table = renderIncidentsTable(data);
        $('.card-incident .table-responsive').html($table);
        setDefaultLang();
      }
    })
    data.forEach(item => arrIncidents.push(item));
  }else{
    rssetTblIncidents();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function rssetTblIncidents(){
  $('#totalIncidents').html('');
  $('#pagingIncidentsControl').html('');
  $('#tblIncidents').find('tbody').html('');
}

function renderIncidentsTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblIncidents"></table>`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn"></th>
        <th class="trn">Name</th>
        <th class="trn">Zone</th>
        <th class="trn">Date</th>
        <th class="trn">Started</th>
        <th class="trn">Finihed</th>
        <th class="trn">Image</th>
        <th class="trn">Description</th>
        <th class="trn">Map</th>
      </tr>
    `
  )
  if(data){
    data.forEach(incident => {
      const { sGuardName, sZoneName, dDateTimeIntinial, dDateTimeStart, dDateTimeEnd, sAlertDescription, ImageUrl } = incident;
      let img = `${APP_DOMAIN}${ImageUrl}`;
      $tbody.append(`
        <tr>
          <td>
            <input type="checkbox" class="checkbox-custom checkbox-incident">
          </td>
          <td>${sGuardName}</td>
          <td>${sZoneName}</td>
          <td>${dDateTimeIntinial}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>
            <img src="${img}" alt="Image here" style="width:60px; height: 80px" onClick="showIncidentImage('${img}')">
          </td>
          <td>${sAlertDescription}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowIncidentMap btn-custom-small">Map</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowIncidentMap').last().click(function(){
        showMapIncident(incident)
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showIncidentImage(urlImage){
  $('#incidentImg').attr({src: `${urlImage}`})
  $('#modalIncidentImage').modal('show');
}

function formatTodayIncident() {
  $('#incidentDatetime').val(formatToday());
  showIncidentsData();
}

function buildIncidentMap(incident){
  $mapArea = $('<div id="mapIncident" style="height: 350px"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($('#mapIncident')[0], mapProp);

  if(incident){
    const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident
    let lat = Number(dAlertLat);
    let lng = Number(dAlertLong);
    let pos = new google.maps.LatLng(lat, lng);
    let img = `${APP_DOMAIN}${ImageUrl}`;
    let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`
    
    let icon = '../img/error.png';
    let marker = createMarkerGoogleMap(pos, icon);
    marker.setMap(mymap);
    let infoWindow = createInfoWindowGoogleMap(mes);
    infoWindow.open(mymap, marker);
  }
}

function buildAllIncidentMap(incidents){
  $mapArea = $('<div id="mapIncident" style="height: 350px"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($('#mapIncident')[0], mapProp);
  let icon = '../img/error.png';

  if(incidents && incidents.length > 0){
    incidents.forEach(incident => {
      const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident;
      let lat = Number(dAlertLat);
      let lng = Number(dAlertLong)
      let pos = new google.maps.LatLng(lat, lng);
      let img = `${APP_DOMAIN}${ImageUrl}`;
      let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`;
      
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function showAllIncidentMap(incidents){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildAllIncidentMap(incidents);
  }, 0);
}

function showMapIncident(incident){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildIncidentMap(incident);
  }, 0);
}