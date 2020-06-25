export default class AddDeviceModal {
  constructor (modal) {
    this.modal = modal
  }

  openModal () {
    this.modal.display = 'block'
  }

  closeModal () {
    this.modal.display = 'none'
  }
}
