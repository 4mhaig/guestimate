# Guestimate — Briefing para Claude Code

## Qué es este proyecto

**Guestimate** es una herramienta web que calcula la cantidad de comida y bebida que necesitas para un evento social (barbacoa, comida familiar, cumpleaños, cena de amigos, Nochebuena...), genera una lista de la compra con cantidades exactas, compara precios en Mercadona (y más supermercados en el futuro), y aprende de cada evento mediante feedback del usuario.

---

## El problema que resuelve

El caos de organizar comida para eventos: cuánto comprar, qué comprar, dónde es más barato, y aprender de cada evento para mejorar la siguiente vez. Elimina el desperdicio alimentario y la ansiedad del anfitrión.

---

## MVP — Lo que tiene que funcionar mañana

1. **Formulario de evento** — tipo de evento, fecha, número de personas con edades y sexo
2. **Restricciones y alergias** — celíaco, intolerante a la lactosa, vegano, vegetariano, alérgico a frutos secos, marisco, etc.
3. **Lista de la compra generada con cantidades** — calculada en función de personas, edades, sexo y tipo de evento
4. **Comparativa de precios de Mercadona** — scrapeando la API interna de Mercadona
5. **Feedback post-evento** — valoración de si la lista fue correcta, sobró o faltó comida

---

## Arquitectura decidida

```
Lovable (Frontend React)
        ↓
Supabase (Base de datos + Edge Functions)
        ↓
Script de scraping de Mercadona (API interna no oficial)
```

### Por qué esta arquitectura
- El frontend va en **Lovable** (lovable.dev) — genera React, se conecta a GitHub
- El backend y base de datos van en **Supabase** — gratis para empezar, tiene Edge Functions para el scraping
- Mercadona tiene una **API interna no oficial** accesible públicamente, mucho más limpia que scraping HTML:
  - `https://tienda.mercadona.es/api/categories/`
  - `https://tienda.mercadona.es/api/products/?category=<id>`

---

## Stack técnico

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | React (via Lovable) | Generación rápida de UI |
| Estilos | Tailwind CSS | Viene por defecto en Lovable |
| Base de datos | Supabase (PostgreSQL) | Gratis, fácil, tiene auth |
| Backend / API | Supabase Edge Functions | Serverless, no necesita servidor |
| Scraping precios | Script Node.js → Mercadona API | API interna no oficial, estable |
| Deploy frontend | Lovable / Vercel | Un clic |
| Repositorio | GitHub | Ya tiene cuenta |

---

## Schema de base de datos (Supabase)

### Tabla `products`
```sql
id          uuid primary key
name        text
price       numeric
unit        text          -- "kg", "ud", "L", "pack"
category    text          -- "carne", "bebida", "pan", etc.
supermarket text          -- "mercadona" (más adelante otros)
updated_at  timestamp
image_url   text
```

### Tabla `events`
```sql
id            uuid primary key
type          text    -- "barbacoa", "comida_familiar", "cumpleanos", "cena_amigos", "nochebuena", "casa_rural"
date          date
people        jsonb   -- [{age: 35, sex: "M"}, {age: 8, sex: "F"}, ...]
restrictions  jsonb   -- ["celiaco", "vegano", "intolerante_lactosa", ...]
days          int     -- solo para casa_rural (número de días del viaje)
meals_config  jsonb   -- solo para casa_rural
              -- [{day: 1, breakfast: false, lunch: false, snack: false, dinner: true},
              --  {day: 2, breakfast: true, lunch: true, snack: true, dinner: true},
              --  {day: 3, breakfast: true, lunch: true, snack: false, dinner: false}]
created_at    timestamp
user_id       uuid    -- nullable para empezar sin auth
```

### Tabla `shopping_lists`
```sql
id          uuid primary key
event_id    uuid references events(id)
items       jsonb   -- [{product_id, name, quantity, unit, price_mercadona}]
total       numeric
created_at  timestamp
```

### Tabla `feedback`
```sql
id              uuid primary key
event_id        uuid references events(id)
rating          int     -- 1-5
food_accuracy   text    -- "perfecto" | "sobro" | "falto"
notes           text
created_at      timestamp
```

---

## Flujo de pantallas (Frontend Lovable)

