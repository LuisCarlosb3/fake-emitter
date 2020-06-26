export default class UpdateDeviceModal {
  constructor (modal, tag, attributesList, btUpdate, btCancel, btDelete) {
    this.modal = modal
    this.tag = tag
    this.attributesList = attributesList
    this.btDelete = btDelete
    this.btUpdate = btUpdate
  }

  openModal (device, deleteAction, updateAction) {
    this.modal.display = 'block'
    this.tag.value = device.tag
    this.btDelete.onclick = (e) => {
      e.preventDefault()
      this.closeModal()
      deleteAction()
    }
    this.btUpdate.onclick = (e) => {
      e.preventDefault()
      const newTag = this.tag.value
      console.log(newTag)
      if (newTag.trim().length > 0) {
        const updated = updateAction(newTag)
        console.log(updated)
        if (updated) {
          this.closeModal()
        }
      } else {
        console.log('preencha corretamente')
      }
    }
  }

  closeModal () {
    this.tag.value = ''
    this.modal.display = 'none'
  }
}
