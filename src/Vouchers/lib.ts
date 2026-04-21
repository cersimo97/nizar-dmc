import ExcelJs from 'exceljs'
import kyunLogo from './assets/kyunkyun-logo.jpg'
import sivolaLogo from './assets/sivola-logo.jpg'
import type { FormValues } from './schema'
import { emergencyContacts } from './data'
import { writeRoomDistribution } from './utils'

const MAX_ROWS_PER_PAGE = 54

const COLORS = {
  YELLOW: 'FFFFDC5A',
}

const YELLOW_FILL = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: COLORS.YELLOW },
} as const

const baseFont = {
  name: 'Calibri',
}

function applyYellowBg(cell: ExcelJs.Cell) {
  cell.fill = YELLOW_FILL
}

function applyHeaderStyle(cell: ExcelJs.Cell) {
  applyYellowBg(cell)
  cell.font = { ...baseFont, bold: true, size: 12 }
  cell.alignment = { horizontal: 'center' }
}

function applyBold(cell: ExcelJs.Cell) {
  cell.font = { ...baseFont, bold: true }
}

function mergeRow(
  sheet: ExcelJs.Worksheet,
  row: ExcelJs.Row,
  centered: boolean = true,
  colFrom: number = 1,
  colTo: number = 3
) {
  sheet.mergeCells(row.number, colFrom, row.number, colTo)
  if (centered) row.alignment = { horizontal: 'center' }
}

function addCenteredHeader(sheet: ExcelJs.Worksheet, text: string) {
  const row = sheet.addRow([text])
  applyHeaderStyle(row.getCell(1))
  mergeRow(sheet, row)
  return row
}

function addLabelValueRow(
  sheet: ExcelJs.Worksheet,
  label: string,
  value: string,
  boldValue: boolean = false
) {
  const row = sheet.addRow([label, value])
  if (boldValue) applyBold(row.getCell(2))
  return row
}

function addTourTable(
  sheet: ExcelJs.Worksheet,
  t: FormValues['tour'][number],
  coupon: string
) {
  const headerRow = addCenteredHeader(sheet, t.city)
  addCenteredHeader(
    sheet,
    `in ${t.dates.in.getDate()} out ${t.dates.out.getDate()}`
  )

  addLabelValueRow(sheet, 'HOTEL', t.hotel.name, true)
  addLabelValueRow(sheet, 'INDIRIZZO', t.hotel.address)
  addLabelValueRow(sheet, 'CAMERE', writeRoomDistribution(t.hotel.rooms))
  addLabelValueRow(sheet, 'CODICE PRENOTAZIONE', coupon)
  addLabelValueRow(sheet, 'TRATTAMENTO', t.hotel.service)

  const taxText = `Il comune applica una tassa di soggiorno: ${Intl.NumberFormat(
    'it-IT',
    {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'name',
    }
  ).format(t.hotel.touristTax)} a persona, a notte.`

  const taxRow = sheet.addRow([taxText])
  for (let col = 1; col <= 3; col++) {
    const cell = sheet.getCell(taxRow.number, col)
    applyYellowBg(cell)
    cell.font = {
      ...baseFont,
      italic: true,
      size: 9,
    }
    cell.alignment = {
      vertical: 'middle',
    }
  }

  const tl = sheet.getCell(headerRow.number, 1)
  const br = sheet.getCell(taxRow.number, 3)
  addBorder(sheet, tl, br)
}

function addBorder(
  sheet: ExcelJs.Worksheet,
  tl: ExcelJs.Cell,
  br: ExcelJs.Cell,
  options: Partial<ExcelJs.Border> = {
    style: 'thin',
    color: { argb: 'ff000000' },
  }
) {
  const firstRow = Number(tl.row)
  const firstCol = Number(tl.col)
  const lastRow = Number(br.row)
  const lastCol = Number(br.col)

  for (let col = firstCol; col <= lastCol; col++) {
    const cell = sheet.getCell(firstRow, col)
    cell.border = {
      ...cell.border,
      top: options,
    }
  }

  for (let r = firstRow; r <= lastRow; r++) {
    const row = sheet.getRow(r)
    const cl = row.getCell(firstCol)
    const cr = row.getCell(lastCol)

    cl.border = { ...cl.border, left: options }
    cr.border = { ...cr.border, right: options }
  }

  for (let col = firstCol; col <= lastCol; col++) {
    const cell = sheet.getCell(lastRow, col)
    cell.border = {
      ...cell.border,
      bottom: options,
    }
  }
}

function estimateTourRows() {
  return 8
}

async function addImage(
  wb: ExcelJs.Workbook,
  sheet: ExcelJs.Worksheet,
  image: string,
  range: string
) {
  const res = await fetch(image)
  const buffer = await res.arrayBuffer()
  const imageId = wb.addImage({
    buffer,
    extension: 'jpeg',
  })

  sheet.addImage(imageId, range)
}

function addEmergencyContacts(
  sheet: ExcelJs.Worksheet,
  emergencyContacts: Array<{ name: string; tel: string }>
) {
  const emc = sheet.getCell(2, 3)
  emc.value = 'Contatti di emergenza'
  emc.alignment = { horizontal: 'center' }

  emergencyContacts.forEach((ec, i) => {
    const c = sheet.getCell(4 + i, 3)
    c.value = `${ec.name}: ${ec.tel}`
    applyBold(c)
    c.alignment = { horizontal: 'center' }
  })

  sheet.getRows(1, 6)?.forEach(r => {
    applyYellowBg(r.getCell(3))
  })

  addBorder(sheet, sheet.getCell(1, 3), sheet.getCell(6, 3), { style: 'thick' })
}

export function downloadBuffer(
  buffer: ArrayBuffer,
  filename = 'voucher.xlsx',
  mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) {
  const blob = new Blob([buffer], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export async function generateVoucher(data: FormValues) {
  const workbook = new ExcelJs.Workbook()
  workbook.creator = 'KYUN KYUN MOROCCO TOUR'

  const sheet = workbook.addWorksheet('VOUCHER', {
    pageSetup: {
      paperSize: 9,
      orientation: 'portrait',
      fitToPage: true,
      fitToHeight: 2,
    },
  })

  sheet.columns = [{ width: 28 }, { width: 38 }, { width: 32 }]

  // Import KyunKyun logo image
  await addImage(workbook, sheet, kyunLogo, 'A1:A6')

  // Import SiVola logo image
  await addImage(workbook, sheet, sivolaLogo, 'B8:B11')

  // Emergency contacts
  addEmergencyContacts(sheet, emergencyContacts)

  // Add header title
  addCenteredHeader(
    sheet,
    `${data.dates.from.toLocaleDateString('it-IT')} → ${data.dates.to.toLocaleDateString('it-IT')} — ${data.numPax} PAX`
  )

  sheet.addRow([])

  sheet.addRow(['TOUR LEADER']).font = {
    bold: true,
    family: 2,
    name: 'Calibri',
  }
  sheet.addRow([data.tourLeader.name])

  sheet.addRow([])

  let used = sheet.lastRow?.number ?? 17

  data.tour.forEach(t => {
    const size = estimateTourRows()

    // Prevent page breaks in the middle of a table
    if (used + size > MAX_ROWS_PER_PAGE) {
      const breakRow = used
      sheet.getRow(breakRow).addPageBreak()
      while (used <= MAX_ROWS_PER_PAGE) {
        sheet.addRow([])
        used++
      }
      used = 0
    }

    addTourTable(sheet, t, data.coupon)
    sheet.addRow([])
    used += size + 1 // count empty line too
  })

  return workbook.xlsx.writeBuffer()
}
