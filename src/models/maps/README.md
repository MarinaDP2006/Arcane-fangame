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

1. Compón los barrios en Blender a partir de activos 3D detallados (fachadas, torres, tejados, puentes, escaleras, tuberías, maquinaria y atrezo) y texturas PBR. Puedes usar Meshy o Tripo para generar piezas a partir de texto, pero corrige su malla, escala, orientación y materiales en Blender.
2. No intentes crear toda la ciudad con una sola generación de texto a 3D. Trabaja por conjuntos arquitectónicos y compón una escena continua en Blender: las calles deben conectar, los edificios tener escala consistente y los puntos de aparición quedar transitables.
3. Para Piltover, prioriza arquitectura art nouveau dorada, piedra clara, balcones, cúpulas, agujas, puentes monumentales y grandes desniveles sobre nubes. Para Zaun, crea una ciudad vertical de hierro oxidado, pasarelas, chabolas, tuberías industriales, neones, humo ambiental y callejones estrechos bajo una bóveda rocosa.
4. Crea y coloca un empty `POI__<id>` por cada lugar, usa la tabla de coordenadas de `tools/blender/export_arcane_map.py` y ejecuta la exportación de validación.
5. Revisa a vista cenital, altura de calle y zoom cercano. Confirma que personajes y guardias se distingan frente a fachadas, que no haya fachadas gigantes en proporción y que los puntos sean accesibles.


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
7. Valida la escala con una figura humana de referencia de 1,7 unidades de altura (aproximación de producción): cámara cenital, media altura y nivel de calle; comprueba también los niveles de zoom mínimo/máximo. La escala final del avatar del juego debe ajustarse a los datos reales de los modelos, no solo al tamaño nominal de la malla.
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
