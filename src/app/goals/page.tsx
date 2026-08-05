"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { createGoal, subscribeToGoals, deleteGoal } from "@/services/goals.service";
import { ErrorText } from "@/components/ui/ErrorText";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Goal, GoalPeriod } from "@/types";

export default function GoalsPage() {
  const profile = useAuthStore((s) => s.profile);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<GoalPeriod>("semanal");

  useEffect(() => {
    if (!profile) return;
    return subscribeToGoals(profile.uid, setGoals);
  }, [profile]);

  const addGoal = async () => {
    if (!profile || !title.trim()) return;
    await createGoal({
      userId: profile.uid, title, period, target: 1, progress: 0, createdAt: new Date().toISOString(),
    });
    setTitle("");
  };

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <Card className="mb-4 flex flex-col gap-3">
        <Input placeholder="Nueva meta..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex items-center justify-between">
          <Tabs
            value={period}
            onChange={(v) => setPeriod(v as GoalPeriod)}
            options={[
              { label: "Diaria", value: "diaria" },
              { label: "Semanal", value: "semanal" },
              { label: "Mensual", value: "mensual" },
              { label: "Anual", value: "anual" },
            ]}
          />
          <Button onClick={addGoal}>Agregar</Button>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {goals.map((goal) => (
          <Card key={goal.id} className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-gray-700">{goal.title}</p>
              <p className="text-xs text-gray-400 capitalize">{goal.period}</p>
            </div>
            <button
              onClick={() => deleteGoal(goal.id)}
              className="text-gray-300 hover:text-blush-500 shrink-0"
            >
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
