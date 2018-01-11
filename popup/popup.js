
function clickOperition () {
    var element = document.querySelector('#operition')
    console.log(document.getElementById('operition').innerText);
    if (element.innerText === 'Start Recording') {
        element.querySelector('span').innerText = "Stop Recording"
        element.querySelector('img').src='img/pause-button.png';
    } else if (element.innerText === 'Stop Recording') {
        element.querySelector('span').innerText = "Start Recording"
        element.querySelector('img').src='img/play-button.png';
    }
}

function clickConfig () {
    chrome.runtime.openOptionsPage();
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('operition').addEventListener('click', clickOperition);
  document.querySelector('#config').addEventListener('click', clickConfig);
});