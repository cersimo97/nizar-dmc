import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { InvoiceFormValues } from './types'
import { useMemo } from 'react'
import dayjs from 'dayjs'

import Footer from '@/pdf/Footer'
import Signature from '@/pdf/Signature'
import Header from '@/pdf/Header'

const PADDING_VALUE = 24

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: PADDING_VALUE,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },

  row: {
    flexDirection: 'row',
  },

  header: {
    backgroundColor: '#eee',
    fontWeight: 700,
  },

  cell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  designation: {
    width: '70%',
  },
  amount: { width: '30%', textAlign: 'right' },
  totalsBox: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 6,
    marginTop: 10,
    alignSelf: 'flex-end',
    width: '30%',
  },

  totalsRow: {
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 3,
  },
  bankCellHeader: { fontWeight: 'bold' },
  bankCellBody: { textAlign: 'right' },
})

export default function PDFInvoice({ data }: { data: InvoiceFormValues }) {
  const receiptCode = useMemo(
    () =>
      `${String(data.progressiveNumber).padStart(3, '0')}/${dayjs(data.startDate).year()}`,
    [data]
  )

  return (
    <Document
      author="KYUN KYUN MOROCCO TOURS"
      creator="KYUN KYUN MOROCCO TOURS"
      title={`FACTURE B2B72 ${receiptCode}`}
    >
      <Page size="A4" style={styles.page}>
        <Header
          invoiceCode={receiptCode}
          invoiceDate={data.receiptDate}
          isProforma={false}
        />

        <View style={styles.table}>
          {/* HEADER */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.designation]}>Designation</Text>
            <Text style={[styles.cell, styles.amount]}>Amount</Text>
          </View>
          {/* ROW */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.designation]}>
              {data.tour.type === 'standard' ? 'BIG TOUR' : 'SURF & SOUND'} -{' '}
              {dayjs(data.startDate).format('DDMMYY')}
            </Text>
            <Text style={[styles.cell, styles.amount]}>
              {Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
              }).format(data.tour.amount)}
            </Text>
          </View>
        </View>
        {/* TOTALS */}
        <View style={styles.totalsBox}>
          <View style={styles.totalsRow}>
            <Text>Total:</Text>
            <Text>
              {Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
              }).format(data.tour.amount)}
            </Text>
          </View>
        </View>

        {/* SIGNATURE */}
        <Signature />

        {/* FOOTER */}
        <Footer />
      </Page>
    </Document>
  )
}
