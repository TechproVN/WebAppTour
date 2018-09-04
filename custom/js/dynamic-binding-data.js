let GOOGLE_MAP_API_KEY = 'AIzaSyB27wuxZVqzMUwnuvzWxOuaLRzs0bncVP0';

// function replaceGoogleMapAPI() {
//   let url = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`;
//   console.log(123456);
//   $('script').eq(0).attr({
//     src: url
//   });
//   console.log($('script').eq(0).attr('src'));
// }

// var gMapsLoaded = false;

// function loadGoogleMaps() {
//   if (!gMapsLoaded) {
//     $.getScript(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&sensor=false&async=2&callback=GoogleMapsLoaded`, function () {});
//   } else {
//     GoogleMapsLoaded();
//   }
// }

// function GoogleMapsLoaded() {
//   gMapsLoaded = true;
// }

// loadGoogleMaps();


// window.mapapiloaded = function () {
//   console.log('$.ajax done: use google.maps');
// };

// $.ajax({
//   url: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&callback=mapapiloaded`,
//   dataType: 'script',
//   timeout: 30, 
//   success: function () {
//       console.log('$.ajax progress: waiting for mapapiloaded callback');
//   },
//   error: function () {
//       console.log('$.ajax fail: use osm instead of google.maps');
//       // createusingosm();
//   }
// });
