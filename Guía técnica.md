# Guía técnica — Arcane-fangame

Manual para entender la estructura y los archivos principales de **Arcane-fangame**. Este repositorio es independiente de **Las ciudades del Umbral** (`MarinaDP2006/RIFTS-GEARS`).

> **Estado real:** el juego se puede jugar mediante rol y diálogos escritos sin IA. El chat de IA de escritorio usa actualmente KoboldCpp. El perfil de Ollama está preparado como experimento, pero está desactivado y la aplicación no lo carga automáticamente. Que exista un archivo de configuración no significa que esa función esté integrada.

## 1. ¿Qué es Capacitor?

**Capacitor** es una herramienta que permite empaquetar una aplicación hecha con tecnologías web (HTML, CSS y JavaScript) dentro de un proyecto nativo de móvil, como Android. No es el motor del juego ni sustituye a Electron.

En este repositorio:
- `capacitor.config.json` indica el identificador de la app, el nombre visible y la carpeta web que Capacitor debe copiar.
- `android/` contiene el proyecto nativo Android.
- `www/` es la carpeta web de entrada configurada para Capacitor; se genera/prepara y está excluida de Git.
- `npm run android:sync` ejecuta `scripts/build-mobile.js` y después `cap sync android`: prepara los archivos web para móvil y sincroniza los recursos/plugins con el proyecto Android.
- Capacitor sirve para el empaquetado móvil; la aplicación de escritorio sigue usando **Electron** (`main.js`, `preload.js` y `npm start`).

La configuración por sí sola no demuestra que la app se haya probado en un teléfono. Hay que compilarla y comprobar navegación, pantalla, recursos y controles en el dispositivo real o emulador.

## 2. Archivos que están en la raíz del repositorio

Esta sección describe los archivos que están directamente en la raíz (fuera de las carpetas). Los archivos generados o personales no siempre se suben a Git.

### Documentación en Markdown

| Archivo | Qué contiene y para qué sirve |
|---|---|
| [`README.md`](README.md) | Presentación principal del proyecto, funciones generales, comandos de desarrollo, enlaces a las guías y aviso legal. Es el punto de entrada para quien llega al repositorio. |
| [`Guía técnica.md`](Gu%C3%ADa%20t%C3%A9cnica.md) | Este documento: mapa de los archivos de raíz, herramientas, comandos y precauciones técnicas. |
| [`GUIAJUEGO.md`](GUIAJUEGO.md) | Manual para jugar: creación del personaje, pantallas, navegación y uso de las funciones disponibles. |
| [`GUIA-IA-Y-CAMPANA.md`](GUIA-IA-Y-CAMPANA.md) | Explica el estado de la IA y la campaña, el flujo narrativo y qué partes están realmente conectadas. Distingue las funciones actuales de las experimentales o pendientes. |
| [`MODELOS-LOCALES.md`](MODELOS-LOCALES.md) | Guía sobre modelos de IA locales y su estado de preparación. Importante: el perfil de Ollama no está integrado automáticamente en el cliente de escritorio. |
| [`GUIA-MODELOS-3D-Y-PRUEBAS.md`](GUIA-MODELOS-3D-Y-PRUEBAS.md) | Orientación para añadir modelos 3D y probar su carga y rendimiento. |
| [`GUIA_WEB_DESDE_CERO.md`](GUIA_WEB_DESDE_CERO.md) | Instrucciones para reconstruir y trabajar en la versión web desde cero. |
| [`partidas-guardadas-guia.md`](partidas-guardadas-guia.md) | Explica las partidas guardadas, su ubicación, exportación/importación y precauciones para no perder datos. |
| [`PENDIENTES.md`](PENDIENTES.md) | Lista resumida de trabajo pendiente y mejoras por completar. Comprueba también la lista de tareas dentro de `docs/`. |
| [`PILTOVER-3D.md`](PILTOVER-3D.md) | Diseño y estado del mapa 3D de Piltover: lugares previstos, implementación actual y mejoras necesarias. |
| [`ZAUN-3D.md`](ZAUN-3D.md) | Diseño y estado del mapa 3D de Zaun: lugares previstos, implementación actual y mejoras necesarias. |
| [`PLAN-3D.md`](PLAN-3D.md) | Hoja de ruta para desarrollar y mejorar el mundo 3D. |
| [`PRIVACIDAD.md`](PRIVACIDAD.md) | Información sobre datos locales, partidas, ajustes y consideraciones de privacidad. |
 
### Configuración y dependencias

| Archivo | Qué contiene y para qué sirve |
|---|---|
| `package.json` | Ficha del proyecto Node.js: nombre y versión, punto de entrada, dependencias y comandos como `npm start`, `npm run check`, `npm run dist`, `npm run android:sync` y `npm run web`. |
| `package-lock.json` | Fija las versiones concretas del árbol de dependencias para instalaciones reproducibles. Normalmente se actualiza con npm; no se edita a mano. |
| `capacitor.config.json` | Configuración de Capacitor para el empaquetado móvil: identificador, nombre y carpeta web de origen (`www`). No configura Electron ni conecta la IA. |
| `.env.example` | Plantilla de variables de entorno para el **servidor web de roleplay** y su proveedor de IA. No contiene claves reales y no configura el proveedor de IA de escritorio. Los valores reales se configuran en el entorno de alojamiento, no se publican en Git. |
| `.gitignore` | Indica a Git qué no debe subir: dependencias instaladas, compilaciones, datos personales, partidas locales, claves y carpetas generadas. No borra archivos del ordenador. |
| `render.yaml` | Configuración de despliegue para Render: comando de compilación, comando de inicio, comprobación de salud y variables del servicio web. No es la configuración de la app de escritorio. |

### Código que conecta la aplicación

