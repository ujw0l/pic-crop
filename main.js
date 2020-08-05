const { app, BrowserWindow,Menu,Tray} = require('electron');
const path = require ('path')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()
}


app.whenReady().then(()=>{
    tray = new Tray (path.join(__dirname, 'icon/tray-icon.png') )
    
  
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Demo', click:  ()=> console.log("Demo") },
      { label: 'Quit', click:  ()=> app.quit() }
      ])
   
	// tray icon hover text
    tray.setToolTip('Pic Crop'); 
    tray.setContextMenu(contextMenu)

    createWindow();
})

