
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

  createDeviceListItem (device) {
    const div = document.createElement('div')
    div.setAttribute('id', device.id)
    div.appendChild(document.createTextNode(`${device.tag}:${device.id}`))
    div.addEventListener('click', () => this.removeDevice(device.id))
    return div
  }
}