```
1. Home
   └── CTA principal: "Planifica tu evento"

2. Step 1 — Tipo de evento
   └── Barbacoa / Comida familiar / Cumpleaños / Cena de amigos / Nochebuena
   └── Selector de fecha

3. Step 2 — Las personas
   └── Número total de personas
   └── Desglose por grupos: adultos hombres / adultos mujeres / niños / adolescentes

4. Step 3 — Restricciones y alergias
   └── Multi-select: Celíaco, Intolerante lactosa, Vegano, Vegetariano,
       Alérgico frutos secos, Alérgico marisco, Sin cerdo, Sin alcohol

5. Step 4 — Lista de la compra generada
   └── Agrupada por categorías (carne, bebida, pan, ensalada, postre...)
   └── Cantidades calculadas
   └── Precio por producto en Mercadona
   └── Total estimado
   └── Botón "Ver en Mercadona online"

6. Step 5 — Feedback (post-evento)
   └── ¿Cómo fue la cantidad de comida?
       - Sobró mucho / Sobró algo / Perfecto / Faltó algo / Faltó mucho
   └── Campo de texto libre para notas
   └── Valoración general 1-5 estrellas
```

---

## Motor de cálculo de porciones

La lógica central del producto. Calcula cantidades en función de:

- **Tipo de evento** — una barbacoa consume más carne y bebida que una cena ligera
- **Perfil de personas** — adulto hombre consume más que adulto mujer, niño consume menos
- **Restricciones** — si hay celíacos, ajustar proporciones de pan/pasta; si hay veganos, añadir alternativas

### Referencias de porciones base (por persona adulta, comida completa)

| Producto | Hombre adulto | Mujer adulta | Adolescente | Niño (3-12) |
|---|---|---|---|---|
| Carne/proteína | 350g | 250g | 300g | 150g |
| Pan | 100g | 80g | 100g | 60g |
| Ensalada | 150g | 180g | 120g | 80g |
| Patatas/guarnición | 200g | 150g | 200g | 120g |
| Postre | 150g | 150g | 150g | 150g |
| Bebida (sin alcohol) | 500ml | 500ml | 500ml | 500ml |
| Bebida (con alcohol) | 500ml | 350ml | — | — |

### Multiplicadores por tipo de evento
- **Barbacoa**: carne x1.3, bebida x1.4, pan x1.2
- **Nochebuena**: entrantes x1.5, postre x1.8, bebida x1.3
- **Cumpleaños**: postre x2.0 (tarta), bebida x1.2
- **Cena de amigos**: todo x0.85 (cenas más ligeras)
- **Comida familiar**: base x1.0

---

## Tipos de evento soportados en MVP

1. Barbacoa
2. Comida familiar
3. Cumpleaños
4. Cena de amigos
5. Nochebuena / Navidad
6. **Casa rural / Viaje en grupo**

---

## Lógica especial — Casa rural

Este tipo de evento tiene una lógica diferente al resto porque no es una sola comida sino **múltiples comidas a lo largo de varios días.**

### Inputs adicionales para casa rural

```
- Número de días del viaje
- Configuración de comidas por día:
    ┌─────────────┬───────────────────────────────────────────┐
    │ Desayuno    │ toggle on/off por día                     │
    │ Comida      │ toggle on/off por día                     │
    │ Merienda    │ toggle on/off por día                     │
    │ Cena        │ toggle on/off por día                     │
    └─────────────┴───────────────────────────────────────────┘
```

### Ejemplo de configuración

```
Viaje de 3 días, 8 personas

Día 1 (viernes):
  ✗ Desayuno   (llegan a mediodía)
  ✗ Comida     (comen en ruta)
  ✓ Cena       → compra completa

Día 2 (sábado):
  ✓ Desayuno   → compra completa
  ✓ Comida     → compra completa
  ✓ Merienda   → snacks ligeros
  ✓ Cena       → compra completa

Día 3 (domingo):
  ✓ Desayuno   → compra completa
  ✓ Comida     → compra completa
  ✗ Cena       (se van por la tarde)
```

### Porciones base por tipo de comida (casa rural)

