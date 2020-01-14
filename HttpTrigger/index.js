const XLSX = require('xlsx')

const { getExcelFromBlobStorage, queryMapper } = require('./helpers')

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

    context.res = {
      body: queryMapper(workbook)
    }
  } catch (err) {
    console.log('Error:', err)
    context.res = {
      status: 500,
      body: 'Error error error error'
    }
  }
}
