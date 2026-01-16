import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Trophy } from "lucide-react";

export function LastWorkout() {
  // TODO: Fetch real last workout
  const lastWorkout = null;

  if (!lastWorkout) {
    return (
      <Card className="border-dashed border-zinc-800 bg-zinc-900/30">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-12 w-12 text-zinc-700 mb-4" />
          <h3 className="text-lg font-bold text-zinc-400">
            Nenhum treino registrado ainda
          </h3>
          <p className="text-sm text-zinc-500 max-w-[200px]">
            Sua jornada começa hoje. Inicie sua primeira sessão!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm uppercase text-muted-foreground">
          <span>Última Sessão</span>
          <CalendarDays className="h-4 w-4" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white">"Murph" Prep</h4>
          <p className="text-sm text-zinc-400">2 days ago • 45 min</p>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-primary">
            PV
          </div>
          <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-primary">
            EV
          </div>
          <div className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-primary">
            COND
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
