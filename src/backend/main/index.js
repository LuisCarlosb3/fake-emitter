import DeviceList from './device-list.js'
import DeviceController from '../events/device-controller.js'
import StorageManager from '../service/storage-manager.js'
class MainApplication {
  constructor (storageManager) {
    this.storageManager = storageManager
  }

  async config (ids) {
    const deviceListEl = document.getElementById(ids.devicesList)
    const btOpenModal = document.getElementById(ids.btOpenAddModal)
    const btAddDevice = document.getElementById(ids.btAddDevice)
    const btRemoveDevice = document.getElementById(ids.btRemoveDevice)

    const deviceController = new DeviceController(this.storageManager)
    const deviceList = new DeviceList(deviceListEl, deviceController)
    await deviceList.initialize()

    btAddDevice.addEventListener('click', () => deviceList.addDevice())
    btRemoveDevice.addEventListener('click', () => deviceList.removeDevice())
  }
}

const storageManager = new StorageManager()
window.onload = async function () {
  await storageManager.load()
  const application = new MainApplication(storageManager)
  application.config({
    btOpenAddModal: 'bt-open-add-modal',
    btAddDevice: 'bt-add-device',
    btRemoveDevice: 'bt-remove-device',
    devicesList: 'devices-list'
  })
}
require('electron').remote.getCurrentWindow().on('close', async (e) => {
  await storageManager.save()
})
