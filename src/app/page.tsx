import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LastWorkout } from "@/components/dashboard/LastWorkout";
import { MovementBadge } from "@/components/MovementBadge";

async function DashboardHeader() {
  const supabase = await createClient();
  const Dictionary = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Elite",
  };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Should be handled by middleware, but extra safety
    return null;
  }

  // Create profile if not exists (handled by trigger but just in case we need to fetch)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userName = profile?.full_name?.split(" ")[0] || "Athlete";
  const userLevel = profile?.level
    ? Dictionary[profile.level as keyof typeof Dictionary]
    : "Rookie";

  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Olá, <span className="text-primary">{userName}</span>
        </h1>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-xs mt-1">
          Nível: {userLevel}
        </p>
      </div>
      {/* Could put a streak counter here */}
    </div>
  );
}

function Loading() {
  return (
    <div className="animate-pulse bg-zinc-900 h-24 rounded-lg w-full"></div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={<Loading />}>
        <DashboardHeader />
      </Suspense>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">
          Ações Rápidas
        </h2>
        <QuickActions />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">
          Atividade Recente
        </h2>
        <LastWorkout />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">
          Foco & Balanço
        </h2>
        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-3">Padrões da Semana</p>
          <div className="flex flex-wrap gap-2">
            <MovementBadge code="PV" size="sm" />
            <MovementBadge code="PH" size="sm" />
            <MovementBadge code="DSB" size="sm" />
          </div>
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[45%]" />
          </div>
          <p className="text-xs text-right text-zinc-500 mt-1">
            45% Dominância de Empurrar
          </p>
        </div>
      </section>
    </div>
  );
}
