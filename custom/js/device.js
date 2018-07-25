$(() => {
  $('#btnViewDeviceData').click();
  $('#btnShowInsertDeviceModal').click(showInsertDeviceModal);
  $('#btnInsertDevice').click(insertDevice);
  // $('#btnUpdateDevice').click(updateDevice);
  showDevices();
})

let currentDeviceUpdate = null;

async function insertDevice(){
  let name = $('#txtInsertDeviceName').val();
  let serial = $('#txtInsertDeviceSerial').val();
  if(!Validation.checkEmpty(name) || !Validation.checkEmpty(serial)){
    showAlertError("Invalid data", "Both Name and Serial must be filled");
  } else{
    let sentData = { sDeviceNameIN: name, sDeviceSerialIN: serial, iDeviceIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertDevice(sentData);
    console.log(response);
    showDevices();
    showAlertSuccess("Insert Successfully", "", 3000);
  }
}

function showInsertDeviceModal(){
  $('#modalInsertDeivce').modal('show');
  $('#txtInsertDeviceName').val('');
  $('#txtInsertDeviceSerial').val('');
}

// function showUpdateDeviceModal(device){
//   currentDeviceUpdate = Object.assign({}, device);
//   const { sDeviceName, sDeviceSerial } = device;
//   $('#modalUpdateDevice').modal('show');
//   $('#txtUpdateDeviceName').val(sDeviceName);
//   $('#txtUpdateDeviceSerial').val(sDeviceSerial);
// }

// async function updateDevice(){
//   let name = $('#txtUpdateDeviceName').val();
//   let serial = $('#txtUpdateDeviceSerial').val();
//   if(!Validation.checkEmpty(name) || !Validation.checkEmpty(serial)){
//     showAlertError("Invalid data", "Both Name and Serial must be filled");
//   } else{
//     const { iDeviceID } = currentDeviceUpdate;
//     let sentData = { sDeviceNameIN: name, sDeviceSerialIN: serial, iDeviceIDIN: iDeviceID, bStatusIN: 2 };
//     console.log(JSON.stringify(sentData));
//     let response = await Service.updateDevice(sentData);
//     console.log(response);
//     showDevices();
//     $('#modalUpdateDevice').modal('hide');
//     showAlertSuccess("Insert Successfully", "", 3000);
//   }
// }

async function lockDevice(device){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    const { iDeviceID } = device;
    let sentData = { sDeviceNameIN: 0, sDeviceSerialIN: 0, iDeviceIDIN: iDeviceID, bStatusIN: 2 }
    console.log(JSON.stringify(sentData));
    let response = await Service.lockDevice(sentData);
    console.log(response);
    showDevices();
    showAlertSuccess("Locked Successfully", "", 3000);
  }
}

function renderDeviceTable(devices){
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table min-height-table" id="tblDevice"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">No.</th>
      <th class="trn">Name</th>
      <th class="trn">Serial</th>
      <th class="trn">Status</th>
      <th class="trn">Power</th>
      <th class="trn">Datetime updated</th>
    </tr>
  `
  )
  if (devices) {
    devices.forEach(device => {
      const { bStatus, dPower, iDeviceID, sDeviceName, sDeviceSerial, dDateTimeUpdated } = device
      $tbody.append(`
        <tr>
          <td>${iDeviceID}</td>
          <td>${sDeviceName}</td>
          <td>${sDeviceSerial}</td>
          <td>${bStatus}</td>
          <td>${dPower}</td>
          <td>${dDateTimeUpdated}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle trn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action</button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-info btn-custom-small dropdown-item btnShowDetailDevice trn">Details</button>
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnLockDevice trn">Lock</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowDetailDevice').last().click(() => {
        showDeviceDetail(device);
      })
      $tbody.find('.btnShowUpdateDeviceModal').last().click(() => {
        showUpdateDeviceModal(device);
      })
      $tbody.find('.btnLockDevice').last().click(() => {
        lockDevice(device);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showDeviceDetail(device){
  console.log(device);
}

async function showDevices(){
  let devices = await Service.getDevice();
  console.log(devices);
  if(devices){
    $('#totalDevices').html(`<strong class="trn">Total Devices</strong>: ${devices.length}`);
    $('#pagingDevicesControl').pagination({
      dataSource: devices,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (devices, pagination) {
        let $table = renderDeviceTable(devices);
        $('.card-device .table-responsive').html($table);
      }
    })
  }else{
    resetTblDevice();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function resetTblDevice(){
  $('#totalDevices').html('');
  $('#pagingDevicesControl').html('');
  $('#tblDevice').html('');
}