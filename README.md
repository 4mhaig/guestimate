# Guestimate

Webapp que calcula cuánta comida y bebida necesitas para un evento social y te arma la **cesta de la compra** con productos concretos de Mercadona y su precio aproximado.

Guestimate = *guest* (invitado) + *estimate* (estimar): estima cuánto necesitas según tus invitados, ya sea para una barbacoa, una comida familiar, un cumpleaños, Nochebuena o una casa rural de varios días.

> ¿Eres una persona no técnica y quieres ponerlo en marcha desde cero? Ve directo a la **[Guía paso a paso](docs/GUIA-PASO-A-PASO.md)**.

## Qué hace ahora mismo

- **Asistente de 4 pasos**: Evento → Personas → Restricciones y preferencias → Cesta.
- **Cesta viva**: muestra productos **concretos** de Mercadona con su **precio aproximado** (sin contar el envío).
- **Eliges entre 2-3 opciones** por producto mediante un desplegable, y puedes **eliminar** lo que no quieras.
- **Bebidas**: eliges cuáles incluir. Opción de añadir **aperitivo**.
- **Casa rural**: fechas de inicio y fin, y eventos especiales por día (barbacoa, cumpleaños...).
- **Peticiones especiales**: un texto libre para pedir cosas concretas.
- **Mis listas**: guarda tus listas y deja **feedback** después del evento.

Paleta visual "berry + crema" y tipografía Fraunces en los títulos.

### Próximamente (aún no está hecho)

- **Login con Google** (mediante Supabase Auth).
- Que la **IA tenga en cuenta las peticiones especiales** al armar la cesta.

## Estructura del repositorio

Es un **monorepo**: la app y las herramientas de datos viven juntas.

```
guestimate/
├── src/                  ← LA APP (frontend): React + TanStack Start + Tailwind v4 + framer-motion
│   ├── routes/             pantallas (asistente por pasos + cesta viva)
│   ├── components/         componentes (cesta, asistente, iconos, UI)
│   └── lib/
│       ├── guestimate.ts   motor de cálculo de la app
│       ├── catalog.ts      catálogo de productos (GENERADO, ver más abajo)
│       └── supabase.ts     conexión a Supabase (clave pública)
│
├── data-tools/           ← HERRAMIENTAS DE DATOS: scraper de Mercadona + utilidades Node
│   ├── src/scraper/        descarga productos y precios de la API de Mercadona
│   ├── src/portions/       motor de cálculo de referencia (Node)
│   ├── scripts/            scrape.js, build-catalog.js, demo.js
│   ├── db/schema.sql       tablas de Supabase
│   ├── data/products.json  productos descargados (GENERADO, no se sube a GitHub)
│   └── .env                claves de Supabase (NO se sube)
│
└── docs/                 ← briefing original, guía paso a paso y nota histórica de Lovable
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

El despliegue va a **Vercel**. `vite.config.ts` ya tiene el preset de Nitro `vercel`, así que basta con **importar el repositorio en [vercel.com](https://vercel.com)**. Ya **no** se usa Lovable para editar el proyecto: ahora se trabaja editando el repositorio directamente.

## Las herramientas de datos (carpeta `data-tools/`)

Sirven para descargar los productos y precios de Mercadona y construir el catálogo que usa la app. Desde la carpeta `data-tools/`:

```bash
cd data-tools
npm install                    # instalar dependencias (solo la primera vez)
npm run scrape                 # descarga productos de Mercadona → data/products.json y Supabase
node scripts/build-catalog.js  # genera el catálogo de la app → src/lib/catalog.ts
npm run demo                   # prueba el motor de cálculo (sin internet ni cuentas)
npm test                       # tests
```

- `npm run scrape` necesita un `data-tools/.env` con las claves de Supabase (ver `data-tools/.env.example`). Guarda los productos en `data-tools/data/products.json` y, si está configurado Supabase, los sube a la tabla `products`.
- `node scripts/build-catalog.js` lee ese `products.json` y genera `src/lib/catalog.ts`, que es lo que la app usa para mostrar productos concretos en la cesta.

Base de datos: el esquema está en `data-tools/db/schema.sql` (tablas `products`, `events`, `shopping_lists`, `feedback`).

## Documentación

- [Guía paso a paso](docs/GUIA-PASO-A-PASO.md) — para ponerlo todo en marcha desde cero (para no técnicos).
- [Briefing](docs/briefing.md) — la definición **original** del producto (documento histórico).
- [Nota sobre Lovable](docs/PROMPT-LOVABLE.md) — el prompt que se usó para la primera generación del frontend (histórico).

## Licencia

MIT
