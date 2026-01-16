import { createClient } from "@/utils/supabase/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { MovementBadge } from "@/components/MovementBadge";
import { Database } from "@/types/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ExercisesPage() {
  const supabase = await createClient();

  // For MVP, we might fallback to some default exercises if DB is empty
  let { data: exercises } = await supabase.from("exercises").select(`
      *,
      exercise_patterns (
        pattern_code
      )
    `);

  if (!exercises || exercises.length === 0) {
    // Fallback Mock Data for Demo if user hasn't run the seed
    const mocks = [
      { id: "1", name: "Air Squat", category: "gymnastics", patterns: ["DSB"] },
      {
        id: "2",
        name: "Push Up",
        category: "gymnastics",
        patterns: ["PH", "CORE"],
      },
      { id: "3", name: "Deadlift", category: "strength", patterns: ["DQB"] },
      { id: "4", name: "Pull Up", category: "gymnastics", patterns: ["EV"] },
      {
        id: "5",
        name: "Thruster",
        category: "conditioning",
        patterns: ["DSB", "PV"],
      },
    ];
    // Transform mock to match structure
    exercises = mocks.map((m) => ({
      ...m,
      description: "Standard movement",
      equipment: [],
      created_at: new Date().toISOString(),
      exercise_patterns: m.patterns.map((p) => ({ pattern_code: p })),
    })) as any;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-black italic uppercase text-white">
            Biblioteca de Movimentos
          </h1>
          <p className="text-zinc-500">
            Domine o básico, conquiste o complexo.
          </p>
        </div>
        <Link href="/exercises/new">
          <Button>Novo Exercício</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises?.map((ex: any) => (
          <Card
            key={ex.id}
            className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-white">{ex.name}</CardTitle>
                {ex.category && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-zinc-800 text-zinc-400 px-2 py-1 rounded">
                    {ex.category}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mt-2">
                {ex.exercise_patterns?.map((p: any) => (
                  <MovementBadge
                    key={p.pattern_code}
                    code={p.pattern_code}
                    size="sm"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
