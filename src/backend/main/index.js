import DeviceList from './device-list.js'

class MainApplication {
  async config (ids) {
    const deviceListEl = document.getElementById(ids.devicesList)
    const btOpenModal = document.getElementById(ids.btOpenAddModal)
    const btAddDevice = document.getElementById(ids.btAddDevice)
    const btRemoveDevice = document.getElementById(ids.btRemoveDevice)

    this.deviceList = new DeviceList(deviceListEl)
    this.deviceList.initialize()

    btAddDevice.addEventListener('click', () => this.deviceList.addDevice())
    btRemoveDevice.addEventListener('click', () => this.deviceList.removeDevice())
  }
}
window.onload = function () {
  const application = new MainApplication()
  application.config({
    btOpenAddModal: 'bt-open-add-modal',
    btAddDevice: 'bt-add-device',
    btRemoveDevice: 'bt-remove-device',
    devicesList: 'devices-list'
  })
}
