let bg = chrome.extension.getBackgroundPage();
let tag;
let data = bg.recordingStatus.recordingData;
let show = document.querySelector("#show");
console.log(data);
let i=0;
for (let item in data){
    i++;
    console.log(item,i);
    let oul = document.createElement("ul");
    for (let item2 in data[item]) {
        let oli = document.createElement("li");
        oli.innerHTML = "<h5>"+ item2 +": </h5><span>"+ data[item][item2]+"</span>";
        oul.appendChild(oli);
    }
    show.appendChild(oul);
}

document.querySelector("#count").innerText = i;
let saveButton = document.querySelector("#print")
saveButton.addEventListener("click",saveData);
function saveData() {
    if (i===0){
        alert("there is no recording console")
    } else if (i > 0) {
        console.log(JSON.stringify(data));
        createAndDownloadFile("recording.json", JSON.stringify(data))
}
}
function createAndDownloadFile (fileName, content) {
    var aTag = document.createElement('a');
    var blob = new Blob([content]);
    aTag.download = fileName;
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
};