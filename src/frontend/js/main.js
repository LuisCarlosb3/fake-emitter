import { openAddDeviceModal, closeAddDeviceModal, submitAddDeviceModal } from '../js/functions-add-device-events.js'
import { initializeList } from './functions-list-devices-events.js'
function initializeElements () {
  // Add device modal
  openAddDeviceModal()
  closeAddDeviceModal()
  submitAddDeviceModal()
  // List devices modal
  initializeList()
}
window.onload = initializeElements
