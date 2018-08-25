const APP_DOMAIN = 'http://115.79.27.219/tracking/';
const CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];
const TIME_OUT_SHOW_MAP_ON_MODAL = 0;
const arrMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const arrYears = ['2018', '2019', '2020', '2021', '2022'];
const arrColors = [ '#8d6e63', '#616161', '#78909c', '#ffb74d', '#66bb6a', '#80d8ff', '#00acc1', '#5c6bc0', '#f48fb1', '#e1bee7', 'red', 'green', 'blue','orange','violet', 'yellow', 'pink', 'purple', 'cyan', 'teal', 'lime', 'ambe', '#0048BA', '#B0BF1A', '#7CB9E8', '#72A0C1', '#F2F0E6', '#9966CC', '#E32636', '#C46210', '#EFDECD', '#FFBF00', '#CFCFCF', '#551B8C', '#F2B400', '#CD9575', '#665D1E', '#915C83', '#841B2D', '#008000', '#8DB600', '#FBCEB1', '#00FFFF', '#D0FF14', '#4B5320', '#8F9779', '#E9D66B', '#B2BEB5', '#87A96B', '#FF9966' ];


$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})

$('.datetimepicker-bootstrap4').datetimepicker({
  // format: 'LT'
   format: 'HH:mm'
});

$('.btnScrollTop').click(moveTop);

$('.dropdown-submenu .dropdown-toggle').on("click", function(e) {
  e.stopPropagation();
  e.preventDefault();
  $(this).parent().siblings().children('.dropdown-menu').css({
    display: 'none'
  });
  $(this).next('.dropdown-menu').toggle();
});

$('.dropdown').on('hidden.bs.dropdown', function () {
  $('.dropdown-submenu .dropdown-menu').css({
    display:'none'
  })
})

function formatToday() {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  let mon = month < 10 ? `0${month}` : month;
  let d = day < 10 ? `0${day}` : day;
  
  return `${mon}/${d}/${year}`;
}

function changeFormatDateTime(time){
  let arr = time.split('/');
  let y = arr[2];
  let d = arr[1];
  let m = arr[0];
  return `${y}-${m}-${d}`;
}

// function changeToVietnameseFormatDateTime(time){
//   let arr = time.split('/');
//   let y = arr[2];
//   let d = arr[1];
//   let m = arr[0];
//   return `${d}/${m}/${y}`;
// }

function showAlertError(title, text, timer){
  swal({
    title: title,
    text: text,
    icon: "error",
    button: "Close!",
    timer: timer
  });
}

function showAlertSuccess(title, text, timer){
  swal({
    title: title,
    text: text,
    icon: "success",
    button: "Close!",
    timer: timer
  });
}

