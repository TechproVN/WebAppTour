$(() => {
  $('#btnShowReportWeek').click(() => {
    showTourDetailsTable('week');
  })
  $('#btnShowReportMonth').click(() => {
    showTourDetailsTable('month');
  })
  $('#btnShowChartByWeek').click(() => {
    showChart('week');
  })
  $('#btnShowChartByMonth').click(() => {
    showChart('month');
  })

  showRouteList(true);
  showMonthsSelect();
  showWeeksSelect();
  setDefaultLoading();
})

let arrLabels = [];
let arrPerformance_Routing = [];


async function showChart(type){
  let iRouteID = $('#selectRouteName').val();
  let sentData = { iRouteID, iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'week') sentData.iMonth = $('#reportMonth').val();
  else sentData.iWeek = $('#reportWeek').val();
  let data = await Service.getTourDetail(sentData);
  console.log(data);
  if(!data) return showAlertError("No data available!!", "", 5000);
  // buildLineChart(data);
  // buildBarChart(data);
}

function buildLineChart(data){

}

function buildBarChart(data){

}

function buildChartWeeklyPatrollingPerformance(){
  $chartArea = $('<canvas style="width: 100%" height="300" id="chartWeeklyPatrollingPerformance"></canvas>');
  $('#modalSecurityReportChart').find('.chartWeeklyPatrollingPerformance').html($chartArea);
  let $chartWeeklyPatrolling = $('#chartWeeklyPatrollingPerformance');
  let ctx = $chartWeeklyPatrolling[0].getContext('2d');
  // ctx.height(500);
  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let bgColor2 = 'rgba(75, 192, 192, 0.2)';
  let bgColor3 = 'rgba(153, 102, 255, 0.2)';
  let bgColor4 = 'rgba(255, 159, 64, 0.2)';

  let borderColor1 = 'rgba(75, 192, 192, 1)';
  let borderColor2 = 'rgba(153, 102, 255, 1)';
  let borderColor3 = 'rgba(255, 159, 64, 1)';
  let borderColor4 = 'red';

  var chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrLabelsChartWorkingTimeVsIdlingTime,
        datasets: [{
					label: "Performance Routes",
					backgroundColor: borderColor1,
					borderColor: borderColor1,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[0]),
					fill: false,
				},{
					label: "Performance Timing",
					backgroundColor: borderColor2,
					borderColor: borderColor2,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[1]),
					fill: false,
				},{
					label: "Performance Routing",
					backgroundColor: borderColor3,
					borderColor: borderColor3,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[2]),
					fill: false,
				},{
					label: "Overall Performance",
					backgroundColor: borderColor4,
					borderColor: borderColor4,
					data: arrDataChartWeeklyPatrollingPerformance.map(a => a[3]),
					fill: false,
				}]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Weekly Patroll Performance'
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: ''
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            // steps: 10,
            // stepValue: 20,
            stepSize: 20,
            max: 110,
            min: 0,
            callback: function(value, index, values) {
                return value + "%";
            },
          },
          scaleLabel: {
            display: true,
            // labelString: '%'
          }
        }]
      }  
    } 
  });
}

function buildBarChart(data){
  $chart = $('<canvas style="width: 100%" height="300"></canvas>');
  $('#modalChartReport').find('.modal-body').html($chart);
  let ctx = $chart[0].getContext('2d');
  let length = arrDataChartWorkingTimeVsIdlingTime.length;
  const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = getColorVsBgColor(length);
  var chartTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: arrLabelsChartWorkingTimeVsIdlingTime,
      datasets: [{
        label: 'Idling Time',
        data: arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[0]),
        backgroundColor: arrBgColor1,
        borderColor: arrBorderColor1,
        borderWidth: 1
      },
      {
        label: 'Working Time',
        data: arrDataChartWorkingTimeVsIdlingTime.map(arr => arr[1]),
        backgroundColor: arrBgColor2,
        borderColor: arrBorderColor2,
        borderWidth: 1
      }
    ],
    },  
    options:{
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      },
      title: {
        display: true,
        text: 'Working Time Vs Idling Time'
      },
    },
  });
}

function setDefaultLoading(){
  let d = new Date();
  let month = d.getMonth();
  let week = getWeek();
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