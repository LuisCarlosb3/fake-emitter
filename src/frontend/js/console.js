const { ipcRenderer } = require('electron')
function consoleEvent () {
  const consoleDiv = document.getElementById('console')
  ipcRenderer.on('console:log', (event, arg) => {
    const p = document.createElement('p')
    p.appendChild(document.createTextNode(`${arg}`))
    consoleDiv.appendChild(p)
  })
}

consoleEvent()
