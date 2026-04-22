import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { FormValues } from './schema'
import kyunLogo from './assets/kyunkyun-logo.jpg'
import sivolaLogo from './assets/sivola-logo.jpg'
import { writeRoomDistribution } from './utils'
import { emergencyContacts } from './data'
import dayjs from 'dayjs'

const PADDING_VALUE = 24

const styles = StyleSheet.create({
  page: {
    padding: PADDING_VALUE,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  row: {
    flexDirection: 'row',
  },
  col1: { width: '30%' },
  col2: { width: '70%' },

  header: {
    paddingVertical: 2,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    marginVertical: 8,
    backgroundColor: '#FFDC5A',
  },

  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },

  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 6,
  },
  cell: {
    padding: 4,
  },
  bottomRow: {
    padding: 4,
    backgroundColor: '#FFDC5A',
  },
  emergencyContactsText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

function TourTable({
  t,
  coupon,
}: {
  t: FormValues['tour'][number]
  coupon: string
}) {
  return (
    <>
      <View style={styles.table}>
        <View
          style={[
            styles.header,
            {
              marginVertical: 0,
            },
          ]}
        >
          <Text>{t.city}</Text>
          <Text style={{ fontSize: 10, fontWeight: 'normal' }}>
            in {t.dates.in.getDate()} out {t.dates.out.getDate()}
          </Text>
        </View>
        <View style={[styles.row, { borderBottom: '1px solid #EEEEEE' }]}>
          <Text style={[styles.cell, styles.col1]}>HOTEL</Text>
          <Text style={[styles.cell, styles.col2, { fontWeight: 'bold' }]}>
            {t.hotel.name}
          </Text>
        </View>
        <View style={[styles.row, { borderBottom: '1px solid #EEEEEE' }]}>
          <Text style={[styles.cell, styles.col1]}>INDIRIZZO</Text>
          <Text style={[styles.cell, styles.col2]}>{t.hotel.address}</Text>
        </View>
        <View style={[styles.row, { borderBottom: '1px solid #EEEEEE' }]}>
          <Text style={[styles.cell, styles.col1]}>CAMERE</Text>
          <Text style={[styles.cell, styles.col2]}>
            {writeRoomDistribution(t.hotel.rooms)}
          </Text>
        </View>
        <View style={[styles.row, { borderBottom: '1px solid #EEEEEE' }]}>
          <Text style={[styles.cell, styles.col1]}>CODICE PRENOTAZIONE</Text>
          <Text style={[styles.cell, styles.col2]}>{coupon}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.col1]}>TRATTAMENTO</Text>
          <Text style={[styles.cell, styles.col2]}>{t.hotel.service}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={{ fontStyle: 'italic', fontSize: 9 }}>
            Il comune applica una tassa di soggiorno:{' '}
            {Intl.NumberFormat('it-IT', {
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'code',
            }).format(t.hotel.touristTax)}{' '}
            a persona, a notte.
          </Text>
        </View>
      </View>
    </>
  )
}

function PDFVoucher({ data }: { data: FormValues }) {
  return (
    <Document
      author="KYUN KYUN MOROCCO TOUR"
      creator="KYUN KYUN MOROCCO TOUR"
      title={`VOUCHER - ${dayjs(data.dates.from).format('DD_MM_YYYY')} ${dayjs(data.dates.to).format('DD_MM_YYYY')} - ${data.numPax} PAX`}
    >
      <Page size="A4" style={styles.page}>
        {/* Contatti di emergenza */}
        <View
          style={{
            position: 'absolute',
            top: PADDING_VALUE,
            right: PADDING_VALUE,
            border: '1px solid black',
            backgroundColor: '#FFDC5A',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Text style={[styles.emergencyContactsText, { marginBottom: 10 }]}>
            Contatti di emergenza
          </Text>
          {emergencyContacts.map((ec, i) => (
            <Text key={i} style={styles.emergencyContactsText}>
              {ec.name}: {ec.tel}
            </Text>
          ))}
        </View>
        {/* LOGHI */}
        <View style={styles.row}>
          <Image src={kyunLogo} style={{ width: 120 }} />
        </View>
        <View style={{ margin: '20 auto 5 auto' }}>
          <Image src={sivolaLogo} style={{ width: 100 }} />
        </View>
        {/* HEADER */}
        <Text style={styles.header}>
          {`${data.dates.from.toLocaleDateString('it-IT')} - ${data.dates.to.toLocaleDateString('it-IT')} — ${data.numPax} PAX`}
        </Text>
        {/* TOUR LEADER */}
        <Text style={styles.sectionTitle}>TOUR LEADER</Text>
        <Text>{data.tourLeader.name}</Text>
        {/* TOUR TABLES */}
        {data.tour.map((t, i) => (
          <View key={i} style={{ marginTop: 10 }} wrap={false}>
            <TourTable t={t} coupon={data.coupon} />
          </View>
        ))}

        {/* Numero di pagina */}
        <View
          style={{
            padding: `10 ${PADDING_VALUE}`,
            position: 'absolute',
            bottom: 10,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          fixed
        >
          <Text style={{ textAlign: 'center', fontSize: 8 }}>
            Kyun Kyun Morocco Tour -{' '}
            <Text style={{ fontStyle: 'italic' }}>
              Voucher {dayjs(data.dates.from).format('DD/MM/YYYY')}-
              {dayjs(data.dates.to).format('DD/MM/YYYY')} ({data.numPax} PAX)
            </Text>
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 8,
            }}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}

export default PDFVoucher
