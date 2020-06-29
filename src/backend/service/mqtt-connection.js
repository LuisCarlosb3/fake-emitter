const mqtt = require('mqtt')

export default class MqttConnection {
  constructor (url, config) {
    this.url = url
    this.config = config
    this.running = false
  }

  changeConfig (url, config) {
    this.url = url
    this.config = config
  }

  connect () {
    MqttConnection.connection = mqtt.connect(this.url, this.config)
    this.running = true
  }

  sendData (tag, data) {
    MqttConnection.publish(tag, JSON.stringify(data))
  }
}
