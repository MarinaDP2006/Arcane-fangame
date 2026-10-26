Modelos 3D de los siete protagonistas

> **En pocas palabras:** Aquí se separa lo que ya existe en el sistema 3D de lo que todavía falta crear o comprobar. Antes de añadir otro sistema, revisa si el juego ya tiene uno que puedas ampliar. Los modelos de respaldo mantienen el juego utilizable, pero no deben presentarse como modelos oficiales ni como réplicas exactas de la serie.

## Estado comprobado
El proyecto dispone de un sistema de avatares 3D en `src/js/avatars3d.js`, con GLTFLoader local, animaciones cuando el archivo las trae y personajes procedurales de respaldo. Existen archivos con los nombres previstos en `src/models/`, pero **la presencia de un GLB no demuestra que sea un modelo completo, fiel a Arcane o que sus texturas y animaciones funcionen**: cada archivo debe inspeccionarse y probarse en escena. No se reemplaza este sistema por uno nuevo. El nombre visible del juego es **Rifts & Gears**; se mantiene el identificador interno `grietas-and-gears`, el ID de la app y las claves de las partidas.

## Catálogo de modelos que faltan
| Personaje | Archivo previsto | Estado |
| --- | --- | --- |
| Viktor | `viktor.glb` | Pendiente de modelo licenciado |
| Jayce | `jayce.glb` | Pendiente de modelo licenciado |
| Mel | `mel.glb` | Pendiente de modelo licenciado |
| Jinx | `jinx.glb` | Pendiente de modelo licenciado |
| Vi | `vi.glb` | Pendiente de modelo licenciado |
| Caitlyn | `caitlyn.glb` | Pendiente de modelo licenciado |
| Ekko | `ekko.glb` | Pendiente de modelo licenciado |

### Fuentes investigadas
- Colección Arcane de Sketchfab, con fan art y modelos de algunos personajes: https://sketchfab.com/enishi/collections/arcane-62f207cdbc6749d8841fe81cd876cb88
- Referencia visual de las skins de Arcane en 3D: https://www.nerfplz.com/lol-skins/lines/arcane/
- Catálogo de modelos para impresión: https://cults3d.com/en/3d-model/art/arcane-bundle
- Modelos comerciales de personajes: https://www.turbosquid.com/Search/3D-Models/arcane_leagueoflegends
- Especificación de carga GLB: https://threejs.org/docs/pages/GLTFLoader

**No descargar ni redistribuir automáticamente estos modelos:** cada obra tiene autor, licencia y formatos distintos; muchos STL son estatuas sin esqueleto ni animaciones y no sirven directamente para el juego. Las mallas extraídas de otros videojuegos pueden estar sujetas a derechos de Riot Games. Antes de incorporar cada archivo, confirmar autorización para redistribución, atribución, uso en videojuego y modificación.

## Proceso de integración por personaje
1. Elegir una referencia de temporada/atuendo. Confirmar silueta, ropa, peinado, rostro, accesorios y paleta. No mezclar versiones de la temporada 1 y 2 sin indicarlo.
2. Obtener un modelo con licencia compatible o crear una malla original en Blender; preferir GLB con materiales PBR y rig humanoide. Registrar autor, enlace, licencia y modificaciones.
3. Optimizar la malla para Android/tablet: geometría y texturas razonables, sin mallas innecesarias ni cientos de materiales.
4. Exportar a `src/models/<id>.glb` con el nombre exacto de la tabla. Mantener un modelo de reserva si falla la carga.
5. Añadir el nombre a `src/models/index.json` (array de nombres base sin extensión), para la versión web/Android. El cargador del proyecto usa ese índice fuera de escritorio.
6. Verificar carga en el juego, orientación, escala, materiales, iluminación, animaciones, interacción, FPS y consumo de memoria en Windows y Android.
7. Probar todas las variantes narrativas y el sistema de guardado. No fusionar una incorporación sin prueba visual.

## Mapa 3D exterior de Piltover y Zaun

`src/js/world3d.js` ya no construye edificios, calles, cúpulas, cavernas ni tuberías mediante geometría procedural. El modo 3D exige un entorno urbano completo en src/models/maps/piltover.glb o src/models/maps/zaun.glb; el renderizador añade actores dinámicos y vuelve al mapa ilustrado 2D si no puede cargar la escena. Los archivos fuente .blend y los GLB ya existen en main, pero su integración y calidad visual aún deben validarse dentro de una partida real. No volver a generarlos a ciegas ni declarar terminado el mapa solo porque los archivos estén presentes. El plan actualizado y los prompts para Marble/SpAItial están en PENDIENTES.md y src/models/maps/README.md.