| Archivo | Qué contiene y para qué sirve |
|---|---|
| `main.js` | Proceso principal de Electron. Abre la ventana, configura el entorno seguro, gestiona las partidas y los ajustes, y expone operaciones de archivos/modelos a través de IPC. También contiene la entrada que permite iniciar el servidor web fuera de Electron. |
| `preload.js` | Puente limitado entre la interfaz y Electron. Expone las operaciones autorizadas mediante `window.arcane`; evita dar acceso directo a Node.js a la página del juego. |
| `modelos.js` | Prepara modelos 3D personales: inspecciona archivos ZIP, encuentra modelos y texturas, reduce texturas grandes y guarda una caché regenerable para acelerar cargas posteriores. No es el catálogo de personajes narrativos ni un modelo de IA. |

### Scripts auxiliares de Windows

| Archivo | Qué contiene y para qué sirve |
|---|---|
| `jugar-windows.bat` | Permite iniciar el juego desde el código fuente con doble clic en Windows. Comprueba Node.js, instala dependencias si falta `node_modules` y ejecuta `npm start`. |
| `copiar-arte-windows.ps1` | Copia los recursos de arte organizados desde `arcaneData/arte` a una ruta local de Windows definida dentro del script. Revisa y cambia esa ruta si tu equipo usa otra ubicación. Copia archivos, pero no limpia los antiguos del destino. |

## 3. Carpetas principales (orientación rápida)

Esta lista no sustituye a la documentación específica de cada carpeta:

- `src/`: interfaz del juego, estilos, JavaScript, datos, fuentes, imágenes y recursos/modelos incluidos.
- `assets/music/`: archivos de música que usa el juego.
- `arcaneData/`: recursos organizados, fuentes/créditos del arte y estructura para datos de usuario. Las partidas y ajustes personales no deben subirse.
- `config/`: perfiles de configuración, incluido el perfil experimental de Ollama; no asumir que una configuración se carga automáticamente.
- `ollama/`: archivos auxiliares para preparar el perfil/modelo local de Ollama.
- `scripts/`: comprobaciones y tareas de construcción para web, móvil y mantenimiento.
- `server/`: servidor del modo web y sus rutas API. La configuración de `.env.example` corresponde a este lado del proyecto.
- `web/`: archivos fuente de la web y demo de desarrollo. La salida de distribución se genera en `web-dist/`.
- `android/`: proyecto nativo Android que usa Capacitor.
- `build/`: recursos de compilación, como el icono de la aplicación.
- `docs/`: documentación ampliada, tareas pendientes, notas de compilación y otras guías.
- `.github/`: automatizaciones de GitHub Actions y configuración del repositorio.
- `store/`: recursos relacionados con la distribución/tienda del proyecto, si están presentes en la versión actual.
- `salida/`: carpeta de salida auxiliar del proyecto; no la confundas con la salida web generada en `web-dist/`.

## 4. Comandos habituales

Ejecuta estos comandos desde la raíz del repositorio y con Node.js instalado:

```bash
npm ci
npm run check
npm start
npm run web
npm run android:sync
```

- `npm ci`: instala las dependencias fijadas por `package-lock.json`.
- `npm run check`: ejecuta las comprobaciones del proyecto y del entorno de ejecución.
- `npm start`: abre la versión de escritorio con Electron.
- `npm run web`: genera el sitio web de distribución en `web-dist/`.
- `npm run android:sync`: prepara la versión móvil y sincroniza los archivos/plugins con el proyecto Android de Capacitor.

Otros comandos definidos en `package.json`:
- `npm run dist` o `npm run dist:win`: genera instaladores de Windows.
- `npm run dist:mac`: prepara los paquetes configurados para macOS.
- `npm run serve:web`: inicia el servidor web de roleplay.

## 5. Qué guía consultar según la tarea

- **Quiero jugar:** `GUIAJUEGO.md`.
- **Quiero entender el código y la raíz del proyecto:** esta guía.
- **Quiero trabajar en la IA o la campaña:** `GUIA-IA-Y-CAMPANA.md` y `MODELOS-LOCALES.md`.
- **Quiero mejorar los escenarios 3D:** `GUIA-MODELOS-3D-Y-PRUEBAS.md`, `PILTOVER-3D.md`, `ZAUN-3D.md` y `PLAN-3D.md`.
- **Quiero arreglar la versión web:** `GUIA_WEB_DESDE_CERO.md`, el código de `web/` y los scripts de `scripts/`.
- **Quiero entender las partidas:** `partidas-guardadas-guia.md`.
- **Quiero saber qué falta:** `PENDIENTES.md` y `docs/TAREAS-PENDIENTES.md`.
- **Quiero revisar compilaciones:** `docs/RELEASES-ARCANE.md` y los workflows de `.github/`.

## 6. Desarrollo y publicación

1. Instala dependencias con `npm ci`.
2. Ejecuta `npm run check` y corrige cualquier error.
3. Prueba inicio, creación de personaje, navegación, diálogos y guardado/carga.
4. Para web, ejecuta `npm run web` y revisa el contenido generado en `web-dist/`. No sustituyas `web/index.html` por una página vacía.
5. Para Android, ejecuta la sincronización/compilación de Capacitor y prueba en un dispositivo o emulador.
6. Comprueba escritorio y móvil, consola, rutas de recursos, rendimiento y escalado de pantalla.
7. Revisa los créditos y permisos de los recursos de Arcane. Es un fangame no oficial: la licencia MIT del código no concede derechos sobre marcas, personajes o imágenes de terceros.

**Importante:** una guía, un script o un archivo de configuración describe cómo se pretende hacer algo; no demuestra que la función esté integrada ni que haya pasado pruebas. Registra como terminado solo lo que se haya ejecutado y comprobado en la versión actual.
