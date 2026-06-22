# 🧭 Guía paso a paso (para no técnicos)

Esta guía te lleva de cero a tener Guestimate funcionando. No necesitas saber programar: solo seguir los pasos y copiar/pegar.

---

## Paso 0 · Lo que necesitas

- Un ordenador con la **Terminal** (en Mac: app "Terminal").
- **Node.js** instalado. Para comprobarlo, abre la Terminal y escribe:
  ```bash
  node --version
  ```
  Si sale un número (ej. `v24.14.0`), lo tienes. Si no, descárgalo de [nodejs.org](https://nodejs.org) (versión LTS).
- Cuenta de **GitHub** ✅ (ya la tienes)
- Cuenta de **Lovable** ✅ (ya la tienes) → lovable.dev
- Cuenta de **Supabase** (gratis) → la creamos en el Paso 2

---

## Paso 1 · Probar el motor de cálculo

Dentro de la carpeta del proyecto, en la Terminal:

```bash
npm install      # instala lo necesario (solo la primera vez)
npm run demo     # muestra ejemplos de cálculo
```

Verás cantidades calculadas para una barbacoa, un cumpleaños y una casa rural. **Esto ya funciona sin internet ni cuentas.** Es el corazón de Guestimate.

¿Quieres cambiar las cantidades (que salga más o menos carne, por ejemplo)? Edita el archivo `src/portions/data.js`. Está todo comentado en español.

---

## Paso 2 · Crear la base de datos en Supabase

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Pulsa **"New project"**. Ponle nombre (ej. `guestimate`) y una contraseña (guárdala).
3. Espera 1-2 minutos a que se cree.
4. En el menú lateral, ve a **"SQL Editor"** → **"New query"**.
5. Abre el archivo `db/schema.sql` de este proyecto, **copia todo su contenido**, pégalo en Supabase y pulsa **"Run"**.
6. Si sale "Success", ya tienes las 4 tablas creadas: `products`, `events`, `shopping_lists`, `feedback`.

---

## Paso 3 · Conectar tus claves de Supabase

1. En Supabase: **Project Settings** (rueda dentada) → **API**.
2. Copia dos valores:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **service_role** key (en la sección "Project API keys" — ⚠️ es secreta, no la compartas)
3. En la carpeta del proyecto, haz una copia del archivo `.env.example` y llámala `.env`:
   ```bash
   cp .env.example .env
   ```
4. Abre `.env` con cualquier editor de texto y pega tus valores:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY=tu-service-role-key
   MERCADONA_POSTAL_CODE=tu-codigo-postal
   ```

> 🔒 El archivo `.env` **nunca se sube a GitHub** (está protegido). Tus claves quedan solo en tu ordenador.

---

## Paso 4 · Descargar precios de Mercadona

```bash
npm run scrape
```

Esto descarga los productos relevantes (carnes, bebidas, pan, fruta...) y:
- Los guarda en `data/products.json` (siempre).
- Si configuraste Supabase en el Paso 3, también los **sube a la tabla `products`**.

Puedes volver a ejecutarlo cuando quieras para actualizar precios.

---

## Paso 5 · Crear el frontend en Lovable

1. Abre [lovable.dev](https://lovable.dev) y crea un proyecto nuevo.
2. Copia el prompt del archivo [`docs/PROMPT-LOVABLE.md`](PROMPT-LOVABLE.md) y pégalo. Lovable generará la web.
3. En Lovable, conecta **Supabase** (botón de integración) usando la **Project URL** y la clave **anon** (la pública, no la service_role).
4. Conecta Lovable con **GitHub** y elige este repositorio `guestimate`. Así el código del frontend vivirá aquí también.

---

## Paso 6 · Probar de punta a punta

1. Abre la web generada por Lovable.
2. Crea un evento (ej. barbacoa, 10 personas).
3. Comprueba que sale la lista de la compra con cantidades y precios.
4. Rellena el feedback al final.

¡Y listo! 🎉

---

## ❓ Problemas frecuentes

- **"command not found: npm"** → no tienes Node.js instalado (ver Paso 0).
- **El scraper falla con error 403/429** → Mercadona limitó las peticiones. Espera unos minutos y reintenta.
- **No sube nada a Supabase** → revisa que el `.env` tenga bien la URL y la `service_role` key, y que ejecutaste el `schema.sql`.
