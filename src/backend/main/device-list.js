
export default class DeviceList {
  constructor (deviceList, deviceController, modal) {
    this.element = deviceList
    this.deviceController = deviceController
    this.modal = modal
  }

  async initialize () {
    const devices = this.deviceController.getDevices()
    for (const device of devices) {
      const divEl = this.createDeviceListItem(device)
      this.element.appendChild(divEl)
    }
  }

  async addDevice (newTag) {
    const device = await this.deviceController.add(newTag)
    if (device) {
      const deviceItem = this.createDeviceListItem(device)
      this.element.appendChild(deviceItem)
      return true
    }
    return false
  }

  async removeDevice (id) {
    const wasRemoved = await this.deviceController.delete(id)
    if (wasRemoved) {
      document.getElementById(id).remove()
    }
  }

  changeData (device, newTag, attributes) {
    device.tag = newTag
    device.attributes = attributes
    const response = this.deviceController.updateAttribute(device)
    if (response) {
      document.getElementById(`tag-${device.id}`).innerText = `TAG: ${newTag}`
      return true
    } else {
      console.log('TAG JA CADASTRADA')
      return false
    }
  }

  changeStatus (id, stateButton) {
    const newState = this.deviceController.updateState(id)
    stateButton.textContent = newState ? 'ON' : 'OFF'
  }

  createDeviceListItem (device) {
    const template = document.getElementsByTagName('template')[0]
    const templateElements = template.content.querySelectorAll('div')
    const deviceDiv = templateElements[0]
    const tagDiv = templateElements[1]
    const statusButton = templateElements[2]
    const newDeviceDiv = deviceDiv.cloneNode(false)
    const newTagDiv = tagDiv.cloneNode(false)
    const newStatusButton = statusButton.cloneNode(false)

    const buttonStateId = `change-state-${device.id}`
    newStatusButton.textContent = device.state ? 'ON' : 'OFF'
    newStatusButton.id = buttonStateId
    newStatusButton.addEventListener('click', () => this.changeStatus(device.id, newStatusButton))

    newTagDiv.appendChild(document.createTextNode(`TAG: ${device.tag}`))
    newTagDiv.setAttribute('id', `tag-${device.id}`)
    newTagDiv.addEventListener('click', () => this.modal.openModal(
      device,
      () => this.removeDevice(device.id),
      (newTag, attributes) => this.changeData(device, newTag, attributes)
    ))

    newDeviceDiv.setAttribute('id', device.id)

    newDeviceDiv.appendChild(newTagDiv)
    newDeviceDiv.appendChild(newStatusButton)

    return newDeviceDiv
  }
}
