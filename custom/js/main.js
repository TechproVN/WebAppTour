const APP_DOMAIN = 'http://115.79.27.219/tracking/';
const CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];
const TIME_OUT_SHOW_MAP_ON_MODAL = 0;

$('.datepicker').datepicker();

$('.datetimepicker').datetimepicker({
  format: 'yyyy-mm-dd hh:ii'
})

$('.btnScrollTop').click(moveTop);

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

function showGuardsOnCombobox(guards){
  $('.guardsCombobox').html('');
  if(guards){
    guards.forEach(g => {
      const { iGuardId, sGuardName } = g;
      $('.guardsCombobox').append(`<option value="${iGuardId}">${sGuardName}</option>`)
    })
  }
}

async function loadGuardsOnCombobox(){
  let guards = await Service.getGuardsData();
  showGuardsOnCombobox(guards);
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

function createInfoWindowGoogleMap(content){
  let infoWindow = new google.maps.InfoWindow({
      content:content
    });
    return infoWindow
}

function createIconGoogleMap(url){
  let icon = {
    url: url, // url
    scaledSize: new google.maps.Size(15, 15), // scaled size
    origin: new google.maps.Point(0,0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };
return icon;
}

function createPolylineGoogleMap(path){
  let polyline = new google.maps.Polyline({
    path: path,
    strokeColor: "red",
    strokeOpacity: 0.8,
    strokeWeight: 4
  });
  return polyline;
}