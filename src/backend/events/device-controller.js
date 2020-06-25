import Device from '../model/device.js'

export default class DeviceController {
  constructor (deviceRepository) {
    this.devices = []
    this.deviceRepository = deviceRepository
    this.load()
  }

  getDevices () {
    return this.devices
  }

  async add (tag) {
    const newDevice = new Device(tag)
    this.devices.push(newDevice)
    this.save()
    return newDevice
  }

  update (deviceUpdated, index) {
    if (index < this.devices.length && index >= 0) {
      return false
    }
    this.device[index] = deviceUpdated
    this.save()
  }

  async delete (index) {
    let isDeleted = false
    this.devices = this.devices.filter((value) => {
      if (value.id !== index) {
        return true
      }
      isDeleted = true
    })
    return isDeleted
  }

  save () {
    this.deviceRepository.setData('devices', this.devices)
  }

  load () {
    this.devices = this.deviceRepository.getData('devices')
  }
}
