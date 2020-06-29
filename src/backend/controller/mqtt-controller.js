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

  saveConfig ({ clientId, port, username, password, url }) {
    if (clientId.trim().length > 0 &&
        port.trim().length > 0 &&
        username.trim().length > 0 &&
        password.trim().length > 0 &&
        url.trim().length > 0
    ) {
      this.config = { clientId, port, username, password, url }
      this.save()
      return true
    } else {
      return false
    }
  }

  connect () {

  }

  disconnect () {

  }

  save () {
    this.configRepository.setData('configuration', this.config)
  }

  load () {
    this.config = this.configRepository.getData('configuration')
  }
}
