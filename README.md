# Arcane-fangame — guía única del proyecto

## 1. Qué es este repositorio

Este repositorio contiene la versión existente del fangame narrativo de Arcane, desarrollada principalmente con JavaScript y Electron. Incluye el juego de escritorio, datos y recursos gráficos, música, herramientas de comprobación y una web pública independiente.

- **Web publicada:** https://arcane-fangame.onrender.com/
- **Repositorio original:** https://github.com/MarinaDP2006/Arcane-fangame
- **Rama de referencia establecida:** `main`
- **Versión indicada en `package.json`:** 1.30.3
- **Tecnología de la versión actual:** JavaScript, HTML/CSS, Node.js y Electron.
- **Motor previsto para la nueva versión:** Godot 4, en un proyecto separado y local. Este repositorio todavía no es el proyecto Godot.

La limpieza de documentación no cambia el código, las imágenes, los datos, los paquetes ni la web. Solo reúne la documentación en este archivo.

## 2. Descargar el proyecto completo

Para descargar una copia de los archivos guardados en esta rama:

1. Abre la página de la rama **preparar-descarga-local**.
2. Pulsa el botón verde **Code**.
3. Elige **Download ZIP**.
4. Espera a que termine la descarga y descomprime el ZIP en una carpeta nueva.
5. Conserva la carpeta original como respaldo. No sobrescribas el proyecto anterior.

Enlace directo al ZIP de esta versión: https://github.com/MarinaDP2006/Arcane-fangame/archive/refs/heads/preparar-descarga-local.zip

La descarga ZIP contiene los archivos versionados de la rama, incluidas las imágenes y los recursos que están en el repositorio. No incluye los artefactos temporales de GitHub Actions, las dependencias instaladas de Node ni archivos que nunca se hayan añadido al repositorio.

**Para empezar a aprender Godot:** crea una carpeta distinta, por ejemplo `RiftsAndGears-Godot`. No conviertas ni muevas el proyecto antiguo encima de esa carpeta. Primero aprenderemos el editor y GDScript con ejercicios pequeños, sin modificar la web publicada.

## 3. Qué hay en las carpetas principales

| Ruta | Contenido y propósito |
| --- | --- |
| `main.js`, `preload.js` | Entrada de la aplicación Electron y puente entre el proceso principal y la interfaz. |
| `src/` | Interfaz, lógica, datos, estilos e imágenes usados por el juego actual. |
| `src/img/arte/` | Recursos gráficos que consume la versión actual del juego: retratos, personajes, lugares, mapas y otros elementos artísticos. |
| `src/data/arte.js` | Manifiesto generado que registra recursos artísticos para la aplicación. Evita editarlo a mano sin revisar primero su generador. |
| `arcaneData/arte/` | Archivo organizado de arte de referencia y originales por categorías, lugares, personajes y temporadas. Es una fuente importante para consultar recursos al diseñar el proyecto nuevo. |
| `arcaneData/arte/FUENTES.json` | Registro de procedencia de los recursos artísticos. |
| `web/` | Código fuente y recursos de la web pública. |
| `web/assets/img/` | Imágenes propias de la web, separadas por ciudades, personajes e interfaz. No son necesariamente las mismas rutas que utiliza la aplicación de escritorio. |
| `web/icono-arcane.svg` | Icono de referencia de la web. |
| `build/` | Recursos usados al empaquetar la aplicación, incluido el icono de Windows. |
| `assets/music/` | Música y recursos de audio del repositorio. |
| `server/` | Servidor que entrega la versión preparada de la web. |
| `scripts/` | Comprobaciones, generación de la web, manifiestos de arte y utilidades de compilación. |
| `.github/workflows/compilar.yml` | Flujo de GitHub Actions para comprobar y empaquetar el juego para Windows. |
| `render.yaml` | Configuración de despliegue de la web en Render. |
| `package.json` y `package-lock.json` | Dependencias y comandos npm del proyecto actual. |

Las capturas de referencia, si están presentes, se encuentran en `web/capturas/` y `capturasjuego/`. Los nombres concretos y la organización interna pueden cambiar; utiliza las rutas reales de la copia descargada.

## 4. Cómo ejecutar el juego actual en Windows

Este procedimiento es para probar la versión existente, **no para empezar todavía el juego nuevo en Godot**.

### Requisitos

- Windows.
- Node.js 22 recomendado por la configuración actual.
- npm, incluido con Node.js.
- Espacio libre para instalar dependencias y generar el paquete.

### Preparación

1. Abre la carpeta descomprimida.
2. En el Explorador de archivos, abre la carpeta del proyecto.
3. Haz clic en la barra de dirección, escribe `cmd` y pulsa Intro.
4. Ejecuta:

```bat
npm ci
npm run check
npm run check:web
```

Para abrir la aplicación de escritorio:

```bat
npm start
```

Si `npm ci` falla por la instalación de Electron, no borres carpetas al azar. Copia el error completo y revisaremos la causa antes de cambiar nada.

### Comandos disponibles

| Comando | Para qué sirve |
| --- | --- |
| `npm start` | Abre el juego actual mediante Electron. |
| `npm run check` | Ejecuta las comprobaciones del juego y sus datos. |
| `npm run check:web` | Construye la web y comprueba las referencias de recursos publicados. |
| `npm run web` | Genera la salida estática en `web-dist/`. |
| `npm run serve:web` | Inicia el servidor de la web de forma local. |
| `npm run dist:win` | Solicita empaquetar el juego para Windows mediante electron-builder. |

No es necesario ejecutar estos comandos para comenzar el curso de Godot.

