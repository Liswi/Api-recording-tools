chrome.runtime.onInstalled.addListener(function(detail){
  chrome.notifications.create({
    type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"Tnanks you",
  message: "Good Boy",
  contextMessage:" From OneView Api Recording"});
})

var recordingStatus = {
  startTime: null,
  stopTime: null,
  isStart : false,
  actionTimer: function () {
    if(this.isStart) {
      this.startTime = new Date();
    } else {
      this.stopDate = new Date();
    }
  },

  notific: function () {
    let opt;
  if(this.isStart) {
    opt = {
      type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"Start Recording",
  message: "",
  contextMessage:" From OneView Api Recording"
    }
  } else {
    opt = {
      type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"Stop Recording",
  message: "",
  contextMessage:" From OneView Api Recording"
    }
  }
  chrome.notifications.create(opt);
  },

  recordingAipStart: function () {
    chrome.webRequest.onBeforeRequest.addListener(
      function(requestDetails){
        if(requestDetails.method !== "GET") {
          let buf = requestDetails.requestBody.raw[0].bytes;
         arrayBufferToObj(buf).onload=function(){
           console.log(1,JSON.parse(this.result));
         }
        }
      },
       {urls:["<all_urls>"]},
       ["requestBody"]
     );
     
     chrome.webRequest.onBeforeSendHeaders.addListener(
       function(requestDetails){
         if(requestDetails.method !== "GET") {
           console.log(1.2, requestDetails);
          console.log(2, requestDetails.requestHeaders);
         }
       },
        {urls: ["<all_urls>"]},
        ["requestHeaders"]
      );
     
      chrome.webRequest.onCompleted.addListener(
       function(requestDetails){
         if(requestDetails.method !== "GET") {
          console.log(3,requestDetails);
         }
       },
        {urls: ["<all_urls>"]},
        ["responseHeaders"]
      );
  }
}

function clickOperition () {
  let popup = chrome.extension.getViews({type:"popup"});
  let operition =  popup[0].document.querySelector("#operition");
  if (recordingStatus.isStart) {
    stopRecording(operition);
  } else {
     startRecording(operition);
  }
  recordingStatus.actionTimer();
  recordingStatus.notific();
}

function checkStatus () {
  let popup = chrome.extension.getViews({type:"popup"})[0];
  chrome.tabs.query({
    active:true,
    lastFocusedWindow:true
  },function(tabs){
    let reg = /^https:\/\/15.114.*$/;
    if (!reg.test(tabs[0].url)) {
     popup.document.body.innerHTML="<h2>Sorry, This page seem to be not supported.<h2>";
      return;
    }
   
     let operition =  popup.document.querySelector("#operition");
    if (!recordingStatus.isStart) {
      operition.querySelector('span').innerText = "Start Recording"
       operition.querySelector('img').src='img/play-button.png';
   } else {
       operition.querySelector('span').innerText = "Stop Recording"
       operition.querySelector('img').src='img/pause-button.png';
   }
  })
}

function startRecording (element) {
  recordingStatus.recordingAipStart ()
  chrome.browserAction.setIcon({path: "recording.png"});
  chrome.browserAction.setBadgeText({text: "||"});
  element.querySelector('span').innerText = "Stop Recording"
  element.querySelector('img').src='img/pause-button.png';
  recordingStatus.isStart = !recordingStatus.isStart;
}

function stopRecording (element) {
  chrome.browserAction.setIcon({path:"title.png"});
  chrome.browserAction.setBadgeText({text: ""});
  element.querySelector('span').innerText = "Start Recording"
  element.querySelector('img').src='img/play-button.png';
  recordingStatus.isStart = !recordingStatus.isStart;
}

function arrayBufferToObj(buf) {
  var blob = new Blob([buf]);
     var reader = new FileReader();
    reader.readAsText(blob,'utf-8');
    return reader
}

