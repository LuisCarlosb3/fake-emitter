
export default class DeviceController {
  constructor (deviceRepository) {
    this.devices = []
    this.deviceRepository = deviceRepository
    this.load()
  }

  getDevices () {
    return this.devices
  }

  async add (newDevice) {
    this.devices.push(newDevice)
    this.save()
    return this.devices.indexOf(newDevice)
  }

  update (deviceUpdated, index) {
    if (index < this.devices.length && index >= 0) {
      return false
    }
    this.device[index] = deviceUpdated
    this.save()
  }

  async delete (index) {
    if (index < this.devices.length && index >= 0) {
      this.devices.splice(index, 1)
      this.save()
      return true
    }
    return false
  }

  save () {
    this.deviceRepository.setData('devices', this.devices)
  }

  load () {
    this.devices = this.deviceRepository.getData('devices')
  }
}
