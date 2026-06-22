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
import { resolveBasket, formatEuro, DRINK_SLOTS, type ResolvedBasket } from "@/lib/products";
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

type Step = 1 | 2 | 3 | 4;
type View = "wizard" | "saved" | "feedback";
type FlyTask = {
  id: number;
  label: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

const STEP_LABELS = ["Evento", "Personas", "Restricciones", "Cesta"];

// Días (inclusive) entre dos fechas YYYY-MM-DD. Por defecto 2 si faltan.
function daysBetween(start: string, end: string): number {
  if (!start || !end) return 2;
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (Number.isNaN(s) || Number.isNaN(e) || e < s) return 2;
  return Math.round((e - s) / 86400000) + 1;
}

function Index() {
  const [step, setStep] = useState<Step>(1);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [date, setDate] = useState<string>(""); // inicio (casa rural) o fecha del evento
  const [endDate, setEndDate] = useState<string>(""); // fin del viaje (casa rural)
  const [people, setPeople] = useState<People>({
    hombres: 0,
    mujeres: 0,
    adolescentes: 0,
    ninos: 0,
  });
  const [meals, setMeals] = useState<MealsConfig>(defaultMealsConfig(2));
  const [aperitivo, setAperitivo] = useState(false);
  const [specialEvents, setSpecialEvents] = useState<SpecialEvents>({});
  const [restrictions, setRestrictions] = useState<Restriction[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [mobileBasketOpen, setMobileBasketOpen] = useState(false);
  const [savedEventId, setSavedEventId] = useState<string | null>(null);
  const [view, setView] = useState<View>("wizard");
  const [fbEvent, setFbEvent] = useState<{ id: string; label: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const basketIconRef = useRef<HTMLDivElement | null>(null);
  const mobileBasketRef = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();

  // En casa rural el nº de días sale de las fechas de inicio/fin.
  const days = useMemo(
    () => (eventType === "rural" ? daysBetween(date, endDate) : 1),
    [eventType, date, endDate],
  );

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
  const [removedLines, setRemovedLines] = useState<Set<string>>(new Set());
  const [drinks, setDrinks] = useState<Set<string>>(
    () => new Set([...DRINK_SLOTS.bebida_sin, ...DRINK_SLOTS.bebida_con]),
  );
  const resolved: ResolvedBasket = useMemo(
    () => resolveBasket(items, eventType, { choices, removed: removedLines, drinks }),
    [items, eventType, choices, removedLines, drinks],
  );
  const setChoice = (key: string, index: number) => {
    setChoices((prev) => ({ ...prev, [key]: index }));
  };
  const removeLine = (key: string) => {
    setRemovedLines((prev) => new Set(prev).add(key));
  };
  const toggleDrink = (id: string) => {
    setDrinks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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
    setEndDate("");
    setPeople({ hombres: 0, mujeres: 0, adolescentes: 0, ninos: 0 });
    setMeals(defaultMealsConfig(2));
    setAperitivo(false);
    setSpecialEvents({});
    setRestrictions([]);
    setSpecialRequests("");
    setChoices({});
    setRemovedLines(new Set());
    setDrinks(new Set([...DRINK_SLOTS.bebida_sin, ...DRINK_SLOTS.bebida_con]));
    setOverrides({});
    setRemoved(new Set());
    setSavedEventId(null);
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
      const savedItems = resolved.groups.flatMap((g) =>
        g.lines.map((l) => ({
          category: g.label,
          name: l.option.name,
          amount: l.amountLabel,
          cost: l.cost,
        })),
      );
      const { error: e2 } = await supabase.from("shopping_lists").insert({
        event_id: ev.id,
        items: savedItems,
        total: resolved.total,
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
    resolved.groups.forEach((g) => {
      lines.push(`— ${g.label}`);
      g.lines.forEach((l) =>
        lines.push(
          `  • ${l.option.name} · ${l.amountLabel}${l.cost > 0 ? ` · ${formatEuro(l.cost)}` : ""}`,
        ),
      );
      lines.push("");
    });
    lines.push(`Total aprox (sin envío): ${formatEuro(resolved.total)}`);
    if (specialRequests.trim()) {
      lines.push("");
      lines.push(`Peticiones: ${specialRequests.trim()}`);
    }
    const text = lines.join("\n");
    const title = `Guestimate — ${EVENTS.find((e) => e.id === eventType)?.name ?? "Lista de la compra"}`;
    // En móvil abrimos el menú nativo de compartir; si no existe, copiamos.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text });
        return;
      } catch (err) {
        // El usuario canceló el diálogo: no hacemos nada.
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast("Lista copiada");
    } catch {
      showToast("No se pudo copiar");
    }
  };

  const openFeedback = (id: string, label: string) => {
    setFbEvent({ id, label });
    setFeedbackEmoji(null);
    setRating(0);
    setNotes("");
    setFeedbackSent(false);
    setView("feedback");
  };

  const sendFeedback = async () => {
    if (!fbEvent) return;
    try {
      const { error } = await supabase.from("feedback").insert({
        event_id: fbEvent.id,
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

  const goHome = () => {
    reset();
    setView("wizard");
  };

  const canNext = () => {
    if (step === 1) {
      if (!eventType) return false;
      if (eventType === "rural") return !!date && !!endDate;
      return true;
    }
    if (step === 2) return totalPeople(people) > 0;
    return true;
  };

  const totalPpl = totalPeople(people);

  return (
    <div
      className={`min-h-screen text-foreground transition-colors ${
        view === "wizard" ? "bg-background" : "bg-muted/50"
      }`}
    >
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button onClick={goHome} className="flex items-center gap-2.5" aria-label="Inicio">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ShoppingBasket className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <span className="text-lg font-bold tracking-tight">Guestimate</span>
          </button>
          <div className="flex items-center gap-4">
            {view === "wizard" && <ProgressBasket step={step} />}
            <button
              onClick={() => setView("saved")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                view === "saved"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mis listas
            </button>
          </div>
        </div>
      </header>

      {view === "saved" && (
        <SavedListsView onFeedback={openFeedback} onNew={goHome} />
      )}

      {view === "feedback" && (
        <FeedbackView
          eventLabel={fbEvent?.label ?? ""}
          feedbackEmoji={feedbackEmoji}
          setFeedbackEmoji={setFeedbackEmoji}
          rating={rating}
          setRating={setRating}
          notes={notes}
          setNotes={setNotes}
          onSend={sendFeedback}
          sent={feedbackSent}
          onDone={() => setView("saved")}
        />
      )}

      {view === "wizard" && (
      <>
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
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
              )}
              {step === 2 && (
                <Step2
                  people={people}
                  setPeople={setPeople}
                  eventType={eventType}
                  days={days}
                  meals={meals}
                  setMeals={setMeals}
                  specialEvents={specialEvents}
                  setSpecialEvents={setSpecialEvents}
                  aperitivo={aperitivo}
                  setAperitivo={setAperitivo}
                />
              )}
              {step === 3 && (
                <Step3
                  restrictions={restrictions}
                  setRestrictions={setRestrictions}
                  drinks={drinks}
                  toggleDrink={toggleDrink}
                  specialRequests={specialRequests}
                  setSpecialRequests={setSpecialRequests}
                />
              )}
              {step === 4 && (
                <Step4
                  resolved={resolved}
                  onSelect={setChoice}
                  onRemove={removeLine}
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
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
            {step < 4 && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep((s) => Math.min(4, s + 1) as Step)}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === 3 ? "Ver mi cesta" : "Siguiente"}
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </section>

        {/* Desktop sticky basket */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
            <BasketPanel
              resolved={resolved}
              onSelect={setChoice}
              onRemove={removeLine}
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
                <BasketPanel resolved={resolved} onSelect={setChoice} onRemove={removeLine} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </>
      )}

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

/* ---------- Mis listas guardadas ---------- */
type SavedRow = {
  id: string;
  total: number | null;
  created_at: string;
  event: { id: string; type: string; date: string | null } | { id: string; type: string; date: string | null }[] | null;
};

function SavedListsView({
  onFeedback,
  onNew,
}: {
  onFeedback: (id: string, label: string) => void;
  onNew: () => void;
}) {
  const [rows, setRows] = useState<SavedRow[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("shopping_lists")
        .select("id, total, created_at, event:events(id, type, date)")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (error) {
        setFailed(true);
        setRows([]);
        return;
      }
      setRows((data ?? []) as SavedRow[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Mis listas</h1>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Nuevo evento
        </button>
      </div>
      <p className="mt-2 text-muted-foreground">
        Tus listas guardadas. Cuando pase el evento, danos tu feedback para afinar las próximas.
      </p>

      {rows === null && <p className="mt-8 text-sm text-muted-foreground">Cargando…</p>}

      {rows && rows.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {failed
            ? "No se pudieron cargar las listas. Inténtalo más tarde."
            : "Aún no has guardado ninguna lista. Crea un evento y pulsa “Guardar lista”."}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {rows?.map((r) => {
          const ev = Array.isArray(r.event) ? r.event[0] : r.event;
          const name = EVENTS.find((e) => e.id === ev?.type)?.name ?? "Evento";
          const label = `${name}${ev?.date ? ` · ${ev.date}` : ""}`;
          return (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">{name}</div>
                <div className="text-xs text-muted-foreground">
                  {ev?.date ? `${ev.date} · ` : ""}
                  {r.total != null ? `${formatEuro(r.total)} aprox` : ""}
                </div>
              </div>
              <button
                onClick={() => ev && onFeedback(ev.id, label)}
                className="shrink-0 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Dar feedback
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/* ---------- Progress ---------- */
function ProgressBasket({ step }: { step: Step }) {
  const pct = ((step - 1) / 3) * 100;
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
      <div className="text-xs tabular-nums text-muted-foreground">{step}/4</div>
    </div>
  );
}

/* ---------- Step 1 ---------- */
function Step1({
  eventType,
  setEventType,
  date,
  setDate,
  endDate,
  setEndDate,
}: {
  eventType: EventType | null;
  setEventType: (e: EventType) => void;
  date: string;
  setDate: (s: string) => void;
  endDate: string;
  setEndDate: (s: string) => void;
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
        <div className="mt-8 grid max-w-md gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground">Día que empieza</label>
            <input
              type="date"
              value={date}
              max={endDate || undefined}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Día que termina</label>
            <input
              type="date"
              value={endDate}
              min={date || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
          {date && endDate && (
            <p className="text-xs text-muted-foreground sm:col-span-2">
              Viaje de {daysBetween(date, endDate)} día(s).
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Step 2 ---------- */
function AperitivoToggle({
  aperitivo,
  setAperitivo,
}: {
  aperitivo: boolean;
  setAperitivo: (b: boolean) => void;
}) {
  return (
    <button
      onClick={() => setAperitivo(!aperitivo)}
      className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
        aperitivo ? "border-primary bg-accent" : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div>
        <div className="text-sm font-semibold text-foreground">¿Habrá aperitivo antes de comer?</div>
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
          className={`inline-block h-5 w-5 rounded-full bg-white shadow ${aperitivo ? "ml-[22px]" : "ml-0.5"}`}
        />
      </span>
    </button>
  );
}

function Step2({
  people,
  setPeople,
  eventType,
  days,
  meals,
  setMeals,
  specialEvents,
  setSpecialEvents,
  aperitivo,
  setAperitivo,
}: {
  people: People;
  setPeople: (p: People) => void;
  eventType: EventType | null;
  days: number;
  meals: MealsConfig;
  setMeals: (m: MealsConfig) => void;
  specialEvents: SpecialEvents;
  setSpecialEvents: (s: SpecialEvents) => void;
  aperitivo: boolean;
  setAperitivo: (b: boolean) => void;
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

      {eventType && eventType !== "rural" && (
        <div className="mt-8 max-w-xl">
          <AperitivoToggle aperitivo={aperitivo} setAperitivo={setAperitivo} />
        </div>
      )}

      {eventType === "rural" && (
        <div className="mt-10">
          <p className="mb-4 text-sm text-muted-foreground">
            Viaje de <span className="font-semibold text-foreground">{days} día(s)</span> (según las
            fechas que elegiste).
          </p>
          <MealsTable
            days={days}
            meals={meals}
            setMeals={setMeals}
            specialEvents={specialEvents}
            setSpecialEvents={setSpecialEvents}
            aperitivo={aperitivo}
            setAperitivo={setAperitivo}
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
  aperitivo,
  setAperitivo,
}: {
  days: number;
  meals: MealsConfig;
  setMeals: (m: MealsConfig) => void;
  specialEvents: SpecialEvents;
  setSpecialEvents: (s: SpecialEvents) => void;
  aperitivo: boolean;
  setAperitivo: (b: boolean) => void;
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
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold">Comidas por día</h3>
        <button
          onClick={() => setMeals(defaultMealsConfig(days, "standard"))}
          title="Rellena el patrón típico: día 1 solo cena, último día solo desayuno y comida, resto todas."
          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Rellenar automático
        </button>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Marca qué comidas hacéis cada día. “Rellenar automático” pone el patrón típico de un viaje.
      </p>
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

      <div className="mt-5 border-t border-border pt-4">
        <AperitivoToggle aperitivo={aperitivo} setAperitivo={setAperitivo} />
      </div>
    </div>
  );
}

/* ---------- Step 3 ---------- */
const DRINK_LABELS: Record<string, string> = {
  agua: "Agua",
  cola: "Refresco de cola",
  naranja_limon: "Naranja / limón",
  zumo: "Zumo",
  cerveza: "Cerveza",
  vino: "Vino",
};

function Step3({
  restrictions,
  setRestrictions,
  drinks,
  toggleDrink,
  specialRequests,
  setSpecialRequests,
}: {
  restrictions: Restriction[];
  setRestrictions: (r: Restriction[]) => void;
  drinks: Set<string>;
  toggleDrink: (id: string) => void;
  specialRequests: string;
  setSpecialRequests: (s: string) => void;
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
  const DrinkChip = ({ id }: { id: string }) => {
    const on = drinks.has(id);
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleDrink(id)}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
          on
            ? "border-secondary bg-secondary text-secondary-foreground"
            : "border-border bg-card text-foreground hover:border-secondary/50"
        }`}
      >
        {DRINK_LABELS[id]}
      </motion.button>
    );
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
        <h2 className="font-display text-lg font-semibold text-foreground">Bebidas</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Elige qué bebidas quieres en la lista.</p>
        <div className="mt-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Refrescos</span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {DRINK_SLOTS.bebida_sin.map((id) => (
              <DrinkChip key={id} id={id} />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Con alcohol</span>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {DRINK_SLOTS.bebida_con.map((id) => (
              <DrinkChip key={id} id={id} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold text-foreground">Peticiones especiales</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Escribe lo que quieras tener en cuenta (ej. "no compres agua embotellada" o "incluye gildas").
        </p>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={3}
          placeholder="Opcional"
          className="mt-3 w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </div>
  );
}

/* ---------- Step 4 ---------- */
function Step4({
  resolved,
  onSelect,
  onRemove,
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
  onSelect: (key: string, index: number) => void;
  onRemove: (key: string) => void;
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
                <h3 className="font-display text-base font-semibold text-foreground">
                  {g.label}
                </h3>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">{formatEuro(g.cost)}</span>
            </div>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {g.lines.map((line) => {
                const canSwap = line.alternatives.length > 1;
                const idx = line.alternatives.findIndex((o) => o.id === line.option.id);
                return (
                  <div key={line.key} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      {canSwap ? (
                        <select
                          value={idx}
                          onChange={(e) => onSelect(line.key, Number(e.target.value))}
                          className="w-full max-w-full truncate rounded-md bg-transparent text-sm font-medium text-foreground outline-none hover:text-primary focus:text-primary"
                          aria-label={`Elegir ${line.slotLabel}`}
                        >
                          {line.alternatives.map((o, i) => (
                            <option key={o.id} value={i}>
                              {o.name} · {o.price}€/{o.unit}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="truncate text-sm font-medium text-foreground">
                          {line.option.name}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {line.amountLabel}
                        {canSwap ? ` · ${line.alternatives.length} opciones` : ""}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                      {line.cost > 0 ? formatEuro(line.cost) : "—"}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => onRemove(line.key)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Quitar de la lista"
                      title="Quitar de la lista"
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
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

      <p className="mt-3 text-xs text-muted-foreground">
        Los productos y precios son orientativos y están basados en Mercadona. Pueden variar
        según tu tienda y la fecha.
      </p>

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

function FeedbackView({
  eventLabel,
  feedbackEmoji,
  setFeedbackEmoji,
  rating,
  setRating,
  notes,
  setNotes,
  onSend,
  sent,
  onDone,
}: {
  eventLabel: string;
  feedbackEmoji: string | null;
  setFeedbackEmoji: (s: string) => void;
  rating: number;
  setRating: (n: number) => void;
  notes: string;
  setNotes: (s: string) => void;
  onSend: () => void;
  sent: boolean;
  onDone: () => void;
}) {
  if (sent) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
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
          Usaremos tu feedback para mejorar tus próximas listas.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
        >
          Volver a mis listas
        </motion.button>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <button
        onClick={onDone}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Mis listas
      </button>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">¿Cómo fue la comida?</h1>
      <p className="mt-2 text-muted-foreground">
        {eventLabel ? `${eventLabel} · ` : ""}Tu feedback mejora las próximas listas.
      </p>

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
    </main>
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
