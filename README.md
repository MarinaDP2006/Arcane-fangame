# Arcane-fangame · Piltover y Zaun

> **En pocas palabras:** Fangame narrativo 2D de Piltover y Zaun. Esta fase prioriza escenas ilustradas, diálogos escritos y recursos locales; la integración de IA y los escenarios 3D quedan aplazados.

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o Zaun y escribes lo que dice o hace. Los personajes reaccionan dentro del mundo de la serie. Proyecto de fans no oficial.

## Cómo funciona

1. **Creación de personaje:** nombre, pronombres, ciudad, oficio y trasfondo escrito por ti.
2. **Rol libre:** el jugador escribe; la historia y los personajes reaccionan sin opciones prefabricadas.
3. **Diálogos y escenas:** juega con contenido escrito y escenarios 2D ilustrados. La integración de IA queda aplazada; no es necesaria para esta fase.

## Web y arte

La web pública se genera con `npm run web`. La demo del repositorio se mantiene para desarrollo y pruebas y no está enlazada desde la portada. Antes de publicar, comprueba la salida `web-dist/` y las rutas de los recursos.

- `web/index.html`: landing page, ciudades, galería de arte y personajes.
- `scripts/build-web.js`: copia una selección de imágenes oficiales de entorno y retratos desde `src/img/arte/` a `web-dist/arte-oficial/`.
- `arcaneData/arte/FUENTES.json`: fuentes, créditos, nombres de archivos y procedencia de los recursos.
- `web/demo.html` + `web/demo-juego.js`: demo mantenida en el repositorio para desarrollo/pruebas; no enlazada desde la portada.
- `web/arte-propio/`: recursos gráficos propios de la interfaz.

## Guías de desarrollo

- [Guía de juego](GUIAJUEGO.md): cómo jugar y usar las funciones disponibles.
- [Guía técnica](Guía%20técnica.md): estructura y ejecución del proyecto.
- [Fuentes y créditos del arte](arcaneData/arte/FUENTES.json): procedencia de las imágenes.

La integración de IA y los escenarios 3D están fuera del alcance actual. Se conservan sus archivos históricos mientras se comprueba que no haya dependencias activas.

`npm run web` genera la carpeta `web-dist/` con el contenido listo para Render. Las imágenes de Arcane son propiedad de Riot Games / Fortiche Production; el proyecto es un fangame no oficial.

## Desarrollo

```bash
npm ci
npm run check
npm start
npm run web
```

El workflow de GitHub Actions verifica el proyecto y compila Windows x64. Las releases se publican manualmente; revisa los artefactos disponibles en Releases.

## Mapas y dirección artística

- Los mapas de juego de esta fase son 2D, legibles y navegables.
- Usa `arcaneData/arte/FUENTES.json` como registro de procedencia y créditos.
- Conserva los originales y evita borrar duplicados hasta comprobar todas las referencias.

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

## Producción de arte 2D

Organiza las referencias por ciudad, lugar y temporada. Antes de integrar una imagen, comprueba que el archivo exista, que el juego use la ruta correcta y que la procedencia figure en `arcaneData/arte/FUENTES.json`. No elimines originales durante una limpieza sin verificar sus usos. Las herramientas de IA y el flujo de escenarios 3D quedan aplazados.