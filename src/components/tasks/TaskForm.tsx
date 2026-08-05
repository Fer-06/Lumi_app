"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createTask } from "@/services/tasks.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { todayISO } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Escribe un título"),
  description: z.string().optional(),
  priority: z.enum(["muy-alta", "alta", "media", "baja"]),
  date: z.string(),
  time: z.string().optional(),
  color: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function TaskForm() {
  const profile = useAuthStore((s) => s.profile);
  const closeModal = useUIStore((s) => s.closeTaskModal);
  const [submitError, setSubmitError] = useState("");
  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: "media", date: todayISO(), color: "#A98AFA" },
  });

  const onSubmit = async (values: FormValues) => {
    if (!profile?.uid) {
      setSubmitError("Inicia sesión para guardar pendientes.");
      return;
    }

    try {
      setSubmitError("");
      const now = new Date().toISOString();
      await createTask(
        {
          userId: profile.uid,
          title: values.title,
          description: values.description,
          priority: values.priority,
          date: values.date,
          time: values.time,
          color: values.color,
          tags: [],
          subtasks: [],
          links: [],
          completed: false,
          createdAt: now,
          updatedAt: now,
        },
        profile.uid
      );
      closeModal();
    } catch {
      setSubmitError("No se pudo guardar el pendiente. Intenta otra vez.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input placeholder="¿Qué tienes que hacer?" {...register("title")} />
      {errors.title && <p className="text-xs text-blush-500">{errors.title.message}</p>}

      <Textarea placeholder="Descripción (opcional)" rows={3} {...register("description")} />

      <div className="grid grid-cols-2 gap-3">
        <select {...register("priority")} className="rounded-xl border border-lavender-200 bg-white/80 px-3 py-2.5 text-sm">
          <option value="muy-alta">Prioridad muy alta</option>
          <option value="alta">Prioridad alta</option>
          <option value="media">Prioridad media</option>
          <option value="baja">Prioridad baja</option>
        </select>
        <Input type="date" {...register("date")} />
      </div>

      <Input type="time" {...register("time")} />

      {submitError && <p className="text-xs text-blush-500">{submitError}</p>}

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        Guardar tarea
      </Button>
    </form>
  );
}
