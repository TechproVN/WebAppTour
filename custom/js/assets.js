// http://115.79.27.219/tracking/api/GetAssetData.php 

$(() => {

  $('#btnAssetsData').click(showAssetsData);

  formatTodayAssets();
})

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
        <th class="trn">Last Property History</th>
        <th class="trn">Long Property History</th>
        <th class="trn">Datetime</th>
      </tr>
    `
  )
  if(data){
    let htmltBody = '';
    data.forEach(asset => {
      htmltBody +=
        `
        <tr>
          <td>${asset.AssetCode}</td>
          <td>${asset.AssetName}</td>
          <td>${asset.sZoneName}</td>
          <td>${asset.sGuardName}</td>
          <td>${asset.dLatPropertyHistory}</td>
          <td>${asset.dLongPropertyHistory}</td>
          <td>${asset.dDateTime}</td>
        </tr>
      `
    })
    $tbody.html(htmltBody);
  } 
  $table.append($thead).append($tbody);
  return $table;
}

async function showAssetsData() {
  let datetime = $('#assetDatetime').val();
  if(datetime == '') return showAlertError("Datetime required", "", 3000);
  let sentData = {dDateTime : changeFormatDateTime(datetime)};
  let data = await Service.getAssetsData(sentData);
  if(data){
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