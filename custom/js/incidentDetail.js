$(() => {
  $('#btnShowIncidentsType').click(showIncidentsType);
  showIncidentsType();
})

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
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}