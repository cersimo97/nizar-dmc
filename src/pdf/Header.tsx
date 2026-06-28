import { Image, Text } from '@react-pdf/renderer'
import dayjs from 'dayjs'
import kyunLogo from '@images/logo.png'

interface HeaderProps {
  invoiceDate: Date | string
  invoiceCode: string
  isProforma: boolean
}

export default function Header({
  invoiceCode,
  invoiceDate,
  isProforma,
}: HeaderProps) {
  return (
    <>
      <Image src={kyunLogo} style={{ width: 120, marginHorizontal: 'auto' }} />
      <Text
        textAnchor="end"
        style={{
          textAlign: 'right',
        }}
      >
        Casablanca, {dayjs(invoiceDate).format('DD/MM/YYYY')}
      </Text>
      <Text style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        RECIPIENT:
      </Text>
      <Text>B2B 72 SRL</Text>
      <Text>VIA ORAZIO ANTINORI 6, 10128</Text>
      <Text>TORINO</Text>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: '2rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}
      >
        FACTURE {isProforma && 'PROFORMA'} N° {invoiceCode}
      </Text>
    </>
  )
}
