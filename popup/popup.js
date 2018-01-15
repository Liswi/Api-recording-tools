let bgDom = chrome.extension.getBackgroundPage();
bgDom.checkStatus();
function clickConfig () {
    chrome.runtime.openOptionsPage();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('operition').addEventListener('click', bgDom.clickOperition);
    document.querySelector('#config').addEventListener('click', clickConfig);
});