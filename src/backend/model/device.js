module.exports = class Device {
  constructor (tag, id, attributes, state) {
    this.id = id || Date.now()
    this.tag = tag
    this.attributes = attributes || []
    this.state = state || false
  }

  changeState () {
    this.state = !this.state
  }

  static transformArrayToObject (attributes) {
    const attributesObj = {}
    for (const attr of attributes) {
      attributesObj[attr.name] = attr.value
    }
    return attributesObj
  }
}
