import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  RefreshCw,
  ShoppingBasket,
  Star,
  X,
} from "lucide-react";
import {
  CATEGORY_META,
  EVENTS,
  RESTRICTIONS,
  computeBasket,
  defaultMealsConfig,
  formatQty,
  groupByCategory,
  totalPeople,
  type EventType,
  type Item,
  type Meal,
  type MealsConfig,
  type People,
  type Restriction,
  type SpecialEvent,
  type SpecialEvents,
} from "@/lib/guestimate";
import { resolveBasket, formatEuro, type ResolvedBasket } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { Stepper } from "@/components/guestimate/Stepper";
import { AnimatedNumber } from "@/components/guestimate/AnimatedNumber";
import { BasketPanel } from "@/components/guestimate/Basket";
import { CategoryIcon } from "@/components/guestimate/Icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guestimate · Calcula la comida para tu evento" },
      { name: "description", content: "Calcula la cesta de la compra perfecta para tu próximo evento. Sin sobras, sin que falte." },
      { property: "og:title", content: "Guestimate" },
      { property: "og:description", content: "Tu cesta de la compra inteligente para cualquier celebración." },
    ],
  }),
  component: Index,
});

type Step = 1 | 2 | 3 | 4 | 5;
type FlyTask = {
  id: number;
  label: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const STEP_LABELS = ["Evento", "Personas", "Restricciones", "Cesta", "Feedback"];

function Index() {
  const [step, setStep] = useState<Step>(1);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [date, setDate] = useState<string>("");
  const [people, setPeople] = useState<People>({
    hombres: 0,
    mujeres: 0,
    adolescentes: 0,
    ninos: 0,
  });
  const [days, setDays] = useState(2);
  const [meals, setMeals] = useState<MealsConfig>(defaultMealsConfig(2));
  const [aperitivo, setAperitivo] = useState(false);
  const [specialEvents, setSpecialEvents] = useState<SpecialEvents>({});
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [mobileBasketOpen, setMobileBasketOpen] = useState(false);
  const [savedEventId, setSavedEventId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  // Fly-to-basket
  const basketIconRef = useRef<HTMLDivElement | null>(null);
  const mobileBasketRef = useRef<HTMLButtonElement | null>(null);
  const [flyTasks, setFlyTasks] = useState<FlyTask[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const reduced = useReducedMotion();

  // Days/meals sync
  useEffect(() => {
    setMeals((prev) => {
      const next: MealsConfig = {};
      for (let d = 1; d <= days; d++) {
        next[d] = prev[d] || { desayuno: true, comida: true, merienda: true, cena: true };
      }
      return next;
    });
  }, [days]);

  // Compute basket (debounced)
  const rawItems = useMemo(
    () => computeBasket(eventType, people, restrictions, days, meals, aperitivo, specialEvents),
    [eventType, people, restrictions, days, meals, aperitivo, specialEvents],
  );
  const items: Item[] = useMemo(() => {
    return rawItems
      .filter((it) => !removed.has(it.id))
      .map((it) => (overrides[it.id] != null ? { ...it, qty: overrides[it.id] } : it));
  }, [rawItems, overrides, removed]);

  // Productos concretos + precio (elección de opción por línea)
  const [choices, setChoices] = useState<Record<string, number>>({});
  const resolved: ResolvedBasket = useMemo(
    () => resolveBasket(items, eventType, choices),
    [items, eventType, choices],
  );
  const cycleChoice = (key: string) => {
    let count = 0;
    for (const g of resolved.groups) {
      const line = g.lines.find((l) => l.key === key);
      if (line) {
        count = line.alternatives.length;
        break;
      }
    }
    if (count <= 1) return;
    setChoices((prev) => ({ ...prev, [key]: ((prev[key] ?? 0) + 1) % count }));
  };

  // Detect new items → fly animation
  useEffect(() => {
    if (reduced) {
      items.forEach((it) => seenIdsRef.current.add(it.id));
      return;
    }
    const newOnes = items.filter((it) => !seenIdsRef.current.has(it.id));
    if (newOnes.length === 0) return;
    // Use bounding rect of the source area: center of current viewport step area
    const target = (basketIconRef.current ?? mobileBasketRef.current)?.getBoundingClientRect();
    if (!target) {
      newOnes.forEach((it) => seenIdsRef.current.add(it.id));
      return;
    }
    // Calculamos el destino UNA vez (centro del icono de la cesta).
    const to = {
      x: target.left + target.width / 2 - 18,
      y: target.top + target.height / 2 - 14,
    };
    const baseId = Date.now();
    const tasks: FlyTask[] = newOnes.slice(0, 3).map((it, i) => ({
      id: baseId + i,
      label: it.name,
      from: { x: window.innerWidth / 2 - 24, y: window.innerHeight * 0.42 },
      to,
    }));
    setFlyTasks((t) => [...t, ...tasks]);
    newOnes.forEach((it) => seenIdsRef.current.add(it.id));
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  }, [items, reduced]);

  const adjustItem = (id: string, delta: number) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const stepAmt = it.unit === "u" ? 1 : it.unit === "g" ? 100 : 250;
    const next = Math.max(0, it.qty + delta * stepAmt);
    setOverrides((o) => ({ ...o, [id]: next }));
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(8);
      } catch {}
    }
  };
  const removeItem = (id: string) => {
    setRemoved((r) => new Set(r).add(id));
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch {}
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const reset = () => {
    setStep(1);
    setEventType(null);
    setDate("");
    setPeople({ hombres: 0, mujeres: 0, adolescentes: 0, ninos: 0 });
    setDays(2);
    setMeals(defaultMealsConfig(2));
    setRestrictions([]);
    setOverrides({});
    setRemoved(new Set());
    setSavedEventId(null);
    setFeedbackEmoji(null);
    setRating(0);
    setNotes("");
    setFeedbackSent(false);
    seenIdsRef.current = new Set();
  };

  const saveList = async () => {
    setSaving(true);
    try {
      const { data: ev, error: e1 } = await supabase
        .from("events")
        .insert({
          type: eventType,
          date: date || null,
          people,
          restrictions,
          days: eventType === "rural" ? days : null,
          meals_config: eventType === "rural" ? meals : null,
        })
        .select()
        .single();
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("shopping_lists").insert({
        event_id: ev.id,
        items,
        total: items.length,
      });
      if (e2) throw e2;
      setSavedEventId(ev.id);
      showToast("Lista guardada");
    } catch (err) {
      console.error(err);
      showToast("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const shareList = async () => {
    const lines: string[] = [];
    lines.push(`Guestimate — ${EVENTS.find((e) => e.id === eventType)?.name ?? ""}`);
    if (date) lines.push(`Fecha: ${date}`);
    lines.push(`Personas: ${totalPeople(people)}`);
    lines.push("");
    const grouped = groupByCategory(items);
    (Object.keys(grouped) as Array<keyof typeof grouped>).forEach((cat) => {
      lines.push(`— ${CATEGORY_META[cat].label}`);
      grouped[cat].forEach((it) => lines.push(`  • ${it.name} · ${formatQty(it)}`));
      lines.push("");
    });
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      showToast("Copiado");
    } catch {
      showToast("No se pudo copiar");
    }
  };

  const sendFeedback = async () => {
    if (!savedEventId) {
      showToast("Guarda primero la lista");
      return;
    }
    try {
      const { error } = await supabase.from("feedback").insert({
        event_id: savedEventId,
        rating,
        food_accuracy: feedbackEmoji,
        notes,
      });
      if (error) throw error;
      setFeedbackSent(true);
    } catch (err) {
      console.error(err);
      showToast("Error al enviar feedback");
    }
  };

  const canNext = () => {
    if (step === 1) return !!eventType;
    if (step === 2) return totalPeople(people) > 0;
    return true;
  };

  const totalPpl = totalPeople(people);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBasket className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <span className="text-lg font-bold tracking-tight">Guestimate</span>
          </div>
          <ProgressBasket step={step} />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1fr_380px]">
        <section className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <Step1
                  eventType={eventType}
                  setEventType={setEventType}
                  date={date}
                  setDate={setDate}
                />
              )}
              {step === 2 && (
                <Step2
                  people={people}
                  setPeople={setPeople}
                  eventType={eventType}
                  days={days}
                  setDays={setDays}
                  meals={meals}
                  setMeals={setMeals}
                  specialEvents={specialEvents}
                  setSpecialEvents={setSpecialEvents}
                />
              )}
              {step === 3 && (
                <Step3
                  restrictions={restrictions}
                  setRestrictions={setRestrictions}
                  aperitivo={aperitivo}
                  setAperitivo={setAperitivo}
                />
              )}
              {step === 4 && (
                <Step4
                  resolved={resolved}
                  onCycle={cycleChoice}
                  eventType={eventType}
                  date={date}
                  totalPeople={totalPpl}
                  restrictions={restrictions}
                  onSave={saveList}
                  onShare={shareList}
                  saving={saving}
                  saved={!!savedEventId}
                />
              )}
              {step === 5 && (
                <Step5
                  feedbackEmoji={feedbackEmoji}
                  setFeedbackEmoji={setFeedbackEmoji}
                  rating={rating}
                  setRating={setRating}
                  notes={notes}
                  setNotes={setNotes}
                  onSend={sendFeedback}
                  sent={feedbackSent}
                  onReset={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {!feedbackSent && (
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
                disabled={step === 1}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
              >
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
              {step < 5 && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep((s) => Math.min(5, s + 1) as Step)}
                  disabled={!canNext()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step === 3 ? "Ver mi cesta" : step === 4 ? "Siguiente · Feedback" : "Siguiente"}
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          )}
        </section>

        {/* Desktop sticky basket */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
            <BasketPanel
              resolved={resolved}
              onCycle={cycleChoice}
              registerIconTarget={(el) => (basketIconRef.current = el)}
            />
          </div>
        </aside>
      </main>

      {/* Mobile floating basket button */}
      <MobileBasketButton
        count={items.length}
        onClick={() => setMobileBasketOpen(true)}
        registerRef={(el) => (mobileBasketRef.current = el)}
      />

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {mobileBasketOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={() => setMobileBasketOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 32 }}
              className="absolute inset-x-0 bottom-0 h-[85vh] overflow-hidden rounded-t-3xl bg-card"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">Mi cesta</span>
                <button
                  onClick={() => setMobileBasketOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-[calc(85vh-3.25rem)]">
                <BasketPanel resolved={resolved} onCycle={cycleChoice} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fly-to-basket overlay */}
      <FlyOverlay
        tasks={flyTasks}
        onDone={(id) => setFlyTasks((t) => t.filter((x) => x.id !== id))}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Progress ---------- */
function ProgressBasket({ step }: { step: Step }) {
  const pct = ((step - 1) / 4) * 100;
  return (
    <div className="hidden items-center gap-3 sm:flex">
      <div className="hidden text-xs font-medium text-muted-foreground md:block">
        {STEP_LABELS[step - 1]}
      </div>
      <div className="relative h-8 w-12 overflow-hidden">
        <ShoppingBasket className="absolute inset-0 h-full w-full text-border" strokeWidth={1.5} />
        <motion.div
          initial={false}
          animate={{ height: `${pct}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="absolute inset-x-0 bottom-0 bg-primary/30"
        />
        <ShoppingBasket
          className="absolute inset-0 h-full w-full text-primary"
          strokeWidth={1.5}
          style={{ clipPath: `inset(${100 - pct}% 0 0 0)` }}
        />
      </div>
      <div className="text-xs tabular-nums text-muted-foreground">{step}/5</div>
    </div>
  );
}

/* ---------- Step 1 ---------- */
function Step1({
  eventType,
  setEventType,
  date,
  setDate,
}: {
  eventType: EventType | null;
  setEventType: (e: EventType) => void;
  date: string;
  setDate: (s: string) => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Qué estás organizando?</h1>
      <p className="mt-2 text-muted-foreground">Elige el tipo de evento para empezar tu cesta.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {EVENTS.map((ev) => {
          const selected = ev.id === eventType;
          return (
            <motion.button
              key={ev.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setEventType(ev.id)}
              className={`group flex items-start gap-4 rounded-2xl border bg-card p-5 text-left transition-all ${
                selected
                  ? "border-primary shadow-[0_0_0_3px_rgba(45,106,79,0.12),0_8px_24px_rgba(0,0,0,0.06)]"
                  : "border-border hover:border-primary/40 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
              }`}
            >
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors ${
                  selected ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                }`}
              >
                <CategoryIcon name={ev.icon} className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <div className="text-base font-semibold text-foreground">{ev.name}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{ev.desc}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {eventType === "rural" && (
        <div className="mt-8 max-w-sm">
          <label className="block text-sm font-medium text-foreground">¿Cuándo empieza el viaje?</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2 ---------- */
function Step2({
  people,
  setPeople,
  eventType,
  days,
  setDays,
  meals,
  setMeals,
  specialEvents,
  setSpecialEvents,
}: {
  people: People;
  setPeople: (p: People) => void;
  eventType: EventType | null;
  days: number;
  setDays: (n: number) => void;
  meals: MealsConfig;
  setMeals: (m: MealsConfig) => void;
  specialEvents: SpecialEvents;
  setSpecialEvents: (s: SpecialEvents) => void;
}) {
  const total = totalPeople(people);
  const rows: { key: keyof People; label: string }[] = [
    { key: "hombres", label: "Hombres adultos" },
    { key: "mujeres", label: "Mujeres adultas" },
    { key: "adolescentes", label: "Adolescentes (13-17 años)" },
    { key: "ninos", label: "Niños (3-12 años)" },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Quién viene?</h1>
      <p className="mt-2 text-muted-foreground">
        En total:{" "}
        <span className="font-semibold text-foreground">
          <AnimatedNumber value={total} /> personas
        </span>
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {rows.map((r) => (
          <Stepper
            key={r.key}
            label={r.label}
            value={people[r.key]}
            onChange={(v) => setPeople({ ...people, [r.key]: v })}
          />
        ))}
      </div>

      {eventType === "rural" && (
        <div className="mt-10">
          <div className="mb-4 max-w-xs">
            <Stepper label="¿Cuántos días?" value={days} onChange={(v) => setDays(Math.max(1, v))} min={1} />
          </div>
          <MealsTable
            days={days}
            meals={meals}
            setMeals={setMeals}
            specialEvents={specialEvents}
            setSpecialEvents={setSpecialEvents}
          />
        </div>
      )}
    </div>
  );
}

function MealsTable({
  days,
  meals,
  setMeals,
  specialEvents,
  setSpecialEvents,
}: {
  days: number;
  meals: MealsConfig;
  setMeals: (m: MealsConfig) => void;
  specialEvents: SpecialEvents;
  setSpecialEvents: (s: SpecialEvents) => void;
}) {
  const mealRows: { key: Meal; label: string }[] = [
    { key: "desayuno", label: "Desayuno" },
    { key: "comida", label: "Comida" },
    { key: "merienda", label: "Merienda" },
    { key: "cena", label: "Cena" },
  ];
  const dayCols = Array.from({ length: days }, (_, i) => i + 1);
  const toggle = (d: number, m: Meal) => {
    const cur = meals[d] || { desayuno: true, comida: true, merienda: true, cena: true };
    setMeals({ ...meals, [d]: { ...cur, [m]: !cur[m] } });
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Comidas por día</h3>
        <button
          onClick={() => setMeals(defaultMealsConfig(days, "standard"))}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Configuración estándar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground">
              <th className="py-2 pr-3 font-medium"></th>
              {dayCols.map((d) => (
                <th key={d} className="px-2 py-2 text-center font-medium">
                  Día {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mealRows.map((row) => (
              <tr key={row.key} className="border-t border-border">
                <td className="py-2 pr-3 text-foreground">{row.label}</td>
                {dayCols.map((d) => {
                  const on = meals[d]?.[row.key] ?? true;
                  return (
                    <td key={d} className="px-2 py-2 text-center">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => toggle(d, row.key)}
                        className={`h-7 w-12 rounded-full transition-colors ${
                          on ? "bg-primary" : "bg-muted"
                        }`}
                        aria-label={`${row.label} día ${d}`}
                      >
                        <motion.span
                          layout
                          className={`block h-5 w-5 rounded-full bg-white shadow ${
                            on ? "ml-6" : "ml-1"
                          }`}
                        />
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="text-sm font-semibold text-foreground">¿Alguna celebración especial?</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Si un día hay barbacoa o cumpleaños, ajustamos las cantidades de ese día.
        </p>
        <div className="mt-3 space-y-2">
          {dayCols.map((d) => (
            <div key={d} className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground">Día {d}</span>
              <select
                value={specialEvents[d] ?? ""}
                onChange={(e) =>
                  setSpecialEvents({
                    ...specialEvents,
                    [d]: (e.target.value || null) as SpecialEvent | null,
                  })
                }
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="">Día normal</option>
                <option value="barbacoa">Barbacoa</option>
                <option value="cumple">Cumpleaños</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */
function Step3({
  restrictions,
  setRestrictions,
  aperitivo,
  setAperitivo,
}: {
  restrictions: Restriction[];
  setRestrictions: (r: Restriction[]) => void;
  aperitivo: boolean;
  setAperitivo: (b: boolean) => void;
}) {
  const toggle = (id: Restriction) => {
    if (id === "ninguna") {
      setRestrictions(restrictions.includes("ninguna") ? [] : ["ninguna"]);
      return;
    }
    let next = restrictions.filter((r) => r !== "ninguna");
    if (next.includes(id)) next = next.filter((r) => r !== id);
    else next = [...next, id];
    setRestrictions(next);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Hay algo que no podáis comer?</h1>
      <p className="mt-2 text-muted-foreground">Selecciona todo lo que aplique.</p>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {RESTRICTIONS.map((r) => {
          const on = restrictions.includes(r.id);
          return (
            <motion.button
              key={r.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(r.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              }`}
            >
              {r.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Antes de comer</h2>
        <button
          onClick={() => setAperitivo(!aperitivo)}
          className={`mt-3 flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
            aperitivo
              ? "border-primary bg-accent"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <div>
            <div className="text-sm font-semibold text-foreground">
              ¿Habrá aperitivo antes de comer?
            </div>
            <div className="mt-0.5 text-sm text-muted-foreground">
              Añade picoteo: patatas, aceitunas, frutos secos, embutido y queso.
            </div>
          </div>
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              aperitivo ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`inline-block h-5 w-5 rounded-full bg-white shadow ${
                aperitivo ? "ml-[22px]" : "ml-0.5"
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 4 ---------- */
function Step4({
  resolved,
  onCycle,
  eventType,
  date,
  totalPeople,
  restrictions,
  onSave,
  onShare,
  saving,
  saved,
}: {
  resolved: ResolvedBasket;
  onCycle: (key: string) => void;
  eventType: EventType | null;
  date: string;
  totalPeople: number;
  restrictions: Restriction[];
  onSave: () => void;
  onShare: () => void;
  saving: boolean;
  saved: boolean;
}) {
  const ev = EVENTS.find((e) => e.id === eventType);
  const activeNotes = RESTRICTIONS.filter((r) => restrictions.includes(r.id) && r.note);
  const lineCount = resolved.groups.reduce((s, g) => s + g.lines.length, 0);
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tu cesta para {ev?.name}</h1>
      <p className="mt-2 text-muted-foreground">
        Para {totalPeople} {totalPeople === 1 ? "persona" : "personas"}
        {date ? ` · ${date}` : ""} · {lineCount} productos
      </p>

      {activeNotes.length > 0 && (
        <div className="mt-6 space-y-2">
          {activeNotes.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm text-foreground"
            >
              <span className="mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full bg-secondary" />
              <span>
                <span className="font-medium">{n.label}:</span> {n.note}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-6">
        {resolved.groups.map((g) => (
          <div key={g.category}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CategoryIcon name={g.icon} className="h-4 w-4 text-primary" strokeWidth={1.6} />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.label}
                </h3>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">{formatEuro(g.cost)}</span>
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {g.lines.map((line) => {
                const canSwap = line.alternatives.length > 1;
                return (
                  <div key={line.key} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-foreground">
                        {line.option.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{line.amountLabel}</div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {line.cost > 0 ? formatEuro(line.cost) : "—"}
                    </span>
                    {canSwap && (
                      <motion.button
                        whileTap={{ scale: 0.85, rotate: -90 }}
                        onClick={() => onCycle(line.key)}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25"
                        aria-label="Cambiar producto"
                        title={`Cambiar (${line.alternatives.length} opciones)`}
                      >
                        <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/5 px-5 py-4">
        <div>
          <div className="text-sm font-semibold text-foreground">Total aproximado</div>
          <div className="text-xs text-muted-foreground">sin envío a domicilio</div>
        </div>
        <div className="text-2xl font-bold text-primary">{formatEuro(resolved.total)}</div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onSave}
          disabled={saving || saved}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saved ? <Check className="h-4 w-4" /> : null}
          {saved ? "Guardada" : saving ? "Guardando..." : "Guardar lista"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onShare}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Copy className="h-4 w-4" /> Compartir
        </motion.button>
      </div>
    </div>
  );
}

/* ---------- Step 5 ---------- */
const FEEDBACK_FACES = [
  { emoji: "😭", label: "Faltó mucho", value: "falto_mucho" },
  { emoji: "😕", label: "Faltó algo", value: "falto_algo" },
  { emoji: "😊", label: "Perfecto", value: "perfecto" },
  { emoji: "😅", label: "Sobró algo", value: "sobro_algo" },
  { emoji: "🤦", label: "Sobró mucho", value: "sobro_mucho" },
];

function Step5({
  feedbackEmoji,
  setFeedbackEmoji,
  rating,
  setRating,
  notes,
  setNotes,
  onSend,
  sent,
  onReset,
}: {
  feedbackEmoji: string | null;
  setFeedbackEmoji: (s: string) => void;
  rating: number;
  setRating: (n: number) => void;
  notes: string;
  setNotes: (s: string) => void;
  onSend: () => void;
  sent: boolean;
  onReset: () => void;
}) {
  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Check className="h-12 w-12" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
        <h2 className="mt-8 text-2xl font-bold tracking-tight">¡Gracias!</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Usaremos tu feedback para mejorar tu próxima lista.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          Organizar otro evento
        </motion.button>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Cómo fue la comida?</h1>
      <p className="mt-2 text-muted-foreground">Tu feedback mejora las próximas listas.</p>

      <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-3">
        {FEEDBACK_FACES.map((f) => {
          const on = feedbackEmoji === f.value;
          return (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -2 }}
              onClick={() => setFeedbackEmoji(f.value)}
              className={`flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 transition-all sm:p-5 ${
                on
                  ? "border-primary shadow-[0_0_0_3px_rgba(45,106,79,0.12)]"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <span className="text-3xl sm:text-4xl">{f.emoji}</span>
              <span className="text-center text-[11px] font-medium text-muted-foreground sm:text-xs">
                {f.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10">
        <p className="text-sm font-medium">¿Cómo valorarías la experiencia general?</p>
        <div className="mt-3 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.85 }}
              onClick={() => setRating(n)}
              aria-label={`${n} estrellas`}
            >
              <Star
                className={`h-9 w-9 ${
                  n <= rating ? "fill-secondary text-secondary" : "text-border"
                }`}
                strokeWidth={1.5}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <label className="text-sm font-medium">¿Algo que mejorar para la próxima vez?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Opcional"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onSend}
        disabled={!feedbackEmoji || rating === 0}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-40"
      >
        Enviar feedback
      </motion.button>
    </div>
  );
}

/* ---------- Mobile basket button ---------- */
function MobileBasketButton({
  count,
  onClick,
  registerRef,
}: {
  count: number;
  onClick: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <motion.button
      ref={registerRef}
      onClick={onClick}
      animate={{ scale: [1, 1.15, 1] }}
      key={count}
      transition={{ duration: 0.3 }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl lg:hidden"
      aria-label="Abrir cesta"
    >
      <ShoppingBasket className="h-6 w-6" strokeWidth={1.6} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 grid h-6 min-w-[1.5rem] place-items-center rounded-full bg-secondary px-1.5 text-xs font-bold text-secondary-foreground">
          <AnimatedNumber value={count} />
        </span>
      )}
    </motion.button>
  );
}

/* ---------- Fly overlay ---------- */
function FlyOverlay({
  tasks,
  onDone,
}: {
  tasks: FlyTask[];
  onDone: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[55]">
      <AnimatePresence>
        {tasks.map((t, idx) => {
          // Arco suave: punto de control elevado a mitad de camino.
          const midX = (t.from.x + t.to.x) / 2;
          const midY = Math.min(t.from.y, t.to.y) - 70;
          return (
            <motion.div
              key={t.id}
              initial={{ x: t.from.x, y: t.from.y, opacity: 0, scale: 0.7 }}
              animate={{
                x: [t.from.x, midX, t.to.x],
                y: [t.from.y, midY, t.to.y],
                opacity: [0, 1, 0],
                scale: [0.7, 1, 0.4],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.5, 1],
              }}
              onAnimationComplete={() => onDone(t.id)}
              className="absolute left-0 top-0 max-w-[150px] truncate rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg"
            >
              + {t.label}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
