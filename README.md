# Rifts & Gears · Fangame de Arcane

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o Zaun y escribes lo que dice o hace. Los personajes responden dentro del canon de la serie.

## Cómo funciona

1. **Creación de personaje:** nombre, pronombres, ciudad, oficio y trasfondo escrito por ti.
2. **Rol libre:** el jugador escribe; la historia y los personajes reaccionan sin opciones prefabricadas.
3. **IA local:** KoboldCpp carga un modelo Qwen o Llama GGUF en tu PC. La dirección LAN predeterminada para esta instalación es `http://192.168.1.139:5001` (API OpenAI: `http://192.168.1.139:5001/v1`). Si Windows cambia la IP, actualiza Ajustes → IA.
4. **PC, móvil y tablet:** el juego instalado usa la IP del PC en la red de casa. Para la demo web en Render/HTTPS, Chrome moderno puede pedir el permiso **Acceso a la red local**. No usamos Remote Tunnel ni Cloudflare. Si un navegador no permite esta conexión, usa el juego instalado o una web servida en tu red local.

Pasos en [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md).

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
- [KoboldCpp: Qwen/Llama en PC y LAN](GUIA-KOBOLDCPP.md)
- [Releases y compilaciones](docs/RELEASES-ARCANE.md)

## Enlaces del proyecto

- [Releases](https://github.com/MarinaDP2006/Arcane-fangame/releases)
- [Problemas / Issues](https://github.com/MarinaDP2006/Arcane-fangame/issues)

## Aviso legal

Proyecto de fans gratuito y no respaldado por Riot Games. Arcane, League of Legends, Piltover, Zaun, sus personajes y su arte pertenecen a sus respectivos propietarios. El código está bajo licencia MIT, que no concede derechos sobre marcas ni personajes de terceros.
