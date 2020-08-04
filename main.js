const { app, BrowserWindow,Menu,Tray} = require('electron');
const path = require ('path')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon:__dirname+'/icon/icon.png',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
}


app.whenReady().then(()=>{
    tray = new Tray (path.join(__dirname, 'icon/tray-icon.png') )
    
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Quit', click:  ()=>alert('aye') }
      ])
   
	// tray icon hover text
    tray.setToolTip('Pic Crop'); 
    tray.setContextMenu(contextMenu)

    createWindow();
})

