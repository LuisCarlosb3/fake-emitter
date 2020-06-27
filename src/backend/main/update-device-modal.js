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
      const isValid = this.validateInput()
      if (isValid) {
        const { newTag, attributes } = this.getFormData()
        const updated = updateAction(newTag, attributes)
        console.log(updated ? 'Salvo' : 'Nome ja existe')
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
    const newTemplateRemoveElDiv = templateRemoveElDiv.cloneNode(false)
    const newattrValue = attrValue.cloneNode(false)
    newattrName.setAttribute('id', `${id}-name`)
    newattrValue.setAttribute('id', `${Date.now()}-value`)
    newTemplateRemoveElDiv.setAttribute('id', `${id}-remove`)
    newTemplateRemoveElDiv.innerText = 'DEL'

    newTemplateDiv.setAttribute('id', `${id}`)
    newTemplateDiv.appendChild(newattrName)
    newTemplateDiv.appendChild(newattrValue)
    newTemplateRemoveElDiv.onclick = (e) => {
      removeAttr(newTemplateDiv)
    }
    newTemplateDiv.appendChild(newTemplateRemoveElDiv)
    return newTemplateDiv
  }

  validateInput () {
    const newTag = this.tag.value
    const attrs = this.attributesList.querySelectorAll('input')
    if (newTag.trim().length === 0) {
      return false
    }
    let tagValidated = true
    for (const attrKey of attrs) {
      for (const compareAttrKey of attrs) {
        if (attrKey.id.includes('name') && attrKey.value === compareAttrKey.value && attrKey.id !== compareAttrKey.id) {
          tagValidated = false
          break
        }
      }
    }
    return tagValidated
  }

  getFormData () {
    const newTag = this.tag.value
    const attributes = []
    const attrDiv = this.attributesList.querySelectorAll('div')
    for (const attrKey of attrDiv) {
      const inputs = attrKey.querySelectorAll('input')
      if (inputs.length === 2) {
        attributes.push({ name: inputs[0].value, value: inputs[1].value })
      }
    }
    return { newTag, attributes }
  }
}
