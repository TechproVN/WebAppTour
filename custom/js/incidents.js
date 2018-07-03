
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
  if(datetime == '') return alert('No datetime');
  let sentData = { dDateTime: changeFormatDateTime(datetime) };
  let data = await Service.getIncidentsData(sentData);
  console.log(data);
  arrIncidents.length = 0;
  if(data) {
    renderIncidentsTable(data);
    data.forEach(item => arrIncidents.push(item));
  }
}

function renderIncidentsTable(data) {
  let $table = $('#tblIncidents');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn"></th>
        <th class="trn">Name</th>
        <th class="trn">Zone</th>
        <th class="trn">Date</th>
        <th class="trn">Start</th>
        <th class="trn">End</th>
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
            <button class="btn btn-custom bg-main-color btnShowIncidentMap btn-custom-small"> Map</button>
          </td>
        </tr>
      `) 
      $tbody.find('.btnShowIncidentMap').last().click(function(){
        showMapIncident(incident)
      })
    })
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
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

  var map = L.map('mapIncident').setView([20.81715284, 106.77411238], 17);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(map);

  L.icon = function (options) {
    return new L.Icon(options);
  };

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  let Error = new LeafIcon({
    iconUrl: '../img/error.png'
  });

  if(incident){
    console.log(incident);
    const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident
    let pos = [Number(dAlertLat), Number(dAlertLong)];
    let img = `${APP_DOMAIN}${ImageUrl}`;
    let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`
    L.marker(pos, {
      icon: Error
    }).addTo(map)
    .bindPopup(mes)
    .openPopup();
  }
}

function buildAllIncidentMap(incidents){
  $mapArea = $('<div id="mapIncident" style="height: 350px"></div>');
  $('#modalIncidentMap').find('.modal-body').html($mapArea);

  var map = L.map('mapIncident').setView([20.81715284, 106.77411238], 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(map);

  L.icon = function (options) {
    return new L.Icon(options);
  };

  var LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  let Error = new LeafIcon({
    iconUrl: '../img/error.png'
  });

  // L.marker([lon, lat], {icon: Error}).bindTooltip(message).addTo(mymap);
  // message = message + "<br> <center><img src='" + imgurl + "' alt = '' style='width:144px;height:256px;'></center>";
  if(incidents && incidents.length > 0){
    incidents.forEach(incident => {
      const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident;
      let pos = [Number(dAlertLat), Number(dAlertLong)];
      let img = `${APP_DOMAIN}${ImageUrl}`;
      let mes = `${dDateTimeIntinial}<br>${sAlertDescription}<br><img src="${img}" class="img-fluid">`;
      L.marker(pos, {
        icon: Error
      }).bindTooltip(mes)
      .addTo(map)
    })
  }
}

function showAllIncidentMap(incidents){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildAllIncidentMap(incidents);
  }, 500);
}

function showMapIncident(incident){
  $('#modalIncidentMap').modal('show');
  setTimeout(() => {
    buildIncidentMap(incident);
  }, 500);
}