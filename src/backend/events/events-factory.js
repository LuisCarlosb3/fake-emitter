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
        console.log('name already exists')
      }
    } else {
      console.log('inisira corretamente')
    }
  })
}
