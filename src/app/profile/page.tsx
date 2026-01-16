import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Settings, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch profile if exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="h-24 w-24 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-primary">
          <span className="text-3xl font-black text-white">
            {profile?.full_name?.substring(0, 2).toUpperCase() ||
              user.email?.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-black italic uppercase text-white">
            {profile?.full_name || "Atleta"}
          </h1>
          <p className="text-zinc-500">{user.email}</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configurações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 uppercase">
              Nome Completo
            </label>
            <Input
              disabled
              defaultValue={profile?.full_name || ""}
              className="bg-zinc-950 border-zinc-800 text-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 uppercase">
              Nível
            </label>
            <Input
              disabled
              defaultValue={profile?.level || "Iniciante"}
              className="bg-zinc-950 border-zinc-800 text-zinc-500"
            />
          </div>

          <form action="/auth/signout" method="post">
            <Button variant="destructive" className="w-full mt-4">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
