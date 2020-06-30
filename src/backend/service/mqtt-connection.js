import { simpleAlert } from '../events/events-factory.js'
const mqtt = require('mqtt')
export default class MqttConnection {
  constructor (url, config) {
    this.url = url
    this.config = config
    this.running = false
    this.eventsInitialized = false
  }

  changeConfig (url, config) {
    this.url = url
    this.config = config
  }

  connect () {
    MqttConnection.connection = mqtt.connect(this.url, this.config)
    if (!this.eventsInitialized) {
      this.initializeEvents()
    }
    this.running = true
  }

  disconnect () {
    if (this.running) {
      MqttConnection.connection.end()
      this.running = false
    }
  }

  sendData (tag, data) {
    if (this.running) {
      MqttConnection.connection.publish(tag, JSON.stringify(data))
    }
  }

  initializeEvents () {
    this.eventsInitialized = true
    MqttConnection.connection.on('error', err => {
      if (err) {
        simpleAlert('MQTT Disconnected, check configs', 'error')
        MqttConnection.connection.end()
        console.log(err)
        this.running = false
      }
    })
  }
}