## Mejoras de mundo e interfaz aún pendientes
- Mapa: transiciones consistentes entre vista general, ubicaciones y exploración, marcadores legibles y rutas táctiles.
- Mundo 3D: modelar/exportar los entornos urbanos completos de Piltover y Zaun con Blender, comprobar los anclajes de POI, definir colisiones transitables y validar cámara/NPCs con los GLB reales.
- Interacción: misiones, pistas, diálogos y relaciones que cambian según las decisiones.
- Móvil/tablet: verificar la PR #47 de controles táctiles en dispositivo real antes de fusionarla.
- Rendimiento: perfiles de calidad baja/media/alta y pruebas de 30/60 FPS medidos.
- Interfaz: HUD escalable, controles configurables, subtítulos y accesibilidad.
- Entrega: compilar Windows, Android y web; comprobar instalación, partidas y carga sin conexión.


## Flujo de generación actualizado (Marble + SpAItial)

- Usar imágenes oficiales/de referencia para estudiar la forma de Piltover y Zaun, sus accesos, cultura, Hextech, quimtec y Shimmer.
- Generar una escena independiente por ciudad con Marble y otra con SpAItial para comparar continuidad, estética y opciones de exportación.
- Preferir malla convencional editable; verificar si la salida es GLB, malla PLY o Gaussian Splat. No cambiar extensiones ni asumir colisiones.
- Limpiar la escena en Blender, alinear POI con src/data/world.js y conservar mapa 2D como alternativa.
- Referencia Neta de la autora: https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298; si no se puede abrir, pedir captura.
- Consultar PENDIENTES.md como lista principal de trabajo. Este documento es complementario.


## Flujo práctico para integrar personajes con Marble/SpAItial, ComfyUI y Open3D Viewer

Estas herramientas tienen funciones distintas y no deben confundirse:
- **Marble** y **SpAItial**: generar una primera versión de mundo/entorno a partir de texto e imágenes. Se utilizan para escenarios completos, no como garantía de que cada edificio tenga colisiones o mallas limpias.
- **ComfyUI**: crear y repetir concept art, referencias de iluminación, materiales, vestuario, retratos y hojas de vistas mediante workflows visuales de nodos. No es un editor de escenas 3D ni exporta automáticamente una ciudad jugable. Si hay workflows/modelos 3D instalados, probarlos como experimento separado; primero usarlo para imágenes consistentes de referencia.
- **Open3D Viewer**: inspeccionar localmente GLB/GLTF/FBX/OBJ/PLY, girar y acercar el modelo, revisar materiales y reproducir animaciones disponibles. Sirve para detectar problemas antes de integrarlos, no para crear el rig, corregir todo el mesh o garantizar el funcionamiento en Three.js.
- **Blender**: limpieza final de mallas, pivotes, escala, materiales, colisiones/zonas, organización de escena y exportación GLB.
- **Freebuff**: asistencia para preparar prompts, automatizar auditorías de archivos, revisar código e integrar los recursos en ramas aisladas. La persona usuaria no necesita programar en JavaScript: debe pedir al agente pasos verificables, comandos sencillos y capturas, sin dar permisos para fusionar PR automáticamente.

### Revisión de cada personaje
1. Abrir el GLB en Open3D Viewer; guardar captura frontal, lateral y tres cuartos.
2. Comprobar altura, orientación, pies, materiales, transparencia, pelo y accesorios; verificar si hay animaciones y esqueleto real.
3. Comparar con una referencia autorizada/propia; no copiar assets extraídos de juegos comerciales.
4. Importar en Blender solo si hace falta corregir algo; conservar el archivo fuente y exportar una copia GLB de prueba.
5. Probar en el juego a distancia general, media y de conversación, junto a un avatar de referencia y un guardia/NPC.
6. Registrar resultado, defectos y licencia en una tabla; no declarar animado un modelo que no contiene animaciones.

Para instrucciones por pantalla y criterios de aceptación, la fuente principal sigue siendo PENDIENTES.md.
