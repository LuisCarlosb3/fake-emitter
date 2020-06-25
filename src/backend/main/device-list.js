import DeviceController from '../events/device-controller.js'

export default class DeviceList {
  constructor (deviceList) {
    this.deviceController = new DeviceController()
    this.element = deviceList
  }

  async initialize () {
    await this.deviceController.load()
    const devices = this.deviceController.getDevices()
    for (const key in devices) {
      const divEl = this.createDeviceListItem(devices[key], key)
      this.element.appendChild(divEl)
    }
  }

  async addDevice () {
    const device = { tag: 'my tag', attributes: [], state: false }
    const id = await this.deviceController.add(device)
    const deviceItem = this.createDeviceListItem(device, id)
    this.element.appendChild(deviceItem)
  }

  async removeDevice (id) {
    const lastId = this.deviceController.getDevices().length - 1
    const wasRemoved = await this.deviceController.delete(lastId)
    if (wasRemoved) {
      document.getElementById(lastId).remove()
      console.log(this.deviceController.getDevices().length)
    }
  }

  createDeviceListItem (device, index) {
    const div = document.createElement('div')
    div.setAttribute('id', index)
    div.appendChild(document.createTextNode(`${device.tag}:${index}`))
    return div
  }
}
