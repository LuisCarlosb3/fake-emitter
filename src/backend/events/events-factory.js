const Swal = require('sweetalert2')
export function buttonOpenModal (buttonId, modalEl) {
  const btOpenModal = document.getElementById(buttonId)
  btOpenModal.addEventListener('click', () => { modalEl.openModal() })
}
export function buttonCloseModal (buttonId, modalEl) {
  const btOpenModal = document.getElementById(buttonId)
  btOpenModal.addEventListener('click', () => { modalEl.closeModal() })
}
export function buttonAddDevice (buttonId, deviceList, inputElement) {
  const btAddDevice = document.getElementById(buttonId)
  btAddDevice.addEventListener('click', async () => {
    const newTag = inputElement.value
    if (newTag.trim().length > 0) {
      const response = await deviceList.addDevice(newTag)
      if (!response) {
        simpleAlert('Tag already exists')
      }
    } else {
      simpleAlert('Please, insert device tag')
    }
  })
}
export function simpleAlert (message, type = 'warning') {
  Swal.fire({
    text: message,
    icon: type,
    confirmButtonText: 'OK'
  })
}
export function buttonActionMqtt (buttonId, mqttController) {
  const btStartMqtt = document.getElementById(buttonId)
  const imageAction = btStartMqtt.querySelectorAll('img')[0]
  let running = false
  btStartMqtt.addEventListener('click', async () => {
    try {
      if (!running) {
        await mqttController.connect()
        mqttController.sendData()
        simpleAlert('MQTT Connected', 'info')
        imageAction.setAttribute('src', '../img/stop-white.svg')
        running = true
      } else {
        mqttController.stopData()
        await mqttController.disconnect()
        simpleAlert('MQTT Disconnected', 'info')
        running = false
        imageAction.setAttribute('src', '../img/play-white.svg')
      }
    } catch (err) {
      simpleAlert('An error has occured')
      mqttController.stopData()
      imageAction.setAttribute('src', '../img/play-white.svg')
      console.log(err)
      running = false
    }
  })
}
