import Device from '../model/device.js'
export default class MqttController {
  constructor (configRepository, deviceRepository, mqtt) {
    this.config = {}
    this.configRepository = configRepository
    this.deviceRepository = deviceRepository
    this.mqtt = mqtt
    this.load()
  }

  getConfig () {
    return this.config
  }

  async saveConfig ({ clientId, port, username, password, url, interval }) {
    if (clientId.trim().length > 0 &&
        port.trim().length > 0 &&
        username.trim().length > 0 &&
        password.trim().length > 0 &&
        url.trim().length > 0 &&
        (interval > 0)
    ) {
      this.stopData()
      await this.disconnect()
      this.status = false
      this.config = { clientId, port, username, password, url, interval }
      this.save()
      return true
    } else {
      return false
    }
  }

  connect () {
    this.status = true
    return new Promise(resolve => resolve('conectado'))
  }

  disconnect () {
    this.status = false
    return new Promise(resolve => resolve('desconectado'))
  }

  sendData () {
    const time = this.config.interval * 1000
    this.timeInterval = setInterval(() => {
      const devices = this.deviceRepository.getData('devices')

      for (const device of devices) {
        if (device.state) {
          const attr = Device.transformArrayToObject(device.attributes)
          console.log('ON' + device.tag, attr)
          this.mqtt.sendData(device.tag, attr)
        }
      }
    }, time)
  }

  stopData () {
    clearInterval(this.timeInterval)
  }

  getStatus () {
    return this.status
  }

  save () {
    this.configRepository.setData('configuration', this.config)
  }

  load () {
    this.config = this.configRepository.getData('configuration')
  }
}
