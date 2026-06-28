export function writeRoomDistribution({
  qdp,
  trp,
  dbl,
  sgl,
}: Record<string, number>) {
  const qdpText = qdp ? `${qdp} QDP` : null
  const trpText = trp ? `${trp} TRP` : null
  const dblText = dbl ? `${dbl} DBL` : null
  const sglText = sgl ? `${sgl} SGL` : null

  return [qdpText, trpText, dblText, sglText]
    .filter(f => f !== null)
    .join(' + ')
}
