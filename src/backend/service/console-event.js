const { webContents } = require('electron')
module.exports = function showConsole (data) {
  const webCont = webContents.fromId(2)
  console.log(data)
  if (webCont) {
    webCont.send('console:log', data)
  }
}
