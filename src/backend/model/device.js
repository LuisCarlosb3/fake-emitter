export default class Device {
  constructor (tag) {
    this.tag = tag
    this.attributes = []
    this.state = false
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
