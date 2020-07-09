const { ipcMain, app } = require('electron')
const StorageManager = require('./service/storage-manager')
const MqttConnection = require('./service/mqtt-connection')
const DeviceController = require('./controller/device-controller')
const MqttController = require('./controller/mqtt-controller')
module.exports = class MainApplication {
  constructor (mainWindow) {
    this.mainWindow = mainWindow
  }

  async run () {
    await StorageManager.load()
    const deviceController = new DeviceController(StorageManager)
    const mqttController = new MqttController(StorageManager, StorageManager, MqttConnection)
    ipcMain.on('device:save', async (event, deviceTag) => {
      const newDevice = await deviceController.add(deviceTag)
      if (newDevice) {
        this.mainWindow.webContents.send('device:created', newDevice)
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
    ipcMain.on('device:delete', (event, deviceId) => {
      const isDeleted = deviceController.delete(deviceId)
      if (isDeleted) {
        this.mainWindow.webContents.send('device:deleted', deviceId)
      }
      event.returnValue = isDeleted
    })
    ipcMain.on('device:update', (event, device) => {
      const response = deviceController.updateAttribute(device)
      if (response) {
        this.mainWindow.webContents.send('device:updated', device)
      }
      event.returnValue = response
    })
    ipcMain.on('mqtt:save', (event, config) => {
      mqttController.saveConfig(config)
    })
    ipcMain.on('mqtt:load', (event) => {
      const mqtt = mqttController.getConfig()
      event.returnValue = mqtt
    })
    ipcMain.on('mqtt:status', (event) => {
      const stts = mqttController.getStatus()
      event.returnValue = stts
    })
    ipcMain.on('mqtt:run', async (event) => {
      const connection = await mqttController.connect()
      mqttController.sendData()
      event.returnValue = connection
    })
    ipcMain.on('mqtt:stop', async (event) => {
      await mqttController.disconnect()
      mqttController.stopData()
    })
    app.on('window-all-closed', async () => {
      await StorageManager.save()
    })
  }
}
