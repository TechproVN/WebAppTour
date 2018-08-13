$(async() => {
  $('#btnShowReportSecuriity').click(showSecurityReport);
  $('#btnShowReportSecuriityChart').click(showChartSecurityReport)
  $('#btnViewMonthlyPatrorllingReport').click(() => {
    showSecurityReport('month');
  })
  $('#btnViewWeeklyPatrorllingReport').click(() => {
    showSecurityReport('week');
  })
  $('#btnViewChartWeeklyPatrorllingReport').click(() => {

  })
  let data = await loadGuardsOnCombobox();
  if(data) arrGuardList = data;
  else arrGuardList = [];
  showMonthsSelect();
  showWeeksSelect();
  showRouteList(true);
  // showSecurityReportByDefault();

})

let arrDataChartWorkingTimeVsIdlingTime = [];
let arrDataChartWeeklyPatrollingPerformance = [];
let arrLabelsChartWorkingTimeVsIdlingTime = [];
let arrGuardList = [];
let guardHeader = '';

async function showSecurityReport(type){
  let iRouteID = $('#selectRouteNameReportSecurity').val();
  let sentData = { iRouteID, iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'week'){
    let week = $('#reportWeek').val();
    sentData.iWeek = week;
  }else{
    let month = $('#reportMonth').val();
    sentData.iMonth = month;
  }
  console.log(JSON.stringify(sentData));
  let data = await Service.getReportPerformanceChart(sentData);
  console.log(data);
  // arrDataChartWorkingTimeVsIdlingTime.length = 0;
  // arrDataChartWeeklyPatrollingPerformance.length = 0;
  // arrLabelsChartWorkingTimeVsIdlingTime.length = 0;

  // let guard = arrGuardList.find(g => g.iGuardId == iGuardIDIN);
  // if(guard) {
  //   const { sGuardName } = guard;
  //   guardHeader = `${sGuardName} - ${from} -> ${to}`
  // }
  // $('.headerTblReportSecurityWeek').text(guardHeader);

  // if(data){
  //   data.forEach(weekData => {
  //     const { dIdling_Time_in, dWorking_Time, dWeek, dPerformance_Routes, dPerformance_Timing, dPerformance_Routing, dOverall_performance } = weekData;

  //     arrDataChartWorkingTimeVsIdlingTime.push([Number(dIdling_Time_in), Number(dWorking_Time)]);

  //     arrLabelsChartWorkingTimeVsIdlingTime.push(dWeek);

  //     arrDataChartWeeklyPatrollingPerformance.push([Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing), Number(dOverall_performance)]);
  //   })
  //   renderSecurityReportTable(data);
  // }else{
  //   showAlertError("No data available", "", 3000);
  //   resetTblSecurityReport();
  // }
  renderSecurityReportTable(data);
  setDefaultLang();
}

// async function showSecurityReportByDefault(){
//   let currentDate = getCurrentDate();
//   let prevMonth = getPreviousMonth();
//   let fromDate = `${prevMonth.month + 1}/${prevMonth.day}/${prevMonth.year}`;
//   let toDate = `${currentDate.month + 1}/${currentDate.day}/${currentDate.year}`;
//   $('#fromDateReportSecurity').val(fromDate);
//   $('#toDateReportSecurity').val(toDate);
//   let iGuardIDIN = $('#selectGuardNameReportSecurity').val();
//   let sentData = { iGuardIDIN, fromDate: changeFormatDateTime(fromDate), toDate: changeFormatDateTime(toDate) };
  
//   let data = await Service.getReportPerformanceChart(sentData);
//   console.log(data);
//   arrDataChartWorkingTimeVsIdlingTime.length = 0;
//   arrDataChartWeeklyPatrollingPerformance.length = 0;
//   arrLabelsChartWorkingTimeVsIdlingTime.length = 0;

//   let guard = arrGuardList.find(g => g.iGuardId == iGuardIDIN);
//   if(guard) {
//     const { sGuardName } = guard;
//     guardHeader = `${sGuardName} - ${fromDate} -> ${toDate}`
//   }
//   $('.headerTblReportSecurityWeek').text(guardHeader);

//   if(data){
//     data.forEach(weekData => {
//       const { dIdling_Time_in, dWorking_Time, dWeek, dPerformance_Routes, dPerformance_Timing, dPerformance_Routing, dOverall_performance } = weekData;

//       arrDataChartWorkingTimeVsIdlingTime.push([Number(dIdling_Time_in), Number(dWorking_Time)]);

//       arrLabelsChartWorkingTimeVsIdlingTime.push(dWeek);

//       arrDataChartWeeklyPatrollingPerformance.push([Number(dPerformance_Routes), Number(dPerformance_Timing), Number(dPerformance_Routing), Number(dOverall_performance)]);
//     })
//     renderSecurityReportTable(data);
//   }else{
//     showAlertError("No data available", "", 3000);
//     resetTblSecurityReport();
//   }
//   setDefaultLang();
// }

function resetTblSecurityReport(){
  $('#tblReportSecurity').find('tbody').html('');
  $('#totalSecurityReportRows').html('');
  $('#pagingSecurityReportControl').html('');
  $('.headerTblReportSecurityWeek').html('');
}

function renderSecurityReportTable(data) {
  let $table = $('#tblReportSecurity');
  $table.html('');
  let $thead = $('<thead class="custom-table-header"></thead>');
  let $tbody = $('<tbody></tbody>');
  console.log(data);
  if (data) {
    $thead.append('<tr></tr>');
    $thead.find('tr').append(`<th class="trn">Reporting Week</th>`)
    data.map(item => item.dWeek).forEach(item => {
      $thead.find('tr').append(`<th class="trn">${item}</th>`);
    })
    let arrRows = ['Performance Route', 'Performance Timing', 'Performance Routing', 'Overall Performance', 'Working Time', 'Idling Time', 'Spot check'];
    arrRows.forEach((rowName, index) => {
      $tbody.append('<tr></tr>');
      $tbody.find('tr').last().append(`<td class="trn">${rowName}</td>`);
      let rowData = [];
      if(index == 0){
        rowData = data.map(item => item.dPerformance_Routes);
      }else if(index == 1){
        rowData = data.map(item => item.dPerformance_Timing);
      }else if(index == 2){
        rowData = data.map(item => item.dPerformance_Routing);
      }else if(index == 3){
        rowData = data.map(item => item.dOverall_performance);
      }else if(index == 4){
        rowData = data.map(item => item.dWorking_Time);
      }else if(index == 5){
        rowData = data.map(item => item.dIdling_Time_in);
      }else if(index == 6){
        rowData = data.map(item => '');
      }
      rowData.forEach(item => {
        $tbody.find('tr').last().append(`<td>${item}</td>`);
      })
    })
  }

  $table.append($thead).append($tbody);
}

function showChartSecurityReport(){
  buildChartWorkingTimeVsIdlingTime();
  buildChartWeeklyPatrollingPerformance();
  $('.headerChartReportSecurity').text(guardHeader)
  $('#modalSecurityReportChart').modal('show');
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
  $chartArea = $('<canvas style="width: 100%" height="300" id="chartWorkingTimeVsIdlingTime"></canvas>');
  $('#modalSecurityReportChart').find('.chartWorkingTimeVsIdlingTime').html($chartArea);
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