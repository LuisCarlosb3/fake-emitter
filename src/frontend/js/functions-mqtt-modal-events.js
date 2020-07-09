import { simpleAlert } from './events-factory.js'
const { ipcRenderer } = require('electron')

const elements = {
  btOpenMqttModal: 'bt-config-mqtt',
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
}
export function openMqttModalEvent () {
  const btOpenMqtt = document.getElementById(elements.btOpenMqttModal)
  const modalMqtt = document.getElementById(elements.modalMqttConfig)
  const btSave = document.getElementById(elements.modalMqttSave)
  btOpenMqtt.onclick = () => {
    modalMqtt.style.display = 'block'
    fillFelds()
    window.onclick = (event) => {
      if (event.target === modalMqtt) {
        closeMqttModal()
      }
    }
  }
  btSave.addEventListener('click', saveConfigurationEvent)
  buttonStartStopMqtt()
}
export function buttonCloseModal () {
  const btCloseModal = document.getElementById(elements.modalMqttCancel)
  btCloseModal.onclick = () => {
    closeMqttModal()
  }
}
function closeMqttModal () {
  const modal = document.getElementById(elements.modalMqttConfig)

  const clientInput = document.getElementById(elements.inputMqttClient)
  const portInput = document.getElementById(elements.inputMqttPort)
  const userInput = document.getElementById(elements.inputMqttUser)
  const passwordInput = document.getElementById(elements.inputMqttPassword)
  const urlInput = document.getElementById(elements.inputMqttUrl)
  const topicInput = document.getElementById(elements.inputMqttTopic)
  const intervalInput = document.getElementById(elements.inputMqttInterval)

  clientInput.value = ''
  portInput.value = ''
  userInput.value = ''
  passwordInput.value = ''
  urlInput.value = ''
  topicInput.value = ''
  intervalInput.value = ''

  modal.style.display = 'none'
}
function saveConfigurationEvent () {
  const clientId = document.getElementById(elements.inputMqttClient).value
  const port = document.getElementById(elements.inputMqttPort).value
  const username = document.getElementById(elements.inputMqttUser).value
  const password = document.getElementById(elements.inputMqttPassword).value
  const url = document.getElementById(elements.inputMqttUrl).value
  const topic = document.getElementById(elements.inputMqttTopic).value
  const interval = document.getElementById(elements.inputMqttInterval).value
  const btRunMqtt = document.getElementById(elements.btStartMqtt)
  const imageAction = btRunMqtt.querySelectorAll('img')[0]

  if (
    clientId.trim() === '' ||
    port.trim() === '' ||
    username.trim() === '' ||
    url.trim() === '' ||
    topic.trim() === '' ||
    interval.trim() === ''
  ) {
    simpleAlert('Fill the fields correctly')
  } else {
    const config = {
      clientId,
      port,
      username,
      password,
      url,
      topic,
      interval
    }
    ipcRenderer.send('mqtt:save', config)
    imageAction.setAttribute('src', '../img/play-white.svg')
    closeMqttModal()
  }
}
function fillFelds () {
  const clientId = document.getElementById(elements.inputMqttClient)
  const port = document.getElementById(elements.inputMqttPort)
  const username = document.getElementById(elements.inputMqttUser)
  const password = document.getElementById(elements.inputMqttPassword)
  const url = document.getElementById(elements.inputMqttUrl)
  const topic = document.getElementById(elements.inputMqttTopic)
  const interval = document.getElementById(elements.inputMqttInterval)
  const config = ipcRenderer.sendSync('mqtt:load')
  clientId.value = config.clientId
  port.value = config.port
  username.value = config.username
  password.value = config.password
  url.value = config.url
  topic.value = config.topic
  interval.value = config.interval
}
export function buttonStartStopMqtt () {
  const btRunMqtt = document.getElementById(elements.btStartMqtt)
  const imageAction = btRunMqtt.querySelectorAll('img')[0]
  btRunMqtt.addEventListener('click', async () => {
    let running = ipcRenderer.sendSync('mqtt:status')
    try {
      if (!running) {
        await ipcRenderer.sendSync('mqtt:run')
        simpleAlert('MQTT Connected', 'info')
        imageAction.setAttribute('src', '../img/stop-white.svg')
        running = true
      } else {
        ipcRenderer.send('mqtt:stop')
        simpleAlert('MQTT Disconnected', 'info')
        running = false
        imageAction.setAttribute('src', '../img/play-white.svg')
      }
      console.log(running)
    } catch (err) {
      simpleAlert('An error has occured')
      ipcRenderer.send('mqtt:stop')
      imageAction.setAttribute('src', '../img/play-white.svg')
      console.log(err)
      running = false
    }
  })
}
