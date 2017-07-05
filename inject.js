const Electron = require('electron');
const IPC = Electron.ipcRenderer;
const ThisBW = Electron.remote.getCurrentWindow();
const ThisWC = Electron.remote.getCurrentWebContents();
const {BrowserWindow} = Electron.remote;

var remoteWindow = null;
var send = (channel, message) => remoteWindow.webContents.send(channel, message);
parent.onunload = () => remoteWindow.close();

IPC.on('connect_bw', (event, pRemoteWindowId) => {
	if(remoteWindow.id === pRemoteWindowId){
		send('console', "Connected to remote Window!")
		return console.log("Connected to remote Window!");
	} 
	console.error("Cold not connect to remote Window");
	remoteWindow.close();
});
IPC.on('console', (event, message) => {
	console.log(message); 
});

var btn_1, btn_1;

var openWindow = () => {
	if (remoteWindow) {
   		remoteWindow.focus()
		return;
	}
	remoteWindow = new BrowserWindow({
		resizable: true,
		title: "Beamer",
		minimizable: true,
		fullscreenable: true,
		autoHideMenuBar: true,
		webPreferences:{
			preload: __dirname+ "/beamer.js"
		}
	});
	remoteWindow.loadURL('file://' + __dirname + '/beamer.html');
	
	remoteWindow.webContents.on('did-finish-load', () => {
		remoteWindow.webContents.openDevTools();
		remoteWindow.webContents.send('connect_bw', ThisBW.id);
	});
	remoteWindow.on('closed', function () {
		btn_1.setAttribute("disabled", "true");
		btn_2.setAttribute("disabled", "true");
		remoteWindow = null;
	});
}

var generateUI = () => {
	var createButton = function(Text, Id, Disabled, eventListener, parent){
		var btn = document.createElement("BUTTON");
		btn.innerHTML = Text;
		btn.type = 'button'
		btn.setAttribute("id", Id);
		if(Disabled)btn.setAttribute("disabled", "true");
		btn.addEventListener("click", eventListener);
		parent.appendChild(btn);
		return btn;
	}
	var div = document.createElement("DIV");
	div.setAttribute("id", "cbgh_control");
	var box = document.getElementById('searchOK');
	box.parentNode.insertBefore(div, box.nextSibling);

	var btn_0_fkt = () => {
		openWindow();
		btn_1.removeAttribute("disabled");
		btn_2.removeAttribute("disabled");
	}
	var btn_0 = createButton('Beamer', 'cbgh_control_beamer', false, btn_0_fkt, div);

	var btn_1_fkt = () => {	
		var obj =  { chapter: '', verses: [] };
		send('text',obj);
		
		var chapter = document.getElementById("buttonSelectChapter_label");
		chapter = chapter.getElementsByTagName("h1")[0].innerHTML
		
		obj.chapter = chapter;
		var x = document.getElementsByClassName("highlight");
		for (var i = 0; i < x.length; i++) {
			var nr = x[i].getElementsByTagName("a")[0].innerHTML;	
			var txt = x[i].innerHTML.split('</span>')[1];
			var verse = {
				number: nr,
				text: txt
			}
			obj.verses.push(verse);
		}
		send('text',obj);
	}
	btn_1 = createButton('Anzeigen', 'cbgh_control_show', true, btn_1_fkt, div);

	var btn_2_fkt = () => {		
		var obj =  {
			chapter: '',
			verses: []
		}
		send('text',obj);
	}
	btn_2 = createButton('Verstecken', 'cbgh_control_hide', true, btn_2_fkt, div);
}

generateUI();