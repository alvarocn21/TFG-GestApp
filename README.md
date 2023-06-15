# TFG-GestApp

En este documento se describe el proceso de despliegue de la aplicación utilizando Docker Compose desde un repositorio en GitHub. El despliegue es un paso fundamental para poner en marcha el proyecto en un entorno de producción. GestApp se encuentra en un repositorio de GitHub, lo que permite mantener un control de versiones.

## Pasos para el Despliegue

A continuación se detallan los pasos necesarios para llevar a cabo el despliegue:

1. **Clonar el Repositorio**: Para clonar el repositorio, sigue estos pasos:
   - Abre tu editor de código fuente, como Visual Studio Code.
   - Selecciona la opción para clonar un repositorio de GitHub.
   - Ingresa la URL del repositorio "alvarocn21/TFG-GestApp" y confirma la clonación. Esto creará una copia del repositorio en tu entorno local.

2. **Instalar Dependencias del Backend**: Sigue estos pasos:
   - Abre un terminal en la carpeta raíz del proyecto.
   - Navega hasta la carpeta "api" utilizando el comando `cd api`.
   - Ejecuta el comando `npm install` para instalar todas las dependencias y paquetes necesarios para el Backend.

3. **Instalar Dependencias del Frontend**: Sigue estos pasos:
   - Abre un terminal en la carpeta raíz del proyecto.
   - Navega hasta la carpeta "Front" utilizando el comando `cd Front`.
   - Ejecuta el comando `npm install` para instalar todas las dependencias y paquetes necesarios para el Frontend.

4. **Ejecutar los Servicios**: Para lanzar la aplicación utilizando Docker Compose, realiza lo siguiente:
   - En primer lugar, añadir un fichero ".env" en donde hay que informar el cluseter de la base de datos de MongoDb. ej:
   `MONGO_URL=clustermongodb\usuario:contraseña\basededatos`
   - Despues, abre un terminal en la carpeta raíz del proyecto.
   - Ejecuta el comando `docker-compose up`. Esto iniciará tanto el Backend como el Frontend como servicios en paralelo.

## Acceso a la Aplicación

Una vez que el proyecto esté en ejecución, puedes acceder a la aplicación de la siguiente manera:

- **Frontend (Web)**: Abre cualquier navegador web y visita la siguiente URL: [http://localhost:3000](http://localhost:3000).

- **Backend**: Si deseas acceder a las funciones del Backend, ingresa la siguiente URL en un navegador: [http://localhost:6005](http://localhost:6005).

¡Ahora la aplicación debería estar desplegada y lista para su uso!
