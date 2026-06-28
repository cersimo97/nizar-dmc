import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { ReceiptFormValues } from './types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import bankLogo from './assets/bank_logo.jpeg'
import { BANK_DETAILS, BUSINESS_INFO } from '../../const'
import Header from '@/pdf/Header'
import Signature from '@/pdf/Signature'
import Footer from '@/pdf/Footer'

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

export default function PDFProForma({ data }: { data: ReceiptFormValues }) {
  const receiptCode = useMemo(
    () =>
      `${String(data.progressiveNumber).padStart(3, '0')}/${dayjs(data.startDate).year()}`,
    [data]
  )

  const paymentDetails = useMemo(
    () => ({
      advance: {
        amount: data.tour.amount * 0.3,
        within: dayjs(data.startDate).subtract(2, 'month'),
      },
      final: {
        amount: data.tour.amount * 0.7,
        within: dayjs(data.startDate).subtract(1, 'month'),
      },
    }),
    [data]
  )

  return (
    <Document
      author="KYUN KYUN MOROCCO TOURS"
      creator="KYUN KYUN MOROCCO TOURS"
      title={`PROFORMA B2B72 ${receiptCode}`}
    >
      <Page size="A4" style={styles.page}>
        <Header
          invoiceCode={receiptCode}
          invoiceDate={data.receiptDate}
          isProforma
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

        {/* BANK DETAILS */}
        <View
          style={{
            border: '1px solid black',
            padding: 10,
            marginVertical: '1rem',
          }}
        >
          <Image src={bankLogo} style={{ width: 80, marginBottom: '2rem' }} />
          <Text style={{ color: 'grey', marginBottom: '1rem' }}>
            Relevé d'Identité Bancarie
          </Text>
          <Text style={{ fontWeight: 'bold' }}>{BUSINESS_INFO.name}</Text>
          <Text>{BANK_DETAILS.agency}</Text>

          <Text style={{ color: 'grey', marginBottom: '1rem' }}>
            Références Bancaires
          </Text>

          <View style={styles.table}>
            <View style={styles.row}>
              <Text
                style={[
                  styles.bankCell,
                  styles.bankCellHeader,
                  { width: '20%' },
                ]}
              >
                Code banque
              </Text>
              <Text
                style={[
                  styles.bankCell,
                  styles.bankCellHeader,
                  { width: '20%' },
                ]}
              >
                Code ville
              </Text>
              <Text
                style={[
                  styles.bankCell,
                  styles.bankCellHeader,
                  { width: '40%' },
                ]}
              >
                Numéro de compte
              </Text>
              <Text
                style={[
                  styles.bankCell,
                  styles.bankCellHeader,
                  { width: '20%' },
                ]}
              >
                Clé Rib
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={[styles.bankCell, styles.bankCellBody, { width: '20%' }]}
              >
                {BANK_DETAILS.bankCode}
              </Text>
              <Text
                style={[styles.bankCell, styles.bankCellBody, { width: '20%' }]}
              >
                {BANK_DETAILS.villeCode}
              </Text>
              <Text
                style={[styles.bankCell, styles.bankCellBody, { width: '40%' }]}
              >
                {BANK_DETAILS.ccNumber}
              </Text>
              <Text
                style={[styles.bankCell, styles.bankCellBody, { width: '20%' }]}
              >
                {BANK_DETAILS.rib}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={[
                  styles.bankCell,
                  { width: '100%', paddingLeft: '2rem' },
                ]}
              >
                CODE SWIFT: {BANK_DETAILS.swift}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={[
                  styles.bankCell,
                  { width: '100%', paddingLeft: '2rem' },
                ]}
              >
                IBAN: {BANK_DETAILS.iban}
              </Text>
            </View>
          </View>
        </View>

        {/* PAYMENT DETAILS */}
        <View style={[styles.table, { marginTop: '2rem' }]}>
          <View style={styles.row}>
            <Text style={[styles.cell, { width: '50%', fontWeight: 'bold' }]}>
              ADVANCE PAYMENT WITHIN{' '}
              {paymentDetails.advance.within.format('DD/MM/YYYY')}
            </Text>
            <Text style={[styles.cell, { width: '50%', fontWeight: 'bold' }]}>
              FINAL PAYMENT WITHIN{' '}
              {paymentDetails.final.within.format('DD/MM/YYYY')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, { width: '50%' }]}>
              {Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'code',
              }).format(data.tour.split ? paymentDetails.advance.amount : 0)}
            </Text>
            <Text style={[styles.cell, { width: '50%' }]}>
              {Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'code',
              }).format(
                data.tour.split ? paymentDetails.final.amount : data.tour.amount
              )}
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
