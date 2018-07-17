$(() => {
  $('#btnShowSchedule').click(showSchedule);
  $('#btnShowScheduleInsertModal').click(showInsertScheduleModal);
  $('#btnInsertIncident').click(insertDefineIncident);
  $('#btnUpdateIncident').click(updateIncident);
  showSchedule();
})

let currentUpdateIncident = null;

function showInsertScheduleModal(){
  $('#modalInsertSchedule').modal('show');
}

async function showSchedule(){
  let data = await Service.getSchedule();
  console.log(123);
  console.log(data);
  if(data){
    $('#totalSchedule').html(`<strong>Total Rows:</strong> ${data.length}`)
    $('#pagingScheduleControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderTblSchedule(data);
        $('.card-schedule .table-responsive').html($table);
      }
    })
  }else{
    resetTblSchedule();
    showAlertError("No data available", "", 3000);
  }
}

async function insertDefineIncident(){
  let content = $('#txtInsertIncident').val();
  if(!Validation.checkEmpty(content)) return showAlertError("invalid data", "Content must be filled");
  let sentData = { sAlertContent: content, iAlertContentID: 0, bStatusIN: 1 };
  console.log(sentData);
  let response = await Service.insertIncident(sentData);
  console.log(response);
  showIncidentsType();
  showAlertSuccess("Insert Successfully", "", 3000);
}

function resetTblSchedule(){
  $('#totalSchedule').html('');
  $('#pagingScheduleControl').html('');
  $('#tblSchedule').find('tbody').html('');
}

function renderTblSchedule(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblSchedule"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">ID</th>
        <th class="trn">Name</th>
        <th class="trn">Start</th>
        <th class="trn">End</th>
        <th class="trn">Status</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((schedule) => {
      const { bStatus, dTimeEnd, dTimeStart, iScheduleID, sScheduleName } = schedule;
      $tbody.append(`
        <tr>
          <td>${iScheduleID}</td>
          <td>${sScheduleName}</td>
          <td>${dTimeStart}</td>
          <td>${dTimeEnd}</td>
          <td>${bStatus}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateScheduleModal btn-custom-small">Update</button>
            <button class="btn btn-custom bg-main-color btnInactiveShedule btn-custom-small">Delete</button>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateScheduleModal').last().click(() => {
        showUpdateScheduleModal(schedule);
      })
      $tbody.find('.btnInactiveShedule').last().click(() => {
        inactiveSchedule(schedule);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateScheduleModal(schedule){
  const { sIncidentContent } = incident;
  currentUpdateIncident = Object.assign({}, incident);
  $('#modalUpdateSchedule').modal('show');
  $('#txtUpdateSchedule').val(sIncidentContent);
}

async function updateSchedule(){
  let content = $('#txtUpdateIncidentContent').val();
  if(!Validation.checkEmpty(content)) return showAlertError("invalid data", "Content must be filled");
  const { iIncidentID } = currentUpdateIncident;
  let sentData = { sAlertContent: content, iAlertContentID: iIncidentID, bStatusIN: 2 };
  console.log(sentData);
  let response = await Service.updateIncident(sentData);
  console.log(response);
  showIncidentsType();
  showAlertSuccess("Insert Successfully", "", 3000);
}

async function inactiveSchedule(schedule){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    const { iScheduleID } = schedule;
    let sentData = { iScheduleIDIN: iScheduleID, sScheduleNameIN: 0, dTimeStartIN: 0, dTimeEndIN: 0, bStatusIN: 3 };
    let response = await Service.inactiveSchedule(sentData);
    showSchedule();
    showAlertSuccess("Delete Successfully", "", 3000);
  }
}

function showDefineIncidentInsertModal(){
  $('#modalInsertDefineIncident').modal('show');
  $('txtInsertIncident').val('');
}