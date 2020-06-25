import DeviceList from './device-list.js'
import DeviceController from '../controller/device-controller.js'
import StorageManager from '../service/storage-manager.js'
import AddDeviceModal from './add-device-modal.js'
import { buttonOpenModal, buttonCloseModal, buttonAddDevice } from '../events/events-factory.js'
class MainApplication {
  constructor (storageManager) {
    this.storageManager = storageManager
  }

  async config (ids) {
    const deviceListEl = document.getElementById(ids.devicesList)
    const modalAddDevice = document.getElementById(ids.modalAddDevice)
    const inputNewDeviceTag = document.getElementById(ids.newTagDeviceInput)

    const deviceController = new DeviceController(this.storageManager)
    const deviceList = new DeviceList(deviceListEl, deviceController)
    const modalElement = new AddDeviceModal(modalAddDevice)

    await deviceList.initialize()
    buttonOpenModal(ids.btOpenAddModal, modalElement)
    buttonCloseModal(ids.btCancelAddDevice, modalElement)
    buttonAddDevice(ids.btConfirmAddDevice, deviceList, inputNewDeviceTag)

    window.onclick = (event) => {
      if (event.target === modalAddDevice) {
        modalElement.closeModal()
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
    newTagDeviceInput: 'new-device-tag'
  })
}
require('electron').remote.getCurrentWindow().on('close', async (e) => {
  await storageManager.save()
})
