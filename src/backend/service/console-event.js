const { webContents } = require('electron')
module.exports = function showConsole (data) {
  const webCont = webContents.fromId(2)
  if (webCont) {
    webCont.send('console:log', data)
  }
}
