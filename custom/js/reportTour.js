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
        <th class="trn">Route</th>
        <th class="trn">Date</th>
        <th class="trn">Day</th>
        <th class="trn">Week</th>
        <th class="trn">Month</th>
        <th class="trn">Per. routes</th>
        <th class="trn">Per. Routing</th>
        <th class="trn">Per. Timing</th>
        <th class="trn">Per. Time</th>
        <th class="trn">Idling Time</th>
        <th class="trn">Number issued</th>        
      </tr>
    `
  )
  if (data) {
    data.forEach((tour) => {
      const {dDateReport, sDayName, iWeek, iMonth, sRouteName, dPerformance_Routes, dPerformance_Routing, dPerformance_Timing, dPerfomance_Time, dIdling_Time_in, iNumber_of_reports_issued} = tour;
      $tbody.append(`
        <tr>
          <td>${sRouteName}</td>
          <td>${dDateReport}</td>
          <td>${sDayName}</td>
          <td>${iWeek}</td>
          <td>${iMonth}</td>
          <td>${dPerformance_Routes} %</td>
          <td>${dPerformance_Routing} %</td>
          <td>${dPerformance_Timing} %</td>
          <td>${dPerfomance_Time} %</td>
          <td>${dIdling_Time_in} %</td>
          <td>${iNumber_of_reports_issued}</td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}