const IpfsHttpClient = require('ipfs-http-client');
const ipfs = IpfsHttpClient(new URL('https://ipfs.infura.io:5001'));

var capturedFiles;

var folderContentPaths = new Array();
var folderContents = new Array();

var stateChanged = false;
var isDirectory = false;

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', function(e) {

    stateChanged = true;

    if(!isDirectory) {
        capturedFiles = [this.files[0]]; // Add only the first selected file
    } else {
        capturedFiles = this.files;
    } console.log(capturedFiles);

    let k = 0;
    for(i=0; i<capturedFiles.length; i++) {

        if(!isDirectory) folderContentPaths[i] = capturedFiles[i].name;
        else folderContentPaths[i] = capturedFiles[i].webkitRelativePath;

        const reader = new FileReader();
        reader.onload = function (r) {
            folderContents[k] = reader.result;
            k++;
        }
        reader.readAsArrayBuffer(capturedFiles[i]);
    }
});

const type = document.getElementById("type");
type.addEventListener("change", function() {
    let inputType = type.value;
    if(inputType == "file") {
        isDirectory = false;
        fileInput.removeAttribute("webkitdirectory");
        // folderInput.style.visibility = "collapse";
        // fileInput.style.visibility = "visible";
    }
    else if(inputType == "directory") {
        isDirectory = true;
        fileInput.setAttribute("webkitdirectory", "true");
        // fileInput.style.visibility = "collapse";
        // folderInput.style.visibility = "visible";
    }
    else console.log("Error");
});


const uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click", () => uploadIPFS());


function uploadIPFS() {

    if(!stateChanged) return;
    stateChanged = false;

    let files = [];
    for(i=0; i<capturedFiles.length; i++) files[i] = { path: folderContentPaths[i], content: folderContents[i] };
    console.log(files);
    ipfs.add(files).then(function(receipt) {
        updateList(receipt);
    });
}

function updateList(receipt) {
    let name = receipt.path;
    let hash = receipt.cid.string;
    let site = "https://ipfs.io/ipfs/" + hash;

    let list = document.getElementById('list');
    let entry = document.createElement('li');
    entry.innerHTML = '<a target="_blank" href="' + site + '">(' + name + ')</a> ' + hash;
    list.appendChild(entry);
}