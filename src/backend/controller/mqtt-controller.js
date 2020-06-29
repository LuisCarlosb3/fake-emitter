export default class MqttController {
  constructor (deviceRepository, mqtt) {
    this.config = {}
    this.configRepository = deviceRepository
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
        interval > 0
    ) {
      await this.disconnect()
      this.config = { clientId, port, username, password, url, interval }
      this.save()
      await this.connect()
      return true
    } else {
      return false
    }
  }

  connect () {
    return new Promise(resolve => resolve('conectado'))
  }

  disconnect () {
    return new Promise(resolve => resolve('desconectado'))
  }

  sendData () {
    this.timeInterval = setInterval(() => {
      console.log('enviando')
      // this.mqtt.sendData()
    }, this.interval * 1000)
  }

  stopData () {
    clearInterval(this.timeInterval)
  }

  save () {
    this.configRepository.setData('configuration', this.config)
  }

  load () {
    this.config = this.configRepository.getData('configuration')
  }
}
