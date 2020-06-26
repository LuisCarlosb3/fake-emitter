
export default class DeviceList {
  constructor (deviceList, deviceController, modal) {
    this.element = deviceList
    this.deviceController = deviceController
    this.modal = modal
  }

  async initialize () {
    const devices = this.deviceController.getDevices()
    for (const device of devices) {
      const divEl = this.createDeviceListItem(device)
      this.element.appendChild(divEl)
    }
  }

  async addDevice (newTag) {
    const device = await this.deviceController.add(newTag)
    if (device) {
      const deviceItem = this.createDeviceListItem(device)
      this.element.appendChild(deviceItem)
      return true
    }
    return false
  }

  async removeDevice (id) {
    const wasRemoved = await this.deviceController.delete(id)
    if (wasRemoved) {
      document.getElementById(id).remove()
    }
  }

  changeStatus (id, stateButton) {
    const newState = this.deviceController.updateState(id)
    stateButton.textContent = newState ? 'ON' : 'OFF'
  }

  createDeviceListItem (device) {
    const template = document.getElementsByTagName('template')[0]
    const templateElements = template.content.querySelectorAll('div')
    const deviceDiv = templateElements[0]
    const tagDiv = templateElements[1]
    const statusButton = templateElements[2]
    const newDeviceDiv = document.importNode(deviceDiv, true)
    const newTagDiv = document.importNode(tagDiv, true)
    const newStatusButton = document.importNode(statusButton, true)

    newTagDiv.appendChild(document.createTextNode(`TAG: ${device.tag}`))
    newTagDiv.addEventListener('click', () => this.modal.openModal(device, () => this.removeDevice(device.id)))

    const buttonStateId = `change-state-${device.id}`
    newStatusButton.textContent = 'OFF'
    newStatusButton.setAttribute('id', buttonStateId)
    newStatusButton.addEventListener('click', () => this.changeStatus(device.id, newStatusButton))

    newDeviceDiv.setAttribute('id', device.id)

    newDeviceDiv.appendChild(newTagDiv)
    newDeviceDiv.appendChild(newStatusButton)

    return newDeviceDiv
  }
}
