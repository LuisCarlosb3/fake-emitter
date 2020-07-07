import AddDeviceModal from './elements/add-device-modal.js'
import { buttonOpenModal, buttonCloseModal, buttonAddDevice, buttonActionMqtt } from './events-factory.js'
class MainApplication {
  async config (ids) {
    const modalElement = new AddDeviceModal(ids.modalAddDevice, ids.newTagDeviceInput)

    const deviceListEl = document.getElementById(ids.devicesList)
    const modalAddDevice = document.getElementById()
    const inputNewDeviceTag = document.getElementById(ids.newTagDeviceInput)

    const modalUpdateDevice = document.getElementById(ids.modalUpdateDevice)
    const modalTagDevice = document.getElementById(ids.modalTagDevice)
    const modalAttributesListDevice = document.getElementById(ids.modalAttributesListDevice)
    const modalBtUpdateDevice = document.getElementById(ids.modalBtUpdateDevice)
    const modalBtCancelDevice = document.getElementById(ids.modalBtCancelDevice)
    const modalBtDeleteDevice = document.getElementById(ids.modalBtDeleteDevice)
    const modalBtAddAttribute = document.getElementById(ids.modalBtAddAttribute)
    const modalMqttConfig = document.getElementById(ids.modalMqttConfig)
    const mqttInputs = {}
    mqttInputs.clientId = document.getElementById(ids.inputMqttClient)
    mqttInputs.username = document.getElementById(ids.inputMqttUser)
    mqttInputs.port = document.getElementById(ids.inputMqttPort)
    mqttInputs.password = document.getElementById(ids.inputMqttPassword)
    mqttInputs.url = document.getElementById(ids.inputMqttUrl)
    mqttInputs.topic = document.getElementById(ids.inputMqttTopic)
    mqttInputs.interval = document.getElementById(ids.inputMqttInterval)
    const modalMqttSave = document.getElementById(ids.modalMqttSave)
    const modalMqttCancel = document.getElementById(ids.modalMqttCancel)

    const updateModalEl = new UpdateDeviceModal(
      modalUpdateDevice, modalTagDevice, modalAttributesListDevice,
      modalBtUpdateDevice, modalBtCancelDevice,
      modalBtDeleteDevice, modalBtAddAttribute
    )
    const mqttController = new MqttController(this.storageManager, this.storageManager, this.mqttConnection)
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
    buttonActionMqtt(ids.btStartMqtt, mqttController)

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
try {
  window.onload = async function () {
    const storageManager = new StorageManager()
    const mqttConnection = new MqttConnection()
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
      inputMqttTopic: 'input-mqtt-topic',
      inputMqttInterval: 'input-mqtt-interval',
      modalMqttSave: 'bt-confirm-mqtt-config',
      modalMqttCancel: 'bt-cancel-mqtt-config',
      btStartMqtt: 'bt-start-mqtt'
    })
  }
  // Mudar para event
  // require('electron').remote.getCurrentWindow().on('close', async (e) => {
  //   await storageManager.save()
  // })
} catch (error) {
  console.log(error)
}
