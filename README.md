# Guestimate

Webapp que calcula cuánta comida y bebida necesitas para un evento social, genera la lista de la compra con cantidades y compara precios reales de Mercadona.

Guestimate = *guest* (invitado) + *estimate* (estimar): estima cuánto necesitas según tus invitados, para una barbacoa, comida familiar, cumpleaños, Nochebuena o una casa rural de varios días.

## Estructura del repositorio

Este repo contiene **dos cosas** que viven juntas:

```
guestimate/
├── src/                  ← LA APP (frontend): React + TanStack Start + Tailwind + framer-motion
│   ├── routes/             pantallas (asistente por pasos + cesta viva)
│   ├── components/         componentes (cesta, stepper, iconos, UI)
│   └── lib/
│       ├── guestimate.ts   motor de cálculo de la app
│       └── supabase.ts     conexión a Supabase
│
├── data-tools/           ← BACKEND/DATOS: scraper de Mercadona + utilidades Node
│   ├── src/scraper/        descarga productos y precios de la API de Mercadona
│   ├── src/portions/       motor de cálculo de referencia (Node)
│   ├── scripts/            npm run scrape, npm run demo
│   ├── db/schema.sql       tablas de Supabase
│   └── .env                claves de Supabase (NO se sube)
│
└── docs/                 ← briefing, guía paso a paso y prompt de Lovable
```

## La app (frontend)

```bash
npm install      # instalar dependencias
npm run dev      # arrancar en local (http://localhost:8080)
npm run build    # build de producción
```

Datos: Supabase (PostgreSQL). La conexión está en `src/lib/supabase.ts` (clave pública).

## Las herramientas de datos (scraper de Mercadona)

```bash
cd data-tools
npm install
npm run scrape   # descarga productos de Mercadona y los sube a Supabase
npm run demo     # prueba el motor de cálculo
npm test         # tests
```

Necesita un `data-tools/.env` con las claves de Supabase (ver `data-tools/.env.example`).

## Documentación

- [Guía paso a paso](docs/GUIA-PASO-A-PASO.md) — para ponerlo todo en marcha desde cero.
- [Briefing](docs/briefing.md) — la definición original del producto.

## Licencia

MIT
