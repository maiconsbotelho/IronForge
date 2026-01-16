import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, BarChart2, Calendar, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function StatsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Total Workouts & Streak Data
  const { data: workouts } = await supabase
    .from("workouts")
    .select("date")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const totalWorkouts = workouts?.length || 0;

  // Calculate Streak
  let streak = 0;
  if (workouts && workouts.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if last workout was today or yesterday to start streak
    const lastWorkoutDate = new Date(workouts[0].date);
    lastWorkoutDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak = 1;
      let currentDate = lastWorkoutDate;

      for (let i = 1; i < workouts.length; i++) {
        const nextDate = new Date(workouts[i].date);
        nextDate.setHours(0, 0, 0, 0);

        const gap = Math.abs(currentDate.getTime() - nextDate.getTime());
        const gapDays = Math.ceil(gap / (1000 * 60 * 60 * 24));

        if (gapDays === 1) {
          streak++;
          currentDate = nextDate;
        } else if (gapDays === 0) {
          // Same day, continue
          continue;
        } else {
          break;
        }
      }
    }
  }

  // 2. Volume Logic (Approximation)
  // We fetch items to calculate total tonnage
  const { data: workoutItems } = await supabase
    .from("workout_items")
    .select("weight, sets, reps");

  let totalVolume = 0;
  workoutItems?.forEach((item) => {
    if (item.weight && item.sets && item.reps) {
      totalVolume += item.weight * item.sets * item.reps;
    }
  });

  // Format volume (e.g. 1.2k, 1.5t)
  const formattedVolume =
    totalVolume > 1000
      ? (totalVolume / 1000).toFixed(1) + "t"
      : totalVolume + "kg";

  // 3. PRs
  const { data: prs, count: prCount } = await supabase
    .from("personal_records")
    .select(
      `
        *,
        exercises ( name )
    `,
      { count: "exact" },
    )
    .order("date", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Estatísticas
        </h1>
        <p className="text-zinc-500">Acompanhe seu progresso e evolução.</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total de Treinos
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalWorkouts}</div>
            <p className="text-xs text-zinc-500">Sessões completas</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Volume Total
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formattedVolume}
            </div>
            <p className="text-xs text-zinc-500">Carga total levantada</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Sequência
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{streak}</div>
            <p className="text-xs text-zinc-500">Dias seguidos</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Recordes
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{prCount || 0}</div>
            <p className="text-xs text-zinc-500">PRs batidos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent PRs */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            Recordes Recentes (PRs)
          </h2>
          <div className="space-y-2">
            {prs && prs.length > 0 ? (
              prs.map((pr: any) => (
                <div
                  key={pr.id}
                  className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800"
                >
                  <div>
                    <p className="font-bold text-white">
                      {pr.exercises?.name || "Exercício"}
                    </p>
                    <p className="text-xs text-zinc-500 capitalize">
                      {formatDistanceToNow(new Date(pr.date), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <span className="text-xl font-black text-primary italic">
                    {pr.one_rep_max || pr.three_rep_max || pr.five_rep_max}kg
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-zinc-900/50 rounded-lg border border-zinc-800">
                <p className="text-zinc-500">
                  Nenhum recorde registrado ainda.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Activity Heatmap Mock (Kept as mock for visual appeal as building real calendar heatmap is complex for MVP) */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight">
            Consistência
          </h2>
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex flex-wrap gap-1">
              {/* Creating a visual grid mock based on streak logic could be next step, keeping random for now to fill UI */}
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${
                    Math.random() > 0.7
                      ? "bg-primary"
                      : Math.random() > 0.4
                        ? "bg-primary/40"
                        : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-4 text-center">
              Últimos 42 dias
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
