import { simpleAlert } from './events-factory.js'
const { ipcRenderer } = require('electron')

const elements = {
  modalId: 'modal-device',
  modalTagDeviceInputId: 'modal-device-tag',
  modalIdDeviceInputId: 'modal-device-id',
  modalAttributesListDeviceId: 'modal-device-attributes',
  modalBtUpdateDeviceId: 'bt-modal-confirm-update-device',
  modalBtCancelDeviceId: 'bt-modal-cancel-update-device',
  modalBtDeleteDeviceId: 'bt-modal-delete-device'
}
export function openDeviceModal (device) {
  const modal = document.getElementById(elements.modalId)
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const inputId = document.getElementById(elements.modalIdDeviceInputId)
  inputId.value = device.id
  inputTag.value = device.tag
  modal.style.display = 'block'

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
  inputId.value = ''
  inputTag.value = ''
  modal.style.display = 'none'
}
export function initializeDeviceModalEvents () {
  const btUpdate = document.getElementById(elements.modalBtUpdateDeviceId)
  const btCancel = document.getElementById(elements.modalBtCancelDeviceId)
  const btDelete = document.getElementById(elements.modalBtDeleteDeviceId)
  const inputTag = document.getElementById(elements.modalTagDeviceInputId)
  const inputId = document.getElementById(elements.modalIdDeviceInputId)

  btUpdate.addEventListener('click', () => {
    console.log(`update ${inputTag.value}`)
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
}
