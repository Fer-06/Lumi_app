"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs } from "@/components/ui/Tabs";
import { PomodoroTimer } from "@/components/relax/PomodoroTimer";
import { BreathingExercise } from "@/components/relax/BreathingExercise";
import { SoundPlayer } from "@/components/relax/SoundPlayer";

export default function RelaxPage() {
  const [tab, setTab] = useState("pomodoro");

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <Tabs
        value={tab}
        onChange={setTab}
        options={[
          { label: "Pomodoro", value: "pomodoro" },
          { label: "Respiración", value: "respiracion" },
          { label: "Sonidos", value: "sonidos" },
        ]}
      />
      <div className="mt-4">
        {tab === "pomodoro" && <PomodoroTimer />}
        {tab === "respiracion" && <BreathingExercise />}
        {tab === "sonidos" && <SoundPlayer />}
      </div>
    </div>
  );
}
