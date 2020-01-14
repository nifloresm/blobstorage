const azureStorage = require('azure-storage')
const XLSX = require('xlsx')

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

const mapData = (sheetName, data) => {
  const folioData = {
    FOLIOS_PENDIENTES: data =>
      data.map(elem => {
        console.log('### ELEMENTS', elem)
        return {
          folio: elem.FOLIO,
          recepcion: elem.RECEPCION
        }
      }),
    default: null
  }

  switch (sheetName) {
    case 'Folios Pendientes':
      return folioData['FOLIOS_PENDIENTES'](data)
    default:
      null
  }
}

module.exports = async function(context, req) {
  try {
    // const excelFile = await getExcelFromBlobStorage(
    //   'test',
    //   'test/PorLiquidar_212020.xlsx',
    //   'test.xlsx'
    // )

    const workbook = XLSX.readFile('test.xlsx', {
      cellDates: true,
      cellNF: false,
      cellText: false
    })
    const sheetNameList = workbook.SheetNames

    const mapSheetNames = sheetNameList
      .filter(sheetValue => sheetValue !== 'Total')
      .reduce((accum, nextValue) => {
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[nextValue], {
          dateNF: 'YYYY-MM-DD'
        })

        const customData = {
          name: nextValue,
          data: mapData(nextValue, sheetData)
        }

        return [...accum, customData]
      }, [])

    context.res = {
      body: mapSheetNames
    }
  } catch (err) {
    console.log('Error:', err)
    context.res = {
      status: 500,
      body: 'Error error error error'
    }
  }
}
