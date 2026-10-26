# Escenarios 3D de ciudad (activos creados en Blender)

El renderizador ya **no genera edificios, terreno, cúpulas, cavernas, tuberías ni puentes mediante Three.js**. Para activar el mapa 3D de una ciudad tiene que existir uno de estos archivos:

- `src/models/maps/piltover.glb`
- `src/models/maps/zaun.glb`

Un GLB debe ser un entorno completo creado en un programa 3D (recomendación: Blender), con arquitectura, suelo, calles, silueta de la ciudad, materiales/texturas PBR y elementos ambientales. El juego añade encima únicamente personajes dinámicos, guardias, controles, etiquetas y una iluminación de apoyo.

**Si falta el GLB o no tiene mallas, el juego desactiva el 3D y conserva el mapa ilustrado 2D.** No sustituye una ciudad ausente por bloques procedurales falsos.

## Escala y ejes

- Área jugable de referencia: 3000 × 2200 unidades del juego; suelo a Y=0 dentro de Three.js.
- En Blender usa X para la anchura, Y para la profundidad y Z para la altura. El exportador glTF cambia de Z-up a Y-up; por ello el eje Y de Blender pasa a la profundidad Z de glTF con signo invertido.
- Mantén el origen y escala coherentes con los lugares de `src/data/world.js`: la posición de un lugar `(x, y)` del juego corresponde al punto Blender `(x, -y, 0)`.
- Añade empties de referencia llamados `POI__academia`, `POI__consejo`, etc. en la colección `CITY_WORLD`. El validador comprueba sus ubicaciones para que el HUD señale el edificio correcto.
- El archivo GLB debe incluir el escenario entero y las texturas embebidas; nunca uses rutas absolutas al disco del artista.

## Flujo recomendado

1. Genera dos mundos independientes con Marble y SpAItial, usando referencias separadas para Piltover y Zaun; no mezcles ambas ciudades en una sola generación.
2. Prioriza exportar una malla 3D convencional y materiales editables. Comprueba el formato real: Gaussian Splat/SPZ/PLY no equivale automáticamente a GLB con geometría y colisiones.
3. Importa el resultado en Blender y corrige arquitectura deformada, calles desconectadas, geometría flotante, escala, normales, materiales y zonas intransitables.
4. Genera activos sueltos con otras herramientas solo cuando falten detalles concretos; intégralos manualmente en Blender, no como edificios aleatorios generados por el runtime.
5. Para Piltover, prioriza piedra marfil, latón/oro envejecido, cobre patinado, arcos, balcones, cúpulas, agujas, plazas, puentes, mar y puertas marítimas. Para Zaun, crea ciudad subterránea vertical de hierro remachado, cristal coloreado, tuberías corroídas, pasarelas, mercados, talleres, canales tóxicos, humo y luces químicas.
6. Coloca los empties `POI__<id>` según `tools/blender/export_arcane_map.py` y valida que coincidan con los lugares del juego.
7. Revisa la escena en vista cenital, panorámica y nivel de calle; no declares navegabilidad hasta probarla dentro del juego.


## Prompts base para generar piezas 3D

Usa el generador de mallas para **un activo por generación**, no para pedirle toda la ciudad. Estos textos sirven de punto de partida; el resultado debe corregirse y montarse en Blender antes de exportar.

**Piltover — edificio cívico/academia**
> High-detail stylized fantasy architecture asset for a real-time 3D game: elegant ivory limestone, brass and aged gold trims, art-nouveau curves, tall arched windows, green patinated copper roof, layered balconies and delicate vertical spires, hextech-era prosperous city, Arcane-inspired painterly material treatment, physically based materials, clean topology, coherent real-world proportions, standalone building, no ground plane, no people, no logos, no readable text.

**Piltover — puente monumental y Hexpuertas**
> Modular monumental fantasy city bridge, pale carved stone pylons, ornate brass fittings, turquoise patinated copper details, graceful suspended spans and large circular arcane transit ring, elevated above a sea of clouds, handcrafted industrial art-nouveau, game-ready PBR asset, modular clean ends, no people, no logos, no text.

