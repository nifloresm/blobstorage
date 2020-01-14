const azureStorage = require('azure-storage')
const XLSX = require('xlsx')

const getExcelFromBlobStorage = (container, blob, filename) => {
  const blobService = azureStorage.createBlobService()

  return new Promise((resolve, reject) => {
    blobService.getBlobToLocalFile(
      'test',
      'test/PorLiquidar_212020.xlsx',
      'test.xlsx',
      (err, text) => {
        if (err) {
          reject(err.message)
        } else {
          resolve(text)
        }
      }
    )
  })
}

module.exports = async function(context, req) {
  try {
    //get blob storage
    // const excelFile = await getExcelFromBlobStorage(
    //   'test',
    //   'test/PorLiquidar_212020.xlsx',
    //   'test.xlsx'
    // )

    const workbook = XLSX.readFile('test.xlsx')
    const sheetNameList = workbook.SheetNames

    const mapSheetNames = sheetNameList.map(sheet => {
      return XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    })

    context.res = {
      body: mapSheetNames
    }
  } catch (err) {
    context.res = {
      status: 500,
      body: 'Error error error error'
    }
  }
}
