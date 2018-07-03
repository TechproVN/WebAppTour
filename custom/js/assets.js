// http://115.79.27.219/tracking/api/GetAssetData.php 

$(() => {

  $('#btnAssetsData').click(showAssetsData);

  formatTodayAssets();
})

function renderAssetsTable(data) {
  let $table = $('#tblAssets');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  // Display detail Incident: Code, AssetName, Zone, Start, Name, DateTime, Image, Description

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
  } else {
    alert('No data');
  }

  $table.append($thead).append($tbody);
}

async function showAssetsData() {
  let datetime = $('#assetDatetime').val();
  if(datetime == '') return alert('No datetime');
  let sentData = {dDateTime : changeFormatDateTime(datetime)};
  let data = await Service.getAssetsData(sentData);
  console.log(data);
  renderAssetsTable(data);
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