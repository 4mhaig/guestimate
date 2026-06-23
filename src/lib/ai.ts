import { createServerFn } from "@tanstack/react-start";

// =============================================================
// IA: aplica "peticiones especiales" a la lista de la compra
// =============================================================
// Se ejecuta EN EL SERVIDOR (la clave nunca llega al navegador).
// Usa Groq (gratis). Necesita la variable de entorno GROQ_API_KEY.
//
// Dada la lista actual y una petición en lenguaje natural, devuelve
// qué productos quitar y cuáles añadir.
// =============================================================

export type AiResult = {
  remove: string[]; // nombres de productos a quitar
  add: { name: string; category: string; amount: string }[]; // productos a añadir
  error?: "no_key" | "failed";
};

const CATEGORIES = [
  "carne",
  "pescado",
  "pan",
  "ensalada",
  "guarnicion",
  "postre",
  "bebida_sin",
  "bebida_con",
  "snacks",
  "lacteos",
  "embutido",
  "fruta",
  "desayuno",
  "otros",
];

export const applyAiRequest = createServerFn({ method: "POST" })
  .validator((d: { request: string; lines: string[] }) => d)
  .handler(async ({ data }): Promise<AiResult> => {
    const key = process.env.GROQ_API_KEY;
    if (!key) return { remove: [], add: [], error: "no_key" };

    const system = [
      "Eres un asistente de lista de la compra en español.",
      "Te doy la lista actual (nombres de productos) y una petición del usuario.",
      "Devuelve SOLO un JSON con esta forma exacta:",
      '{"remove": ["nombre exacto de la lista a quitar", ...], "add": [{"name": "producto a añadir", "category": "una de las categorías", "amount": "cantidad p.ej. 1 bote, 200 g, 6 ud"}]}',
      `Categorías válidas: ${CATEGORIES.join(", ")}.`,
      "Para quitar, usa nombres EXACTOS de la lista. Si la petición no pide quitar nada, deja remove vacío.",
      "Para añadir, propón productos concretos y realistas de supermercado. Si no pide añadir nada, deja add vacío.",
      "No inventes campos. No añadas texto fuera del JSON.",
    ].join(" ");

    const user = `Lista actual:\n${data.lines.map((l) => `- ${l}`).join("\n")}\n\nPetición: "${data.request}"`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return { remove: [], add: [], error: "failed" };
      const json = await res.json();
      const content = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(content);
      const remove = Array.isArray(parsed.remove) ? parsed.remove.filter((x: unknown) => typeof x === "string") : [];
      const add = Array.isArray(parsed.add)
        ? parsed.add
            .filter((x: { name?: unknown }) => x && typeof x.name === "string")
            .map((x: { name: string; category?: string; amount?: string }) => ({
              name: x.name,
              category: CATEGORIES.includes(x.category ?? "") ? x.category! : "otros",
              amount: typeof x.amount === "string" ? x.amount : "",
            }))
        : [];
      return { remove, add };
    } catch {
      return { remove: [], add: [], error: "failed" };
    }
  });
