---
description: Guía para subir la aplicación Prueba a GitHub por primera vez.
---

Subir tu código a GitHub es la mejor forma de tener un respaldo y facilitar el paso de una máquina a otra.

### 1. Crear el Repositorio en GitHub
1. Ve a [github.com/new](https://github.com/new).
2. Ponle nombre a tu repositorio (ej: `prueba-saas`).
3. Elige si quieres que sea **Público** o **Privado**.
4. **IMPORTANTE**: No selecciones nada en "Initialize this repository with" (ni README, ni .gitignore, ni license). Déjalo vacío.
5. Haz clic en **Create repository**.

### 2. Comandos en tu Computadora

1.  **Abre la Terminal** (PowerShell o CMD).
2.  **Entra en la carpeta del proyecto** ejecutando este comando:
    ```bash
    cd c:\antigravity\prueba\prueba
    ```
3.  Ejecuta los siguientes comandos de Git uno por uno:

1.  **Inicializar Git** (si no se ha hecho antes):
    ```bash
    git init
    ```
2.  **Añadir los archivos**:
    ```bash
    git add .
    ```
3.  **Primer Commit**:
    ```bash
    git commit -m "Initial commit: Prueba SaaS with Dark Mode and Team Invitations"
    ```
4.  **Configurar la rama principal**:
    ```bash
    git branch -M main
    ```
5.  **Conectar con GitHub**:
    *(Copia la línea que te da GitHub, se verá algo así:)*
    ```bash
    git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
    ```
6.  **Subir el código**:
    ```bash
    git push -u origin main
    ```

### 3. Para cambios futuros
Cada vez que hagas un cambio y quieras subirlo, solo necesitas 3 pasos:
```bash
git add .
git commit -m "Descripción de lo que cambiaste"
git push
```

---
**Tip**: Al moverte a otra máquina, solo tendrás que hacer `git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git` y tendrás todo listo.
