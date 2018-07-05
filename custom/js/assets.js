// http://115.79.27.219/tracking/api/GetAssetData.php 

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
        <th class="trn">Code</th>
        <th class="trn">AssetName</th>
        <th class="trn">Zone</th>
        <th class="trn">Guard name</th>
        <th class="trn">Lat</th>
        <th class="trn">Long</th>
        <th class="trn">Datetime updated</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if(data){
    data.forEach(asset => {
      const { AssetCode, AssetName, sZoneName, sGuardName, dLatPropertyHistory, dLongPropertyHistory, dDateTime } = asset;
      $tbody.append(`
        <tr>
          <td>${AssetCode}</td>
          <td>${AssetName}</td>
          <td>${sZoneName}</td>
          <td>${sGuardName}</td>
          <td>${dLatPropertyHistory}</td>
          <td>${dLongPropertyHistory}</td>
          <td>${dDateTime}</td>
          <td>
            <button class="btn btn-custom btn-custom-small bg-main-color btnShowMapAsset">Map</button>
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
  let datetime = $('#assetDatetime').val();
  if(datetime == '') return showAlertError("Datetime required", "", 3000);
  let sentData = {dDateTime : changeFormatDateTime(datetime)};
  let data = await Service.getAssetsData(sentData);
  console.log(data);
  arrCurrentAssets.length = 0;
  if(data){
    arrCurrentAssets = data.slice();
    $('#pagingAssetsControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        let $table = renderAssetsTable(data);
        $('.card-asset .table-responsive').html($table);
      }
    })
  }else{
    showAlertError("No data", "", 3000);
  }
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

function changeFormatDateTime(time){
  let arr = time.split('/');
  let y = arr[2];
  let d = arr[1];
  let m = arr[0];
  return `${y}-${m}-${d}`;
}

function buildAssetsMap(asset){
  $mapArea = $('<div id="mapAsset" style="height: 350px"></div>');
  $('#modalAssetMap').find('.modal-body').html($mapArea);

  var map = L.map('mapAsset').setView(CENTER_POS_MAP_VIEW, 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(map);

  const { AssetCode, AssetName, sZoneName, sGuardName, dLatPropertyHistory, dLongPropertyHistory, dDateTime } = asset;
  let pos = [Number(dLatPropertyHistory), Number(dLongPropertyHistory)];
  L.icon = function (options) {
    return new L.Icon(options);
  };

  let LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  let Error = new LeafIcon({
    iconUrl: '../img/asset(2).jpg'
  });
  // ../img/asset.png
  // ../img/asset(1).png

  L.marker(pos, {
    icon: Error
  })
  .addTo(map).bindTooltip(AssetName).openTooltip();

}

function showAssetMap(asset){
  $('#modalAssetMap').modal('show');
  setTimeout(() => {
    buildAssetsMap(asset);
  }, 500);
}

function buildAssetsMapAll(assets){
  $mapArea = $('<div id="mapAllAssets" style="height: 350px"></div>');
  $('#modalAssetMapAll').find('.modal-body').html($mapArea);

  let map = L.map('mapAllAssets').setView(CENTER_POS_MAP_VIEW, 14);
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    id: 'Techpro'
  }).addTo(map);

  L.icon = function (options) {
    return new L.Icon(options);
  };

  let LeafIcon = L.Icon.extend({
    options: {
      iconSize: [15, 15]
    }
  });
  let Error = new LeafIcon({
    iconUrl: '../img/asset(2).jpg'
  });
  // ../img/asset.png
  // ../img/asset(1).png
  if(assets.length > 0){
    assets.forEach(asset => {
      const { AssetCode, AssetName, sZoneName, sGuardName, dLatPropertyHistory, dLongPropertyHistory, dDateTime } = asset;
      let pos = [Number(dLatPropertyHistory), Number(dLongPropertyHistory)];
      L.marker(pos, {
        icon: Error
      }).addTo(map).bindTooltip(AssetName).openTooltip();
    })
  }
}

function showAssetMapAll(assets){
  $('#modalAssetMapAll').modal('show');
  setTimeout(() => {
    buildAssetsMapAll(assets);
  }, 500);
}