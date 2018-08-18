

$(() => {
  $('#btnViewIncidentsReportByMonth').click(() => {
    showIncidentReport('month');
  })
  $('#btnViewIncidentsReportByWeek').click(() => {
    showIncidentReport('week');
  })
  $('#btnViewChartIncidentsReportByMonth').click(() => {
    showChartIncidentReport('month');
  })
  $('#btnViewChartIncidentsReportByWeek').click(() => {
    showChartIncidentReport('week');
  })
  showWeeksSelect();
  showMonthsSelect();
  showDataInCurrentMonth();
  setCurrentWeek();
  
})

const arrColors = [ '#8d6e63', '#616161', '#78909c', '#ffb74d', '#66bb6a', '#80d8ff', '#00acc1', '#5c6bc0', '#f48fb1', '#e1bee7', 'red', 'green', 'blue','orange','violet', 'yellow', 'pink', 'purple', 'cyan', 'teal', 'lime', 'ambe' ];

let arrIncidents = [];
let arrRows = [];

async function showChartIncidentReport(type){
  let sentData = { iWeek: 0, iMonth: 0 };
  let header = ''
  if(type.toLowerCase() == 'week') {
    let week = $('#reportWeek').val();
    sentData.iWeek = week;
    header = `Report in Week ${week}`;
  }else{
    let month = $('#reportMonth').val();
    sentData.iMonth = month;
    header = `Report in ${arrMonths[Number(month) - 1]}`;
  }
  let data = await Service.reportIncidentWeekOrMonthChart(sentData);
  if(!data) return showAlertError("No data avalable", "");
  buildReportIncidentWeekOrMonthChart(data, header);
  $('#modalChartIncidentReport').modal('show');
}

function getColors(l){
  let arr = [];
  for(let i = 0; i < l; i++){
    arr.push(arrColors[i]);
  }
  return arr;
}

function getChartDataSetIncidentWeekOrMonth(data){
  return data.map(item => Number(item.Percent));
}

function getChartLabelsIncidentReport(data){
  return data.map(item => item.sAlertContent);
}

function buildReportIncidentWeekOrMonthChart(currentData, title){
  let $chartCanvas = $('<canvas style="width: 100%" height="300"></canvas>');
  $('#modalChartIncidentReport').find('.modal-body').html($chartCanvas);
  let ctx = $chartCanvas[0].getContext('2d');
  let labels = getChartLabelsIncidentReport(currentData);
  let data = getChartDataSetIncidentWeekOrMonth(currentData);
  //console.log(currentData);
  //console.log(data);
  let colors = getColors(currentData.length);
  var chartTime = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: labels,
        datasets: [{
            label: 'Something of Votes',
            data: data,
            backgroundColor: colors,
            // borderColor: [],
            borderWidth: 1
        }]
    },
    options:{
      title: {
        display: true,
        text: title
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
    }
  });
  return chartTime;
}

function showDataInCurrentMonth(){
  let d = new Date();
  let currentMonth = d.getMonth() + 1;
  $('#reportMonth').val(currentMonth);
  showIncidentReport('month');
}

function setCurrentWeek(){
  let d = new Date();
  let currentWeek = getWeek(d);
  $('#reportWeek').val(currentWeek)
}

function renderTblIncidentReport(){
  let $table = $('#tblViolationMin');
  $table.html('');
  let $thead = $('<thead></thead>');
  let $tbody = $('<tbody></tbody>');
  
  if(arrIncidents){
    $thead.append(`
      <tr>
        <th rowspan="2">Day</th>
        <th rowspan="2">Date</th>
        <th rowspan="2">Weekend NO.</th>
        <th rowspan="2">Number of Violation</th>
        <th colspan="${arrIncidents.length}">Types of Violation</th>
      </tr>
      <tr class="trIncident"></tr>
    `)
    arrIncidents.forEach(item => {
      $thead.find('tr.trIncident').append(`<th>${item}</th>`);
    });
  }
  if(arrRows){
    arrRows.forEach(row => {
      const { sDay, iWeek, dDate } = row;
      $tbody.append(`
        <tr>
          <td>${sDay}</td>
          <td>${dDate}</td>
          <td>${iWeek}</td>
          <td>${getNumOfViolationsByDate(row)}</td>
        </tr>
      `)
      arrIncidents.forEach(item => {
        $tbody.find('tr').last().append(`<td>${row[item]}</td>`);
      })
    })
  }
  $table.append($thead).append($tbody);
}

async function showIncidentReport(type){
  let sentData = { iWeek: 0, iMonth: 0 };
  if(type.toLowerCase() == 'week'){
    let week = $('#reportWeek').val();
    sentData.iWeek = week;
  }else{
    let month = $('#reportMonth').val();
    sentData.iMonth = month;
  }
  let data = await Service.reportIncidentWeekOrMonth(sentData);
  arrIncidents = getIncidentsArr(data);
  arrRows = getRowsViolationsByDate(data);
  renderTblIncidentReport();
  if(!data) showAlertError("No data available!!", "");
}

function getIncidentsArr(data){
  if(!data) return null;
  if(data.length == 0) return null;
  let incidentsSet = new Set(data.map(incident => incident.sAlertContent));
  return [...incidentsSet];
}

function getRowsViolationsByDate(data){
  if(!data) return null;
  if(data.length == 0) return null;
  let dateSet = new Set(data.map(item => item.dDate));
  let arrRows = []
  dateSet.forEach(value => {
    let arrTemp = data.filter(item => item.dDate == value);
    let acc = arrTemp.reduce((acc, incident, index) => {
      const { sAlertContent, iCountAlert } = incident;
      if(index == 0){
        const { sDay, iWeek, dDate } = incident;
        acc.sDay = sDay;
        acc.iWeek = iWeek;
        acc.dDate = dDate;
      }
      if(!acc[sAlertContent]) {
        acc[sAlertContent] = 0;
      }
      acc[sAlertContent] += Number(iCountAlert);
      return acc;
    }, {});
    arrRows.push(acc);
  })
  return arrRows;
}

function getNumOfViolationsByDate(row){
  let sum = 0;
  arrIncidents.forEach(item => {
    sum += row[item];
  })
  return sum;
}