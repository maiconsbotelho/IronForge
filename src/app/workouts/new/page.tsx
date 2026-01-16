import { createWorkout } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Timer, Calendar, Dumbbell, Save } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MovementBadge } from "@/components/MovementBadge";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { wod_id } = await searchParams;
  let wodDetails = null;

  if (wod_id && typeof wod_id === "string") {
    const { data: wod } = await supabase
      .from("wod_library")
      .select("*")
      .eq("id", wod_id)
      .single();
    wodDetails = wod;
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Registrar Treino
        </h1>
        <p className="text-zinc-500">
          {wodDetails
            ? `Logando o benchmark: ${wodDetails.name}`
            : "Registre sua sessão de hoje."}
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            Detalhes do Treino
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {wodDetails && (
            <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800 mb-6">
              <h3 className="text-lg font-bold text-white mb-2">
                {wodDetails.name}{" "}
                <span className="text-xs font-normal text-zinc-500 ml-2">
                  ({wodDetails.type})
                </span>
              </h3>
              <p className="text-zinc-400 whitespace-pre-line text-sm mb-4">
                {wodDetails.description}
              </p>
              <div className="flex gap-2">
                <span className="text-xs font-bold bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
                  Score: {wodDetails.scoring_type}
                </span>
              </div>
            </div>
          )}

          <form action={createWorkout} className="space-y-4">
            <input type="hidden" name="wod_id" value={wodDetails?.id || ""} />

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Nome do Treino (Opcional)
              </label>
              <Input
                name="name"
                placeholder={
                  wodDetails ? wodDetails.name : "Ex: Treino de Força A"
                }
                defaultValue={wodDetails ? wodDetails.name : ""}
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 uppercase">
                  Data
                </label>
                <Input
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 uppercase">
                  {wodDetails?.scoring_type === "time"
                    ? "Tempo Final"
                    : wodDetails?.scoring_type === "rounds"
                      ? "Rounds + Reps"
                      : wodDetails?.scoring_type === "reps"
                        ? "Total de Repetições"
                        : "Resultado"}
                </label>
                <Input
                  name="score"
                  placeholder={
                    wodDetails?.scoring_type === "time" ? "20:00" : "Ex: 100kg"
                  }
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Notas
              </label>
              <textarea
                name="notes"
                className="flex w-full rounded-md border border-input bg-zinc-950 border-zinc-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] text-white"
                placeholder="Como foi o treino? Como se sentiu?"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold uppercase tracking-widest h-12"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Treino
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
