# Arcane-fangame · Piltover y Zaun

> **En pocas palabras:** Este es el punto de partida del proyecto. Aquí puedes entender qué juego es, qué puedes hacer ahora mismo, cómo ejecutarlo y dónde encontrar instrucciones más específicas. Es un proyecto de fans, no oficial, y algunas funciones —como ciertos proveedores de IA o partes de la web— siguen en preparación; por eso distinguimos entre lo que ya está disponible y lo que todavía hay que probar.

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o Zaun y escribes lo que dice o hace. Los personajes reaccionan dentro del mundo de la serie. Proyecto de fans no oficial.

## Cómo funciona

1. **Creación de personaje:** nombre, pronombres, ciudad, oficio y trasfondo escrito por ti.
2. **Rol libre:** el jugador escribe; la historia y los personajes reaccionan sin opciones prefabricadas.
3. **IA opcional:** el chat de IA del juego de escritorio usa actualmente KoboldCpp. Ollama puede seleccionarse como proveedor local experimental desde Ajustes de IA. Consulta [MODELOS-LOCALES.md](MODELOS-LOCALES.md) para instalarlo, configurar el modelo y resolver problemas de conexión. Los diálogos escritos permiten jugar sin IA.

## Web y arte

La web pública se genera con `npm run web`. La demo del repositorio se mantiene para desarrollo y pruebas y no está enlazada desde la portada. Antes de publicar, comprueba la salida `web-dist/` y las rutas de los recursos.

- `web/index.html`: landing page, ciudades, galería de arte y personajes.
- `scripts/build-web.js`: copia una selección de imágenes oficiales de entorno y retratos desde `src/img/arte/` a `web-dist/arte-oficial/`.
- `arcaneData/arte/FUENTES.json`: fuentes, créditos, nombres de archivos y procedencia de los recursos.
- `web/demo.html` + `web/demo-juego.js`: demo mantenida en el repositorio para desarrollo/pruebas; no enlazada desde la portada.
- `web/arte-propio/`: recursos gráficos propios de la interfaz.

## Guías de modelos e integración

- [Modelos locales y Ollama](MODELOS-LOCALES.md): instalación, comprobación y estado real de integración.
- [Guía de modelos 3D](GUIA-MODELOS-3D.md): formatos, rendimiento, integración por etapas y pruebas.
- [Guía de KoboldCpp](GUIA-KOBOLDCPP.md): proveedor de chat local que usa actualmente el juego de escritorio.

`npm run web` genera la carpeta `web-dist/` con el contenido listo para Render. Las imágenes de Arcane son propiedad de Riot Games / Fortiche Production; el proyecto es un fangame no oficial.

## Desarrollo

```bash
npm ci
npm run check
npm start
npm run web
```

El workflow de GitHub Actions verifica el proyecto y compila Windows, macOS y Android. Las releases se publican manualmente; revisa los artefactos disponibles en Releases.

## Mapas 2D/3D y dirección artística

- [Pendientes y prompt de Freebuff (mapas, personajes, interfaz, lore y misiones)](PENDIENTES.md)
- [Guía de escenarios 3D, Marble, SpAItial, Blender y referencias de Piltover/Zaun](src/models/maps/README.md)
- [Piltover 3D: espacios, interiores y dirección artística](PILTOVER-3D.md)
- En main existen los archivos de escenario piltover.blend, zaun.blend, piltover.glb y zaun.glb. Su integración visual, escala, colisiones, POI y rendimiento aún deben verificarse en una partida real; no se consideran validados solo por existir.

## Guías

- [IA y campaña](GUIA-IA-Y-CAMPANA.md)
- [Modelos 3D y pruebas](GUIA-MODELOS-3D-Y-PRUEBAS.md)
- [Partidas guardadas](partidas-guardadas-guia.md)

- [Guía técnica](Guía%20técnica.md) y [guía de juego](GUIAJUEGO.md)
- [Perfiles de modelos locales con Ollama](MODELOS-LOCALES.md)
- [Instrumentales por ciudad: Zaun y Piltover](docs/INSTRUMENTALES-POR-CIUDAD.md)
- [Tareas pendientes](docs/TAREAS-PENDIENTES.md)
- [Releases y compilaciones](docs/RELEASES-ARCANE.md)


## Enlaces del proyecto

- [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases)
- [Problemas / Issues](https://github.com/MarinaDP2006/Arcane-fangame/issues)

## Aviso legal

Proyecto de fans gratuito y no respaldado por Riot Games. Arcane, League of Legends, Piltover, Zaun, sus personajes y su arte pertenecen a sus respectivos propietarios. El código está bajo licencia MIT, que no concede derechos sobre marcas ni personajes de terceros.
