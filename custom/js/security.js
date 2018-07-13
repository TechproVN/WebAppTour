$(async () => {
  $('#btnShowSecuriity').click(showSecurity);
  let data = await loadGuardsOnCombobox();
  console.log(data);
  if(data) arrGuardList = data;
  else arrGuardList = [];
})

let arrGuardList = [];

async function showSecurity(){
  let iGuardIDIN = $('#selectGuardNameReportSecurity').val();
  let from = $('#fromDateReportSecurity').val();
  let to = $('#toDateReportSecurity').val();
  if(checkDate(from, to)){
    let fromDate = changeFormatDateTime(from);
    let toDate = changeFormatDateTime(to);
    let sentData = { iGuardIDIN, fromDate, toDate };
    let data = await Service.getReportPerformance(sentData);
    console.log(data);
    let header = '';
    let guard = arrGuardList.find(g => g.iGuardId == iGuardIDIN);
    console.log(guard);
    if(guard){
      const { sGuardName } = guard;
      header = `${sGuardName} - ${from} -> ${to}`
    }
    $('.headerTblReportSecurity').text(header);
    if(data){
      $('#totalSecurityReportRows').html(`<strong>Total rows: </strong>${data.length}`);
      $('#pagingSecurityReportControl').pagination({
        dataSource: data,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
          let $table = renderSecurityTable(data);
          $('.card-securityReport .table-responsive').html($table);
        }
      })
    }else{
      $('#totalSecurityReportRows').html('');
      $('#pagingSecurityReportControl').html('');
      let $table = renderSecurityTable(data);
      $('.card-securityReport .table-responsive').html($table);
    }
  }
}

function renderSecurityTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportSecurity"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th>Day</th>
        <th>Date</th>
        <th>Week No.</th>
        <th>Guard Name</th>
        <th>Performance Route</th>
        <th>Performance Timing</th>
        <th>Performance Routing</th>
        <th>Performance Time</th>
        <th>Idle Time</th>
        <th>Spot check</th>
        <th>Remarks</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((security) => {
      const { dDAYNAME, dDateTimeUpdate, dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dWeek, sGuardName } = security;
      $tbody.append(`
        <tr>
          <td>${dDAYNAME}</td>
          <td>${dDateTimeUpdate}</td>
          <td>${dWeek}</td>
          <td>${sGuardName}</td>
          <td>${dPerformance_Routes}</td>
          <td>${dPerformance_Timing}</td>
          <td>${dPerformance_Routing}</td>
          <td>${dPerfomance_Time}</td>
          <td>${dIdling_Time_in}</td>
          <td></td>
          <td></td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function checkDate(from, to){
  let valid = true;
  let msgErr = '';
  if(!Validation.checkEmpty(from)){
    valid = false;
    msgErr += 'Start date must be filled\n'
  }
  if(!Validation.checkEmpty(to)){
    valid = false;
    msgErr += 'End date must be filled\n'
  }
  if(!valid){
    showAlertError("Invalid data", msgErr, 3000);
  }
  return valid;
}