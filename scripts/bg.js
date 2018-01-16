chrome.runtime.onInstalled.addListener(function(detail){
  chrome.notifications.create({
    type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"OneView Api tools",
  message: "Thanks for your install",
  contextMessage:"Hewlett Packard Enterprise "});
})

var recordingStatus = {
  startTime: null,
  stopTime: null,
  isStart : false,
  recordingHost:null,
  recordingData: {},
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
    title:"OneView Api tools",
  message: "Recording  start",
  contextMessage:" Hewlett Packard Enterprise"
    }
  } else {
    opt = {
      type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"OneView Api tools",
  message: "Recording stop",
  contextMessage:" Hewlett Packard Enterprise"
    }
  }
  chrome.notifications.create(opt);
  }
}

function recordingAipStart () {
  chrome.webRequest.onBeforeRequest.addListener(
    bodyListener,
    {urls:["<all_urls>"]},
    ["requestBody"]
   ); 
  chrome.webRequest.onBeforeSendHeaders.addListener(
    headerListener,
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
    );
}

function recordingAipStop () {
  chrome.webRequest.onBeforeRequest.removeListener(bodyListener); 
  chrome.webRequest.onBeforeSendHeaders.removeListener(headerListener);
  console.log(recordingStatus.recordingData);
}

function bodyListener (requestDetails) {
    if (recordingStatus.recordingHost.split("/")[2] !== requestDetails.url.split('/')[2]) {
      return;
    };
    if(requestDetails.method !== "GET") {
      if(requestDetails.requestBody) {
        let buf = requestDetails.requestBody.raw[0].bytes;
        arrayBufferToObj(buf).onload=function(){
          let requestBody = JSON.parse(this.result);
          recordingStatus.recordingData[requestDetails.requestId].requestBody=requestBody;
        }
      }
    }
}

function headerListener (requestDetails) {
      if (recordingStatus.recordingHost.split("/")[2] !== requestDetails.url.split('/')[2]) {
        return;
      };
       if(requestDetails.method !== "GET") {
         console.log(requestDetails);
        let requestHeaders = new Object;
        requestDetails.requestHeaders.forEach(element => {
          requestHeaders[element.name] = element.value;
        })
        recordingStatus.recordingData[requestDetails.requestId] = new Object;
        recordingStatus.recordingData[requestDetails.requestId].timeStamp=requestDetails.timeStamp;
        recordingStatus.recordingData[requestDetails.requestId].requestId = requestDetails.requestId;
        recordingStatus.recordingData[requestDetails.requestId].method = requestDetails.method;
        recordingStatus.recordingData[requestDetails.requestId].url = requestDetails.url;
        recordingStatus.recordingData[requestDetails.requestId].requestHeaders = requestHeaders;
        
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
      recordingStatus.recordingHost = tabs[0].url;
     let operition =  popup.document.querySelector("#operition");
    if (!recordingStatus.isStart) {
      operition.querySelector('span').innerText = "Start Recording";
      operition.style.backgroundColor = "rgb(152, 202, 190)";
      operition.querySelector('img').src='img/play-button.png';
   } else {
       operition.querySelector('span').innerText = "Stop Recording";
       operition.style.backgroundColor = "rgb(228,157,6)";
       operition.querySelector('img').src='img/pause-button.png';
   }
  })
}

function startRecording (element) {
  recordingAipStart()
  chrome.browserAction.setIcon({path: "recording.png"});
  chrome.browserAction.setBadgeText({text: "||"});
  element.style.backgroundColor = "rgb(228,157,6)"
  element.querySelector('span').innerText = "Stop Recording"
  element.querySelector('img').src='img/pause-button.png';
  recordingStatus.isStart = !recordingStatus.isStart;
}

function stopRecording (element) {
  recordingAipStop();
  chrome.browserAction.setIcon({path:"title.png"});
  chrome.browserAction.setBadgeText({text: ""});
  element.style.backgroundColor = "rgb(152, 202, 190)"
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

