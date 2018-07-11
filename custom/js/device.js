$(() => {
  $('#btnViewDeviceData').click();
  $('#btnInsertDevice').click();
  showGuards();
})
// bStatus
// "1"
// dPower
// "50"
// iDeviceID
// "1"
// sDeviceName
// "SPEEDATA - QRCode"
// sDeviceSerial
// "11111111111"

function renderDeviceTable(devices){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblDevice"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">Name</th>
      <th class="trn">ID</th>
      <th class="trn">Serial</th>
      <th class="trn">Status</th>
      <th class="trn">Power</th>
    </tr>
  `
  )
  if (devices) {
    devices.forEach(device => {
      const { bStatus, dPower, iDeviceID, sDeviceName, sDeviceSerial } = device
      $tbody.append(`
        <tr>
          <td>${sDeviceName}</td>
          <td>${iDeviceID}</td>
          <td>${sDeviceSerial}</td>
          <td>${bStatus}</td>
          <td>${dPower}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Action
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnShowDetailDevice">Details</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowDetailDevice').last().click(() => {
        showDeviceDetail(device);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showDeviceDetail(device){
  console.log(device);
}

async function showGuards(){
  let devices = await Service.getDevice();
  console.log(devices);
  if(devices){
    $('#totalDevices').html(`<strong>Total Devices:</strong> ${devices.length}`);
    $('#pagingDevicesControl').pagination({
      dataSource: devices,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (devices, pagination) {
        let $table = renderGuardTable(devices);
        $('.card-device .table-responsive').html($table);
      }
    })
  }
  
}