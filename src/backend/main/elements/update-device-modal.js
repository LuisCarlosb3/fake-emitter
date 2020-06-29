import { simpleAlert } from '../../events/events-factory.js'
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
    this.closeModal()
    this.modal.style.display = 'block'
    this.tag.value = device.tag
    this.btDelete.onclick = (e) => {
      e.preventDefault()
      this.closeModal()
      deleteAction()
    }
    this.btUpdate.onclick = (e) => {
      e.preventDefault()
      const isValid = this.validateInput()
      if (isValid.status) {
        const { newTag, attributes } = this.getFormData()
        const updated = updateAction(newTag, attributes)
        simpleAlert(updated ? 'Updated' : 'Tag already exists')
        if (updated) {
          this.closeModal()
        }
      } else {
        simpleAlert(isValid.message)
      }
    }
    this.btAddAttribute.onclick = (e) => {
      this.addAttributeFactory()
    }
    for (const attr of device.attributes) {
      this.addAttributeFactory(attr)
    }
  }

  closeModal () {
    this.tag.value = ''
    this.modal.style.display = 'none'
    while (this.attributesList.lastElementChild) {
      this.attributesList.removeChild(this.attributesList.lastElementChild)
    }
  }

  addAttributeFactory (attr) {
    const removeEl = (el) => this.attributesList.removeChild(el)
    const attrEl = this.addAttributeAction(removeEl, attr)
    this.attributesList.appendChild(attrEl)
  }

  addAttributeAction (removeAttr, attr = { name: '', value: '' }) {
    const id = Date.now()
    const template = document.getElementsByTagName('template')[1]
    const templateDiv = template.content.querySelectorAll('div')[0]
    const templateInputDiv = template.content.querySelectorAll('div')[1]
    const templateRemoveElDiv = template.content.querySelectorAll('div')[2]
    const buttonRemoveEl = template.content.querySelectorAll('img')[0]
    const templateElements = template.content.querySelectorAll('input')
    const attrName = templateElements[0]
    const attrValue = templateElements[1]
    const newTemplateDiv = templateDiv.cloneNode(false)
    const newTemplateInputDiv = templateInputDiv.cloneNode(false)
    const newattrName = attrName.cloneNode(false)
    const newTemplateRemoveElDiv = templateRemoveElDiv.cloneNode(false)
    const newButtonRemoveEl = buttonRemoveEl.cloneNode(false)
    const newattrValue = attrValue.cloneNode(false)
    newattrName.setAttribute('id', `${id}-name`)
    newattrName.setAttribute('value', attr.name)
    newattrValue.setAttribute('id', `${Date.now()}-value`)
    newattrValue.setAttribute('value', attr.value)
    newButtonRemoveEl.setAttribute('id', `${id}-remove`)

    newTemplateInputDiv.appendChild(newattrName)
    newTemplateInputDiv.appendChild(newattrValue)
    newTemplateDiv.setAttribute('id', `attr-${id}`)
    newTemplateDiv.appendChild(newTemplateInputDiv)
    newTemplateRemoveElDiv.appendChild(newButtonRemoveEl)
    newButtonRemoveEl.onclick = (e) => {
      removeAttr(newTemplateDiv)
    }
    newTemplateDiv.appendChild(newTemplateRemoveElDiv)
    return newTemplateDiv
  }

  validateInput () {
    const newTag = this.tag.value
    const attrs = this.attributesList.querySelectorAll('input')
    if (newTag.trim().length === 0) {
      return { status: false, message: 'Invalid Tag' }
    }
    let tagValidated = true
    for (const attrKey of attrs) {
      if (attrKey.id.includes('name')) {
        for (const compareAttrKey of attrs) {
          if (compareAttrKey.id.includes('name') && attrKey.value === compareAttrKey.value && attrKey.id !== compareAttrKey.id) {
            tagValidated = false
            break
          }
        }
      }
    }
    return { status: tagValidated, message: tagValidated ? '' : 'Duplicated attribute' }
  }

  getFormData () {
    const newTag = this.tag.value
    const attributes = []
    const attrDiv = this.attributesList.querySelectorAll('div')
    for (const attrKey of attrDiv) {
      if (attrKey.id.includes('attr-')) {
        const inputs = attrKey.querySelectorAll('input')
        if (inputs.length === 2) {
          attributes.push({ name: inputs[0].value, value: inputs[1].value })
        }
      }
    }
    return { newTag, attributes }
  }
}
