export default class Device {
  constructor (tag, id, attributes, state) {
    this.id = id || Date.now()
    this.tag = tag
    this.attributes = attributes || []
    this.state = state || false
  }

  addAttribute (name, value) {
    this.attributes.push({ name, value })
  }

  removeAttribute (index) {
    this.attributes.splice(index, 1)
  }

  changeState () {
    this.state = !this.state
  }
}
