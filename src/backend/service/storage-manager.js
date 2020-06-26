const electron = require('electron')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

export default class StorageManager {
  async load () {
    const filePath = this.getPath()
    return readFileAsync(filePath, 'utf-8').then(data => {
      this.data = JSON.parse(data)
    }).catch((err) => {
      console.log(err.message)
      this.data = { devices: [], configuration: {} }
      fs.writeFileSync(filePath, JSON.stringify(this.data))
    })
  }

  async save () {
    try {
      const filePath = this.getPath()
      const storedData = JSON.stringify(this.data)
      await writeFileAsync(filePath, storedData)
    } catch (error) {
      console.log(error)
    }
  }

  getData (attribute) {
    return this.data[attribute]
  }

  setData (attributeName, dataToStore) {
    this.data[attributeName] = dataToStore
  }

  getPath () {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')
    const filePath = path.join(userDataPath, 'userData.json')
    return filePath
  }
}
