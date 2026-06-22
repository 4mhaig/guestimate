import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { AnimatedNumber } from "./AnimatedNumber";

export function Stepper({
  value,
  onChange,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]">
      {label && <span className="text-[15px] font-medium text-foreground">{label}</span>}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-white text-foreground transition-colors hover:bg-muted disabled:opacity-40"
          disabled={value <= min}
          aria-label="Restar"
        >
          <Minus className="h-4 w-4" />
        </motion.button>
        <div className="min-w-[2.5ch] text-center text-xl font-semibold tabular-nums text-foreground">
          <AnimatedNumber value={value} />
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onChange(value + 1)}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:opacity-90"
          aria-label="Sumar"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}