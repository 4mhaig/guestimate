# 🧭 Guía paso a paso (para no técnicos)

Esta guía te lleva de cero a tener Guestimate funcionando en tu ordenador. No necesitas saber programar: solo seguir los pasos y copiar/pegar.

> **Importante:** este proyecto es un *monorepo*. Significa que en la misma carpeta conviven **dos cosas**:
> - **La app** (lo que se ve en el navegador) → vive en la **raíz** del proyecto.
> - **Las herramientas de datos** (descargar precios de Mercadona) → viven en la carpeta **`data-tools/`**.
>
> Por eso, según el paso, te diremos si los comandos se ejecutan desde la **raíz** o desde **`data-tools/`**. Para cambiar de carpeta en la Terminal se usa el comando `cd` (por ejemplo, `cd data-tools`).

---

## Paso 0 · Lo que necesitas

- Un ordenador con la **Terminal** (en Mac: app "Terminal").
- **Node.js** instalado. Para comprobarlo, abre la Terminal y escribe:
  ```bash
  node --version
  ```
  Si sale un número (ej. `v24.14.0`), lo tienes. Si no, descárgalo de [nodejs.org](https://nodejs.org) (versión LTS).
- Cuenta de **GitHub** ✅ (ya la tienes).
- Cuenta de **Supabase** (gratis) → la creamos en el Paso 3.

> Antes se usaba **Lovable** para crear la web. Ya **no hace falta**: ahora el proyecto se edita directamente en el repositorio y se despliega en Vercel.

---

## Paso 1 · Arrancar la web en tu ordenador

Vamos a abrir la app en el navegador. Esto se hace desde la **raíz** del proyecto.

```bash
npm install      # instala lo necesario (solo la primera vez)
npm run dev      # arranca la web
```

Cuando termine, abre tu navegador en **http://localhost:8080**. Ya puedes usar el asistente de 4 pasos (Evento → Personas → Restricciones → Cesta).

Para **parar** la web, vuelve a la Terminal y pulsa `Ctrl + C`.

---

## Paso 2 · Crear la base de datos en Supabase

Supabase es donde se guardan los productos de Mercadona, las listas y el feedback.

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Pulsa **"New project"**. Ponle nombre (ej. `guestimate`) y una contraseña (guárdala).
3. Espera 1-2 minutos a que se cree.
4. En el menú lateral, ve a **"SQL Editor"** → **"New query"**.
5. Abre el archivo `data-tools/db/schema.sql` de este proyecto, **copia todo su contenido**, pégalo en Supabase y pulsa **"Run"**.
6. Si sale "Success", ya tienes las 4 tablas creadas: `products`, `events`, `shopping_lists`, `feedback`.

---

## Paso 3 · Conectar tus claves de Supabase

1. En Supabase: **Project Settings** (rueda dentada) → **API**.
2. Copia dos valores:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - **service_role** key (en la sección "Project API keys" — ⚠️ es secreta, no la compartas).
3. Entra en la carpeta `data-tools/` y haz una copia del archivo `.env.example` llamándola `.env`:
   ```bash
   cd data-tools
   cp .env.example .env
   ```
4. Abre `data-tools/.env` con cualquier editor de texto y pega tus valores:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY=tu-service-role-key
   MERCADONA_POSTAL_CODE=tu-codigo-postal
   ```

> 🔒 El archivo `data-tools/.env` **nunca se sube a GitHub** (está protegido). Tus claves quedan solo en tu ordenador.

---

## Paso 4 · Descargar precios de Mercadona

Desde la carpeta `data-tools/`:

```bash
npm run scrape
```

Esto descarga los productos relevantes (carnes, bebidas, pan, fruta...) y:
- Los guarda en `data-tools/data/products.json` (siempre).
- Si configuraste Supabase en el Paso 4, también los **sube a la tabla `products`**.

Puedes volver a ejecutarlo cuando quieras para actualizar precios.

---

## Paso 5 · Construir el catálogo de la app

La app no lee directamente `products.json`: usa un catálogo ya preparado. Para generarlo, desde la carpeta `data-tools/`:

```bash
npm run build-catalog
```

Esto crea el archivo `src/lib/catalog.ts`, que es lo que la app usa para mostrar productos concretos de Mercadona en la cesta. Vuelve a ejecutarlo cada vez que actualices los precios (Paso 5).

---

## Paso 6 · Probar de punta a punta

1. Arranca la web (Paso 2: desde la raíz, `npm run dev`) y abre **http://localhost:8080**.
2. Crea un evento (ej. barbacoa, 10 personas).
3. Comprueba que sale la cesta con productos de Mercadona, precios y opciones para elegir.
4. Guarda la lista en "Mis listas" y, si quieres, deja feedback.

¡Y listo! 🎉

---

## Paso 7 · Publicar la web (opcional)

Cuando quieras tenerla online, el despliegue va a **Vercel**:

1. Entra en [vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Pulsa **"Add New… → Project"** e **importa el repositorio** `guestimate`.
3. Vercel detecta la configuración automáticamente (el proyecto ya trae el preset de Vercel). Pulsa **"Deploy"**.

---

## ❓ Problemas frecuentes

- **"command not found: npm"** → no tienes Node.js instalado (ver Paso 0).
- **Ejecuté un comando y no funciona** → comprueba en qué carpeta estás. Los comandos `dev`/`build` van en la **raíz**; los de datos (`scrape`, `build-catalog`) van en **`data-tools/`**.
- **El scraper falla con error 403/429** → Mercadona limitó las peticiones. Espera unos minutos y reintenta.
- **No sube nada a Supabase** → revisa que `data-tools/.env` tenga bien la URL y la `service_role` key, y que ejecutaste el `schema.sql`.
- **La cesta no muestra productos** → asegúrate de haber ejecutado el Paso 5 (`npm run build-catalog`) después de descargar los precios.
