import DeviceList from './device-list.js'
import DeviceController from '../controller/device-controller.js'
import StorageManager from '../service/storage-manager.js'
import AddDeviceModal from './add-device-modal.js'
import UpdateDeviceModal from './update-device-modal.js'
import { buttonOpenModal, buttonCloseModal, buttonAddDevice } from '../events/events-factory.js'
class MainApplication {
  constructor (storageManager) {
    this.storageManager = storageManager
  }

  async config (ids) {
    const deviceListEl = document.getElementById(ids.devicesList)
    const modalAddDevice = document.getElementById(ids.modalAddDevice)
    const inputNewDeviceTag = document.getElementById(ids.newTagDeviceInput)

    const modalUpdateDevice = document.getElementById(ids.modalUpdateDevice)
    const modalTagDevice = document.getElementById(ids.modalTagDevice)
    const modalAttributesListDevice = document.getElementById(ids.modalAttributesListDevice)
    const modalBtUpdateDevice = document.getElementById(ids.modalBtUpdateDevice)
    const modalBtCancelDevice = document.getElementById(ids.modalBtCancelDevice)
    const modalBtDeleteDevice = document.getElementById(ids.modalBtDeleteDevice)
    const modalBtAddAttribute = document.getElementById(ids.modalBtAddAttribute)

    const modalElement = new AddDeviceModal(modalAddDevice)

    const updateModalEl = new UpdateDeviceModal(
      modalUpdateDevice, modalTagDevice, modalAttributesListDevice,
      modalBtUpdateDevice, modalBtCancelDevice,
      modalBtDeleteDevice, modalBtAddAttribute
    )
    const deviceController = new DeviceController(this.storageManager)
    const deviceList = new DeviceList(deviceListEl, deviceController, updateModalEl)
    await deviceList.initialize()
    buttonOpenModal(ids.btOpenAddModal, modalElement)
    buttonCloseModal(ids.btCancelAddDevice, modalElement)
    buttonAddDevice(ids.btConfirmAddDevice, deviceList, inputNewDeviceTag)

    buttonCloseModal(ids.modalBtCancelDevice, updateModalEl)

    window.onclick = (event) => {
      if (event.target === modalAddDevice) {
        modalElement.closeModal()
      }
      if (event.target === modalUpdateDevice) {
        updateModalEl.closeModal()
      }
    }
  }
}

const storageManager = new StorageManager()
window.onload = async function () {
  await storageManager.load()
  const application = new MainApplication(storageManager)
  application.config({
    btOpenAddModal: 'bt-open-add-modal',
    btConfirmAddDevice: 'bt-confirm-add-device',
    btCancelAddDevice: 'bt-cancel-add-device',
    devicesList: 'devices-list',
    modalAddDevice: 'modal-add-device',
    newTagDeviceInput: 'new-device-tag',
    modalUpdateDevice: 'modal-device',
    modalTagDevice: 'modal-device-tag',
    modalAttributesListDevice: 'modal-device-attributes',
    modalBtUpdateDevice: 'bt-modal-confirm-update-device',
    modalBtCancelDevice: 'bt-modal-cancel-update-device',
    modalBtDeleteDevice: 'bt-modal-delete-device',
    modalBtAddAttribute: 'modal-add-attribute'
  })
}
require('electron').remote.getCurrentWindow().on('close', async (e) => {
  await storageManager.save()
})
