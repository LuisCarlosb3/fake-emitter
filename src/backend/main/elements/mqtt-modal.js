import { simpleAlert, changeMqttButtonState } from '../../events/events-factory.js'
export default class MqttModal {
  constructor (modal, inputs, btSave, btCancel, mqttController, buttonAction) {
    this.modal = modal
    this.inputs = inputs
    this.btSave = btSave
    this.btCancel = btCancel
    this.mqttController = mqttController
    this.buttonAction = buttonAction
  }

  openModal () {
    this.modal.style.display = 'block'
    const config = this.mqttController.getConfig()
    this.inputs.clientId.value = config.clientId || ''
    this.inputs.port.value = config.port || ''
    this.inputs.username.value = config.username || ''
    this.inputs.password.value = config.password || ''
    this.inputs.url.value = config.url || ''
    this.inputs.interval.value = config.interval || ''
    this.btSave.onclick = async () => {
      const inputs = {}
      for (const input in this.inputs) {
        inputs[input] = this.inputs[input].value
      }
      const response = await this.mqttController.saveConfig(inputs)
      if (response) {
        changeMqttButtonState(this.buttonAction)
        this.closeModal()
      } else {
        simpleAlert('Insert correct values')
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
