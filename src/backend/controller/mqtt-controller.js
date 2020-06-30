import Device from '../model/device.js'
export default class MqttController {
  constructor (configRepository, deviceRepository, mqtt) {
    this.config = {}
    this.configRepository = configRepository
    this.deviceRepository = deviceRepository
    this.mqtt = mqtt
    this.load()
    this.setConfig()
  }

  getConfig () {
    return this.config
  }

  setConfig () {
    const url = this.config.url
    const config = {
      clienteId: this.config.clientId,
      port: this.config.clientId,
      username: this.config.clientId,
      password: this.config.clientId
    }
    this.mqtt.changeConfig(url, config)
  }

  async saveConfig ({ clientId, port, username, password, url, interval }) {
    if (clientId.trim().length > 0 &&
        port.trim().length > 0 &&
        url.trim().length > 0 &&
        (interval > 0)
    ) {
      this.stopData()
      await this.disconnect()
      this.status = false
      this.config = { clientId, port, username, password, url, interval }
      this.setConfig()
      this.save()
      return true
    } else {
      return false
    }
  }

  async connect () {
    this.status = true
    const url = this.config.url
    const config = {
      clienteId: this.config.clientId,
      port: this.config.clientId,
      username: this.config.clientId,
      password: this.config.clientId
    }
    return new Promise(resolve => resolve(this.mqtt.connect(url, config)))
  }

  async disconnect () {
    this.status = false
    return new Promise(resolve => resolve(this.mqtt.disconnect()))
  }

  sendData () {
    const time = this.config.interval * 1000
    this.timeInterval = setInterval(() => {
      if (this.mqtt.running) {
        const devices = this.deviceRepository.getData('devices')
        for (const device of devices) {
          if (device.state) {
            const attr = Device.transformArrayToObject(device.attributes)
            console.log('ON' + device.tag, attr)
            this.mqtt.sendData(device.tag, attr)
          }
        }
      } else {
        this.stopData()
        this.disconnect()
        this.status = false
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