**Zaun — bloque de viviendas/taller**
> Dense undercity industrial architecture asset, stacked crooked tenements, dark riveted iron plates, weathered copper and rust, repaired wooden platforms, exposed pipes, suspended catwalks, mismatched windows with toxic green and magenta practical lights, damp stone and oily wear, Arcane-inspired painterly realism, believable human scale, modular street-facing facade, game-ready PBR, no people, no logos, no readable text.

**Zaun — fábrica/tuberías**
> Industrial undercity factory prop set, thick worn metal pipes with valves, pressure gauges, rivets, exhaust ducts, hanging cables, chemical glass tanks, soot, rust and green chemical glow, dense layered silhouette, physically plausible connections, modular pieces that can join seamlessly, PBR materials, optimized for real-time game use, no people, no logos, no text.

La fidelidad nace sobre todo de la **composición y los materiales del escenario completo en Blender**: los activos generados no conocen la distribución de los barrios ni las ubicaciones de la historia. No uses una generación 3D como ciudad final sin rehacer la escala, los empalmes, las calles transitables, la iluminación y los detalles característicos.


## Flujo recomendado con IA para generar el escenario completo

La opción prioritaria para **probar una ciudad completa a partir de referencias** es [World Labs Marble](https://marble.worldlabs.ai/): acepta texto, imágenes y panoramas y permite explorar el mundo generado. Su documentación describe exportación de Gaussian splats y mallas trianguladas; el tipo de exportación disponible depende del plan. Para el juego, el objetivo final sigue siendo una malla/escena que podamos limpiar en Blender y exportar como GLB. No des por hecho que cualquier descarga de Marble sea un GLB listo para Three.js.

Alternativa para generar mundos desde una imagen o prompt: [SpAItial](https://spaitial.ai/), que anuncia mundos navegables, edición y exportación en varios formatos. Comprueba el formato exacto y los límites de exportación antes de invertir tiempo.

Para **piezas sueltas**, no ciudades enteras:
- [Tripo](https://www.tripo3d.ai/product-doc/model-generation/image-to-3d): convierte una imagen de referencia en un objeto 3D; sirve para torres, puentes, fachadas, maquinaria y atrezo.
- [Meshy](https://docs.meshy.ai/en): genera modelos desde texto o imágenes y admite flujos de exportación; es adecuado para activos modulares que después se ensamblan.

### Procedimiento de producción

1. Usa arte de referencia de varias vistas por ciudad: vista panorámica, nivel de calle, arquitectura característica y un plano cenital aproximado. No envíes un collage con Piltover y Zaun mezclados como si fuese una sola escena.
2. Genera en Marble una primera versión navegable de Piltover y otra independiente de Zaun. Pide una vista amplia y calles/terrazas conectadas. La IA produce un primer borrador, no garantiza que respete la geografía exacta de la serie ni que los edificios sean transitables.
3. Exporta la malla de mayor calidad disponible. Si solo se obtiene un Gaussian splat, no lo renombres a GLB: debe integrarse con un renderizador compatible o convertirse/reconstruirse con un proceso adecuado. Para el mapa actual, preferimos malla y materiales reales.
4. Abre la salida en Blender. Corrige escala, normales, materiales, piezas flotantes, intersecciones, calles, colisiones y huecos; elimina ruido y reconstruye zonas que la IA haya deformado. Conserva una silueta arquitectónica reconocible de cada ciudad.
5. Crea/coloca los empties `POI__<id>` de este README y alinea los puntos con `src/data/world.js`. La IA no debe mover silenciosamente lugares que usa la historia.
6. Exporta a `piltover.glb` o `zaun.glb` con texturas embebidas. Optimiza la malla y las texturas para el rendimiento en Windows y dispositivos modestos.
7. Valida la escala con la geometría real de los avatares. El código de avatars3d.js usa actualmente una altura objetivo de 22 unidades de mundo, pero debe contrastarse con los GLB antes de fijar la escala definitiva: cámara cenital, media altura y nivel de calle; comprueba también los niveles de zoom mínimo/máximo. La escala final del avatar del juego debe ajustarse a los datos reales de los modelos, no solo al tamaño nominal de la malla.
8. Coloca después NPC y guardias como entidades dinámicas del juego, no como parte fija de la malla estática. Distribuye residentes de forma determinista por zonas transitables, excluye agua/tejados y evita puntos de historia, entradas y bloqueos.
9. Prueba ambas ciudades dentro del juego. Solo entonces considera listo el mapa; una previsualización bonita de la IA no demuestra que el GLB sea funcional, ligero ni jugable.

### Referencias visuales y derechos

- [Arte y proceso de Arcane — Fortiche](https://forticheprod.com/blog/the-art-and-making-of-arcane-artbook-arcane/)
- [Material oficial de Zaun — League of Legends Wiki](https://wiki.leagueoflegends.com/en-us/Zaun)
- [Arte de producción de Zaun con créditos de autoría](https://wiki.leagueoflegends.com/en-us/File%3AZaun_Characters_Arcane_Model_01.jpg)

Usa estas imágenes para estudiar siluetas, iluminación y materiales. No asumas que una imagen de la serie se puede redistribuir en el juego por el mero hecho de estar en Internet; revisa la política de Riot y la licencia de cada recurso. La referencia final debe guiar una reconstrucción original de fan art, no prometer una réplica exacta generada automáticamente.

## Exportar y validar

Con Blender instalado, abre el .blend de la ciudad y ejecuta desde la raíz del repositorio:

```powershell
blender -b piltover.blend --python tools/blender/export_arcane_map.py -- --city piltover --output src/models/maps/piltover.glb
blender -b zaun.blend --python tools/blender/export_arcane_map.py -- --city zaun --output src/models/maps/zaun.glb
```

El script **no crea edificios, materiales ni mallas**. Solo valida una escena modelada y exporta la colección `CITY_WORLD`. Revisa las licencias de cada activo antes de incluirlo en el fangame.

### Nota sobre el estado del repositorio

Este cambio hace que el runtime acepte únicamente escenarios GLB completos y apague la generación arquitectónica procedural. Los dos archivos de ciudad todavía deben crearse y añadirse al repositorio con Blender; hasta entonces el juego usa el mapa 2D existente en vez de volver a dibujar ciudades con formas geométricas.


## Referencias de lore, imágenes y diseño del mapa

No uses una única imagen como textura del mapa ni copies una captura como si fuese una malla. Reúne referencias separadas por ciudad y por tipo de espacio: panorámica, nivel de calle, fachadas, interiores, conexiones verticales, cultura y tecnología.

### Piltover
- Universo oficial: https://universe.leagueoflegends.com/en_US/region/piltover/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver
- Visual: metrópolis costera sobre acantilados, puertas marítimas y comercio, avenidas/plazas, piedra clara, oro/latón, cobre patinado, tejados ornamentados, torres, balcones, cúpulas, Academia, Consejo, talleres e instalaciones Hextech.
- Cultura: comercio, estatus, academias, innovación, clanes influyentes y fe en el progreso; también debe notarse la desigualdad respecto a Zaun.
- Hextech: cristales/energía mágica integrados en dispositivos refinados y precisos, no runas decorativas aleatorias.

### Zaun
- Universo oficial: https://universe.leagueoflegends.com/en_US/region/zaun/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Zaun
- Visual: cañones y fisuras inferiores, niveles verticales, pasarelas, ascensores, escaleras y puentes, hierro remachado, vidrio coloreado, tuberías corroídas, mercados, talleres, bares, canales y humo industrial. Luces verdes, cian y magenta como acentos, no una capa de neón que lo cubra todo.
- Cultura: inventiva, comunidad, expresión personal, mercados, música, santuarios, redes informales, rivalidad industrial y barones químicos. No representar solo pobreza, violencia y fábricas.
- Shimmer/Brillo: sustancia peligrosa asociada a producción, contrabando, poder, dependencia y efectos físicos. Mostrar laboratorios, recipientes, depósitos, señales de riesgo y control territorial cuando la historia lo justifique; no convertirlo en decoración omnipresente.
- Diferenciar quimtec (industrial, experimental, corrosiva y a menudo improvisada) de Hextech (cristales/energía mágica, ingeniería más refinada).

### Acceso y geografía común
- Piltover está arriba; Zaun se extiende por fisuras y niveles inferiores. Mostrar conexiones verticales y horizontales: puentes, rampas, escaleras, ascensores/descensores, pasarelas, túneles y estaciones.
- El Puente del Progreso debe ser un hito reconocible y políticamente cargado, no un decorado genérico.
- Cada acceso tiene origen, destino y condición narrativa. Evitar puertas que den a paredes o viajes sin transición.
- La estética de Arcane es la referencia primaria. Las wikis pueden mezclar continuidades de Runeterra; registrar contradicciones en lugar de fusionarlas sin criterio.

### Mapa 2D y versión 3D
- Referencia visual aportada por la autora: https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298
- El agente debe abrir la referencia en su navegador. Si no carga, pedir a la autora una captura; no inventar lo que muestra.
- El mapa 2D debe seguir siendo legible y jugable: distritos, etiquetas, accesos, POI y rutas claras. El 3D debe representar la misma geografía en volumen real, alineado con IDs y coordenadas de src/data/world.js.
- El mapa 2D y el 3D deben compartir una sola fuente de verdad para lugares, misiones, accesos y estado desbloqueado.


## Referencia artística, mapa 2D y producción con IA (actualización)

### Fuentes para estudiar antes de generar
- [Piltover — universo oficial](https://universe.leagueoflegends.com/en_US/region/piltover/) y [galería de imágenes](https://universe.leagueoflegends.com/en_US/region/piltover/?mv=image-gallery).
- [Zaun — universo oficial](https://universe.leagueoflegends.com/en_US/region/zaun/) y [galería de imágenes](https://universe.leagueoflegends.com/en_US/region/zaun/?mv=image-gallery).
- [Piltóver en Fandom (español)](https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver) y [Zaun en Fandom (español)](https://leagueoflegends.fandom.com/es/wiki/Zaun).
- [Referencia visual oficial de Zaun](https://cmsassets.rgpub.io/sanity/images/dsfx7636/universe/d7858e6a65fed5e14321604dbde4f144640bd795-1920x1067.jpg).
- [Referencia visual de Piltover](https://cdn.oneesports.gg/cdn-data/2023/09/LeagueofLegends_Piltover_VisionsofProgress.jpg).
- [Composición/mapa de referencia indicado por la autora](https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298). Si el agente no puede abrirlo, pedir a la autora una captura; no afirmar que lo ha visto.

### Dos representaciones coordinadas: mapa 2D y escenario 3D
- El **mapa 2D** debe ser una vista superior estilizada y legible, con contorno real de distritos, calles, niveles, puentes, puertas y puntos de interés. No debe ser un tablero genérico con botones dispersos. Diferenciar Piltover (marfil/azul/oro) y Zaun (carbón/verde químico/magenta), e indicar alturas y accesos entre niveles.
- El **escenario 3D** debe corresponder a esa misma geografía: calles, edificios y puentes deben encontrarse donde indica el mapa 2D. Las localizaciones se vinculan mediante IDs/POI de src/data/world.js; el mapa no puede inventar ubicaciones sin registrarlas en datos.
- Mantener una única fuente de verdad para nombres, coordenadas, accesos, misiones y bloqueos. El mapa 2D no es un reemplazo del 3D, y el 3D no debe perder la función de navegación clara del mapa 2D.
- El acceso Piltover↔Zaun debe expresarse mediante pasos, escaleras, ascensores/descensores, controles y puentes según la geografía; el Puente del Progreso tiene peso cultural y narrativo, no es un simple portal.

### Herramientas: qué hace cada una
1. **Marble** — https://marble.worldlabs.ai/ : crear prototipos de mundos explorables a partir de prompts e imágenes. Confirmar qué exportación está disponible en la cuenta. Un Gaussian Splat no equivale a una malla convencional con colisiones.
2. **SpAItial** — https://spaitial.ai : crear mundos desde texto/imágenes y comprobar qué formatos de exportación están disponibles en la sesión. Elegir salida de malla convencional cuando se necesite editar/exportar a GLB.
3. **ComfyUI** — https://docs.comfy.org/ : usar para producir moodboards y referencias de estilo consistentes, vistas cenitales, materiales, fachadas, iluminación y hojas de referencia. Cada workflow depende de modelos y nodos instalados; no asumir que ComfyUI por sí solo genera una ciudad GLB completa.
4. **Open3D Viewer** — https://open3d.app/glb-viewer : abrir localmente los GLB, rotarlos, revisar PBR y reproducir animaciones incluidas. No sustituye Blender ni prueba las colisiones del juego.
5. **Blender** — corrección artística/técnica, pivotes, materiales, escala, organización de POI, zonas de colisión y exportación final.
6. **Freebuff** — coordinar agentes y revisar integración de código. Para una persona que no programa, pedir primero análisis y plan, después cambios en ramas separadas, pruebas y pasos explicados en lenguaje sencillo. No dar permiso automático para mergear o borrar ramas.

### Flujo recomendado para la autora (sin necesidad de programar)
1. Abrir en el navegador la referencia de Neta y guardar una captura de pantalla del mapa 2D que se desea imitar en composición; si se utiliza una imagen de terceros, mantenerla como referencia y no incluirla directamente en la distribución sin permiso.
2. En ComfyUI, crear una carpeta de referencias para Piltover y otra para Zaun. Generar vistas de arriba, calle, horizonte y materiales; mantener paleta y arquitectura consistentes entre imágenes. Guardar prompts y workflow junto a las imágenes.
3. Generar una ciudad por separado en Marble y/o SpAItial. No mezclar ambas ciudades en un único mundo. Comparar resultados con las referencias y elegir la base más coherente y editable.
4. Descargar el formato de salida disponible y abrirlo en Open3D Viewer para inspección inicial. Si no es GLB/GLTF convencional, anotar formato exacto y no sobrescribir los GLB del juego.
5. Si el resultado es una malla compatible, importarla a Blender con ayuda guiada de Freebuff, corregir geometría, escala, suelo, materiales y calles; alinear POI con src/data/world.js y exportar a una carpeta temporal.
6. Validar la copia en Open3D Viewer y solo entonces sustituir el archivo de prueba. Ejecutar npm run check y probar en el juego antes de proponer la PR.
7. Si no sabes hacer un paso en Blender, pedir a Freebuff una instrucción por turno, con nombres exactos de menús/botones y una comprobación visible al final. No ejecutar comandos destructivos ni reemplazar archivos fuente sin copia de seguridad.

### Prompt de agente de mapas
> Audita el repositorio y las referencias visuales antes de tocar archivos. Usa Marble y SpAItial para explorar/generar dos escenarios separados; usa ComfyUI para producir referencias consistentes de estilo y Open3D Viewer para revisar los GLB localmente. La referencia de Neta debe consultarse si es accesible; si no, pide captura. Respeta la diferencia cultural entre Piltover (comercio, artesanía, arquitectura de mármol/latón/vidrio, hextech azul-dorada) y Zaun (niveles subterráneos, hierro/vidrio, mercados, quimtec, shimmer, humo y luces químicas). El mapa 2D y la escena 3D deben coincidir en geometría, accesos y POI. No generes edificios procedurales por código ni declares una salida válida sin revisar formato, mallas, escala, materiales, colisiones y resultado dentro del juego. No sobrescribas archivos fuente, no hagas push/merge ni abras PR sin autorización. Explica cada paso para una usuaria que no programa.
