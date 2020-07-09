const mqtt = require('mqtt')
module.exports = {
  setConfig (url, config, topic) {
    this.url = url
    this.config = config
    this.topic = topic
    this.running = false
    this.eventsInitialized = false
  },
  connect () {
    if (!this.connection) {
      this.connection = mqtt.connect(this.url, this.config)
    }
    this.connection.on('connect', () => {
      console.log('connected')
      this.connection.subscribe(this.topic)
    })
    this.connection.on('message', (topic, msg) => {
    })
    if (!this.eventsInitialized) {
      this.initializeEvents()
    }
    this.running = true
  },

  disconnect () {
    if (this.running) {
      this.connection.end()
      this.running = false
    }
  },

  sendData (tag, data) {
    try {
      if (this.running) {
        this.connection.publish(tag, JSON.stringify(data))
      }
    } catch (error) {
      console.log(error)
    }
  },

  initializeEvents () {
    this.eventsInitialized = true
    this.connection.on('close', () => { console.log('mqtt client disconnected') })
    this.connection.on('error', err => {
      if (err) {
        this.connection.end()
        this.connect()
        console.log(err.message)
        this.running = false
      }
    })
  }
}
