# TFG-GestApp

En este documento se describirá el proceso de despliegue de la aplicación utilizando Docker Compose desde un repositorio en GitHub. El despliegue es un paso fundamental para poner en marcha el proyecto en un entorno de producción, y al utilizar un repositorio de GitHub, se facilita el control de versiones.

Pasos para el Despliegue
A continuación se detallan los pasos necesarios para llevar a cabo el despliegue:

Clonar el Repositorio: Abre tu editor de código fuente (como Visual Studio Code) y clona el repositorio "alvarocn21/TFG-GestApp" desde GitHub. Puedes hacerlo usando la opción "Git: Clone" en la paleta de comandos e ingresando la URL del repositorio. Esto creará una copia del repositorio en tu proyecto local.

Instalar Dependencias del Backend: Abre un terminal en la carpeta raíz del proyecto y navega hasta la carpeta "api" utilizando el comando "cd api". A continuación, ejecuta el comando "npm install" para instalar todas las dependencias y paquetes necesarios para el Backend.

Instalar Dependencias del Frontend: Repite el mismo proceso para instalar las dependencias y paquetes necesarios para el Frontend. Abre un terminal en la carpeta raíz del proyecto, navega hasta la carpeta "Front" con el comando "cd Front" y ejecuta "npm install".

Ejecutar los Servicios: Finalmente, abre un terminal en la carpeta raíz del proyecto y ejecuta el comando "docker-compose up". Esto lanzará tanto el Backend como el Frontend como servicios en paralelo.

Acceso a la Aplicación
Una vez que el proyecto esté en ejecución, puedes acceder a la aplicación de la siguiente manera:

Frontend (Web): Abre cualquier navegador y visita la siguiente URL: http://localhost:3000.

Backend: Si deseas acceder a las funciones del Backend, simplemente ingresa la siguiente URL en un navegador: http://localhost:6005.

¡Ahora la aplicación debería estar desplegada y lista para su uso!

