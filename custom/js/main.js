const APP_DOMAIN = 'http://115.79.27.219/tracking/';
const CENTER_POS_MAP_VIEW = [20.81715284, 106.77411238];

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
  $('html, body').animate({'scrollTop': 0}, 400);
}