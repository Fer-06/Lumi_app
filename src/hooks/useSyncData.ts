"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTasksStore } from "@/store/useTasksStore";
import { subscribeToTasks } from "@/services/tasks.service";
import { subscribeToEvents } from "@/services/events.service";
import { subscribeToDiary } from "@/services/diary.service";
import { subscribeToNotes } from "@/services/notes.service";
import { subscribeToCourses } from "@/services/courses.service";
import { CalendarEvent, DiaryEntry, QuickNote, Course } from "@/types";

export function useSyncTasks() {
  const profile = useAuthStore((s) => s.profile);
  const setTasks = useTasksStore((s) => s.setTasks);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToTasks(profile.uid, setTasks);
    return () => unsub();
  }, [profile, setTasks]);
}

export function useSyncEvents() {
  const profile = useAuthStore((s) => s.profile);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToEvents(profile.uid, setEvents);
    return () => unsub();
  }, [profile]);

  return events;
}

export function useSyncDiary() {
  const profile = useAuthStore((s) => s.profile);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToDiary(profile.uid, setEntries);
    return () => unsub();
  }, [profile]);

  return entries;
}

export function useSyncNotes() {
  const profile = useAuthStore((s) => s.profile);
  const [notes, setNotes] = useState<QuickNote[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToNotes(profile.uid, setNotes);
    return () => unsub();
  }, [profile]);

  return notes;
}

export function useSyncCourses() {
  const profile = useAuthStore((s) => s.profile);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsub = subscribeToCourses(profile.uid, setCourses);
    return () => unsub();
  }, [profile]);

  return courses;
}