async function showAlertWarning(title, text){
  let sure = await swal({
    title: title,
    text: text,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  return sure;
}

function moveTop(){
  $('html, body').animate({'scrollTop': 0}, 300);
}

async function showSelectDevices(withAll){
  let devices = await Service.getDevicelist();
  let $select = $('.selectDevice');
  $select.html('');
  if(!devices) return;
  if(withAll) $select.append(`<option value="0">All</option>`);
  devices.forEach(device => {
    const { sDeviceName, iDeviceID } = device;
    $select.append(`<option value="${iDeviceID}">${sDeviceName}</option>`);
  })
}

function showGuardsOnCombobox(guards){
  $('.guardsCombobox').html('');
  if(guards){
    guards.forEach(g => {
      const { iGuardId, sGuardName } = g;
      $('.guardsCombobox').append(`<option value="${iGuardId}">${sGuardName}</option>`)
    })
  }
}

function showMonthsSelect(){
  let $select = $('.selectMonth');
  $select.html('');
  for(let i = 1; i <= 12; i++){
    $select.append(`<option value="${i}">${arrMonths[i - 1]}</option>`);
  }
}

function showYearsSelect(){
  let $select = $('.selectYear');
  $select.html('');
  for(let i = 1; i <= 5; i++){
    $select.append(`<option value="${i + 2017}">${arrYears[i - 1]}</option>`);
  }
}

function showWeeksSelect(){
  let $select = $('.selectWeek');
  $select.html('');
  for(let i = 1; i <= 52; i++){
    $select.append(`<option value="${i}">Week ${i}</option>`);
  }
}

async function loadGuardsOnCombobox(){
  let guards = await Service.getGuardsData();
  showGuardsOnCombobox(guards);
  return guards;
}

async function showRouteList(withAll){
  let routes = await Service.getRoutelist();
  let $select = $('.selectRouteName');
  $select.html('');
  if(routes){
    if(withAll) $select.append(`<option value="0">All</option>`);
    routes.forEach(route => {
      const { iRouteID, sRouteName } = route;
      $select.append(`<option value="${iRouteID}">${sRouteName}</option>`)
    })
  }
  return routes;
}

async function showDeviceList(){
  let devices = await Service.getDevicelist();
  $('.selectDeviceName').html('');
  if(devices){
    devices.forEach(device => {
      const { iDeviceID, sDeviceName } = device;
      $('.selectDeviceName').append(`<option value="${iDeviceID}">${sDeviceName}</option>`)
    })
  }
  return devices;
}

async function showGuardList(withAll){
  let guards = await Service.getGuardsData();
  let $selectGuard = $('.selectGuardName')
  $selectGuard.html('');
  if(!guards) return;
  if(withAll) $selectGuard.append(`<option value="0">All</option>`)
  guards.forEach(guard => {
    const { iGuardId, sGuardName } = guard;
    $selectGuard.append(`<option value="${iGuardId}">${sGuardName}</option>`)
  });
  return guards;
}

async function showZoneList(className = 'selectZones', withAll = false){
  let data = await Service.getAllZones();
  let selectZonesEle = $(`.${className}`);
  selectZonesEle.html('');
  if(withAll) selectZonesEle.append(`<option value="0">All</option>`)
  if(data){
    data.forEach(zone => {
      const { iZoneID, sZoneName } = zone;
      selectZonesEle.append(`<option value="${iZoneID}">${sZoneName}</option>`)
    });
  }
  return data;
}

async function showIncidentsList(withAll){
  let data = await Service.getIncidentContent();
  let $select = $(`.selectIncident`);
  $select.html('');
  if(withAll) $select.append(`<option value="0">All</option>`)
  if(data){
    data.forEach(incident => {
      const { iAlertContentID, sAlertContent } = incident;
      $select.append(`<option value="${iAlertContentID}">${sAlertContent}</option>`)
    });
  }
  return data;
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

function createMarkerGoogleMap(pos, urlIcon){
  let icon = createIconGoogleMap(urlIcon);
  let marker = new google.maps.Marker({
    position: pos,
    // animation: google.maps.Animation.BOUNCE,
    icon: icon
  });
  return marker;
}

function createInfoWindowGoogleMap(content, maxWidth = 300, maxHeight = 300){
  let infoWindow = new google.maps.InfoWindow({
    content:content,
    maxWidth: maxWidth,
    maxHeight: maxHeight
  });
  return infoWindow
}

function createIconGoogleMap(url, scaledSize = 17){
  let icon = {
    url: url, // url
    scaledSize: new google.maps.Size(scaledSize, scaledSize), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
  return icon;
}

function createPolylineGoogleMap(path, strokeColor = 'red', strokeOpacity = 0.8, strokeWeight = 4){
  let polyline = new google.maps.Polyline({
    path: path,
    strokeColor: strokeColor,
    strokeOpacity: strokeOpacity,
    strokeWeight: strokeWeight
  });
  return polyline;
}

function createPolygonGooglemap(path, strokeColor = "green", strokeOpacity = 0.8, strokeWeight = 2, fillColor = "green", fillOpacity = 0.4){
  let polygon = new google.maps.Polygon({
    path: path,
    strokeColor: strokeColor,
    strokeOpacity: strokeOpacity,
    strokeWeight: strokeWeight,
    fillColor: fillColor,
    fillOpacity: fillOpacity
  });
  return polygon;
}

function createMapPropGoogleMap(zoom, lat, lng){
  let mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: zoom,
  };
  return mapProp;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getPageSize(l){
  if(l < 100) return 10;
  if(l < 250) return 15;
  if(l < 400) return 20;
  if(l < 600) return 30;
  else return 50;
}

function removeUnicode(str){
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

async function showGuardGroups(withAll){
  let data = await Service.getGroup();
  let $select = $('.selectGuardGroup');
  $select.html('');
  if(!data) return;
  if(withAll) $select.append(`<option value="0">All</option>`)
  data.forEach(group => {
    const { iGuardGroupID, sGroupName } = group;
    $('.selectGuardGroup').append(`<option value="${iGuardGroupID}">${sGroupName}</option>`);
  })
}

function shuffleArray(arr){
  let l = arr.length;
  for (let index = 0; index < l; index++) {
    let randomInt = Math.floor(Math.random() * l);
    let temp = arr[index];
    arr[index] = arr[randomInt];
    arr[randomInt] = temp;
  }
  return arr;
}

function getCurrentDate(){
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  return { year, month, day };
}

function getYesterday(){
  let timestampe = Date.now();
  let yesterdayTimeStamp = timestampe - (1000*60*60*24);
  let yesterday = new Date(yesterdayTimeStamp);
  let year = yesterday.getFullYear();
  let month = yesterday.getMonth();
  let day = yesterday.getDate();
  return { year, month, day };
}

function getPreviousMonth(){
  let timestampe = Date.now();
  let prevMonthTimeStamp = timestampe - (1000*60*60*24*30);
  let prevMonth = new Date(prevMonthTimeStamp);
  let year = prevMonth.getFullYear();
  let month = prevMonth.getMonth();
  let day = prevMonth.getDate();
  return { year, month, day };
}

function getTomorrow(){
  let timestamp = Date.now();
  let tomorrowTimestamp = timestamp + (1000*60*60*24);
  let tomorrow = new Date(tomorrowTimestamp);
  let year = tomorrow.getFullYear();
  let month = tomorrow.getMonth();
  let day = tomorrow.getDate();
  return { year, month, day };
}

function getCurrentDateTime(){
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let day = now.getDate();
  let hour = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  return { year, month, day, hour, min, sec };
}

function calDistanceOfRoute(points){
  let sumOfDistance = 0;
  points.forEach((point, index) => {
    if(index != points.length - 1){
      const { dPointLat, dPointLong } = point;
      let lat1 = Number(dPointLat);
      let lon1 = Number(dPointLong);
      const lat2 = Number(points[index + 1].dPointLat);
      const lon2 = Number(points[index + 1].dPointLong);
      let R = 6371; // km
      let φ1 = toRadian(lat1);
      let φ2 = toRadian(lat2);
      let Δφ = toRadian(lat2-lat1);
      let Δλ = toRadian(lon2-lon1);

      let a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            let d = R * c;
      sumOfDistance += d;
    }
  })
  return sumOfDistance;
}

function toRadian(degree) {
  return degree * Math.PI/180;
}

function getWeek( d ) { 

  // Create a copy of this date object  
  var target = new Date(d.valueOf());  
  
  // ISO week date weeks start on monday  
  // so correct the day number  
  var dayNr = (d.getDay() + 6) % 7;  

  // Set the target to the thursday of this week so the  
  // target date is in the right year  
  target.setDate(target.getDate() - dayNr + 3);  

  // ISO 8601 states that week 1 is the week  
  // with january 4th in it  
  var jan4 = new Date(target.getFullYear(), 0, 4);  

  // Number of days between target date and january 4th  
  var dayDiff = (target - jan4) / 86400000;    

  // Calculate week number: Week 1 (january 4th) plus the    
  // number of weeks between target date and january 4th    
  if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
    // Calculate week number: Week 1 (january 4th) plus the    
    // number of weeks between target date and january 4th    
    return 1 + Math.ceil(dayDiff / 7);    
  }
  else {  // jan 4th is on the next week (so next week is week 1)
    return Math.ceil(dayDiff / 7); 
  }
  
}

// Returns the ISO week of the date.
function getWeek() {
  var date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

function weekOfYear(date){
  var d = new Date(+date);
  d.setHours(0,0,0);
  d.setDate(d.getDate()+4-(d.getDay()||7));
  return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
};

function getColorVsBgColor(length){
  let arrBgColor1 = [];
  let arrBorderColor1 = [];
  let arrBgColor2 = [];
  let arrBorderColor2 = [];

  let bgColor1 = 'rgba(255, 99, 132, 0.2)';
  let borderColor1 = 'rgba(255,99,132,1)';
  let bgColor2 = 'rgba(255, 159, 64, 0.2)';
  let borderColor2 = 'rgba(255, 159, 64, 1)';

  for(let i = 0; i < length; i++){
    arrBgColor1.push(bgColor1);
    arrBorderColor1.push(borderColor1);
    arrBgColor2.push(bgColor2);
    arrBorderColor2.push(borderColor2);
  }

  return { arrBgColor1, arrBorderColor1, arrBgColor2, arrBorderColor2 };
}

Chart.pluginService.register({
  beforeRender: function (chart) {
    if (chart.config.options.showAllTooltips) {
      // create an array of tooltips
      // we can't use the chart tooltip because there is only one tooltip per chart
      chart.pluginTooltips = [];
      chart.config.data.datasets.forEach(function (dataset, i) {
        chart.getDatasetMeta(i).data.forEach(function (sector, j) {
          chart.pluginTooltips.push(new Chart.Tooltip({
            _chart: chart.chart,
            _chartInstance: chart,
            _data: chart.data,
            _options: chart.options.tooltips,
            _active: [sector]
          }, chart));
        });
      });
      // turn off normal tooltips
      chart.options.tooltips.enabled = false;
    }
  },
  afterDraw: function (chart, easing) {
    if (chart.config.options.showAllTooltips) {
      // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
      if (!chart.allTooltipsOnce) {
        if (easing !== 1)
          return;
        chart.allTooltipsOnce = true;
      }
      // turn on tooltips
      chart.options.tooltips.enabled = true;
      Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
        tooltip.initialize();
        tooltip.update();
        // we don't actually need this since we are not animating tooltips
        tooltip.pivot();
        tooltip.transition(easing).draw();
      });
      chart.options.tooltips.enabled = false;
    }
  }
})
