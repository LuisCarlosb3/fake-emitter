import DeviceList from './device-list.js'
import DeviceController from '../events/device-controller.js'
import StorageManager from '../service/storage-manager.js'
import AddDeviceModal from './add-device-modal.js'
class MainApplication {
  constructor (storageManager) {
    this.storageManager = storageManager
  }

  async config (ids) {
    const deviceListEl = document.getElementById(ids.devicesList)
    const btOpenModal = document.getElementById(ids.btOpenAddModal)
    const btAddDevice = document.getElementById(ids.btAddDevice)
    const modalAddDevice = document.getElementById(ids.modalAddDevice)

    const deviceController = new DeviceController(this.storageManager)
    const deviceList = new DeviceList(deviceListEl, deviceController)
    const modalElement = new AddDeviceModal(modalAddDevice)

    await deviceList.initialize()

    btAddDevice.addEventListener('click', () => deviceList.addDevice())
    btOpenModal.addEventListener('click', () => { modalElement.openModal() })
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
