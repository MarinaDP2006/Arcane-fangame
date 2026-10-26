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

## Exportar y validar

Con Blender instalado, abre el .blend de la ciudad y ejecuta desde la raíz del repositorio:

```powershell
blender -b piltover.blend --python tools/blender/export_arcane_map.py -- --city piltover --output src/models/maps/piltover.glb
blender -b zaun.blend --python tools/blender/export_arcane_map.py -- --city zaun --output src/models/maps/zaun.glb
```

El script **no crea edificios, materiales ni mallas**. Solo valida una escena modelada y exporta la colección `CITY_WORLD`. Revisa las licencias de cada activo antes de incluirlo en el fangame.

### Nota sobre el estado del repositorio

Este cambio hace que el runtime acepte únicamente escenarios GLB completos y apague la generación arquitectónica procedural. Los dos archivos de ciudad todavía deben crearse y añadirse al repositorio con Blender; hasta entonces el juego usa el mapa 2D existente en vez de volver a dibujar ciudades con formas geométricas.
