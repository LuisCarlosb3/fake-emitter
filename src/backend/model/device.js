export default class Device {
  constructor (tag, id, attributes, state) {
    this.id = id || Date.now()
    this.tag = tag
    this.attributes = attributes || []
    this.state = state || false
  }

  changeState () {
    this.state = !this.state
  }
}
