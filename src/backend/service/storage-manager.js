const electron = require('electron')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

module.exports = {
  async load () {
    const filePath = this.getPath('userData')
    console.log(filePath)
    return readFileAsync(filePath, 'utf-8').then(data => {
      this.data = JSON.parse(data)
    }).catch((err) => {
      console.log(err)
      this.data = { devices: [], configuration: {} }
      fs.writeFileSync(filePath, JSON.stringify(this.data))
    })
  },
  async save () {
    try {
      const filePath = this.getPath('userData')
      const storedData = JSON.stringify(this.data)
      await writeFileAsync(filePath, storedData)
    } catch (error) {
      this.errorStore(error)
    }
  },
  getData (attribute) {
    return this.data[attribute]
  },
  setData (attributeName, dataToStore) {
    this.data[attributeName] = dataToStore
  },
  async errorStore (err) {
    const filePath = this.getPath('errors')
    await writeFileAsync(filePath, err)
  },
  getPath (file) {
    const userDataPath = (electron.app || electron.remote.app).getPath(file)
    const filePath = path.join(userDataPath, `${file}.json`)
    return filePath
  }
}
