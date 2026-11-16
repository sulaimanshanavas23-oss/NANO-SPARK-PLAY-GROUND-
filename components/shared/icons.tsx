import {
  Bot,
  CarFront,
  CircuitBoard,
  Code2,
  Cpu,
  Network,
  Shapes,
  Sparkles,
  Truck,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import type { LabIcon } from "@/src/lib/labs";
import type { ToolCategoryId } from "@/src/lib/tools";
import { cn } from "@/src/lib/utils";

const labIcons: Record<LabIcon, LucideIcon> = {
  cpu: Cpu,
  wifi: Wifi,
  network: Network,
  circuit: CircuitBoard,
  rover: CarFront,
  truck: Truck,
  bot: Bot,
};

export function LabGlyph({
  icon,
  className,
}: {
  icon: LabIcon;
  className?: string;
}) {
  const Icon = labIcons[icon];
  return <Icon className={className} />;
}

const categoryIcons: Record<ToolCategoryId, LucideIcon> = {
  development: Code2,
  simulation: Shapes,
  hardware: Cpu,
  ai: Sparkles,
};

export function CategoryGlyph({
  category,
  className,
}: {
  category: ToolCategoryId;
  className?: string;
}) {
  const Icon = categoryIcons[category];
  return <Icon className={className} />;
}

export function ToolGlyph({
  monogram,
  color,
  className,
}: {
  monogram: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-xl font-display text-[13px] font-extrabold tracking-tight text-white shadow-sm",
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {monogram}
    </span>
  );
}
