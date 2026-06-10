import {
  Armchair,
  Award,
  Baby,
  BedDouble,
  Coffee,
  Gem,
  ShieldCheck,
  Sofa,
  Sparkles,
  Square,
  Table,
  TreePine,
  Truck,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  Sofa,
  Table,
  BedDouble,
  TreePine,
  Square,
  Coffee,
  Armchair,
  Baby,
  Gem,
  Sparkles,
  Award,
  ShieldCheck,
  Truck,
};

/** Renders a lucide icon by string name (used for data-driven catalog/feature icons). */
export function DynIcon({ name, ...props }: { name: string } & LucideProps) {
  const Comp = MAP[name] ?? Sofa;
  return <Comp {...props} />;
}
