$(async () => {
  $('#btnShowSecuriity').click(showSecurity);
  let data = await loadGuardsOnCombobox();
  console.log(data);
  if(data) arrGuardList = data;
  else arrGuardList = [];
  showSecurityReportByDefault();
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
      header = `${sGuardName} - ${from} -> ${to}`;
    }
    if(data) showSecurityPagination(data, header)
    else{
      resetTblReportSecurity();
      showAlertError("No data available", "", 3000);
    }
  }
  setDefaultLang();
}

async function showSecurityReportByDefault(){
  let yesterday = getYesterday();
  let today = getCurrentDate();
  let fromDate = `${yesterday.month + 1}/${yesterday.day}/${yesterday.year}`;
  let toDate = `${today.month + 1}/${today.day}/${today.year}`;
  $(`#fromDateReportSecurity`).val(fromDate);
  $(`#toDateReportSecurity`).val(toDate);
  let GuardID = $('#selectGuardNameReportSecurity').val();
  let sentData = { fromDate: changeFormatDateTime(fromDate), toDate: changeFormatDateTime(toDate), GuardID };
  console.log(JSON.stringify(sentData));
  data = await Service.getReportPerformance(sentData);
  console.log(data);
  let header = '';
  let guard = arrGuardList.find(g => g.iGuardId == GuardID);
  if(guard){
    const { sGuardName } = guard;
    header = `${sGuardName} - ${from} -> ${to}`;
  }
  if(data) showSecurityPagination(data, header)
  else{
    resetTblReportSecurity();
    showAlertError("No data available", "", 3000);
  }
  setDefaultLang();
}

function showSecurityPagination(data, header){
  $('.headerTblReportSecurity').text(header);
  $('#totalSecurityReportRows').html(`<strong class="trn">Total rows</strong>: ${data.length}`);
  $('#pagingSecurityReportControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderSecurityTable(data);
      $('.card-securityReport .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblReportSecurity(){
  $('.headerTblReportSecurity').text('');
  $('#totalSecurityReportRows').html('');
  $('#pagingSecurityReportControl').html('');
  $('#tblReportSecurity').find('tbody').html('')
}

function renderSecurityTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportSecurity"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th class="trn">Week No.</th>
        <th class="trn">Day</th>
        <th class="trn">Date</th>
        <th class="trn">Guard</th>
        <th class="trn">Performance Route</th>
        <th class="trn">Performance Timing</th>
        <th class="trn">Performance Routing</th>
        <th class="trn">Performance Time</th>
        <th class="trn">Idle Time</th>
        <th class="trn">Spot check</th>
        <th class="trn">Remarks</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((security) => {
      const { dDAYNAME, dDateTimeUpdate, dIdling_Time_in, dPerfomance_Time, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dWeek, sGuardName } = security;
      $tbody.append(`
        <tr>
          <td>${dWeek}</td>
          <td>${dDAYNAME}</td>
          <td>${dDateTimeUpdate}</td>
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