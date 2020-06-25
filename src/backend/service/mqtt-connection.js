const mqtt = require('mqtt')

export default class MqttConnection {
  constructor (url, config) {
    MqttConnection.connection = mqtt.connect(url, config)
  }

  sendData (tag, data) {
    MqttConnection.publish(tag, JSON.stringify(data))
  }
}
