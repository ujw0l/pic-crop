const { app, BrowserWindow,Menu,Tray,screen,dialog} = require('electron');
const path = require ('path')
const fs = require('fs');

function createWindow () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // Create the browser window.
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    show:false,
    backgroundColor: '#2e2c29' ,
    webPreferences: {
      nodeIntegration: true
    }
  })

  

  win.once('ready-to-show', () => {
    win.show()
  })
  // and load the index.html of the app.
  win.loadFile('index.html')

  const menu = Menu.buildFromTemplate([
   
    {
      label: '',
      submenu: [
        {
          label: 'About',
          click: ()=> app.showAboutPanel() 
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File',
          accelerator: 'CommandOrControl+O',
          click: () => {
          
              const files = dialog.showOpenDialog({
                properties: ['openFile']
              }).then(result=>{
                const focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('open-file',[fs.readFileSync(result.filePaths[0],'base64'),path.extname(result.filePaths[0])]);
               
              }).catch(err => {
                console.log(err)
              });
          }
        },
        {
          label : 'Exit',
          role : 'Close'
        }
      ]
    },
    {
      label: 'Window',
      submenu: [
        {role: 'minimize'},
        { role: 'zoomin' },
        { role: 'zoomout' },
        
       
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'Report Issue',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/ujw0l/pic-crop/issues')
          }
        },
        {
          label: 'Toggle Developer Tools',
          click(item, focusedWindow) {                                     
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
      
      ]
    }
])


Menu.setApplicationMenu(menu)

}


app.whenReady().then(()=>{
    tray = new Tray (path.join(__dirname, 'assets/icon/tray-icon.png') )
    
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Toggle fullscreen',role: 'togglefullscreen'},
      {label: 'Speak',role: 'startSpeaking'},
      { label: 'About', click:  ()=> app.showAboutPanel() },
      { label: 'Quit', click:  ()=> app.quit() },
     
      ])

      

      
   
	// tray icon hover text
    tray.setToolTip('Pic Crop'); 
    tray.setContextMenu(contextMenu)

    createWindow();
})

