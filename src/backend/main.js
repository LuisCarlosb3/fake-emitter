const { ipcMain, app } = require('electron')
const StorageManager = require('./service/storage-manager')
const DeviceController = require('./controller/device-controller')
module.exports = class MainApplication {
  async run () {
    await StorageManager.load()
    const deviceController = new DeviceController(StorageManager)
    ipcMain.on('device:save', async (event, deviceTag) => {
      const newDevice = await deviceController.add(deviceTag)
      if (newDevice) {
        console.log('salvou')
      }
      event.returnValue = newDevice
    })
    ipcMain.on('device:load', (event, arg) => {
      const devices = deviceController.getDevices()
      event.returnValue = devices
    })
    ipcMain.on('device:state', (event, deviceId) => {
      const state = deviceController.updateState(deviceId)
      event.returnValue = state
    })

    app.on('window-all-closed', async () => {
      await StorageManager.save()
    })
  }
}