## 5. Web pública y Render

La web pública es un proyecto separado de la ventana de escritorio. Su dirección es https://arcane-fangame.onrender.com/.

- El código fuente de la web vive en `web/`.
- `scripts/build-web.js` prepara la salida web.
- `server/roleplay-server.js` sirve la web generada.
- `render.yaml` contiene la configuración del servicio.
- `npm run check:web` permite comprobar los recursos antes de publicar.

**No cambies la configuración de Render ni despliegues cambios mientras estés aprendiendo Godot.** El nuevo proyecto se desarrollará localmente y no necesita modificar la web existente.

## 6. Imágenes y recursos artísticos

Antes de mover o renombrar imágenes, distingue estos tres grupos:

1. **Archivo de originales y referencias:** `arcaneData/arte/`.
2. **Recursos enlazados por el juego actual:** `src/img/arte/`, junto con el manifiesto `src/data/arte.js`.
3. **Recursos de la web:** `web/assets/img/`.

No elimines duplicados solo porque tengan nombres parecidos: pueden tener tamaños, recortes o usos distintos. Para localizar un recurso, busca primero su nombre y revisa las referencias de código. Consulta `arcaneData/arte/FUENTES.json` para la procedencia registrada.

Al crear el proyecto Godot, copiaremos **solo los recursos necesarios** a la carpeta de arte del nuevo proyecto, conservando intactos los originales. Las imágenes utilizadas deberán estar guardadas dentro del proyecto Godot para que el juego no dependa de enlaces externos.

## 7. Historia, partidas y sistemas actuales

La versión existente contiene sistemas narrativos, decisiones, vínculos, personajes, códice, misiones, mapa de Piltover y Zaun y minijuegos. Esta guía describe el alcance general; no garantiza que todas las funciones estén libres de errores. Usa `npm run check` y pruebas manuales para verificar el comportamiento actual.

No confundas el funcionamiento del juego existente con las funciones que tendrá la nueva versión. Durante el aprendizaje de Godot, primero practicaremos escenas, nodos, señales, entradas, interfaz, recursos y GDScript. Después planificaremos la historia, los chats, las opciones de respuesta y sus consecuencias.

## 8. Ruta de aprendizaje para el nuevo juego en Godot

El proyecto nuevo se hará **en español y para Windows**, con el usuario escribiendo el código y aprendiendo paso a paso.

1. Conocer el editor de Godot: escena, nodo, Inspector, Sistema de archivos y panel de scripts.
2. Crear un proyecto vacío y entender cómo guardarlo y ejecutarlo.
3. Aprender GDScript con variables, condiciones, funciones, señales y colecciones.
4. Crear una escena sencilla con un fondo, una imagen y botones.
5. Construir una interfaz de diálogo de prueba, sin historia definitiva.
6. Aprender a cambiar escenas, guardar estados y gestionar elecciones.
7. Probar recursos gráficos locales y rutas de archivos.
8. Solo después, diseñar la arquitectura del juego completo, su historia, los chats interactivos y las consecuencias de las decisiones.
9. Probar el juego y preparar la exportación para Windows.

No es necesario integrar una IA generativa dentro del juego desde el principio. Primero crearemos un sistema narrativo controlado y fiable; más adelante se podrá evaluar una conexión opcional a IA, si sigue siendo necesaria.

## 9. Compilar una versión de Windows

El workflow de GitHub Actions está en [Actions · Compilar Arcane](https://github.com/MarinaDP2006/Arcane-fangame/actions/workflows/compilar.yml).

1. Abre una ejecución completada correctamente en la rama que quieras probar.
2. Busca la sección **Artifacts** y descarga el paquete disponible.
3. Descomprime el archivo y sigue las instrucciones de esa ejecución.

Los artefactos de Actions son temporales. Para una descarga permanente, consulta la sección [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases). Un ZIP del código fuente no equivale a un instalador compilado.

## 10. Solución de problemas

- **El ZIP parece pequeño o faltan archivos:** comprueba que descargaste la rama correcta y que la descarga terminó; el ZIP solo contiene contenido versionado.
- **No aparecen imágenes:** comprueba la ruta, las mayúsculas/minúsculas del nombre y si el recurso pertenece a `src/img/arte/`, `arcaneData/arte/` o `web/assets/img/`.
- **Electron no arranca:** conserva el mensaje de error completo; verifica la versión de Node.js y las dependencias antes de reparar la instalación.
- **La web local funciona pero Render no cambia:** la web publicada depende de su despliegue y de la rama/configuración de Render; no se actualiza por modificar una carpeta local.
- **Una comprobación falla:** copia el comando ejecutado y toda la salida de error antes de hacer más cambios.

## 11. Licencia, marcas y créditos

El repositorio declara licencia MIT para su código. Esa licencia **no concede derechos sobre Arcane, League of Legends, sus personajes, marcas, música ni obras visuales de terceros**. Revisa los derechos y la procedencia de cada recurso antes de redistribuirlo. El proyecto es un fangame independiente y no oficial, no respaldado por Riot Games.

## 12. Regla de trabajo y copias de seguridad

- Conserva una copia intacta del proyecto antiguo.
- No sustituyas el juego actual por el proyecto Godot.
- No hagas cambios de aprendizaje directamente en la web publicada.
- Mientras aprendemos, guarda el proyecto Godot en una carpeta local independiente.
- Antes de cualquier limpieza o migración de imágenes, haz una copia y comprueba qué archivos las utilizan.
- No publiques la nueva versión hasta que el juego esté probado y tú decidas que está listo.
