const Electron = require('electron');
const IPC = Electron.ipcRenderer;
const ThisBW = Electron.remote.getCurrentWindow();
const ThisWC = Electron.remote.getCurrentWebContents();
const {BrowserWindow} = Electron.remote;

var remoteWindow = null;
var send = (channel, message) => remoteWindow.webContents.send(channel, message);

IPC.on('connect_bw', (event, pRemoteWindow) => {
    remoteWindow = BrowserWindow.fromId(pRemoteWindow);
    send("connect_bw", ThisBW.id);
});

IPC.on('console', (event, message) => {
	console.log(message); 
});

IPC.on('text', (event, obj) => {
    console.log(obj)
    var chapter = document.getElementById('chapter');
    var verses = document.getElementById('verses');
    verses.innerHTML = '';
    
    chapter.innerHTML = obj.chapter;
    obj.verses.forEach((i)=>{
		var verse = document.createElement("DIV");
        verse.className = 'verse'
		var number = document.createElement("SPAN");
        number.innerHTML = i.number;
        number.className = 'number'
		var text = document.createElement("SPAN");
        text.innerHTML = i.text;
        text.className = 'text'
        
		verse.appendChild(number);
		verse.appendChild(text);
		verses.appendChild(verse);
        console.log(i);
    })
});