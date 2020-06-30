import { simpleAlert } from '../events/events-factory.js'
const mqtt = require('mqtt')
export default class MqttConnection {
  constructor (url, config, topic) {
    this.url = url
    this.config = config
    this.topic = topic
    this.running = false
    this.eventsInitialized = false
  }

  changeConfig (url, config, topic) {
    this.url = url
    this.config = config
    this.topic = topic
  }

  connect () {
    if (!MqttConnection.connection) {
      MqttConnection.connection = mqtt.connect(this.url, this.config)
    }

    MqttConnection.connection.on('connect', () => {
      console.log('connected')
      MqttConnection.connection.subscribe(this.topic)
    })
    MqttConnection.connection.on('message', (topic, msg) => {
      console.log(topic, msg.toString())
    })
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
    MqttConnection.connection.on('close', () => { console.log('mqtt client disconnected') })
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
