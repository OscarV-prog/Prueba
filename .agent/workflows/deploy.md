# 🚀 Master Deployment Guide: "Prueba" in the Cloud

Esta guía explica cómo mover tu aplicación de tu PC a internet para que cualquiera pueda usarla. Para que funcione, necesitamos conectar **3 piezas clave**:

---

## 🏗️ Los 3 Pilares del Despliegue

### 1. El Cerebro (GitHub): Tu Código
GitHub es el lugar donde guardamos el código. Vercel leerá el código directamente desde aquí.
- **Estado actual**: ¡Listo! Ya subiste tu código a [github.com/OscarV-prog/Prueba](https://github.com/OscarV-prog/Prueba).

### 2. La Memoria (Supabase): Tus Datos
Como quieres que la app funcione para muchas personas, la base de datos debe estar en la nube.
- **Acción**: Sigue los pasos en [supabase-setup.md](file:///c:/antigravity/prueba/prueba/.agent/workflows/supabase-setup.md) para crear tu base de datos y obtener tu `DATABASE_URL`.

### 3. El Motor (Vercel): Tu Servidor
Vercel es el "computador en internet" que ejecutará tu app las 24 horas.
- **Acción**:
  1. Entra en [Vercel.com](https://vercel.com) e inicia sesión con GitHub.
  2. Haz clic en **"Add New"** > **"Project"** e importa tu repositorio `Prueba`.
  3. **Configura las Variables de Entorno** (esto es VITAL):
     - `DATABASE_URL`: Pega la URL de Supabase que empieza con `postgresql://...`.
     - `NEXTAUTH_SECRET`: Escribe cualquier frase larga y secreta (ej: `prueba-super-secreta-2026`).
     - `NEXTAUTH_URL`: Pega la dirección que te dé Vercel o `https://tu-proyecto.vercel.app`.
  4. Haz clic en **"Deploy"**.

---

## ⚡ Paso Final: Sincronizar la Base de Datos
Una vez que Vercel termine el deploy, necesitas "crear" las tablas en Supabase.
1. Abre tu terminal en la carpeta del proyecto.
2. Asegúrate de que tu archivo `.env` tenga la `DATABASE_URL` de Supabase.
3. Ejecuta:
   ```bash
   npx prisma migrate deploy
   ```

---

## ✅ Checklist de Éxito
- [ ] ¿Puedo entrar a la URL que me dio Vercel?
- [ ] ¿Puedo registrarme y crear una tarea?
- [ ] ¿Si entro desde el celular veo la misma tarea?

¡Si todo esto es un **SÍ**, tu SaaS ya está oficialmente en vivo! 🚀
