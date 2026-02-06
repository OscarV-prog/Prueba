---
description: Guía paso a paso para configurar Supabase como base de datos en la nube para Prueba.
---

Usar Supabase es una excelente elección para que tu aplicación sea accesible desde cualquier lugar. Aquí te explico cómo configurarlo para trabajar con Prisma y Vercel.

### 1. Crear el Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com/) e inicia sesión.
2. Haz clic en **"New Project"**.
3. Ponle un nombre (ej: `prueba-db`) y una contraseña segura para la base de datos (**¡Guárdala bien!**).
4. Elige la región más cercana a donde creas que estarán tus usuarios (ej: `South America (São Paulo)` o `East US`).
5. Espera unos minutos a que se termine de "aprovisionar" la base de datos.

### 2. Obtener la URL de Conexión (Connection String)
Una vez creado el proyecto:
1. Ve al icono de engranaje (**Project Settings**) en la barra lateral izquierda.
2. Haz clic en **"Database"**.
3. Baja hasta la sección **"Connection string"**.
4. Selecciona la pestaña **"URI"**.
5. Verás algo como esto:
   `postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres`
6. Reemplaza `[YOUR-PASSWORD]` con la contraseña que creaste en el paso 1.

### 3. Configurar en Vercel o de forma Local
Si estás usando Vercel para el despliegue:
1. En el panel de tu proyecto en Vercel, ve a **Settings > Environment Variables**.
2. Añade una variable llamada `DATABASE_URL` y pega la URL de Supabase.

### 4. Aplicar el Diseño (Prisma Migrate)
Ahora necesitas que las tablas de "Prueba" existan en Supabase.
1. En tu computadora, dentro de la carpeta `prueba`, abre el archivo `.env`.
2. Actualiza temporalmente la línea `DATABASE_URL` con tu URL de Supabase.
3. Abre una terminal y ejecuta:
   ```bash
   npx prisma migrate deploy
   ```
   *Esto creará todas las tablas (Users, Tasks, Workspaces, etc.) en Supabase automáticamente.*

### 5. Verificación
- Entra en la pestaña **"Table Editor"** de Supabase. Deberías empezar a ver las tablas creadas. 
- ¡Tu aplicación ahora guardará todo en la nube!

---
**Nota Técnica**: Supabase usa el puerto `5432` para conexiones directas y el `6543` para conexiones pool (vía Supavisor). Para Next.js en Vercel, la conexión directa (puerto 5432) suele funcionar perfectamente.
