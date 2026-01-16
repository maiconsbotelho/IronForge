import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-sm border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-center text-primary italic text-3xl font-black">
            IRONFORGE
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Entre ou Cadastre-se para treinar.
          </p>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <Input
              name="email"
              placeholder="Email"
              required
              className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
            />
            <Input
              type="password"
              name="password"
              placeholder="Senha"
              required
              className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
            />
            <Input
              name="fullName"
              placeholder="Nome Completo (Apenas Cadastro)"
              className="bg-zinc-800 border-zinc-700 focus-visible:ring-primary"
            />

            <Button
              formAction={login}
              className="w-full font-bold uppercase tracking-wider"
            >
              Entrar
            </Button>
            <Button
              formAction={signup}
              variant="outline"
              className="w-full border-zinc-700 hover:bg-zinc-800 uppercase tracking-wider"
            >
              Cadastrar
            </Button>

            {message && (
              <p className="mt-4 p-4 bg-zinc-800/50 text-center text-sm text-red-500 rounded-md">
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
