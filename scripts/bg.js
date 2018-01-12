chrome.runtime.onInstalled.addListener(function(detail){
  chrome.notifications.create({
    type: "basic",
    iconUrl:"popup/img/hpe.svg",
    title:"Tnanks you",
  message: "Good Boy",
  contextMessage:" From OneView Api Recording"});
})

function logURL(requestDetails) {
  console.log("Loading: " );
  console.log(1);
}
logURL();

function arrayBufferToObj(buf) {
  var blob = new Blob([buf]);
     var reader = new FileReader();
    reader.readAsText(blob,'utf-8');
    return reader
}


chrome.webRequest.onBeforeRequest.addListener(
 function(requestDetails){
   if(requestDetails.method !== "GET") {
     let buf = requestDetails.requestBody.raw[0].bytes;
    arrayBufferToObj(buf).onload=function(){
      console.log(JSON.parse(this.result));
    }
   }
 },
  {urls: ["https://15.114.113.141/*"]},
  ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(requestDetails){
    if(requestDetails.method !== "GET") {
      console.log(1.2, requestDetails);
     console.log(2, requestDetails.requestHeaders);
    }
  },
   {urls: ["https://15.114.113.141/*"]},
   ["requestHeaders"]
 );

 chrome.webRequest.onCompleted.addListener(
  function(requestDetails){
    if(requestDetails.method !== "GET") {
     console.log(3, requestDetails.requestBody);
    }
  },
   {urls: ["https://15.114.113.141/*"]},
   ["responseHeaders"]
 );
