import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WorkoutsPage() {
  const supabase = await createClient();
  const { data: wods } = await supabase
    .from("wod_library")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Biblioteca de WODs
        </h1>
        <p className="text-zinc-500">Teste seu condicionamento.</p>
      </div>

      <div className="space-y-4">
        {wods ? (
          wods.map((wod) => (
            <Card key={wod.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-primary">
                    {wod.name}
                  </CardTitle>
                  <span className="text-xs font-bold bg-white text-black px-2 py-1 uppercase rounded">
                    {wod.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 font-medium whitespace-pre-line">
                  {wod.description}
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-xs text-zinc-500 uppercase font-bold">
                    Pontuação: {wod.scoring_type}
                  </span>
                  <Link href={`/workouts/new?wod_id=${wod.id}`}>
                    <Button
                      variant="link"
                      className="text-sm font-bold text-primary hover:underline uppercase p-0 h-auto"
                    >
                      Iniciar WOD
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-8 text-center bg-zinc-900/50 rounded-lg border border-zinc-800">
            <p className="text-zinc-500">
              Nenhum WOD encontrado na biblioteca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
