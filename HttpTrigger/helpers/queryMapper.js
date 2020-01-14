const XLSX = require('xlsx')

const mapData = (sheetName, data) => {
  const folioData = {
    FOLIOS_PENDIENTES: data =>
      data.map(elem => {
        return {
          folio: elem.FOLIO,
          recepcion: elem.RECEPCION
        }
      }),
    FOLIOS_CANCELADOS: data =>
      data.map(elem => {
        return {
          folio: elem.FOLIO
        }
      }),
    FOLIOS_SIN_DESPACHO: data =>
      data.map(elem => {
        return {
          folio: elem.FOLIO,
          abastOMS: elem.OMS_ABAST
        }
      }),
    SIN_CATEGORIAS: data =>
      data.map(elem => {
        return {
          sku: elem.sku
        }
      }),
    default: null
  }

  switch (sheetName) {
    case 'Folios Pendientes':
      return folioData['FOLIOS_PENDIENTES'](data)
    case 'Folios Cancelados':
      return folioData['FOLIOS_CANCELADOS'](data)
    case 'Folios Sin Despacho':
      return folioData['FOLIOS_SIN_DESPACHO'](data)
    case 'Sin Categorias':
      return folioData['SIN_CATEGORIAS'](data)
    default:
      null
  }
}

const queryMapper = workbook => {
  const sheetNameList = workbook.SheetNames

  return sheetNameList
    .filter(sheetValue => sheetValue !== 'Total')
    .reduce((accum, nextValue) => {
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[nextValue], {
        dateNF: 'YYYY-MM-DD'
      })

      const queryData = {
        name: nextValue,
        data: mapData(nextValue, sheetData)
      }

      return [...accum, queryData]
    }, [])
}

module.exports = queryMapper
