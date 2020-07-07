export default class AddDeviceModal {
  constructor (modalId, deviceNameInput) {
    this.modal = document.getElementById(modalId)
    this.deviceNameInput = document.getElementById(deviceNameInput)
  }

  openModal () {
    this.modal.style.display = 'block'
  }

  closeModal () {
    this.deviceNameInput.value = ''
    this.modal.style.display = 'none'
  }
}
