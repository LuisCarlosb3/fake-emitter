const electron = require('electron')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
export default class DeviceController {
  constructor () {
    this.devices = []
  }

  getDevices () {
    return this.devices
  }

  async add (newDevice) {
    this.devices.push(newDevice)
    return this.devices.indexOf(newDevice)
  }

  update (deviceUpdated, index) {
    if (index < this.devices.length && index >= 0) {
      return false
    }
    this.device[index] = deviceUpdated
  }

  async delete (index) {
    if (index < this.devices.length && index >= 0) {
      this.devices.splice(index, 1)
      return true
    }
    return false
  }

  async load () {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    console.log(userDataPath)
    const filePath = path.join(userDataPath, 'devices.json')
    return readFileAsync(filePath, 'utf-8').then(data => {
      this.devices = JSON.parse(data)
    }).catch((err) => {
      console.log(err.message)
      fs.writeFileSync(filePath, JSON.stringify([]))
    })
  }

  async save () {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    const filePath = path.join(userDataPath, 'devices.json')
    const storedData = JSON.stringify(this.devices)
    return writeFileAsync(filePath, storedData).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }
}
