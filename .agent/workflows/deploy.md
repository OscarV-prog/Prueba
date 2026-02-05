---
description: Guía paso a paso para desplegar la aplicación Prueba en Vercel con PostgreSQL.
---

Este flujo de trabajo detalla cómo llevar la aplicación desde el entorno de desarrollo local a producción.

### 1. Base de Datos (PostgreSQL)
Necesitas una base de datos PostgreSQL accesible desde internet.
- **Recomendado**: Usa [Neon](https://neon.tech), [Railway](https://railway.app), o [Supabase](https://supabase.com).
- Crea un nuevo proyecto y copia la **Connection String** (ej: `postgresql://user:password@host:port/db`).

### 2. Preparar el Repositorio
Asegúrate de que tu código esté en un repositorio de GitHub, GitLab o Bitbucket.

### 3. Configuración en Vercel
1. Ve a [Vercel](https://vercel.com) e importa tu proyecto de GitHub.
2. En la sección **Environment Variables**, añade las siguientes:
   - `DATABASE_URL`: La URL de conexión de tu base de datos.
   - `NEXTAUTH_SECRET`: Un string aleatorio largo (puedes generarlo con `openssl rand -base64 32`).
   - `NEXTAUTH_URL`: La URL de tu sitio (ej: `https://tu-app.vercel.app`). En Vercel a veces se detecta automáticamente, pero es mejor definirla.
   - `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` (si usas autenticación de Google).

### 4. Build & Deployment
- Vercel detectará automáticamente que es un proyecto de Next.js.
- **Importante**: El comando `npm run build` en un proyecto T3 suele incluir `prisma generate`. Si no, asegúrate de que el comando de build sea `prisma generate && next build`.

### 5. Migraciones de Base de Datos
Para aplicar el esquema a la base de datos de producción:
// turbo
1. Ejecuta localmente o mediante un script de CI/CD:
   ```bash
   npx prisma migrate deploy
   ```
   *(Asegúrate de apuntar temporalmente tu `.env` a la base de datos de producción para este paso o usa un túnel).*

### 6. Verificación
Visita la URL proporcionada por Vercel para confirmar que la aplicación carga correctamente.
