import { BUSINESS_INFO } from '@/const'
import { StyleSheet, Text, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  footerText: { textAlign: 'center', fontSize: 9 },
})

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={[styles.footerText, { fontSize: 8 }]}>
        {BUSINESS_INFO.name} / ICE: {BUSINESS_INFO.ice}
      </Text>
      <Text style={styles.footerText}>{BUSINESS_INFO.address}</Text>
      <Text style={styles.footerText}>
        Mobile 1: {BUSINESS_INFO.mobile_1} Mobile 2: {BUSINESS_INFO.mobile_2}
      </Text>
      <Text style={styles.footerText}>E-mail: {BUSINESS_INFO.email}</Text>
    </View>
  )
}
