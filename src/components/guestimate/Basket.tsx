import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, ShoppingBasket, X } from "lucide-react";
import {
  CATEGORY_META,
  type Category,
  type Item,
  formatQty,
  groupByCategory,
} from "@/lib/guestimate";
import { AnimatedNumber } from "./AnimatedNumber";
import { CategoryIcon } from "./Icon";

export function BasketPanel({
  items,
  onAdjust,
  onRemove,
  registerIconTarget,
  hideEmpty,
}: {
  items: Item[];
  onAdjust?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
  registerIconTarget?: (el: HTMLDivElement | null) => void;
  hideEmpty?: boolean;
}) {
  const grouped = groupByCategory(items);
  const categories = Object.keys(grouped) as Category[];
  const totalCount = items.length;

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
              <AnimatedNumber value={totalCount} /> productos · total estimado
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 && !hideEmpty && (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
            Tu cesta está vacía. Elige un evento para empezar a llenarla.
          </div>
        )}
        <div className="space-y-5">
          <AnimatePresence initial={false}>
            {categories.map((cat) => (
              <motion.div
                key={cat}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="mb-2 flex items-center gap-2 px-2">
                  <CategoryIcon
                    name={CATEGORY_META[cat].icon}
                    className="h-4 w-4 text-primary"
                    strokeWidth={1.6}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {CATEGORY_META[cat].label}
                  </span>
                </div>
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {grouped[cat].map((it) => (
                      <BasketRow
                        key={it.id}
                        item={it}
                        onAdjust={onAdjust}
                        onRemove={onRemove}
                      />
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

function BasketRow({
  item,
  onAdjust,
  onRemove,
}: {
  item: Item;
  onAdjust?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      layout
      drag={onRemove ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={(_, info) => {
        if (onRemove && Math.abs(info.offset.x) > 120) onRemove(item.id);
      }}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, x: 80 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 hover:bg-muted/60"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <motion.span
          key={item.name}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="truncate text-sm font-medium text-foreground"
        >
          {item.name}
        </motion.span>
      </div>
      <div className="flex items-center gap-2">
        <span className="min-w-[3.5rem] text-right text-sm tabular-nums text-muted-foreground">
          {formatQty(item)}
        </span>
        {onAdjust && (
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onAdjust(item.id, -1)}
              className="grid h-6 w-6 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              aria-label="Restar"
            >
              <Minus className="h-3 w-3" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => onAdjust(item.id, 1)}
              className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary/15"
              aria-label="Sumar"
            >
              <Plus className="h-3 w-3" />
            </motion.button>
            {onRemove && (
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onRemove(item.id)}
                className="ml-1 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                aria-label="Eliminar"
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}