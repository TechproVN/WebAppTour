$(() => {
  $('#btnAssetsData').click(showAssetsData);
  $('#btnShowMapAllAssets').click(() => {
    showAssetMapAll(arrCurrentAssets)
  });
  formatTodayAssets();
})

let arrCurrentAssets = [];

function renderAssetsTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblAssets"></table>`);
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">#</th>
        <th class="trn">Code</th>
        <th class="trn">Asset name</th>
        <th class="trn">Zone</th>
        <th class="trn">Route</th>
        <th class="trn">Guard</th>
        <th class="trn">Checked at</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if(data){
    data.forEach(asset => {
      const { AssetCode, AssetName, sZoneName, sRouteName, sGuardName,  dDateTime, dLatPropertyHistory, dLongPropertyHistory} = asset;
      $tbody.append(`
        <tr>
          <td></td>
          <td>${AssetCode}</td>
          <td>${AssetName}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${sGuardName}</td>
          <td>${dDateTime}</td>
          <td>
            <button class="btn btn-custom btn-custom-small bg-main-color btnShowMapAsset trn">Map</button>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnShowMapAsset').last().click(() => {
        showAssetMap(asset);
      })
  }) 
}
  $table.append($thead).append($tbody);
  return $table;
}

async function showAssetsData() {
  let fromDate = $('#assetFromDatetime').val();
  let toDate = $('#assetToDatetime').val();
  if(fromDate == '') return showAlertError("Datetime required", "", 3000);
  if(toDate == '') return showAlertError("Datetime required", "", 3000);
  let sentData = {fromDate : changeFormatDateTime(fromDate), toDate : changeFormatDateTime(toDate)};
  console.log(sentData);
  let data = await Service.getAssetsData(sentData);
  arrCurrentAssets.length = 0;
  if(data){
    arrCurrentAssets = data.slice();
    $('#totalAssets').html(`<strong>Total Assets</strong>: ${data.length}`)
    $('#pagingAssetsControl').pagination({
      dataSource: data,
      pageSize: 10,
      className: 'paginationjs-theme-green paginationjs-big',
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderAssetsTable(data);
        $('.card-asset .table-responsive').html($table);
        setDefaultLang();
      }
    })
  } else{
    resetTblAsset();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblAsset(){
  $('#totalAssets').html('');
  $('#pagingAssetsControl').html('');
  $('#tblAssets').find('tbody').html('');
}

function formatTodayAssets() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
 
  $('#assetDatetime').val(`${mon}/${d}/${year}`);

  showAssetsData();
}

function buildAssetsMap(asset){
  $mapArea = $('<div id="mapAsset" style="height: 350px"></div>');
  $('#modalAssetMap').find('.modal-body').html($mapArea);

  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($('#mapAsset')[0], mapProp);
  const { AssetCode, AssetName, sZoneName, sGuardName, dLatPropertyHistory, dLongPropertyHistory, dDateTime } = asset;
  let icon = '../img/asset(2).jpg';
  let lat = Number(dLatPropertyHistory);
  let lng = Number(dLongPropertyHistory)
  if(incidents && incidents.length > 0){
    incidents.forEach(incident => {
      const { dAlertLat, dAlertLong, ImageUrl, sAlertDescription, dDateTimeIntinial} = incident;
      let lat = Number(dAlertLat);
      let lng = Number(dAlertLong)
      let pos = new google.maps.LatLng(lat, lng);
      let mes = AssetName;
      
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function showAssetMap(asset){
  $('#modalAssetMap').modal('show');
  setTimeout(() => {
    buildAssetsMap(asset);
  }, 0);
}

function buildAssetsMapAll(assets){
  $mapArea = $('<div id="mapAllAssets" style="height: 350px"></div>');
  $('#modalAssetMapAll').find('.modal-body').html($mapArea);

  let mapProp = {
    center: new google.maps.LatLng(20.81715284, 106.77411238),
    zoom: 14,
  };
  let mymap = new google.maps.Map($('#mapAllAssets')[0], mapProp);

  if(assets.length > 0){
    assets.forEach(asset => {
      const { AssetCode, AssetName, sZoneName, sGuardName, dLatPropertyHistory, dLongPropertyHistory, dDateTime } = asset;
      let lat = Number(dAlertLat);
      let lng = Number(dAlertLong)
      let pos = new google.maps.LatLng(lat, lng);
      let mes = AssetName;
      
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      infoWindow.open(mymap, marker);
    })
  }
}

function showAssetMapAll(assets){
  $('#modalAssetMapAll').modal('show');
  setTimeout(() => {
    buildAssetsMapAll(assets);
  }, 500);
}