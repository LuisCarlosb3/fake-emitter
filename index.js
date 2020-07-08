const { app, BrowserWindow, Menu } = require('electron')
const MainApplication = require('./src/backend/main')
let win
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 450,
    height: 730,
    title: 'FakeEmitter',
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  win.loadFile('src/frontend/views/index.html')
  // false to resize
  win.setResizable(false)
  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert menu
  Menu.setApplicationMenu(mainMenu)
  win.on('closed', function () {
    app.quit()
  })
}
const mainMenuTemplate = [
]
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click (item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}

app.whenReady().then(async () => {
  createWindow()
  const application = new MainApplication(win)
  await application.run()
})
