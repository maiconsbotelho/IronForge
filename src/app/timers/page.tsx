import { IntervalTimer } from "@/components/timer/IntervalTimer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Need to create Tabs or assume ui component

export default function TimersPage() {
  return (
    <div className="space-y-8 flex flex-col items-center">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Estação de Timers
        </h1>
        <p className="text-zinc-500">Escolha seu modo</p>
      </div>

      <div className="w-full max-w-md">
        {/* Simple Tabs mock using buttons state if tabs component not exists, 
             but I'll implement Tabs in next step if I don't have it. 
             For now, I'll just render IntervalTimer as it's the main requested one. 
             I'll add others later. 
         */}
        <IntervalTimer />
      </div>
    </div>
  );
}
