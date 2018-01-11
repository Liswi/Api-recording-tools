function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  alert(1);
}

chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);