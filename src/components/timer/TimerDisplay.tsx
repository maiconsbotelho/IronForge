import { cn } from "@/lib/utils";
import { Teko } from "next/font/google";

// Use a digital-looking font if available, or fallback to mono
const teko = Teko({ subsets: ["latin"], weight: "600" });

interface TimerDisplayProps {
  time: number; // in seconds
  state?: "idle" | "work" | "rest" | "prepare" | "finished";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function TimerDisplay({
  time,
  state = "idle",
  className,
  size = "xl",
}: TimerDisplayProps) {
  return (
    <div
      className={cn(
        "tabular-nums font-mono leading-none tracking-tighter transition-colors duration-300",
        {
          "text-zinc-500": state === "idle" || state === "finished",
          "text-primary": state === "work",
          "text-emerald-500": state === "rest",
          "text-yellow-500": state === "prepare",

          "text-4xl": size === "sm",
          "text-6xl": size === "md",
          "text-8xl": size === "lg",
          "text-[10rem]": size === "xl",
        },
        teko.className,
        className,
      )}
    >
      {formatTime(time)}
    </div>
  );
}
