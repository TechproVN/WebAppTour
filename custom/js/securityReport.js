$(() => {
  $('#btnShowReportSecuriity').click(showSecurityReport);
  $('#btnShowReportSecuriityChart').click(showChartSecurityReport)
  loadGuardsOnCombobox();
})
let arrDataChartWorkingTimeVsIdlingTime = [];
let arrDataChartWeeklyPatrollingPerformance = [];
let arrLabelsChartWorkingTimeVsIdlingTime = [];

async function showSecurityReport(){
  let iGuardIDIN = $('#selectGuardNameReportSecurity').val();
  let from = $('#fromDateReportSecurity').val();
  let to = $('#toDateReportSecurity').val();
  if(checkDate(from, to)){
    let fromDate = changeFormatDateTime(from);
    let toDate = changeFormatDateTime(to);
    let sentData = { iGuardIDIN, fromDate, toDate };
    let data = await Service.getReportPerformanceChart(sentData);
    console.log(data);
    arrDataChartWorkingTimeVsIdlingTime.length = 0;
    arrDataChartWeeklyPatrollingPerformance.length = 0;
    arrLabelsChartWorkingTimeVsIdlingTime.length = 0;
    if(data){
      data.forEach(weekData => {
        const { dIdling_Time_in, dWorking_Time, dWeek, dPerformance_Routes, dPerformance_Timing, dPerformance_Routing, dOverall_performance } = weekData;

        arrDataChartWorkingTimeVsIdlingTime.push([Number(dIdling_Time_in), Number(dWorking_Time)]);

        arrLabelsChartWorkingTimeVsIdlingTime.push(dWeek);

        arrDataChartWeeklyPatrollingPerformance.push([Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing), Number(dOverall_performance)]);
      })
      // arrDataChartWorkingTimeVsIdlingTime = 
      $('#totalSecurityReportRows').html(`<strong>Total rows: </strong>${data.length}`);
      $('#pagingSecurityReportControl').pagination({
        dataSource: data,
        pageSize: 10,
        showGoInput: true,
        showGoButton: true,
        callback: function (data, pagination) {
          let $table = renderSecurityReportTable(data);
          $('.card-securityReport .table-responsive').html($table);
        }
      })
    }else{
      resetTblSecurityReport();
    }
  }
}

function resetTblSecurityReport(){
  $('#tblReportSecurity').find('tbody').html('');
  $('#totalSecurityReportRows').html('');
  $('#pagingSecurityReportControl').html('');
}

function renderSecurityReportTable(data) {
  let $table = $(`<table class="table table-hover table-striped table-condensed text-center custom-table" id="tblReportSecurity"></table>`)
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  $thead.html(
    `
      <tr>
        <th>Reporting Week</th>
        <th>Perforamnce Route</th>
        <th>Perforamnce Timing</th>
        <th>Perforamnce Routing</th>
        <th>Overall Perforamnce</th>
        <th>Working Time</th>
        <th>Idling Time</th>
        <th>Spot check</th>
      </tr>
    `
  )
  if (data) {
    data.forEach((security) => {
      const { dIdling_Time_in, dOverall_performance,dPerformance_Timing, dPerformance_Routes, dPerformance_Routing, dWeek, sGuardName, dWorking_Time
      } = security;
      $tbody.append(`
        <tr>
          <td>${dWeek}</td>
          <td>${dPerformance_Routes}</td>
          <td>${dPerformance_Timing}</td>
          <td>${dPerformance_Routing}</td>
          <td>${dOverall_performance}</td>
          <td>${dWorking_Time}</td>
          <td>${dIdling_Time_in}</td>
          <td></td>
        </tr>
      `)
    })
  }

  $table.append($thead).append($tbody);
  return $table;
}

function showChartSecurityReport(){
  buildChartWorkingTimeVsIdlingTime();
  buildChartWeeklyPatrollingPerformance();
  $('#modalSecurityReportChart').modal('show');
}

function buildChartWeeklyPatrollingPerformance(){
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

  console.log('patrolling '+arrDataChartWeeklyPatrollingPerformance)
// arrDataChartWeeklyPatrollingPerformance
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

function buildChartWorkingTimeVsIdlingTime(){
  let $chartWorkingTimeVsIdlingTime = $('#chartWorkingTimeVsIdlingTime');
  let ctx = $chartWorkingTimeVsIdlingTime[0].getContext('2d');
  console.log(arrDataChartWorkingTimeVsIdlingTime);
  // ctx.height(500);
  // $chartWorkingTimeVsIdlingTime.height(500);
  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let borderColor1 = 'rgba(255,99,132,1)';
  let bgColor2 = 'rgba(255, 159, 64, 0.2)';
  let borderColor2 = 'rgba(255, 159, 64, 1)';

  let arrBgColor1 = [];
  let arrBorderColor1 = [];
  let arrBgColor2 = [];
  let arrBorderColor2 = [];

  arrDataChartWorkingTimeVsIdlingTime.forEach(item => {
    arrBgColor1.push(bgColor1);
    arrBorderColor1.push(borderColor1);
    arrBgColor2.push(bgColor2);
    arrBorderColor2.push(borderColor2);
  })
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