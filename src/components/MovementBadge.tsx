import { cn } from "@/lib/utils";

export type MovementPatternCode =
  | "PV"
  | "PH"
  | "EV"
  | "EH"
  | "DQB"
  | "DQU"
  | "DSB"
  | "DSU"
  | "CORE"
  | "COND";

interface MovementBadgeProps {
  code: string | MovementPatternCode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const patternConfig: Record<string, { label: string; color: string }> = {
  PV: {
    label: "Empurrar Vertical",
    color: "bg-red-900/50 text-red-200 border-red-800",
  },
  PH: {
    label: "Empurrar Horizontal",
    color: "bg-orange-900/50 text-orange-200 border-orange-800",
  },
  EV: {
    label: "Puxar Vertical",
    color: "bg-blue-900/50 text-blue-200 border-blue-800",
  },
  EH: {
    label: "Puxar Horizontal",
    color: "bg-cyan-900/50 text-cyan-200 border-cyan-800",
  },
  DQB: {
    label: "Dom. Quadril Bi",
    color: "bg-purple-900/50 text-purple-200 border-purple-800",
  },
  DQU: {
    label: "Dom. Quadril Uni",
    color: "bg-fuchsia-900/50 text-fuchsia-200 border-fuchsia-800",
  },
  DSB: {
    label: "Dom. Joelho Bi",
    color: "bg-green-900/50 text-green-200 border-green-800",
  },
  DSU: {
    label: "Dom. Joelho Uni",
    color: "bg-emerald-900/50 text-emerald-200 border-emerald-800",
  },
  CORE: {
    label: "Core",
    color: "bg-yellow-900/50 text-yellow-200 border-yellow-800",
  },
  COND: { label: "Cardio", color: "bg-zinc-800 text-zinc-300 border-zinc-700" },
};

export function MovementBadge({
  code,
  className,
  size = "md",
}: MovementBadgeProps) {
  const config = patternConfig[code] || {
    label: code,
    color: "bg-zinc-800 text-zinc-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold border",
        config.color,
        {
          "text-[10px] px-2 py-0.5": size === "sm",
          "text-xs px-2.5 py-1": size === "md",
          "text-sm px-3 py-1": size === "lg",
        },
        className,
      )}
      title={config.label}
    >
      {code}
    </span>
  );
}
