$(() => {
  $('#btnShowReportWeek').click(() => {
    showTourDetailsTable('week');
  })
  $('#btnShowReportMonth').click(() => {
    showTourDetailsTable('month');
  })

  showRouteList(true);
  showMonthsSelect();
  showWeeksSelect();
  setDefaultLoading();
})

function setDefaultLoading(){
  let d = new Date();
  let month = d.getMonth();
  let week = getWeek();
  console.log(week)
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  showTourDetailsTable('month');
}

async function showTourDetailsTable(type){
  let iRouteID = $('#selectRouteName').val();
  let sentData = { iRouteID, iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'month') sentData.iMonth = $('#reportMonth').val();
  else sentData.iWeek = $('#reportWeek').val();
  let data = await Service.getTourDetail(sentData);
  console.log(data);
  $('.headerTblReportTour').text('');
  if(data) showReportPagination(data);
  else{
    resetTblTourReport();
    showAlertError("No data avilable", "", 3000);
  }
  setDefaultLang();
}

function showReportPagination(data){
  $('#totalTourReportRows').html(`<strong class="trn">Total rows</strong>: ${data.length}`);
  $('#pagingToursControl').pagination({
    dataSource: data,
    pageSize: 10,
    className: 'paginationjs-theme-green paginationjs-big',
    showGoInput: true,
    showGoButton: true,
    callback: function (data, pagination) {
      let $table = renderTourReportTable(data);
      $('.card-tourReport .table-responsive').html($table);
      setDefaultLang();
    }
  })
}

function resetTblTourReport(){
  $('#totalTourReportRows').html('');
  $('#pagingToursControl').html('');
  $('#tblReportTour').find('tbody').html('');
  $('.headerTblReportTour').text('');
}

function renderTourReportTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportTour"></table>`)
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');

  $thead.html(
    `
      <tr>
        <th class="trn">Code</th>
        <th class="trn">Guard</th>
        <th class="trn">Zone</th>
        <th class="trn">Date</th>
        <th class="trn">Started</th>
        <th class="trn">Finished</th>
        <th class="trn">No.</th>
        <th class="trn">Time</th>
        <th class="trn">Schedule</th>
        <th class="trn">Point</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((tour) => {
      const { dDateTimeEnd, dDateTimeIntinial, dDateTimeStart, dPointChecked, dTimeSchedule, dTimeTour, iNoTour, sCheckingCode, sGuardName, sZoneName } = tour;
      $tbody.append(`
        <tr>
          <td>${sCheckingCode}</td>
          <td>${sGuardName}</td>
          <td>${sZoneName}</td>
          <td>${dDateTimeIntinial}</td>
          <td>${dDateTimeStart}</td>
          <td>${dDateTimeEnd}</td>
          <td>${iNoTour}</td>
          <td>${dTimeTour}</td>
          <td>${dTimeSchedule}</td>
          <td>${dPointChecked}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}