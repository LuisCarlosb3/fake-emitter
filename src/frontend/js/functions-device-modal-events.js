import { simpleAlert } from './events-factory.js'
const { ipcRenderer } = require('electron')

const elements = {
  modalId: 'modal-device',
  modalTagDeviceInputId: 'modal-device-tag',
  modalIdDeviceInputId: 'modal-device-id',
  modalBtUpdateDeviceId: 'bt-modal-confirm-update-device',
  modalBtCancelDeviceId: 'bt-modal-cancel-update-device',
  modalBtDeleteDeviceId: 'bt-modal-delete-device',
  deviceAttrList: 'modal-device-attributes',
  buttonAddAttr: 'modal-add-attribute'
}
export function openDeviceModal (device) {
  const modal = document.getElementById(elements.modalId)
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const inputId = document.getElementById(elements.modalIdDeviceInputId)
  inputId.value = device.id
  inputTag.value = device.tag
  modal.style.display = 'block'
  for (const attr of device.attributes) {
    console.log(attr)
    attributeFactory(attr)
  }
  window.onclick = (event) => {
    if (event.target === modal) {
      closeDeviceModal()
    }
  }
}
export function closeDeviceModal () {
  const modal = document.getElementById(elements.modalId)
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const inputId = document.getElementById(elements.modalIdDeviceInputId)
  const attributeList = document.getElementById(elements.deviceAttrList)
  inputId.value = ''
  inputTag.value = ''

  while (attributeList.lastElementChild) {
    attributeList.removeChild(attributeList.lastElementChild)
  }
  modal.style.display = 'none'
}
export function initializeDeviceModalEvents () {
  const btUpdate = document.getElementById(elements.modalBtUpdateDeviceId)
  const btCancel = document.getElementById(elements.modalBtCancelDeviceId)
  const btDelete = document.getElementById(elements.modalBtDeleteDeviceId)
  const inputId = document.getElementById(elements.modalIdDeviceInputId)
  const buttonAddAttr = document.getElementById(elements.buttonAddAttr)
  btUpdate.addEventListener('click', () => {
    const isValid = validateInput()
    if (isValid.status) {
      const deviceData = getFormData()
      const response = ipcRenderer.sendSync('device:update', { id: inputId.value, ...deviceData })

      simpleAlert(response ? 'Updated' : 'Tag already exists')
      if (response) {
        closeDeviceModal()
      }
    } else {
      simpleAlert(isValid.message)
    }
  })
  btCancel.addEventListener('click', () => {
    closeDeviceModal()
  })
  btDelete.addEventListener('click', () => {
    const response = ipcRenderer.sendSync('device:delete', inputId.value)
    if (response) {
      closeDeviceModal()
      simpleAlert('Device deleted', 'info')
    } else {
      simpleAlert('Device can\'t be deleted')
    }
  })

  buttonAddAttr.onclick = () => {
    attributeFactory()
  }
}
export function attributeFactory (attribute) {
  const deviceAttrList = document.getElementById(elements.deviceAttrList)
  const removeEl = (el) => deviceAttrList.removeChild(el)
  const newAttribute = createDeviceItemEl(removeEl, attribute)
  deviceAttrList.appendChild(newAttribute)
}
function createDeviceItemEl (removeAttr, attr = { name: '', value: '' }) {
  const id = Date.now()
  const template = document.getElementById('device-attribute-item')
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
function getFormData () {
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const attrList = document.getElementById(elements.deviceAttrList)
  const attributes = []
  const attrDivs = attrList.querySelectorAll('div')
  for (const attrKey of attrDivs) {
    if (attrKey.id.includes('attr-')) {
      const inputs = attrKey.querySelectorAll('input')
      if (inputs.length === 2) {
        attributes.push({ name: inputs[0].value, value: inputs[1].value })
      }
    }
  }
  console.log(inputTag.value, attributes)
  return { tag: inputTag.value, attributes }
}
function validateInput () {
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const newTag = inputTag.value
  const attrList = document.getElementById(elements.deviceAttrList)
  const attrs = attrList.querySelectorAll('input')
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
