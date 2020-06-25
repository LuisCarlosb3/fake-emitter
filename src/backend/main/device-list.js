
export default class DeviceList {
  constructor (deviceList, deviceController) {
    this.element = deviceList
    this.deviceController = deviceController
  }

  async initialize () {
    const devices = this.deviceController.getDevices()
    for (const device in devices) {
      const divEl = this.createDeviceListItem(device)
      this.element.appendChild(divEl)
    }
  }

  async addDevice () {
    const device = await this.deviceController.add('my tag')
    const deviceItem = this.createDeviceListItem(device)
    this.element.appendChild(deviceItem)
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
