const azureStorage = require('azure-storage')

const getExcelFromBlobStorage = (container, blob, filename) => {
  const blobService = azureStorage.createBlobService()

  return new Promise((resolve, reject) => {
    blobService.getBlobToLocalFile(container, blob, filename, (err, text) => {
      if (err) {
        reject(err.message)
      } else {
        resolve(text)
      }
    })
  })
}

module.exports = getExcelFromBlobStorage
