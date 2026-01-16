import { createWorkout } from "../actions";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dumbbell, Save, Activity } from "lucide-react";
import { redirect } from "next/navigation";
import { MovementBadge } from "@/components/MovementBadge";
import { createExercise } from "../actions";

export default async function NewExercisePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: patterns } = await supabase
    .from("movement_patterns")
    .select("*");

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Novo Exercício
        </h1>
        <p className="text-zinc-500">
          Adicione um novo movimento à biblioteca.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Dados do Movimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createExercise} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Nome do Exercício
              </label>
              <Input
                name="name"
                placeholder="Ex: Deadlift"
                required
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Categoria
              </label>
              <select
                name="category"
                className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="strength">Strength (Força)</option>
                <option value="gymnastics">
                  Gymnastics (Ginástico/Peso do Corpo)
                </option>
                <option value="conditioning">
                  Conditioning (Condicionamento)
                </option>
                <option value="mobility">Mobility (Mobilidade)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Descrição
              </label>
              <textarea
                name="description"
                className="flex w-full rounded-md border border-input bg-zinc-950 border-zinc-800 px-3 py-2 text-sm text-white min-h-[80px]"
                placeholder="Breve descrição da técnica..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase mb-2 block">
                Padrões de Movimento
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {patterns?.map((p) => (
                  <label
                    key={p.code}
                    className="flex items-center space-x-2 border border-zinc-800 p-2 rounded cursor-pointer hover:bg-zinc-800/50"
                  >
                    <input
                      type="checkbox"
                      name="patterns"
                      value={p.code}
                      className="rounded border-zinc-700 bg-zinc-950 text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">
                        {p.code}
                      </span>
                      <span className="text-[10px] text-zinc-500 leading-tight">
                        {p.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full font-bold uppercase tracking-widest h-12 mt-4"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Exercício
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
