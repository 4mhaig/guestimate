# Guestimate

Webapp que calcula cuánta comida y bebida necesitas para un evento social y te arma la **cesta de la compra** con productos concretos de Mercadona y su precio aproximado.

Guestimate = *guest* (invitado) + *estimate* (estimar): estima cuánto necesitas según tus invitados, ya sea para una barbacoa, una comida familiar, un cumpleaños, Nochebuena o una casa rural de varios días.

🔗 **App en producción: [guestimate-ten.vercel.app](https://guestimate-ten.vercel.app)** (se actualiza sola con cada cambio en `main`).

> ¿Eres una persona no técnica y quieres ponerlo en marcha desde cero? Ve directo a la **[Guía paso a paso](docs/GUIA-PASO-A-PASO.md)**.

## Qué hace ahora mismo

- **Asistente de 4 pasos**: Evento → Personas → Restricciones y preferencias → Cesta.
- **Cesta viva**: muestra productos **concretos** de Mercadona con su **precio aproximado** (sin contar el envío).
- **Eliges entre 2-3 opciones** por producto mediante un desplegable, y puedes **eliminar** lo que no quieras.
- **Bebidas**: eliges cuáles incluir. Opción de añadir **aperitivo**.
- **Casa rural**: fechas de inicio y fin, eventos especiales por día (barbacoa, cumpleaños...), opción de "cocinar poco" (platos preparados) y un **menú sugerido por día** (qué se come en cada comida).
- **Peticiones especiales con IA**: un texto libre ("añade hummus", "quita el pescado") que **modifica la lista**; la IA empareja lo que pide con productos reales del catálogo y muestra el cambio como una conversación.
- **Login** con un **código de 6 dígitos** al email (o enlace), sin contraseñas; al entrar, la lista en curso se guarda sola.
- **Mis listas**: guarda tus listas y deja **feedback** después del evento. Ese feedback (faltó/sobró) **afina las cantidades** de los próximos eventos del mismo tipo.

Paleta visual "berry + crema" y tipografía Fraunces en los títulos.

## Estructura del repositorio

Es un **monorepo**: la app y las herramientas de datos viven juntas.

```
guestimate/
├── src/                  ← LA APP (frontend): React + TanStack Start + Tailwind v4 + framer-motion
│   ├── routes/             pantallas (asistente por pasos + cesta viva)
│   ├── components/         componentes (cesta, asistente, iconos, UI)
│   └── lib/
│       ├── guestimate.ts   motor de cálculo (cantidades, menú, calibración por feedback)
│       ├── products.ts     resuelve cantidades → productos concretos + precio
│       ├── ai.ts           peticiones especiales con IA (Groq), se ejecuta en el servidor
│       ├── catalog.ts      catálogo de productos (GENERADO, ver más abajo)
│       └── supabase.ts     conexión a Supabase (clave pública)
│
├── data-tools/           ← HERRAMIENTAS DE DATOS: scraper de Mercadona + utilidades Node
│   ├── src/scraper/        descarga productos y precios de la API de Mercadona
│   ├── scripts/            scrape.js, build-catalog.js
│   ├── db/schema.sql       tablas de Supabase
│   ├── data/products.json  productos descargados (GENERADO, no se sube a GitHub)
│   └── .env                claves de Supabase (NO se sube)
│
└── docs/                 ← briefing original y guía paso a paso
```

## La app (frontend)

Desde la **raíz** del proyecto:

```bash
npm install      # instalar dependencias (solo la primera vez)
npm run dev      # arrancar en local → http://localhost:8080
npm run build    # build de producción
```

Datos: Supabase (PostgreSQL). La conexión está en `src/lib/supabase.ts` (usa la clave **pública**).

### Despliegue

Ya está desplegada en **Vercel**: [guestimate-ten.vercel.app](https://guestimate-ten.vercel.app). Cada push a `main` se despliega automáticamente. `vite.config.ts` tiene el preset de Nitro `vercel`, así que el repo se importa en Vercel sin configuración extra. Ya **no** se usa Lovable: se trabaja editando el repositorio directamente.

El login (Supabase Auth, sin contraseña) usa un **código de 6 dígitos** que se escribe en la propia web; el email también incluye un enlace como alternativa. Para que ese enlace funcione, en **Supabase → Authentication → URL Configuration** deben estar la Site URL y las Redirect URLs de producción (`https://guestimate-ten.vercel.app/**`) y de local (`http://localhost:8080/**`).

Los emails de login se envían con **SMTP propio (Resend)** en vez del correo integrado de Supabase (que tiene un límite muy bajo): **Authentication → Emails → SMTP Settings** con `smtp.resend.com`, usuario `resend` y una API key de Resend como contraseña, enviando desde un dominio verificado en Resend. La plantilla "Magic Link" incluye el código `{{ .Token }}`.

## Las herramientas de datos (carpeta `data-tools/`)

Sirven para descargar los productos y precios de Mercadona y construir el catálogo que usa la app. Desde la carpeta `data-tools/`:

```bash
cd data-tools
npm install            # instalar dependencias (solo la primera vez)
npm run scrape         # descarga productos de Mercadona → data/products.json y Supabase
npm run build-catalog  # genera el catálogo de la app → src/lib/catalog.ts
```

- `npm run scrape` necesita un `data-tools/.env` con las claves de Supabase (ver `data-tools/.env.example`). Guarda los productos en `data-tools/data/products.json` y, si está configurado Supabase, los sube a la tabla `products`.
- `npm run build-catalog` lee ese `products.json` y genera `src/lib/catalog.ts`, que es lo que la app usa para mostrar productos concretos en la cesta.

Los precios se refrescan solos cada semana con una GitHub Action (`.github/workflows/refresh-prices.yml`).

Base de datos: el esquema está en `data-tools/db/schema.sql` (tablas `products`, `events`, `shopping_lists`, `feedback`).

## Documentación

- [Guía paso a paso](docs/GUIA-PASO-A-PASO.md) — para ponerlo todo en marcha desde cero (para no técnicos).
- [Briefing](docs/briefing.md) — la definición **original** del producto (documento histórico).

## Licencia

MIT
