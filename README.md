# TFG-GestApp

Se va a describir el proceso de despliegue de la aplicación con la utilización de Docker Compose desde un repositorio en Github. El despliegue es un paso fundamental para poner en marcha el proyecto en un entorno de producción. GestApp se encuentra en un repositorio de GitHub, lo que va a permitir mantener un control de versiones.  

Para el despliegue se van a seguir una serie de pasos: 

1.Tener Visual Studio Code o cualquier otro editor de código fuente que permita clonar un repositorio de github. 

2.Clonar el repositorio “alvarocn21/TFG-GestApp (github.com)”, para ello lo primero que hay que hacer es crear un nuevo proyecto y pulsar las teclas “Ctrl + Mayus + P” para que aparezca la paleta de comandos, dentro de la paleta añadir el siguiente texto “git:clone” y pegar la url del repositorio. Esto realizará una copia del repositorio en tu proyecto. 

3.El siguiente paso es instalar todas las dependencias y librerías necesarias para poder lanzar el Back, para ello hay abrir un terminal en el archivo raíz del proyecto y poner “cd api”. A continuación, hay que poner en el terminal “npm install” lo que instalara todos los paquetes del proyecto. 

4.El siguiente paso es instalar todas las dependen¬cias y librerías necesarias, pero ahora para lanzar el Front, para ello hay que seguir los mismos pasos que para el back, primero abrir un terminal en el archivo raíz, poner “cd Front” y a continuación poner “npm install”, ahora si el proyecto estará correctamente instalado y disponibles para ejecutarse. 

5.Por último, para lanzar el proyecto hay que abrir un terminal en el archivo raíz y poner “Docker-Compose up”, este ejecutará ambos servicios en paralelo tanto el Backend como el Frontend.  

Ahora, para poder abrir el Frontend, la web, habría que poner en cualquier navegador la siguiente url http://localhost:3000. Y si se quisiera consultar cualquier función del Backend bastaría con poner en un navegador la siguiente url http://localhost:6005. 
