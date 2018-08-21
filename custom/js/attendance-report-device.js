$(() => {
  $('#btnShowReportWeek').click(() => {
    showAttendanceReportTable('week');
  })
  $('#btnShowReportMonth').click(() => {
    showAttendanceReportTable('month');
  })
  $('#btnShowReportYear').click(() => {
    showAttendanceReportTable('year');
  })

  $('#btnShowChartByWeek').click(() => {
    showAttendanceReportChart('week');
  })
  $('#btnShowChartByMonth').click(() => {
    showAttendanceReportChart('month');
  })
  $('#btnShowChartByYear').click(() => {
    showAttendanceReportChart('year');
  })

  showSelectDevices();
  showWeeksSelect();
  showMonthsSelect();
  showYearsSelect();
  setDefaultLoading();
})

function buildLineChart(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#modalChartReport').find('#lineChart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  
  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let bgColor2 = 'rgba(75, 192, 192, 0.2)';
  let bgColor3 = 'rgba(153, 102, 255, 0.2)';
  let bgColor4 = 'rgba(255, 159, 64, 0.2)';
  let bgColor5 = 'rgba(100, 159, 64, 0.2)';

  let borderColor1 = 'rgba(75, 192, 192, 1)';
  let borderColor2 = 'rgba(153, 102, 255, 1)';
  let borderColor3 = 'rgba(255, 159, 64, 1)';
  let borderColor4 = 'red';
  let borderColor5 = 'pink';

  let arrLabels = getLabelsChart(chartData, type);
  
  var chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels:arrLabels,
        datasets: [{
					label: "Performance Routes",
					backgroundColor: borderColor1,
					borderColor: borderColor1,
					data: chartData.map(item => Number(item.dPerformance_Routes)),
					fill: false,
				}, {
					label: "Performance Routing",
					backgroundColor: borderColor2,
					borderColor: borderColor2,
					data: chartData.map(item => Number(item.dPerformance_Routing)),
					fill: false,
				},{
					label: "Performance Timing",
					backgroundColor: borderColor3,
					borderColor: borderColor3,
					data: chartData.map(item => Number(item.dPerformance_Timing)),
					fill: false,
				},{
					label: "Performance Time",
					backgroundColor: borderColor4,
					borderColor: borderColor4,
					data: chartData.map(item => Number(item.dPerfomance_Time)),
					fill: false,
				},{
					label: "Idling Time",
					backgroundColor: borderColor5,
					borderColor: borderColor5,
					data: chartData.map(item => Number(item.dIdling_Time_in)),
					fill: false,
				}]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: ''
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

function getLabelsChart(chartData, type){
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay);
  if(type.toLowerCase() == 'month') 
    return chartData.map(item => `Week ${item.iWeek}`);
  return chartData.map(item => arrMonths[Number(item.iMonth) - 1]);
}

function buildChartWorkingTimeVsIdlingTime(chartData, type){
  let $chartCanvas = $('<canvas style="width: 100%; height:70vh" class="canvas-reponsive"></canvas>');
  $('#chart').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let length = chartData.length;
  const { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 } = getColorVsBgColor(length);
  var chartTime = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: getLabelsChart(chartData, type),
      datasets: [{
        label: 'Working Time',
        data: chartData.map(item => Number(item.dWorkingPercent)),
        backgroundColor: arrBgColor2,
        borderColor: arrBorderColor2,
        borderWidth: 1
      },{
        label: 'Idling Time',
        data: chartData.map(item => Number(item.dIdlingPercent)),
        backgroundColor: arrBgColor1,
        borderColor: arrBorderColor1,
        borderWidth: 1
      },
    ],
    },  
    options:{
      scales: {
        xAxes: [{
          stacked: true,
          barPercentage: 0.5,
          ticks: {
            fontSize: 15
          }
        }],
        yAxes: [{
          stacked: true,
        }]
      },
      title: {
        display: true,
        text: 'Working Time Vs Idling Time',
        fontSize: 25
      },
    },
  });
}

async function showAttendanceReportChart(type){
  let iDeviceID = $('#selectDevice').val();
  let sentData = {iDeviceID, iKindSearch: 0, iValue: 2018 };
  if (type.toLowerCase() == 'week'){
    sentData.iValue = $('#reportWeek').val();
    sentData.iKindSearch = 1;
  }
  else if(type.toLowerCase() == 'month') {
    sentData.iValue = $('#reportMonth').val();
    sentData.iKindSearch = 2;
  }
  else if (type.toLowerCase() == 'year'){
    sentData.iValue = $('#reportYear').val();
    sentData.iKindSearch = 3;
  }
  console.log(JSON.stringify(sentData));
  let data = await Service.getReportWorkingvsIdlingTimeDeviceData(sentData);
  console.log(data);
  if(data) return buildChartWorkingTimeVsIdlingTime(data, type);
  $('#chart').html('');
  showAlertError("No data available!!", "");
}



async function showAttendanceReportTable(type){
  // let iGuardID = $('#selectGuard').val();
  // let sentData = {iGuardID, iKindSearch: 0, iValue: 2018 };
  // if (type.toLowerCase() == 'week'){
  //   sentData.iValue = $('#reportWeek').val();
  //   sentData.iKindSearch = 1;
  // }
  // else if(type.toLowerCase() == 'month') {
  //   sentData.iValue = $('#reportMonth').val();
  //   sentData.iKindSearch = 2;
  // }
  // else if (type.toLowerCase() == 'year'){
  //   sentData.iValue = $('#reportYear').val();
  //   sentData.iKindSearch = 3;
  // }
  // console.log(sentData);
  // let data = await Service.getReportWorkingvsIdlingTimeGuardData(sentData);
  // console.log(data);
  // $('.headerTblReportTour').text('');
  // if(data) showReportPagination(data);
  // else{
  //   resetTblTourReport();
  //   showAlertError("No data avilable", "", 3000);
  // }
  // setDefaultLang();
}

function setDefaultLoading(){
  let d = new Date();
  let week = getWeek();
  let month = d.getMonth();
  let year = d.getFullYear();
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  $('#reportYear').val(year);
 
}