export default class UpdateDeviceModal {
  constructor (modal, tag, attributesList, btUpdate, btCancel, btDelete, btAddAttribute) {
    this.modal = modal
    this.tag = tag
    this.attributesList = attributesList
    this.btDelete = btDelete
    this.btUpdate = btUpdate
    this.btAddAttribute = btAddAttribute
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
    this.btAddAttribute.onclick = (e) => {
      const removeEl = (el) => this.attributesList.removeChild(el)
      const attrEl = this.addAttributeAction(removeEl)
      this.attributesList.appendChild(attrEl)
    }
  }

  closeModal () {
    this.tag.value = ''
    this.modal.display = 'none'
    while (this.attributesList.lastElementChild) {
      this.attributesList.removeChild(this.attributesList.lastElementChild)
    }
  }

  addAttributeAction (removeAttr) {
    const id = Date.now()
    const template = document.getElementsByTagName('template')[1]
    const templateDiv = template.content.querySelectorAll('div')[0]
    const templateRemoveElDiv = template.content.querySelectorAll('div')[1]
    const templateElements = template.content.querySelectorAll('input')
    const attrName = templateElements[0]
    const attrValue = templateElements[1]
    const newTemplateDiv = templateDiv.cloneNode(false)
    const newattrName = attrName.cloneNode(false)
    const newattrValue = attrValue.cloneNode(false)
    newattrName.setAttribute('id', `${id}-name`)
    newattrValue.setAttribute('id', `${Date.now()}-tag`)
    templateRemoveElDiv.setAttribute('id', `${id}-remove`)
    templateRemoveElDiv.innerText = 'DEL'

    newTemplateDiv.setAttribute('id', `${id}`)
    newTemplateDiv.appendChild(newattrName)
    newTemplateDiv.appendChild(newattrValue)
    templateRemoveElDiv.onclick = (e) => {
      removeAttr(newTemplateDiv)
    }
    newTemplateDiv.appendChild(templateRemoveElDiv)
    return newTemplateDiv
  }
}
