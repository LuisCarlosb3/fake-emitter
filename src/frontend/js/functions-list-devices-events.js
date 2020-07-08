const { ipcRenderer } = require('electron')
const elements = {
  deviceListId: 'devices-list',
  deviceItemTemplateId: 'device-item-template'
}
export function initializeList (deviceModal) {
  const response = ipcRenderer.sendSync('device:load')
  const deviceList = document.getElementById(elements.deviceListId)
  if (response) {
    for (const device of response) {
      const item = createDeviceItem(device, deviceModal)
      deviceList.appendChild(item)
    }
  }
}
export function handleListChanges (deviceModal) {
  ipcRenderer.on('device:created', (event, device) => {
    const deviceList = document.getElementById(elements.deviceListId)
    const item = createDeviceItem(device, deviceModal)
    deviceList.appendChild(item)
  })
  ipcRenderer.on('device:deleted', (event, deviceId) => {
    document.getElementById(deviceId).remove()
  })
}

function createDeviceItem (device, deviceModal) {
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
    const newState = ipcRenderer.sendSync('device:state', device.id)
    statusDivInput.checked = newState
  })
  statusDivLabel.appendChild(statusDivInput)
  statusDivLabel.appendChild(statusDivSpan)
  statusDiv.appendChild(statusDivLabel)

  tagDiv.appendChild(document.createTextNode(`${device.tag}`))
  tagDiv.setAttribute('id', `tag-${device.id}`)
  tagDiv.addEventListener('click', () => {
    deviceModal(device)
  })
  deviceDiv.setAttribute('id', device.id)

  deviceDiv.appendChild(tagDiv)
  deviceDiv.appendChild(statusDiv)
  return deviceDiv
}
