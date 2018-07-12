
class Service {
  // Guard's request
  static async getGuardsData() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetGuard.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async updateGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async insertGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async getPersonalGuardsInfo() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetGuardInformation.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async sendMessageGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/InsertMessage.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async sendSMSToGuards(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/InsertMessage.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async inActiveGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  //Zone's request
  static async getAllZones() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetZone.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getPointsDataOnZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetPointData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getRoutesOnZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetRouteData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async insertZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateZone.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async updateZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateZone.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async inActiveZone(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateZone.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  // Events'request
  static async getEventsData() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetEvent.php`,
      method: 'post'
    });
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getEventHistoryDataGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetEventHistoryGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getEventHistoryDetails(checkingCode) {
    let sentDate = {
      CheckingCode: checkingCode
    };
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetEventHistoryDetail.php`,
      method: 'post',
      data: JSON.stringify(sentDate)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  //Insicidents'request
  static async getIncidentsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetIncidentData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getReportData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/ReportGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    })
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  //Route'request
  static async saveRoute(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateRoute.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async getRouteDetailsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetRouteDetailData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async deleteRoute(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateRoute.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }
  
  static async updateRouteGuard(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateRouteGuard.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  //Route'request

  static async updatePoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async inActivePoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  static async insertPoint(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdatePoint.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    return data;
  }

  //Asset'request
  static async getAssetsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetAssetData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  // Report Tour
  // http://115.79.27.219/tracking/api/GetTourDetail.php
  static async getTourDetail(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetTourDetail.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  // http://115.79.27.219/tracking/api/GetReportPerformance.php
  static async getReportPerformance(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetReportPerformance.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  // http://115.79.27.219/tracking/api/GetReportPerformanceChart.php
  static async getReportPerformanceChart(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetReportPerformanceChart.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  // http://115.79.27.219/tracking/api/CheckTime.php
  static async makeAttendance(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/CheckTime.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }
  // http://115.79.27.219/tracking/api/GetDevice.php
  static async getDevice(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetDevice.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  // GetPointChecking.php
  static async getPointChecking(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetPointChecking.php`,
      method: 'get',
      data: sentData
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  // GetGuardGPSCurrent.php
  static async getGuardGPSCurrent(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetGuardGPSCurrent.php`,
      method: 'get',
      data: sentData
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
}