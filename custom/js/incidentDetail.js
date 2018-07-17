$(() => {
  $('#btnShowIncidentsType').click(showIncidentsType);
  $('#btnShowIncidentsInsertModal').click(showDefineIncidentInsertModal);
  $('#btnInsertIncident').click(insertDefineIncident);
  $('#btnUpdateIncident').click(updateIncident);
  showIncidentsType();
})

let currentUpdateIncident = null;

async function showIncidentsType(){
  let data = await Service.getIncidentContent();
  console.log(data);
  if(data){
    $('#totalIncidentTypes').html(`<strong>Total Rows:</strong> ${data.length}`)
    $('#pagingIncidentTypesControl').pagination({
      dataSource: data,
      pageSize: 10,
      showGoInput: true,
      showGoButton: true,
      callback: function (data, pagination) {
        // template method of yourself
        let $table = renderIncidentTypes(data);
        $('.card-incident-type .table-responsive').html($table);
      }
    })
  }else{
    resetTblIncidentType();
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

function resetTblIncidentType(){
  $('#totalIncidentTypes').html('');
  $('#pagingIncidentTypesControl').html('');
  $('#tblIncidentTypes').find('tbody').html('');
}

function renderIncidentTypes(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblIncidentTypes"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">ID</th>
        <th class="trn">Content</th>
        <th class="trn"></th>
      </tr>
    `
  )
  if (data) {
    data.forEach((incident) => {
      const { iIncidentID, sIncidentContent } = incident;
      $tbody.append(`
        <tr>
          <td>${iIncidentID}</td>
          <td>${sIncidentContent}</td>
          <td>
            <button class="btn btn-custom bg-main-color btnShowUpdateIncidentModal btn-custom-small">Update</button>
            <button class="btn btn-custom bg-main-color btnDeleteIncident btn-custom-small">Delete</button>
          </td>
        </tr>
      `)
      $tbody.find('.btnShowUpdateIncidentModal').last().click(() => {
        showUpdateIncidentModal(incident);
      })
      $tbody.find('.btnDeleteIncident').last().click(() => {
        deleteIncident(incident);
      })
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showUpdateIncidentModal(incident){
  const { sIncidentContent } = incident;
  currentUpdateIncident = Object.assign({}, incident);
  $('#modalUpdateDefineIncident').modal('show');
  $('#txtUpdateIncidentContent').val(sIncidentContent);
}

async function updateIncident(){
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

async function deleteIncident(incident){
  let sure = await showAlertWarning("Are you sure?", "");
  if(sure){
    const { iIncidentID } = incident;
    let sentData = { iAlertContentID: iIncidentID, sAlertContent: 0, bStatusIN: 3 };
    console.log(JSON.stringify(sentData));
    let response = await Service.deleteIncident(sentData);
    console.log(response);
    showIncidentsType();
    showAlertSuccess("Delete Successfully", "", 3000);
  }
}

function showDefineIncidentInsertModal(){
  $('#modalInsertDefineIncident').modal('show');
  $('txtInsertIncident').val('');
}