import { openAddDeviceModal, closeAddDeviceModal, submitAddDeviceModal } from '../js/functions-add-device-events.js'
import { initializeList, handleListChanges } from './functions-list-devices-events.js'
import { openDeviceModal, initializeDeviceModalEvents } from './functions-device-modal-events.js'
function initializeElements () {
  // Add device modal
  openAddDeviceModal()
  closeAddDeviceModal()
  submitAddDeviceModal()
  // List devices modal
  initializeList(openDeviceModal)
  handleListChanges(openDeviceModal)
  // Update device modal
  initializeDeviceModalEvents()
}
window.onload = initializeElements
