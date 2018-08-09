
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

  static async getPersonalGuardsInfo(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetGuardInformation.php`,
      method: 'post',
      data: JSON.stringify(sentData)
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

  static async updateRouteDetail(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateRouteDetail.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    })
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  // http://115.79.27.219/tracking/api/UpdateRouteDetail.php

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

  
  static async makeAttendance(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/CheckTime.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }
  
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
  
  static async getDataAttandance(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetDataAttandance.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  // http://115.79.27.219/tracking/api/GetIncidentContent.php
  static async getIncidentContent() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetIncidentContent.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  
  static async getDevicelist() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/getDevicelist.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  
  static async getRoutelist() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/getRoutelist.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  // http://115.79.27.219/tracking/api/GetEventHistoryRoute.php
  static async getEventHistoryRoute(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetEventHistoryRoute.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
  // http://115.79.27.219/tracking/api/GetEventHistoryDevice.php
  static async getEventHistoryDevice(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetEventHistoryDevice.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async insertDevice(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateDevice.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async lockDevice(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateDevice.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async updateDevice(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateDevice.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }
  
  static async insertIncident(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateIncident.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async deleteIncident(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateIncident.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async updateIncident(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateIncident.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }
  // GetSchedule
  static async getSchedule(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetSchedule.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async updateSchedule(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateSchedule.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async insertSchedule(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateSchedule.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async inactiveSchedule(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateSchedule.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async getGroup() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/getGroup.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async getGroupData() {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetGroupData.php`,
      method: 'post',
    });
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async deleteGroup(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGroup.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async insertGroup(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGroup.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async updateGroup(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdateGroup.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async getAssetsData(sentData) {
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/getassetsdata.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    console.log(data);
    let parsedData = JSON.parse(data)
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }

  static async updateAsset(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/Updateasset.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async deleteAsset(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/Updateasset.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async insertAsset(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/Updateasset.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async updatePointQuestion(sentData){
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/UpdatePointQuestion.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
   return data;
  }

  static async getRouteCreatedData(sentData) {
    // sentData = { iZoneIDIN: 14 }
    let data = await $.ajax({
      url: `${APP_DOMAIN}api/GetRouteCreatedData.php`,
      method: 'post',
      data: JSON.stringify(sentData)
    });
    if(!data) return null;
    let parsedData = JSON.parse(data);
    if (Array.isArray(parsedData) && parsedData.length > 0)
      return parsedData;
    return null;
  }
}