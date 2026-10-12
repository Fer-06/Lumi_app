# Lumi 🌸

**Tu espacio para estudiar, organizarte y sentirte mejor.**

PWA de productividad universitaria y bienestar personal construida con Next.js (App Router), TypeScript, Tailwind CSS y Firebase.

## Funcionalidades incluidas en esta base

- ✅ Autenticación (registro / login / cerrar sesión) con Firebase Auth
- ✅ Dashboard con saludo, frase del día, resumen de tareas, mini calendario y estadísticas
- ✅ Sistema de tareas (CRUD, prioridades, fecha/hora, completar, duplicar, eliminar)
- ✅ Calendario mensual/semanal (FullCalendar) con tareas y eventos
- ✅ Módulo universidad (cursos y profesores)
- ✅ Diario personal con estado de ánimo
- ✅ Notas rápidas estilo Google Keep (con anclado y colores)
- ✅ Asistente con Gemini e historial de conversaciones por cuenta
- ✅ Navegación móvil con acceso a todas las secciones desde el menú «Más»
- ✅ Sección relax: Pomodoro, respiración guiada, sonidos ambientales
- ✅ Objetivos por periodo (diaria/semanal/mensual/anual)
- ✅ Ajustes de perfil, temas de color y recordatorios del navegador para tareas y eventos del calendario
- ✅ Recordatorios mientras Lumi está abierta; las notificaciones con la app cerrada requieren un backend de push
- ✅ Configurado como PWA instalable (`next-pwa` + manifest)
- ✅ Sistema de diseño con paleta pastel (lavanda, rosa, menta, azul bebé, crema) y estilo glassmorphism

## Lo que falta que tú completes (por licencias / credenciales, no por límite técnico)

1. **Tu proyecto de Firebase**: crea uno en https://console.firebase.google.com, activa Authentication (Email/Password), Firestore y Cloud Messaging.
2. Copia `.env.example` a `.env.local` y completa las claves de tu proyecto Firebase.
3. Agrega `GEMINI_API_KEY` a `.env.local` para habilitar el asistente. Mantén esta clave sin el prefijo `NEXT_PUBLIC_` para que no se exponga al navegador; la llamada a Gemini pasa por una ruta del servidor. Si antes usabas `NEXT_PUBLIC_GEMINI_API_KEY`, puedes migrar su valor a `GEMINI_API_KEY` y quitar la variable pública.
4. Para añadir notificaciones push con la app cerrada, configura Firebase Cloud Messaging y el service worker con los datos de tu proyecto (los service workers no leen variables de entorno). Los recordatorios locales no requieren esa configuración.
5. Agrega tus propios íconos en `public/icons/icon-192.png` y `icon-512.png`.
6. Agrega archivos de audio libres de derechos en `public/sounds/` (rain.mp3, ocean.mp3, forest.mp3, night.mp3, fireplace.mp3) para la sección Relax.
7. Publica en Firebase Console las reglas incluidas en [`../firestore.rules`](../firestore.rules). Estas protegen cada registro con su propietario (`userId` o el UID del perfil) y permiten guardar el historial en `chatConversations` y `chatMessages`; no dejes activas reglas temporales abiertas.

## Instalación local

```bash
npm install
cp .env.example .env.local   # y completa tus credenciales de Firebase

```

Abre http://localhost:3000

## Subir a GitHub

```bash
git init
git add .
git commit -m "Lumi: base inicial del proyecto"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/lumi.git
git push -u origin main
```

## Desplegar en Vercel

1. Entra a https://vercel.com/new e importa el repo de GitHub.
2. En "Environment Variables" agrega las mismas variables de tu `.env.local`.
3. Deploy 🚀

## Estructura del proyecto

```
src/
  app/           → páginas (App Router): dashboard, tasks, calendar, university,
                   diary, notes, chat, relax, goals, settings, login, register
  components/    → componentes por dominio (ui, layout, dashboard, tasks, etc.)
  services/      → acceso a datos (Firestore) y capa de IA (services/ai)
  store/         → estado global con Zustand
  contexts/      → AuthContext
  hooks/         → hooks de sincronización con Firestore y notificaciones
  types/         → tipos TypeScript compartidos
  data/          → banco de frases motivacionales
  lib/           → configuración de Firebase y utilidades
```

## Próximos pasos sugeridos

- Vistas Kanban y semanal/mensual completas para tareas (ahora mismo la vista principal es lista; la base de datos y el store ya soportan las demás vistas).
- Subtareas, etiquetas, archivos y links dentro del formulario de tareas (los tipos ya están listos, falta la UI).
- Conectar un proveedor de IA real en `services/ai/` (solo hay que crear una clase que implemente `AIProvider`).
- Modo oscuro (las variables de color ya están centralizadas en `tailwind.config.ts` para facilitarlo).
- Reglas de seguridad de Firestore y de Storage.
