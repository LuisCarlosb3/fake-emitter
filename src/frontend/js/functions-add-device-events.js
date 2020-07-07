import { simpleAlert } from './events-factory.js'
const { ipcRenderer } = require('electron')
const elements = {
  buttonOpenModalId: 'bt-open-add-modal',
  modalId: 'modal-add-device',
  inputId: 'new-device-tag',
  addDeviceFormId: 'add-device-form',
  btSaveDeviceId: 'bt-confirm-add-device',
  btCancelDeviceId: 'bt-cancel-add-device'
}
export function openAddDeviceModal () {
  const button = document.getElementById(elements.buttonOpenModalId)
  const modal = document.getElementById(elements.modalId)
  button.addEventListener('click', () => {
    modal.style.display = 'block'
    window.onclick = (event) => {
      if (event.target === modal) {
        closeAddDeviceModal()
      }
    }
  })
}
export function closeAddDeviceModal () {
  const modal = document.getElementById(elements.modalId)
  const newDeviceTagInput = document.getElementById(elements.inputId)
  modal.style.display = 'none'
  newDeviceTagInput.value = ''
}
export function submitAddDeviceModal () {
  const form = document.getElementById(elements.addDeviceFormId)
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()
    var activeElement = document.activeElement
    if (activeElement.type === 'submit') {
      if (activeElement.id === elements.btSaveDeviceId) {
        saveDevice()
      }
      if (activeElement.id === elements.btCancelDeviceId) {
        closeAddDeviceModal()
      }
    }
  }, false)
}
async function saveDevice () {
  const inputEl = document.getElementById(elements.inputId)
  const deviceTag = inputEl.value
  const response = await ipcRenderer.sendSync('device:save', deviceTag)
  if (!response) {
    simpleAlert('Tag Already Exists')
  } else {
    ipcRenderer.send('device:add', response)
    closeAddDeviceModal()
  }
}
