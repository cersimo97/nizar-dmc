import dayjs from 'dayjs'
import z from 'zod'

export const tourLegs = [
  {
    city: 'Marrakech',
    hotel: {
      name: 'Riad Atlas Palace & SPA',
      address: 'N°22, 23 Derb Essandouk, Marrakech 40000',
      service: 'BB',
      touristTax: 2.5,
    },
  },
  {
    city: 'Essaouira',
    hotel: {
      name: 'Palais Des Remparts',
      address: '18 Rue Ibn Rochd, Essaouira 44000, Marocco',
      service: 'BB',
      touristTax: 2,
    },
  },
  {
    city: 'Casablanca',
    hotel: {
      name: 'Hotel Campanile',
      address: 'ANGLE Boulevard Mohamed V, Casablanca 20250, Marocco',
      service: 'BB',
      touristTax: 1.5,
    },
  },
  {
    city: 'Chefchaouen',
    hotel: {
      name: 'Riad Azemmat',
      address: 'Av. Sisi Abdelhamid, 91000 Chefchaouen',
      service: 'BB',
      touristTax: 1.5,
    },
  },
  {
    city: 'Fes',
    hotel: {
      name: 'Riad Al Makan',
      address: '8 Derb el Guebbas Douh, Fes 30000, Marocco',
      service: 'BB',
      touristTax: 2.5,
    },
  },
  {
    city: 'Midelt',
    hotel: {
      name: 'Chalet ITO Atlas Timnay',
      address: 'Q32J+MWV, Ait Toughach, Marocco',
      service: 'BB',
      touristTax: 1.5,
    },
  },
  {
    city: 'Merzouga',
    hotel: {
      name: 'Relaxing Camp Merzouga',
      address: 'Ksar merzouga, Merzouga 52202, Marocco',
      service: 'HB + CAMEL TRANSFER',
      touristTax: 2,
    },
  },
  {
    city: 'Ouarzazate',
    hotel: {
      name: 'Hotel La Perle du Sud',
      address: '39-40 Boulevard Mohamed V, 45000 Ouarzazate',
      service: 'BB',
      touristTax: 2,
    },
  },
  {
    city: 'Marrakech',
    hotel: {
      name: 'Riad Atlas Palace & SPA',
      address: 'N°22, 23 Derb Essandouk, Marrakech 40000',
      service: 'BB',
      touristTax: 2.5,
    },
  },
]

export const schema = z
  .object({
    dates: z
      .object({
        from: z.coerce.date('Inserisci la data di inizio'),
        to: z.coerce.date('Inserisci la data di fine'),
      })
      .refine(d => d.to > d.from, {
        error: 'La data di fine deve essere successiva alla data di inizio',
        path: ['to'],
      }),
    coupon: z.string(),
    numPax: z.coerce.number().min(2),
    tourLeader: z.object({
      name: z.string(),
    }),
    tour: z
      .array(
        z.object({
          dates: z
            .object({
              in: z.coerce.date('Inserisci la data del check-in'),
              out: z.coerce.date('Inserisci la data del check-out'),
            })
            .refine(d => d.out > d.in, {
              error: 'Check-out deve essere dopo check-in',
              path: ['out'],
            }),
          city: z.string(),
          hotel: z.object({
            name: z.string(),
            address: z.string(),
            service: z.string(),
            touristTax: z.coerce.number().min(0),
            rooms: z
              .object({
                qdp: z.coerce.number().min(0),
                trp: z.coerce.number().min(0),
                dbl: z.coerce.number().min(0),
                sgl: z.coerce.number().min(0),
              })
              .refine(r => r.qdp + r.trp + r.dbl + r.sgl > 0, {
                error: 'Deve esserci almeno una stanza',
              }),
          }),
        })
      )
      .superRefine((tour, ctx) => {
        for (let i = 1; i < tour.length; i++) {
          const prev = tour[i - 1]
          const curr = tour[i]

          if (dayjs(curr.dates.in).isBefore(prev.dates.out)) {
            ctx.addIssue({
              code: 'custom',
              message: 'Le tappe si sovrappongono',
              path: [i, 'dates', 'in'],
            })
          }
        }
      })
      .superRefine((tour, ctx) => {
        tour.forEach((leg, i) => {
          if (leg.city !== tourLegs[i].city) {
            ctx.addIssue({
              code: 'custom',
              message: `Città non valida (atteso ${tourLegs[i]})`,
              path: [i, 'city'],
            })
          }
        })
      }),
  })
  .superRefine((data, ctx) => {
    const first = data.tour[0]
    const last = data.tour[data.tour.length - 1]

    if (dayjs(first.dates.in).isBefore(data.dates.from)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Il tour inizia prima della data globale',
        path: ['tour', 0, 'dates', 'in'],
      })
    }

    if (dayjs(last.dates.out).isAfter(dayjs(data.dates.to), 'day')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Il tour finisce dopo la data globale',
        path: ['tour', data.tour.length - 1, 'dates', 'out'],
      })
    }
  })
  .superRefine((data, ctx) => {
    data.tour.forEach((t, i) => {
      const r = t.hotel.rooms
      const totalBeds = r.qdp * 4 + r.trp * 3 + r.dbl * 2 + r.sgl
      if (totalBeds < data.numPax) {
        ctx.addIssue({
          code: 'custom',
          message: 'Posti letto insufficienti per i partecipanti',
          path: ['tour', i, 'hotel', 'rooms'],
        })
      }
    })
  })

export type FormValues = z.infer<typeof schema>
