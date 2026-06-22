# 🍽️ Guestimate

> Calcula cuánta comida y bebida necesitas para un evento, genera la lista de la compra con cantidades exactas y compara precios en Mercadona.

**Guestimate** es un juego de palabras entre *guest* (invitado) + *estimate* (estimar): estima cuánto necesitas según tus invitados, para una barbacoa, una comida familiar, un cumpleaños, Nochebuena o una casa rural de varios días. Elimina el desperdicio y la ansiedad del anfitrión.

---

## 🧩 Cómo está organizado el proyecto

```
guestimate/
├── src/
│   ├── portions/        ← El motor de cálculo (el corazón del producto)
│   │   ├── data.js        Tablas de porciones y multiplicadores (aquí ajustas cantidades)
│   │   ├── engine.js      Cálculo para eventos de una comida
│   │   └── casaRural.js   Cálculo especial para viajes de varios días
│   ├── scraper/
│   │   └── mercadona.js   Descarga productos y precios de la API de Mercadona
│   └── supabase.js      Conexión a la base de datos
├── scripts/
│   ├── scrape.js        Ejecuta el scraper → npm run scrape
│   └── demo.js          Prueba el motor sin montar nada → npm run demo
├── db/
│   └── schema.sql       Las tablas de Supabase (cópialo y ejecútalo allí)
├── test/                Tests automáticos → npm test
└── docs/
    ├── briefing.md             El briefing original del proyecto
    ├── GUIA-PASO-A-PASO.md     Guía sencilla para ponerlo en marcha
    └── PROMPT-LOVABLE.md       Prompt listo para crear el frontend en Lovable
```

> **El frontend (la web que se ve)** se genera en [Lovable](https://lovable.dev) y se conecta a este mismo repositorio. Este repo contiene la lógica, los datos y la base de datos.

---

## 🚀 Empezar en 3 pasos

```bash
# 1. Instalar dependencias
npm install

# 2. Ver el motor de cálculo en acción (no necesita nada más)
npm run demo

# 3. Ejecutar los tests
npm test
```

Para descargar precios reales de Mercadona:

```bash
npm run scrape
```

Esto crea `data/products.json` con los productos. Si configuras Supabase (ver guía), también los sube a la base de datos.

---

## 📖 Guía completa

¿No eres técnica? No pasa nada. Sigue la **[Guía paso a paso](docs/GUIA-PASO-A-PASO.md)**, que explica todo desde cero: crear Supabase, montar las tablas, descargar precios y crear el frontend en Lovable.

---

## 🗺️ Estado

- [x] Motor de cálculo (eventos estándar + casa rural)
- [x] Scraper de Mercadona
- [x] Schema de base de datos
- [ ] Frontend en Lovable
- [ ] Conexión Lovable ↔ Supabase
- [ ] Más supermercados (Carrefour, Lidl...)

## Licencia

MIT
