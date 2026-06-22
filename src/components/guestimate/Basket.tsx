import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBasket, X } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";
import { CategoryIcon } from "./Icon";
import { type ResolvedBasket, type ResolvedLine, formatEuro } from "@/lib/products";

export function BasketPanel({
  resolved,
  onSelect,
  onRemove,
  registerIconTarget,
  hideEmpty,
}: {
  resolved: ResolvedBasket;
  onSelect?: (key: string, index: number) => void;
  onRemove?: (key: string) => void;
  registerIconTarget?: (el: HTMLDivElement | null) => void;
  hideEmpty?: boolean;
}) {
  const { groups, total } = resolved;
  const lineCount = groups.reduce((s, g) => s + g.lines.length, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            ref={registerIconTarget}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <ShoppingBasket className="h-5 w-5" strokeWidth={1.6} />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Mi cesta</div>
            <div className="text-xs text-muted-foreground">
              <AnimatedNumber value={lineCount} /> productos
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">{formatEuro(total)}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            aprox · sin envío
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {lineCount === 0 && !hideEmpty && (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
            Tu cesta está vacía. Elige un evento para empezar a llenarla.
          </div>
        )}
        <div className="space-y-5">
          <AnimatePresence initial={false}>
            {groups.map((g) => (
              <motion.div
                key={g.category}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="mb-2 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <CategoryIcon name={g.icon} className="h-4 w-4 text-primary" strokeWidth={1.6} />
                    <span className="font-display text-sm font-semibold text-foreground">
                      {g.label}
                    </span>
                  </div>
                  <span className="text-[11px] tabular-nums text-muted-foreground">
                    {formatEuro(g.cost)}
                  </span>
                </div>
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {g.lines.map((line) => (
                      <ProductRow key={line.key} line={line} onSelect={onSelect} onRemove={onRemove} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ProductRow({
  line,
  onSelect,
  onRemove,
}: {
  line: ResolvedLine;
  onSelect?: (key: string, index: number) => void;
  onRemove?: (key: string) => void;
}) {
  const reduced = useReducedMotion();
  const canSwap = !!onSelect && line.alternatives.length > 1;
  const idx = line.alternatives.findIndex((o) => o.id === line.option.id);
  return (
    <motion.div
      layout
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 hover:bg-muted/60"
    >
      <div className="min-w-0 flex-1">
        {canSwap ? (
          <select
            value={idx}
            onChange={(e) => onSelect?.(line.key, Number(e.target.value))}
            className="w-full max-w-full truncate rounded-md bg-transparent text-sm font-medium text-foreground outline-none hover:text-primary focus:text-primary"
            aria-label={`Elegir ${line.slotLabel}`}
          >
            {line.alternatives.map((o) => (
              <option key={o.id} value={line.alternatives.indexOf(o)}>
                {o.name} · {o.price}€/{o.unit}
              </option>
            ))}
          </select>
        ) : (
          <div className="truncate text-sm font-medium text-foreground">{line.option.name}</div>
        )}
        <div className="mt-0.5 text-xs text-muted-foreground">
          {line.amountLabel}
          {canSwap ? ` · ${line.alternatives.length} opciones` : ""}
        </div>
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {line.cost > 0 ? formatEuro(line.cost) : "—"}
      </span>
      {onRemove && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onRemove(line.key)}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Quitar de la lista"
          title="Quitar de la lista"
        >
          <X className="h-3.5 w-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
}
