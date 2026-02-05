---
description: Cómo mover la aplicación PRUEBA de una computadora a otra de forma sencilla.
---

Para pasar la aplicación a otra máquina sin complicaciones, usaremos **Docker**. Esto garantiza que no tengas que instalar Node.js ni configurar bases de datos manualmente en la nueva PC.

### Preparación en la Máquina de Origen (Actual)

1.  **Copia la carpeta del proyecto**: Simplemente copia toda la carpeta `prueba` a un pendrive o súbela a la nube.
    - *Nota: No es necesario copiar la carpeta `node_modules` ni `.next`, ya que Docker las generará de nuevo.*

### Pasos en la Máquina de Destino

1.  **Instalar Docker**: Asegúrate de tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y funcionando.
2.  **Abrir una terminal**: Navega hasta la carpeta `prueba` que copiaste.
3.  **Encender la aplicación**: Ejecuta el siguiente comando:
    ```bash
    docker-compose up -d --build
    ```
    - *Este comando descargará PostgreSQL, construirá la aplicación y la pondrá en marcha.*
4.  **Acceder**: Abre tu navegador en [http://localhost:3000](http://localhost:3000).

### ¿Cómo mover los DATOS existentes?

Si también quieres pasar las tareas que ya creaste:
1.  **En la máquina de origen**, antes de copiar, realiza un respaldo de la base de datos o simplemente copia el volumen de Docker si sabes dónde está.
2.  **Opción recomendada**: Lo más fácil para pasar datos es exportar el archivo de la base de datos:
    ```bash
    docker exec -t prueba-db-1 pg_dumpall -c -U username > dump.sql
    ```
    Y luego importarlo en la nueva máquina:
    ```bash
    cat dump.sql | docker exec -i prueba-db-1 psql -U username
    ```

---
**¡Listo!** Con esto la aplicación funcionará exactamente igual en cualquier máquina que tenga Docker.