| Producto | Desayuno | Comida | Merienda | Cena |
|---|---|---|---|---|
| Pan / bollería | 80g | 80g | 60g | 60g |
| Lácteos (leche, yogur) | 250ml | — | 200ml | — |
| Embutido / queso | 50g | 80g | 60g | 80g |
| Fruta | 150g | 150g | 150g | — |
| Proteína (carne/pescado) | — | 300g | — | 250g |
| Verdura / ensalada | — | 180g | — | 150g |
| Pasta / arroz / patata | — | 150g | — | 120g |
| Postre | — | 120g | — | 100g |
| Café / infusión | 1 ud | — | 1 ud | 1 ud |
| Bebida (agua/refresco) | 300ml | 500ml | 300ml | 500ml |
| Bebida alcohólica | — | 300ml | — | 500ml |
| Snacks (patatas, frutos secos) | — | — | 60g | 80g |

### Extras de casa rural que no hay en otros eventos
- **Aceite, sal, especias** — calculados como pack único para el grupo
- **Papel de cocina, bolsas de basura** — no es comida pero se añade a la lista
- **Café, azúcar, té** — consumo continuo durante días
- **Condimentos básicos** (ketchup, mayonesa, mostaza)

### Multiplicadores casa rural
- Las **comidas del mediodía** tienen el mismo multiplicador que "Comida familiar" (x1.0)
- Las **cenas** tienen multiplicador x0.9 (se cena más ligero)
- Los **desayunos** tienen multiplicador x1.1 (la gente desayuna más fuerte en vacaciones)
- Si hay **barbacoa programada** dentro del viaje: aplicar multiplicador de barbacoa a esa cena/comida específica

### UX del formulario para casa rural

```
Step 1 → Tipo de evento: Casa rural
Step 2 → ¿Cuántos días? [selector numérico]
Step 3 → Personas (igual que el resto de eventos)
Step 4 → Restricciones (igual que el resto)
Step 5 → Configurador de comidas por día
          [tabla visual, un día por columna, toggles por fila]
          Opción rápida: "Configuración estándar" 
          (activa todo excepto primera comida día 1 y última cena último día)
Step 6 → Lista de la compra agrupada por:
          - Categoría de producto (carne, lácteos, bebida...)
          - Con subtotales por tipo de comida si el usuario quiere el desglose
Step 7 → Feedback (igual que el resto)
```

---

## Scraping de precios — Mercadona API

Mercadona tiene una API interna accesible sin autenticación:

```
GET https://tienda.mercadona.es/api/categories/
GET https://tienda.mercadona.es/api/categories/<id>/
```

### Estrategia
1. Script Node.js que llama a la API de Mercadona
2. Filtra productos relevantes para eventos (carnes, bebidas, pan, ensaladas, postres...)
3. Vuelca los datos a la tabla `products` de Supabase
4. Para el MVP: se corre el script localmente una vez para poblar la BD
5. Más adelante: Supabase Edge Function con cron job diario

### Categorías de Mercadona a scrapear primero
- Carnes y aves
- Bebidas con gas / refrescos
- Cervezas y vinos
- Pan y bollería
- Frutas y verduras
- Lácteos
- Aperitivos y snacks
- Postres y dulces

---

## Lo que NO está en el MVP

- Auth de usuarios (las listas se guardan sin login por ahora)
- Más supermercados (Carrefour, Lidl... en fases siguientes)
- App móvil nativa (primero web responsive)
- Precios en tiempo real (primero datos actualizados diariamente)
- IA generativa para sugerencias de menú

---

## Cuentas y accesos disponibles

- ✅ GitHub — cuenta gratuita existente
- ✅ Lovable — cuenta gratuita existente (lovable.dev)
- ⬜ Supabase — crear cuenta gratuita en supabase.com
- ⬜ Node.js — verificar si está instalado (`node --version` en terminal)

---

## Nombre del proyecto

**Guestimate** — juego de palabras entre "guest" (invitado) + "estimate" (estimar/calcular). Describe exactamente lo que hace: estima cuánto necesitas según tus invitados. Funciona en español e inglés.

---

## Próximos pasos en orden

1. Verificar si Node.js está instalado
2. Crear cuenta en Supabase y configurar las tablas
3. Crear el script scraper de Mercadona
4. Poblar la base de datos con productos reales
5. Crear el proyecto en Lovable con el prompt del frontend
6. Conectar Lovable con Supabase
7. Conectar Lovable con GitHub
8. Probar el flujo completo end-to-end
