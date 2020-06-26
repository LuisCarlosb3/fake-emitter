export default class UpdateDeviceModal {
  constructor (modal, tag, state, attributesList, btUpdate, btCancel, btDelete) {
    this.modal = modal
    this.tag = tag
    this.state = state
    this.attributesList = attributesList
    this.btDelete = btDelete
  }

  openModal (device, deleteAction) {
    this.modal.display = 'block'
    this.tag.textContent = device.tag
    this.state.textContent = device.state
    this.btDelete.addEventListener('click', () => {
      this.closeModal()
      deleteAction()
    })
  }

  closeModal () {
    this.tag.textContent = ''
    this.state.textContent = ''
    this.modal.display = 'none'
  }
}
