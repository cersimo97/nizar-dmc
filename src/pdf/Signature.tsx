import { Image, Text } from '@react-pdf/renderer'
import signature from '@images/timbro_firma.png'

export default function Signature({
  includeSignature = true,
}: {
  includeSignature: boolean
}) {
  return (
    <>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 9,
          textAlign: 'center',
          transform: 'translateX(50%)',
          marginTop: '3rem',
          marginBottom: '0.5rem',
        }}
      >
        Signature
      </Text>
      {includeSignature && (
        <Image
          src={signature}
          style={{
            width: 160,
            marginHorizontal: 'auto',
            transform: 'translateX(50%)',
          }}
        />
      )}
    </>
  )
}
