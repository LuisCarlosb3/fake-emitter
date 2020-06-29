export default class AddDeviceModal {
  constructor (modal) {
    this.modal = modal
  }

  openModal () {
    this.modal.style.display = 'block'
  }

  closeModal () {
    const input = this.modal.querySelectorAll('input')[0]
    input.value = ''
    this.modal.style.display = 'none'
  }
}
