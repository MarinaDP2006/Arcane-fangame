# Rifts & Gears · Fangame de Arcane

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o Zaun y escribes lo que dice o hace. Los personajes responden dentro del canon de la serie.

## Cómo funciona

1. **Creación de personaje:** nombre, pronombres, ciudad, oficio y trasfondo escrito por ti.
2. **Rol libre:** el jugador escribe; la historia y los personajes reaccionan sin opciones prefabricadas.
3. **Perfil de modelo local:** existe un perfil JSON para Ollama en `config/ollama.json` y un archivo independiente con el mundo de Arcane en `config/mundo.json`. El perfil está desactivado por defecto y la app aún no lo carga automáticamente; consulta [MODELOS-LOCALES.md](MODELOS-LOCALES.md).

## Web y arte

La web pública presenta la historia, ciudades, personajes y una galería de concept art oficial de Arcane. El acceso directo a la demo no aparece en la portada pública; las acciones externas allí son Releases y Problemas.

- `web/index.html`: landing page, ciudades, galería de arte y personajes.
- `scripts/build-web.js`: copia una selección de imágenes oficiales de entorno y retratos desde `src/img/arte/` a `web-dist/arte-oficial/`.
- `arcaneData/arte/FUENTES.json`: fuentes, créditos, nombres de archivos y procedencia de los recursos.
- `web/demo.html` + `web/demo-juego.js`: demo mantenida en el repositorio para desarrollo/pruebas; no enlazada desde la portada.
- `web/arte-propio/`: recursos gráficos propios de la interfaz.

`npm run web` genera la carpeta `web-dist/` con el contenido listo para Render. Las imágenes de Arcane son propiedad de Riot Games / Fortiche Production; el proyecto es un fangame no oficial.

## Desarrollo

```bash
npm ci
npm run check
npm start
npm run web
```

El workflow de GitHub Actions verifica el proyecto y compila Windows, macOS y Android. Las releases se publican manualmente; revisa los artefactos disponibles en Releases.

## Guías

- [Guía completa del código](GUIA.md) y [guía de juego](GUIAJUEGO.md)
- [Perfiles de modelos locales con Ollama](MODELOS-LOCALES.md)
- [Releases y compilaciones](docs/RELEASES-ARCANE.md)


## Enlaces del proyecto

- [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases)
- [Problemas / Issues](https://github.com/MarinaDP2006/Arcane-fangame/issues)

## Aviso legal

Proyecto de fans gratuito y no respaldado por Riot Games. Arcane, League of Legends, Piltover, Zaun, sus personajes y su arte pertenecen a sus respectivos propietarios. El código está bajo licencia MIT, que no concede derechos sobre marcas ni personajes de terceros.
