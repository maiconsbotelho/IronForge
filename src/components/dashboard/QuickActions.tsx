import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Timer, Dumbbell } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Link href="/workouts/new" className="col-span-2">
        <Button className="w-full h-14 text-lg font-black uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-6 w-6" />
          Novo Treino
        </Button>
      </Link>
      <Link href="/timers">
        <Button
          variant="outline"
          className="w-full h-12 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
        >
          <Timer className="mr-2 h-4 w-4" />
          Timers
        </Button>
      </Link>
      <Link href="/exercises">
        <Button
          variant="outline"
          className="w-full h-12 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800"
        >
          <Dumbbell className="mr-2 h-4 w-4" />
          Exercícios
        </Button>
      </Link>
    </div>
  );
}
