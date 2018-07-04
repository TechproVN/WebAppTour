$(() => {
  $('#formUpdateGuard').submit((e) => {
    e.preventDefault();
    updateGuard();
  });
  $('#formInsertGuard').submit(e => {
    e.preventDefault();
    insertGuard();
  });
  $('#btnShowGuardInsertModal').click(showGuardModalInsert);
  $('#btnSendMessageGuard').click(sendMessageGuard);
  showGuards();
})

var currentSendMessageGuard = null;

async function insertGuard(){
  let name = $('#txtInsertGuardName').val();
  let phone = $('#txtInsertGuardPhone').val();
  let username = $('#txtInsertGuardUsername').val();
  let password = $('#txtInsertGuardPassword').val();
  if(checkValidation(name, username, phone, password)){
    let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: password, iGuardIDIN: 0, bStatusIN: 1 };
    console.log(JSON.stringify(sentData));
    let response = await Service.insertGuard(sentData);
    console.log(response);
    $('#modalInsertGuard').modal('hide');
    showAlertSuccess("Insert successfully!", "", 2000);
    showGuards();
  }
}

function checkValidation(name, username, phone, password){
  let valid = true;
  let errMsg = '';
  if(name == null || name.trim() == ''){
    valid = false;
    errMsg += 'Name must be filled in\n'
  } 
  if(username == null || username.trim() == ''){
    valid = false;
    errMsg += 'Username must be filled in\n'
  } 
  if(!/^[0-9]+$/.test(phone)){
    valid = false;
    errMsg += 'Phone must be number\n'
  } 
  if(password.trim().length < 4){
    valid = false;
    errMsg += 'Password must be longer than 4\n'
  } 
  if(!valid){
    showAlertError("Invalid data!", errMsg);
  }
  return valid;
}

async function updateGuard(){
  let id = $('#txtUpdateGuardID').val();
  let name = $('#txtUpdateGuardName').val();
  let phone = $('#txtUpdateGuardPhone').val();
  let username = $('#txtUpdateGuardUsername').val();

  let sentData = { sGuardNameIN: name, sGuardPhone: phone, sGuardUsername: username, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 2 };
  let response = await Service.updateGuard(sentData);
  console.log(response);
  showAlertSuccess("Updated successfully!", "", 2000);
  showGuards();
}

async function inActiveGuard(id){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    let sentData = { sGuardNameIN: 0, sGuardPhone: 0, sGuardUsername: 0, sGuardPassword: 0, iGuardIDIN: id, bStatusIN: 3 };
    let response = await Service.inActiveGuard(sentData);
    console.log(response);
    showAlertSuccess("Inactive successfully!", "", 2000);
    showGuards();
  }
}

function renderGuardTable(guards){
  let $table = $('#tblGuards')
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
    <tr>
      <th class="trn">ID</th>
      <th class="trn">Name</th>
      <th class="trn">Phone</th>
      <th class="trn">Username</th>
      <th class="trn">Active</th>
    </tr>
  `
  )
  if (guards) {
    guards.forEach(guard => {
      const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
      $tbody.append(`
        <tr>
          <td>${iGuardID}</td>
          <td>${sGuardName}</td>
          <td>${sGuardPhone}</td>
          <td>${sGuardUserName}</td>
          <td>${bActive}</td>
          <td>
            <div class="btn-group">
              <button type="button" class="btn btn-custom bg-main-color btn-custom-small dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Action
              </button>
              <div class="dropdown-menu" >
                <button class="btn btn-custom bg-danger btn-custom-small dropdown-item btnInactiveGuard">Lock</button>
                <button class="btn btn-custom btn-info btn-custom-small dropdown-item btnShowUpdateGuardModal">Update</button>
                <button class="btn btn-custom btn-warning btn-custom-small dropdown-item btnShowModalResetPassword">Reset Password</button>
                <button class="btn btn-custom btn-primary btn-custom-small dropdown-item btnShowModalSendMessage">Send Message</button>
                <button class="btn btn-custom btn-primary btn-custom-small dropdown-item btnShowModalSendMessage">View map</button>
              </div>
            </div>
          </td>
        </tr>
      `)
      $tbody.find('.btn.btnInactiveGuard').last().click(() => {
          inActiveGuard(iGuardID);
      })
      $tbody.find('.btn.btnShowUpdateGuardModal').last().click(() => {
        showGuardModalUpdate(guard);
      })
      $tbody.find('.btn.btnShowModalResetPassword').last().click(() => {
        showGuardModalResetPass(guard);
      })
      $tbody.find('.btn.btnShowModalSendMessage').last().click(() => {
        showModalSendMessage(guard);
      })
    })
  }

  $table.append($thead).append($tbody);

}

function showModalSendMessage(guard){
  const { iGuardID, sGuardName } = guard;
  currentSendMessageGuard = guard;
  $('#txtSendMessageGuardName').val(sGuardName);
  $('#textAreaSendMessage').val('')
  $('#modalSendMessageGuard').modal('show');
}

async function sendMessageGuard(){
  const { iGuardID } = currentSendMessageGuard;
  let sMessageContent = $('#textAreaSendMessage').val();
  console.log(sMessageContent);
  let sentData = { iGuardID, sMessageContent };
  let response = await Service.sendMessageGuard(sentData);
  console.log(response);
  $('#modalSendMessageGuard').modal('hide');
  showAlertSuccess("Send successfully!", "", 2000);
}

function showGuardModalResetPass(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
}

function showGuardModalUpdate(guard){
  const { iGuardID, sGuardName, sGuardPhone, sGuardUserName, bActive} = guard
  $('#txtUpdateGuardID').val(iGuardID);
  $('#txtUpdateGuardPhone').val(sGuardPhone);
  $('#txtUpdateGuardName').val(sGuardName);
  $('#txtUpdateGuardUsername').val(sGuardUserName);
  $('#modalUpdateGuard').modal('show');
}

function showGuardModalInsert(){
  $('#formInsertGuard')[0].reset();
  $('#modalInsertGuard').modal('show');
}

async function showGuards(){
  let guards = await Service.getPersonalGuardsInfo();
  renderGuardTable(guards);
}

