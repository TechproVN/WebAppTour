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

  showGuardGroups();
  showWeeksSelect();
  showMonthsSelect();
  showYearsSelect();
  setDefaultLoading();
  
})

function setDefaultLoading(){
  let d = new Date();
  let week = getWeek();
  let month = d.getMonth();
  let year = d.getFullYear();
  $('#reportMonth').val(month + 1);
  $('#reportWeek').val(Number(week));
  $('#reportYear').val(year);
}

async function showAttendanceReportChart(type){
  let iGroupID = $('#selectGroup').val();
  let sentData = { iGroupID, iKindSearch: 0, iValue: 0 };
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
  let data = await Service.getReportWorkingvsIdlingTimeGuardGroup(sentData);
  console.log(data);
  if(!data){
    $('#chart').html('');
    showAlertError("No data available!!", "");
  }else{
    let chartData = getDataOnGuards(data, 'week');
    let arrLabels = getLabelsChart(data, type);
    buildLineChart(chartData, arrLabels, 'Time Attendance');
  }
}

function buildLineChart(chartData, arrLabels, title){
  let $chartCanvas = $('<canvas style="width: 100%" height="450"></canvas>');
  $('#chartWorkingTimeArea').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let datasets = chartData.map((line, index) => {
    return {
      label: line.label,
      backgroundColor: arrColors[index],
      borderColor: arrColors[index],
      data: line.data,
      fill: false,
    }
  })
  var chartPatroll = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrLabels,
        datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: title,
        fontSize: 20
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
  if(type.toLowerCase() == 'week') return chartData.map(item => item.sDay + ' ' + item.dDateCheck);
  if(type.toLowerCase() == 'month') 
    return chartData.map(item => `Week ${item.iWeek}`);
  return chartData.map(item => arrMonths[Number(item.iMonth) - 1]);
}

function getDataOnGuards(data, type){
  let guardsSet = new Set(data.map(item => item.iGuardID));
  let arrGuards = [...guardsSet];
  let arrDataGuards = [];
  arrGuards.forEach(g => {
    let arr = data.filter(item => {
      if(item.iGuardID == g) return item;
    });
    arrDataGuards.push(arr);
  })
  // let temp = arrDataGuards.map(item => {
  //   let label = [];
  //   if(type.toLowerCase() == 'week') label = item.map(ele => ele.sDay + ' ' + ele.dDateCheck)
  //   if(type.toLowerCase() == 'month') label = item.map(ele => ele.iWeek)
  //   if(type.toLowerCase() == 'year') label = item.map(ele => ele.iMonth)
  //   return { 
  //     label:label,
  //     data: item.map(ele => Number(ele.dPercentWorkingTime))
  //   }
  // })
  let temp = arrDataGuards.map(item => {
    return { 
      label:item[0].sGuardName,
      data: item.map(ele => Number(ele.dPercentWorkingTime))
    }
  })
  return temp;
}