import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, ClipboardList, Calendar, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: plans } = await supabase
    .from("training_plans")
    .select(
      `
        *,
        training_days (count)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-black italic uppercase text-white">
            Minhas Fichas
          </h1>
          <p className="text-zinc-500">
            Gerencie seus planejamentos de treino.
          </p>
        </div>
        <Link href="/plans/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ficha
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans && plans.length > 0 ? (
          plans.map((plan: any) => (
            <Link key={plan.id} href={`/plans/${plan.id}`}>
              <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg text-white group-hover:text-primary transition-colors">
                        {plan.name}
                      </CardTitle>
                    </div>
                    {plan.is_active && (
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/20 text-primary px-2 py-1 rounded">
                        Ativo
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-400 text-sm line-clamp-2 min-h-[40px]">
                    {plan.description || "Sem descrição."}
                  </p>
                </CardContent>
                <CardFooter className="pt-2 border-t border-zinc-800 flex justify-between">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(plan.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-white font-bold">
                    {plan.training_days[0]?.count || 0} Dias de Treino
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-zinc-900/50 rounded-lg border border-zinc-800">
            <ClipboardList className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Nenhuma ficha encontrada
            </h3>
            <p className="text-zinc-500 mb-6">
              Crie sua primeira ficha de treino para começar.
            </p>
            <Link href="/plans/new">
              <Button variant="outline">Criar Ficha</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
