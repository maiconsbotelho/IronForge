"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Play, Pause, RefreshCw, Settings2 } from "lucide-react";
import { TimerDisplay } from "./TimerDisplay";
import { cn } from "@/lib/utils";

type TimerState = "idle" | "prepare" | "work" | "rest" | "finished";

export function IntervalTimer() {
  // Config
  const [rounds, setRounds] = useState(3);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);

  // State
  const [status, setStatus] = useState<TimerState>("idle");
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSettings, setShowSettings] = useState(true);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "idle" || status === "finished") {
      if (timerInterval.current) clearInterval(timerInterval.current);
      return;
    }

    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 0;
          // The status transition logic handles the next step
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [status]);

  // Effect to handle transitions when time hits 0
  useEffect(() => {
    if (timeLeft === 0 && status !== "idle" && status !== "finished") {
      handlePhaseComplete();
    }
  }, [timeLeft, status]);

  const handlePhaseComplete = () => {
    if (status === "prepare") {
      setStatus("work");
      setTimeLeft(workTime);
      // Play START sound
    } else if (status === "work") {
      if (currentRound < rounds && restTime > 0) {
        setStatus("rest");
        setTimeLeft(restTime);
        // Play REST sound
      } else if (currentRound < rounds) {
        // No rest, straight to next round
        setCurrentRound((c) => c + 1);
        setTimeLeft(workTime);
        // Play NEW ROUND sound
      } else {
        setStatus("finished");
        // Play FINISH sound
      }
    } else if (status === "rest") {
      setCurrentRound((c) => c + 1);
      setStatus("work");
      setTimeLeft(workTime);
      // Play START sound
    }
  };

  const startTimer = () => {
    setShowSettings(false);
    setStatus("prepare");
    setTimeLeft(10); // 10s prep
    setCurrentRound(1);
  };

  const pauseTimer = () => {
    setStatus("idle"); // Just using idle as pause for MVP simplicity, creates reset behavior
    // TODO: Implement proper pause without reset
  };

  const resetTimer = () => {
    setStatus("idle");
    setCurrentRound(1);
    setTimeLeft(0);
    setShowSettings(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
        <CardHeader className="bg-zinc-950 border-b border-zinc-800">
          <CardTitle className="flex items-center justify-between text-white">
            <span>Temporizador Intervalado</span>
            {!showSettings && (
              <span className="text-sm font-mono text-zinc-500">
                Round {currentRound} / {rounds}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {showSettings ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">
                    Rounds
                  </label>
                  <Input
                    type="number"
                    value={rounds}
                    onChange={(e) => setRounds(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-lg font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">
                    Trabalho (s)
                  </label>
                  <Input
                    type="number"
                    value={workTime}
                    onChange={(e) => setWorkTime(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-lg font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-zinc-500">
                    Descanso (s)
                  </label>
                  <Input
                    type="number"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    className="bg-zinc-800 border-zinc-700 text-lg font-mono text-center"
                  />
                </div>
              </div>

              <Button
                onClick={startTimer}
                className="w-full h-14 text-xl font-black uppercase mt-4 bg-primary hover:bg-primary/90 text-white"
              >
                <Play className="mr-2 fill-current" /> Iniciar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-8 py-8">
              <div className="relative">
                <TimerDisplay time={timeLeft} state={status} />
                <div className="absolute -top-6 left-0 right-0 text-center">
                  <span
                    className={cn(
                      "text-xl font-black uppercase tracking-widest",
                      status === "work" ? "text-primary" : "text-zinc-500",
                    )}
                  >
                    {status === "prepare" ? "PREPARAR" : status}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <Button
                  onClick={resetTimer}
                  variant="secondary"
                  className="flex-1"
                >
                  <Settings2 className="mr-2 h-4 w-4" /> Ajustes
                </Button>
                {/* Pause Logic to be improved, using reset for now or just stop */}
                <Button
                  onClick={resetTimer}
                  variant="destructive"
                  className="flex-1"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Resetar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Feedback for Phase */}
      <div
        className={cn(
          "fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-0",
          {
            "opacity-10 bg-primary": status === "work",
            "opacity-10 bg-emerald-500": status === "rest",
          },
        )}
      />
    </div>
  );
}
