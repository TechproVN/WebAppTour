$(() => {
  $('#btnViewAssetList').click(showAssets);
  $('#btnShowInsertAssetModal').click(showInsertAssetModal);
  $('#btnInsertAsset').click(insertAsset);
  $('#btnUpdateAsset').click(updateAsset);
  showRouteList();
  showZones();
  showAssets();
})

let currentUpdateAsset = null;

async function insertAsset(){
  let name = $('#txtInsertGroupName').val();
  let guardId = $('#selectInsertGuardLeader').val();
  if(!Validation.checkEmpty(name)){
    showAlertError("Invalid data", "Group Name must be filled");
  } else{
    let sentData = { sGroupNameIN: name, iGuardIDIN: guardId, iGroupIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertGroup(sentData);
    console.log(response);
    showGroups();
    showAlertSuccess("Insert Successfully", "", 3000);
  }
}

function showInsertAssetModal(){
  $('#modalInsertAsset').modal('show');
  $('#txtInsertGroupName').val('');
}

async function deleteAsset(group){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    const { iGuardGroupID, iGuardIDLeader, sGroupName } = group;
    let sentData = { iGroupIDIN: iGuardGroupID, iGuardIDIN: iGuardIDLeader, sGroupNameIN: sGroupName, bStatusIN: 3 }
    console.log(JSON.stringify(sentData));
    let response = await Service.deleteGroup(sentData);
    console.log(response);
    showGroups();
    showAlertSuccess("Locked Successfully", "", 3000);
  }
}

function renderAssetTable(data){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblAsset"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Asset Name</th>
      <th class="trn">Asset Code</th>
      <th class="trn">Zone Name</th>
      <th class="trn">Route Name</th>
      <th class="trn">Lat</th>
      <th class="trn">Long</th>
      <th class="trn"></th>
    </tr>
  `)
  if (data) {
    data.forEach((asset, index) => {
      const { sAssetName, sRouteName, sZoneName, sAssetCode, iAssetID, dPropertyLong, dPropertyLat } = asset
      $tbody.append(`
        <tr>
          <td>${sAssetName}</td>
          <td>${sAssetCode}</td>
          <td>${sZoneName}</td>
          <td>${sRouteName}</td>
          <td>${dPropertyLat}</td>
          <td>${dPropertyLong}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowUpdateAssetModal trn">Update</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnDeleteAsset trn">Delete</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateAssetModal').last().click(() => {
        showUpdateAssetModal(asset);
      })
      $tbody.find('.btnDeleteAsset').last().click(() => {
        deleteAsset(asset);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

async function updateAsset(){
  let name = $('#txtUpdateGroupName').val();
  let guardId =  $('#selectUpdateGuardLeader').val();
  let { iGuardGroupID } = currentUpdateGroup;
  if(!Validation.checkEmpty(name)) return showAlertError("Invalid data", "Group Name must be filled");
  let sentData = { sGroupNameIN: name, iGuardIDIN: guardId, iGroupIDIN: iGuardGroupID, bStatusIN: 2 };
  console.log(JSON.stringify(sentData));
  let response = await Service.updateGroup(sentData);
  console.log(response);
  showGroups();
  showAlertSuccess("Insert Successfully", "", 3000);
}

function showUpdateAssetModal(asset){
  currentUpdateAsset = Object.assign({}, asset);
  const { sGroupName, iGuardIDLeader } = asset;
  $('#modalUpdateAsset').modal('show');
  $('#txtUpdateGroupName').val(sGroupName);
  $('#selectUpdateGuardLeader').val(iGuardIDLeader);
}

async function showAssets(){
  let zoneId = $('#selectFilterAssetByZone').val();
  if(!zoneId) zoneId = 0;
  let sentData = { iZoneID: zoneId };
  let data = await Service.getAssetsData(sentData);
  console.log(data);
  if(data){
    showAssetPagination(data);
  }else{
    resetTblAssets();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function showAssetPagination(data){
  $('#totalAssets').html(`<strong class="trn">Total Assets</strong>: ${data.length}`);
  $('#pagingAssetsControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderAssetTable(data);
      $('.card-assets .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblAssets(){
  $('#totalAssets').html('');
  $('#pagingAssetsControl').html('');
  $('#tblAsset').html('');
}

async function showZones(){
  let data = await Service.getAllZones();
  console.log(data);
  $('.selectZone').html('');
  $('.selectZone').append(`<option value="0">All</option>`);
  data.forEach(zone => {
    const { iZoneID, sZoneName } = zone;
    $('.selectZone').append(`<option value="${iZoneID}">${sZoneName}</option>`);
  })
}

function buildAssetsMap(assets, id){
  let latCenter = CENTER_POS_MAP_VIEW[0];
  let lngCenter = CENTER_POS_MAP_VIEW[1];
  let mapProp = createMapPropGoogleMap(16, latCenter, lngCenter);
  let mymap = new google.maps.Map($(`#${id}`)[0], mapProp);
  let icon = '../img/asset(2).jpg';

  google.maps.event.addListener(mymap, 'click', function(event) {
    handleClickAssetMap(mymap, event);
  });

  //show all points
  if(assets && assets.length > 0){
    points.forEach(asset => {
      const { sAssetName, dPropertyLat, dPropertyLong } = asset;
      let mes = `<div style="font-size: 0.9em">ID: ${iPointID} - ${type}</div>`;
      let lat = Number(dPropertyLat);
      let lng = Number(dPropertyLong)
      let pos = new google.maps.LatLng(lat, lng);
      let marker = createMarkerGoogleMap(pos, icon);
      marker.setMap(mymap);
      let infoWindow = createInfoWindowGoogleMap(mes);
      marker.addListener('mouseover', function() {
        infoWindow.open(mymap, marker);
      });
    })
  }
}

function handleClickAssetMap(mymap, event){
  let lat = event.latLng.lat();
  let lng = event.latLng.lng();
  let pos = new google.maps.LatLng(lat, lng);
  let mes = `${lat} - ${lng}`;
  $('.latAsset').text(lat);  
  $('.longAsset').text(lng);  
  let icon = '../img/asset(2).jpg';
  let marker = createMarkerGoogleMap(pos, icon);
  marker.setMap(mymap);
}
