
export default class DeviceList {
  constructor (deviceList, deviceController) {
    this.element = deviceList
    this.deviceController = deviceController
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
    const div = document.createElement('div')
    div.setAttribute('id', device.id)
    const divName = document.createElement('div')

    const stateButton = document.createElement('button')
    const buttonStateId = `change-state-${device.id}`
    stateButton.textContent = 'OFF'
    stateButton.setAttribute('id', buttonStateId)

    divName.appendChild(document.createTextNode(`${device.tag}:${device.id}`))
    divName.addEventListener('click', () => this.removeDevice(device.id))
    div.appendChild(divName)
    div.appendChild(stateButton)
    stateButton.addEventListener('click', () => this.changeStatus(device.id, stateButton))
    return div
  }
}
