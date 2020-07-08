const Device = require('../model/device')

module.exports = class DeviceController {
  constructor (deviceRepository) {
    this.devices = []
    this.deviceRepository = deviceRepository
    this.load()
  }

  getDevices () {
    return this.devices
  }

  async add (tag) {
    const alreadyExist = this.devices.filter(value => {
      return value.tag === tag
    })
    if (alreadyExist.length === 0) {
      const newDevice = new Device(tag)
      this.devices.push(newDevice)
      this.save()
      return newDevice
    } else {
      return false
    }
  }

  updateAttribute (deviceUpdated) {
    const alreadyExist = this.devices.filter(value => {
      return (value.tag === deviceUpdated.tag && value.id.toString() !== deviceUpdated.id.toString())
    })
    if (alreadyExist.length === 0) {
      for (const key in this.devices) {
        if (this.devices[key].id.toString() === deviceUpdated.id.toString()) {
          this.devices[key] = deviceUpdated
          this.save()
        }
      }
      return true
    }
    return false
  }

  updateState (deviceDataId) {
    let newState
    for (const dev of this.devices) {
      if (dev.id === deviceDataId) {
        dev.changeState()
        newState = dev.state
      }
    }
    this.save()
    return newState
  }

  delete (index) {
    let isDeleted = false
    this.devices = this.devices.filter((value) => {
      if (value.id.toString() !== index.toString()) {
        return true
      }
      isDeleted = true
    })
    this.save()
    return isDeleted
  }

  save () {
    this.deviceRepository.setData('devices', this.devices)
  }

  load () {
    const devicesData = this.deviceRepository.getData('devices')
    for (const dev of devicesData) {
      const newDev = new Device(dev.tag, dev.id, dev.attributes, dev.state)
      this.devices.push(newDev)
    }
  }
}
