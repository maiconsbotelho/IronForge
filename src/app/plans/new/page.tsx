import { createPlan } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardList, Save } from "lucide-react";
import Link from "next/link";

export default function NewPlanPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Nova Ficha
        </h1>
        <p className="text-zinc-500">
          Comece definindo o nome do seu planejamento.
        </p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Detalhes Básicos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={createPlan} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Nome da Ficha
              </label>
              <Input
                name="name"
                placeholder="Ex: Hipertrofia Fase 1"
                required
                className="bg-zinc-950 border-zinc-800 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400 uppercase">
                Descrição (Opcional)
              </label>
              <textarea
                name="description"
                className="flex w-full rounded-md border border-input bg-zinc-950 border-zinc-800 px-3 py-2 text-sm text-white min-h-[80px]"
                placeholder="Objetivo do treino, duração, etc..."
              />
            </div>

            <Button
              type="submit"
              className="w-full font-bold uppercase tracking-widest h-12 mt-4"
            >
              <Save className="mr-2 h-4 w-4" />
              Criar e Adicionar Treinos
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link href="/plans">
          <Button variant="link" className="text-zinc-500">
            Cancelar
          </Button>
        </Link>
      </div>
    </div>
  );
}
