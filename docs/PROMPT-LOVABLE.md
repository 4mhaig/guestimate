# 🎨 Prompt para Lovable (nota histórica)

> **Este documento es histórico.** Este prompt se usó para la **primera generación** del frontend de Guestimate en [Lovable](https://lovable.dev). **Ya no se usa Lovable para iterar**: ahora el proyecto se edita directamente en el repositorio y se despliega en Vercel.
>
> Se conserva aquí solo como referencia de cómo nació la app. Para el estado actual del proyecto, mira el [README](../README.md). El producto ha evolucionado bastante desde este prompt (asistente de 4 pasos, cesta viva con productos concretos de Mercadona, casa rural con fechas, "Mis listas", etc.), así que **no lo tomes como descripción de lo que hace hoy**.

---

## Prompt original que se usó en Lovable

```
Crea una aplicación web responsive llamada "Guestimate" en React + Tailwind.

CONCEPTO: una herramienta que calcula cuánta comida y bebida necesitas para
un evento social y genera la lista de la compra con cantidades y precios de
Mercadona.

BASE DE DATOS: usa Supabase. Tablas: products, events, shopping_lists, feedback.

DISEÑO: limpio, moderno, amable, con buen uso de iconos de comida. Mobile-first.
Tono cercano y en español.

FLUJO DE PANTALLAS (asistente paso a paso):

1. HOME
   - Título "Guestimate" con tagline "Calcula la comida perfecta para tu evento".
   - Botón grande: "Planifica tu evento".

2. PASO 1 — Tipo de evento
   - Tarjetas seleccionables: Barbacoa, Comida familiar, Cumpleaños,
     Cena de amigos, Nochebuena, Casa rural.
   - Selector de fecha.

3. PASO 2 — Las personas
   - Contadores (+/-) para: adultos hombres, adultos mujeres, adolescentes, niños.

4. PASO 3 — Restricciones y alergias (multi-select)
   - Celíaco, Intolerante a la lactosa, Vegano, Vegetariano,
     Alérgico a frutos secos, Alérgico al marisco, Sin cerdo, Sin alcohol.

5. (SOLO casa rural) PASO EXTRA — Configurador de comidas por día
   - Selector de número de días.
   - Tabla: una columna por día, filas Desayuno/Comida/Merienda/Cena con toggles.
   - Botón "Configuración estándar" que activa todo menos el desayuno y la comida
     del primer día y la cena del último.

6. PASO 4 — Lista de la compra generada
   - Agrupada por categorías (carne, bebida, pan, ensalada, postre...).
   - Cada ítem: nombre, cantidad calculada, precio en Mercadona, subtotal.
   - Total estimado destacado.
   - Botón "Ver en Mercadona online".
   - Avisos de las restricciones (ej. "el pan debe ser sin gluten").

7. PASO 5 — Feedback post-evento
   - Pregunta: "¿Cómo fue la cantidad de comida?" con opciones:
     Sobró mucho / Sobró algo / Perfecto / Faltó algo / Faltó mucho.
   - Campo de texto libre para notas.
   - Valoración de 1 a 5 estrellas.

IMPORTANTE: el cálculo de cantidades NO lo hagas tú. Las cantidades vienen de
un motor de cálculo separado (un endpoint o función). De momento, deja un
servicio "calculateShoppingList(event)" con datos de ejemplo que luego
conectaremos a la lógica real.
```

---

> 💡 Nota histórica: cuando se escribió este prompt, la idea era exponer la lógica de cálculo como una Supabase Edge Function para que Lovable la llamara. En la práctica el proyecto evolucionó de otra forma: la lógica de referencia vive en `data-tools/src/portions/` (Node) y la app tiene su propio motor en `src/lib/guestimate.ts`.
