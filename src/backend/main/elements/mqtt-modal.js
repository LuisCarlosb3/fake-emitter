export default class MqttModal {
  constructor (modal, inputs, btSave, btCancel, mqttController) {
    this.modal = modal
    this.inputs = inputs
    this.btSave = btSave
    this.btCancel = btCancel
    this.mqttController = mqttController
  }

  openModal () {
    this.modal.style.display = 'block'
    const config = this.mqttController.getConfig()
    this.inputs.clientId.value = config.clientId || ''
    this.inputs.port.value = config.port || ''
    this.inputs.username.value = config.username || ''
    this.inputs.password.value = config.password || ''
    this.inputs.url.value = config.url || ''
    this.btSave.onclick = () => {
      const inputs = {}
      for (const input in this.inputs) {
        inputs[input] = this.inputs[input].value
      }
      const response = this.mqttController.saveConfig(inputs)
      if (response) {
        this.closeModal()
      }
    }
  }

  closeModal () {
    this.modal.style.display = 'none'
    for (const input in this.inputs) {
      this.inputs[input].value = ''
    }
  }
}
