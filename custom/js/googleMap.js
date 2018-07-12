
let URL_OBJECT, sCheckingCode, iGuardID;

$(() => {
  URL_OBJECT = getUrlVars();
  if(URL_OBJECT){
    sCheckingCode = URL_OBJECT['sCheckingCode'];
    iGuardID = URL_OBJECT['iGuardID'];
    buildMap(iGuardID, sCheckingCode);
  }
})

// http://127.0.0.1:5500/html/googleMap.html?sCheckingCode=1204021105072018&iGuardID=1

async function buildMap(iGuardID, sCheckingCode){
  let sentGuardData = { iGuardID };
  let guardGPSCurrent = await Service.getGuardGPSCurrent(sentGuardData);
  const { dGuardLatCurrent, dGuardLongCurrent, sMessage, bOnline } = guardGPSCurrent[0];
  let latGuard = Number(dGuardLatCurrent);
  let lngGuard = Number(dGuardLongCurrent);
  let mapProp = createMapPropGoogleMap(18, latGuard, lngGuard)
  let mymap = new google.maps.Map($('#mapid')[0], mapProp);
  
  let urlGuard = '../img/Guard.png';
  console.log(latGuard);
  console.log(lngGuard)
  let mainPos = new google.maps.LatLng(latGuard, lngGuard);
  let guardMarker = createMarkerGoogleMap(mainPos, urlGuard);

  guardMarker.setMap(mymap);
  let infoWindowGuard = createInfoWindowGoogleMap(sMessage);
  infoWindowGuard.open(mymap, guardMarker);
  const pointChekingSentData = { iGuardID, sCheckingCode };
  let checkingPointData = await Service.getPointChecking(pointChekingSentData);
  if(checkingPointData){
    checkingPointData.forEach(checkedPoint => {
      let { Lat, Long, Status, Message, ImageUrl } = checkedPoint;
      let url = '';
      switch(Status){
        case 1: 
          url = '../img/Checked.png'; 
          break;
        case 2: 
          url = '../img/None.png'; 
          break;
        case 3: 
          url = '../img/Waiting.png'; 
          break;
        case 4: 
          url = '../img/error.png'; 
          break;
      }
      let pos = new google.maps.LatLng(Lat, Long);
      let marker = createMarkerGoogleMap(pos, url);
      marker.setMap(mymap);
      let mes = Message;
      if(Status == 4){
        mes = `${Message}<br><img src="${APP_DOMAIN}${ImageUrl}" class="img-fluid">`
        let infoWindow = createInfoWindowGoogleMap(mes);
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open(mymap, marker);
        });
      }else{
        let infoWindow = createInfoWindowGoogleMap(mes);
        infoWindow.open(mymap, marker);
      }
    })
  }
}

    
