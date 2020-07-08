const { ipcRenderer } = require('electron')
const elements = {
  deviceListId: 'devices-list',
  deviceItemTemplateId: 'device-item-template'
}
export function initializeList () {
  const response = ipcRenderer.sendSync('device:load')
  const deviceList = document.getElementById(elements.deviceListId)
  if (response) {
    for (const device of response) {
      const item = createDeviceItem(device)
      deviceList.appendChild(item)
    }
  }
}
function createDeviceItem (device) {
  const template = document.getElementById(elements.deviceItemTemplateId)
  const templateEl = template.content.querySelectorAll('div')
  const templateDeviceDiv = templateEl[0]
  const templateTagDiv = templateEl[1]
  const templateStatusDiv = templateEl[2]
  const templateStatusDivLabel = templateStatusDiv.querySelector('label')
  const templateDivInput = templateStatusDiv.querySelector('input')
  const templateStatusDivSpan = templateStatusDiv.querySelector('span')

  const deviceDiv = templateDeviceDiv.cloneNode(false)
  const tagDiv = templateTagDiv.cloneNode(false)
  const statusDiv = templateStatusDiv.cloneNode(false)
  const statusDivLabel = templateStatusDivLabel.cloneNode(false)
  const statusDivInput = templateDivInput.cloneNode(false)
  const statusDivSpan = templateStatusDivSpan.cloneNode(false)

  const buttonStateId = `change-state-${device.id}`
  statusDivInput.checked = device.state
  statusDivInput.id = buttonStateId
  statusDivInput.addEventListener('click', () => {
    // muda status do botão
    // this.changeStatus(device.id, statusDivInput)
    console.log('muda', statusDivInput.checked)
  })
  statusDivLabel.appendChild(statusDivInput)
  statusDivLabel.appendChild(statusDivSpan)
  statusDiv.appendChild(statusDivLabel)

  tagDiv.appendChild(document.createTextNode(`${device.tag}`))
  tagDiv.setAttribute('id', `tag-${device.id}`)
  tagDiv.addEventListener('click', () => {
    // abrir modal do dispositivo
    console.log('abre', tagDiv.id)
  })
  deviceDiv.setAttribute('id', device.id)

  deviceDiv.appendChild(tagDiv)
  deviceDiv.appendChild(statusDiv)
  return deviceDiv
}
