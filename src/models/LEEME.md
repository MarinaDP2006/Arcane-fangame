# Modelos 3D incluidos con el juego

> **En pocas palabras:** Esta carpeta contiene modelos o recursos que el código utiliza para mostrar contenido 3D. Antes de añadir archivos grandes, revisa el formato, el tamaño, la licencia y cómo se cargan. Un modelo puede existir en el repositorio y aun así fallar por materiales, escala, orientación o incompatibilidad.

Pon aquí archivos `.glb` para que vayan dentro del instalador y de la app de Android.
Los mismos nombres que en la carpeta `modelos` de tu carpeta de arte:

- `vi.glb`, `jinx.glb`, `caitlyn.glb`… (un archivo por personaje)
- `jugador.glb` (tu personaje) y `generico.glb` (quien no tenga modelo propio)
- `animaciones/reposo.glb`, `animaciones/andar.glb`, `animaciones/correr.glb`

Si no hay ninguno, el juego usa sus muñecos pintados. Más detalles en el README («Personajes en 3D»).

## Escenarios urbanos 3D (Blender/GLB)

Los escenarios completos de ciudad van en `maps/piltover.glb` y `maps/zaun.glb`. Estos archivos deben ser entornos urbanos completos preparados en Blender: edificios, calles, terreno, materiales y luces ambientales. El renderizador ya no genera arquitectura procedural en Three.js; si falta el GLB de una ciudad, se utiliza el mapa ilustrado 2D hasta que el activo real se incorpore.

Consulta `src/models/maps/README.md` y `tools/blender/export_arcane_map.py`. El exportador valida una escena existente y **no genera edificios ni mallas**.
