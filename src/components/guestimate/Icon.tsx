import {
  Beef,
  Beer,
  Cake,
  CakeSlice,
  Cookie,
  Croissant,
  Fish,
  Flame,
  Home,
  Milk,
  Salad,
  ShoppingBasket,
  Tent,
  TreePine,
  Wine,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Beef,
  Beer,
  Cake,
  CakeSlice,
  Cookie,
  Croissant,
  Fish,
  Flame,
  Home,
  Milk,
  Salad,
  ShoppingBasket,
  Tent,
  TreePine,
  Wine,
};

export function CategoryIcon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = MAP[name] ?? ShoppingBasket;
  return <Cmp className={className} strokeWidth={strokeWidth} />;
}