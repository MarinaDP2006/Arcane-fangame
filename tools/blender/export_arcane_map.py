#!/usr/bin/env python3
"""Valida y exporta una escena urbana creada en Blender; NO genera geometría.

Uso:
  blender -b piltover.blend --python tools/blender/export_arcane_map.py -- --city piltover --output src/models/maps/piltover.glb
"""
import argparse
import sys
from pathlib import Path

import bpy

CITY_POIS = {
    "piltover": {
        "academia": (700, 400),
        "taller-jayce": (1200, 700),
        "consejo": (2200, 380),
        "ejecutores": (2650, 800),
        "mansion-kiramman": (500, 1250),
        "plaza": (1650, 1150),
        "artesanos": (2400, 1350),
        "hexpuertas": (600, 1950),
        "muelle-stillwater": (2600, 1980),
        "puente": (1500, 2110),
    },
    "zaun": {
        "puente-zaun": (1500, 90),
        "fabrica": (650, 330),
        "foso": (2450, 420),
        "tejados": (1950, 600),
        "ultima-gota": (800, 1000),
        "callejones": (1350, 1250),
        "tienda-benzo": (400, 1300),
        "mercado": (2400, 1100),
        "sumidero": (850, 1900),
        "escondite-jinx": (1750, 1950),
        "invernadero": (2090, 1660),
        "arbol": (2550, 1850),
    },
}

TOLERANCE = 4.0


def arguments():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--city", choices=sorted(CITY_POIS), required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--collection", default="CITY_WORLD")
    return parser.parse_args(argv)


def main():
    args = arguments()
    collection = bpy.data.collections.get(args.collection)
    if collection is None:
        raise SystemExit(f"ERROR: falta la colección '{args.collection}' en el .blend.")

    objects = list(collection.all_objects)
    meshes = [obj for obj in objects if obj.type == "MESH" and len(obj.data.vertices)]
    if not meshes:
        raise SystemExit(f"ERROR: '{args.collection}' no contiene mallas de escenario.")
    if len(meshes) < 12:
        print(f"AVISO: solo hay {len(meshes)} objetos-malla. Revisa si el barrio tiene suficiente detalle.")

    errors = []
    for poi_id, (x, map_y) in CITY_POIS[args.city].items():
        name = f"POI__{poi_id}"
        obj = bpy.data.objects.get(name)
        if obj is None or obj.name not in collection.all_objects:
            errors.append(f"falta el empty {name}")
            continue
        p = obj.matrix_world.translation
        expected = (float(x), float(-map_y), 0.0)
        actual = (float(p.x), float(p.y), float(p.z))
        delta = max(abs(actual[i] - expected[i]) for i in range(3))
        if delta > TOLERANCE:
            errors.append(
                f"{name} fuera de posición: Blender {actual}, esperado {expected} "
                f"(tolerancia {TOLERANCE})"
            )
    if errors:
        print("ERROR: puntos de interés no válidos:")
        for error in errors:
            print(" - " + error)
        raise SystemExit(2)

    # Medir el contenido evaluado; se exige una escala de ciudad, no un prop aislado.
    depsgraph = bpy.context.evaluated_depsgraph_get()
    corners = []
    for obj in meshes:
        evaluated = obj.evaluated_get(depsgraph)
        for corner in evaluated.bound_box:
            corners.append(evaluated.matrix_world @ bpy.mathutils.Vector(corner) if hasattr(bpy, "mathutils") else obj.matrix_world @ bpy.context.scene.cursor.location)
    if corners:
        min_x = min(p.x for p in corners)
        max_x = max(p.x for p in corners)
        min_y = min(p.y for p in corners)
        max_y = max(p.y for p in corners)
        width = max_x - min_x
        depth = max_y - min_y
        if width < 1800 or depth < 1200:
            raise SystemExit(
                f"ERROR: escala de escenario demasiado pequeña ({width:.0f} × {depth:.0f} Blender units); "
                "esperado un barrio/ciudad cercano a 3000 × 2200."
            )
        print(f"Escenario medido: {width:.0f} × {depth:.0f} unidades Blender.")

    # Exportar solo la colección del escenario; las cámaras de trabajo y referencias ajenas
    # a CITY_WORLD no se distribuyen en el juego. No se añaden ni alteran mallas.
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]

    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(output),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_cameras=False,
        export_lights=True,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_texcoords=True,
        export_normals=True,
    )
    if not output.exists() or output.stat().st_size < 100_000:
        raise SystemExit("ERROR: el exportador no creó un GLB de escenario válido (>100 KB).")
    print(f"OK: exportado {output} ({output.stat().st_size / (1024 * 1024):.1f} MiB).")


if __name__ == "__main__":
    main()
