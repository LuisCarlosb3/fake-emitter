import DeviceList from './elements/device-list.js'
import DeviceController from '../controller/device-controller.js'
import MqttController from '../controller/mqtt-controller.js'
import StorageManager from '../service/storage-manager.js'
import AddDeviceModal from './elements/add-device-modal.js'
import UpdateDeviceModal from './elements/update-device-modal.js'
import MqttModal from './elements/mqtt-modal.js'
import MqttConnection from '../service/mqtt-connection.js'
import { buttonOpenModal, buttonCloseModal, buttonAddDevice } from '../events/events-factory.js'
class MainApplication {
  constructor (storageManager, mqttConnection) {
    this.storageManager = storageManager
    this.mqttConnection = mqttConnection
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
    const modalBtConfigMqtt = document.getElementById(ids.modalBtConfigMqtt)
    const modalMqttConfig = document.getElementById(ids.modalMqttConfig)

    const mqttInputs = {}
    mqttInputs.clientId = document.getElementById(ids.inputMqttClient)
    mqttInputs.username = document.getElementById(ids.inputMqttUser)
    mqttInputs.port = document.getElementById(ids.inputMqttPort)
    mqttInputs.password = document.getElementById(ids.inputMqttPassword)
    mqttInputs.url = document.getElementById(ids.inputMqttUrl)
    const modalMqttSave = document.getElementById(ids.modalMqttSave)
    const modalMqttCancel = document.getElementById(ids.modalMqttCancel)

    const modalElement = new AddDeviceModal(modalAddDevice)

    const updateModalEl = new UpdateDeviceModal(
      modalUpdateDevice, modalTagDevice, modalAttributesListDevice,
      modalBtUpdateDevice, modalBtCancelDevice,
      modalBtDeleteDevice, modalBtAddAttribute
    )

    const mqttController = new MqttController(this.storageManager, this.mqttConnection)
    const mqttModal = new MqttModal(modalMqttConfig, mqttInputs,
      modalMqttSave, modalMqttCancel, mqttController)

    const deviceController = new DeviceController(this.storageManager)
    const deviceList = new DeviceList(deviceListEl, deviceController, modalElement, updateModalEl)
    await deviceList.initialize()

    buttonOpenModal(ids.btOpenAddModal, modalElement)
    buttonOpenModal(ids.modalBtConfigMqtt, mqttModal)
    buttonCloseModal(ids.btCancelAddDevice, modalElement)
    buttonCloseModal(ids.modalMqttCancel, mqttModal)
    buttonAddDevice(ids.btConfirmAddDevice, deviceList, inputNewDeviceTag)

    buttonCloseModal(ids.modalBtCancelDevice, updateModalEl)

    window.onclick = (event) => {
      if (event.target === modalAddDevice) {
        modalElement.closeModal()
      }
      if (event.target === modalUpdateDevice) {
        updateModalEl.closeModal()
      }
      if (event.target === modalMqttConfig) {
        mqttModal.closeModal()
      }
    }
  }
}

const storageManager = new StorageManager()
const mqttConnection = new MqttConnection()
window.onload = async function () {
  await storageManager.load()
  const application = new MainApplication(storageManager, mqttConnection)
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
    modalBtAddAttribute: 'modal-add-attribute',
    modalBtConfigMqtt: 'bt-config-mqtt',
    modalMqttConfig: 'modal-config-mqtt',
    inputMqttClient: 'input-mqtt-client',
    inputMqttPort: 'input-mqtt-port',
    inputMqttUser: 'input-mqtt-user',
    inputMqttPassword: 'input-mqtt-password',
    inputMqttUrl: 'input-mqtt-url',
    modalMqttSave: 'bt-confirm-mqtt-config',
    modalMqttCancel: 'bt-cancel-mqtt-config'
  })
}
require('electron').remote.getCurrentWindow().on('close', async (e) => {
  await storageManager.save()
})
