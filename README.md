# Rifts & Gears · Fangame de Arcane

Fangame gratuito y no oficial de rol libre ambientado en **Arcane** (temporadas 1 y 2). Creas tu personaje en Piltover o en Zaun y entras en la historia. No hay respuestas prefabricadas: escribes lo que tu personaje dice o hace, y los personajes de la serie te contestan, te preguntan y reaccionan como lo harían ellos, sin salirse del lore.


## Cómo funciona
1. **¿Conoces Arcane?** Antes de crear el personaje el juego lo pregunta. Si dices que no, te da una introducción breve. Si dices que sí, pasas directo a la creación.
2. **Creación de personaje:** nombre, pronombres, ciudad, oficio y lo que quieras contar de ti con tus palabras.
3. **Rol libre:** escribes y te contestan. Los personajes solo saben lo que han vivido hasta tu momento de la historia y respetan el canon de las temporadas 1 y 2.
4. **Una sola IA, KoboldCpp:** el diálogo lo genera KoboldCpp en tu PC (puerto 5001), sin internet ni claves. La tablet o el móvil lo usan por la red de casa. No hay más proveedores de IA. Pasos en [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md).

## Web y demo
La carpeta `web/` tiene la web pública del fangame, con una sección de descargas que enlaza al repositorio independiente:
- `index.html`: portada, introducción para quien no conoce Arcane, ciudades, personajes, cómo se juega y demo.
- `demo.html` + `demo-juego.js`: demo de rol libre. Escena en La Última Gota (Zaun) o en el taller de hextec de la Academia (Piltover), en la temporada 1, acto 2.
- `demo-base.json`: introducción, bloqueo de canon y escenas. Los personajes y las ciudades salen de `src/data` al generar.
- `estilos.css`, `menu.js` y `privacidad.html`.

`npm run web` genera `web-dist/`. La web no publica arte oficial de la serie.

La demo habla con KoboldCpp en ` https://review-tonight-solaris-council.trycloudflare.com/lcpp/` (en el mismo ordenador que abre la web). Si KoboldCpp no está abierto, entra un narrador local sencillo para que la escena no se quede muda.

## Desarrollo
```bash
npm ci
npm run check      # comprobaciones de datos y scripts
npm start          # versión de escritorio (Electron)
npm run web        # genera la web en web-dist/
```

`render.yaml` despliega la web en un servicio Node (`node scripts/build-web.js` y después `node server/roleplay-server.js`). El servidor solo sirve la página: no hace de puente con ninguna IA ni necesita claves.

## Estado

- **Hecho:** historia, personajes de Piltover, Zaun y Noxus, rol libre con bloqueo de canon, web y demo nuevas.
- **Prototipo:** modelos 3D de fan-art en `src/models/` (sin rig ni animaciones finales).
- **Compilación en GitHub Actions:** el workflow «Compilar Arcane» comprueba el juego y compila Windows, macOS (Intel y Apple Silicon) y Android en cada push a `main`, en cada pull request y a mano. Nada se publica solo: la Release se crea únicamente a mano marcando «publicar» ([cómo](docs/RELEASES-ARCANE.md)).

## Guías

- [Guía completa del código](GUIA.md) y [guía de juego](GUIAJUEGO.md)
- [IA local con KoboldCpp](GUIA-KOBOLDCPP.md) y [IA y campaña](GUIA-IA-Y-CAMPANA.md)
- [Prompts 3D de fan-art](docs/PROMPTS-3D-ARCANE-FAN-GAME.md)
- [Partidas guardadas](partidas-guardadas-guia.md)

## Aviso legal

Proyecto de fans gratuito, sin ánimo de lucro y no respaldado por Riot Games. Arcane, League of Legends, Piltover, Zaun y sus personajes pertenecen a Riot Games. El código está bajo licencia MIT, que no da derechos sobre esas marcas ni personajes. Consulta las [condiciones legales de Riot Games](https://www.riotgames.com/es/legal).


## IA para el juego y la web demo

La única IA del juego es **KoboldCpp** (gratis, en tu ordenador). No hay servicios en la nube, ni claves, ni otros proveedores.

- **Escritorio (Windows/macOS):** abre KoboldCpp con un modelo `.gguf`; el juego le habla en `http://localhost:5001`.
- **Android (móvil o tablet):** en Ajustes → IA escribe la dirección de tu PC en la wifi de casa, por ejemplo `192.168.1.40` (el puerto 5001 se pone solo). Mientras no la escribas, el juego usa los diálogos escritos.
- **Web y demo:** solo llegan a KoboldCpp abierto en el mismo ordenador; desde una web `https` el navegador no deja hablar con otro PC de la red.

Los pasos están en [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md).

## Publicación independiente

- [Compilar con GitHub Actions y crear releases](docs/RELEASES-ARCANE.md)
