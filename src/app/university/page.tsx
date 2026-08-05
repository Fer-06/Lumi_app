"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorText } from "@/components/ui/ErrorText";
import { useSyncCourses } from "@/hooks/useSyncData";
import { createCourse, deleteCourse } from "@/services/courses.service";
import { useAuthStore } from "@/store/useAuthStore";

const palette = ["#A98AFA", "#F76BA0", "#63D69B", "#8FCCFF", "#FFE585"];

export default function UniversityPage() {
  const profile = useAuthStore((s) => s.profile);
  const courses = useSyncCourses();
  const [name, setName] = useState("");
  const [professor, setProfessor] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addCourse = async () => {
    setError(null);
    if (!profile) {
      setError("Necesitas iniciar sesión para agregar cursos.");
      return;
    }
    if (!name.trim()) return;
    try {
      await createCourse({
        userId: profile.uid,
        name,
        professor,
        color: palette[courses.length % palette.length],
        materials: [],
        links: [],
      });
      setName("");
      setProfessor("");
    } catch (err) {
      console.error("Error al guardar el curso:", err);
      setError("No se pudo guardar. Revisa tu conexión y la configuración de Firebase.");
    }
  };

  const removeCourse = async (id: string) => {
    const confirmDelete = window.confirm("¿Eliminar este curso?");
    if (!confirmDelete) return;
    try {
      await deleteCourse(id);
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
      setError("No se pudo eliminar el curso.");
    }
  };

  return (
    <div className="px-5 lg:px-8">
      <Header />
      <ErrorText message={error} />
      <Card className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Nombre del curso" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Profesor (opcional)" value={professor} onChange={(e) => setProfessor(e.target.value)} />
        <Button onClick={addCourse}>Agregar curso</Button>
      </Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="border-l-4 flex items-start justify-between gap-2" style={{ borderLeftColor: course.color }}>
            <div>
              <p className="font-display text-gray-700">{course.name}</p>
              {course.professor && <p className="text-sm text-gray-400">{course.professor}</p>}
            </div>
            <button onClick={() => removeCourse(course.id)} className="text-gray-300 hover:text-blush-500 shrink-0">
              <Trash2 size={16} />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}