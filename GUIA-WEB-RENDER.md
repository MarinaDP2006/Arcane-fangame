# Web oficial en Render

La web pública es un **Web Service** de Node independiente del ejecutable del juego: `scripts/build-web.js` monta la página en `web-dist/` y `server/roleplay-server.js` la sirve en el puerto que da Render (`PORT`). No hacen falta variables secretas.

## Ajustes del servicio en Render

En el panel de Render, servicio **Arcane-fangame** → **Settings**:

| Campo | Valor |
| --- | --- |
| Repository / Branch | `MarinaDP2006/Arcane-fangame` / `main` |
| Runtime | Node |
| Build Command | `node scripts/build-web.js` |
| Start Command | `node server/roleplay-server.js` |
| Health Check Path | `/api/health` |
| Environment → `NODE_VERSION` | `22` (opcional) |

Guarda y pulsa **Manual Deploy → Deploy latest commit**. La web queda en `https://arcane-fangame.onrender.com` y la demo en `/demo.html`.

Si el servicio se queda con los valores antiguos (`npm install` y `node main.js`) también funciona: fuera de Electron, `main.js` monta la web y arranca el mismo servidor. Pero `npm install` descarga Electron y el despliegue tarda más.

Alternativa: **New → Blueprint** con este repositorio crea un servicio nuevo con `render.yaml` (mismos comandos).

En el plan Free el servicio se duerme tras unos minutos sin visitas; la primera visita tarda en despertar.

## IA en la demo

La única IA es KoboldCpp en tu ordenador. La web no la lleva dentro: el navegador del jugador habla directamente con su KoboldCpp. Cómo conectarla (localhost o túnel https): ver [GUIA-KOBOLDCPP.md](GUIA-KOBOLDCPP.md#en-la-web-demo-de-render).

## Capturas históricas de todas las versiones

Sube tus imágenes reales a **`/capturasjuego/`** en la raíz del repositorio, siguiendo [su guía](capturasjuego/README.md). Se copiarán automáticamente a Render y aparecerán en la galería. No se inventarán capturas de versiones antiguas.

## Capturas oficiales

Añade archivos reales en `web/capturas/` con estos nombres y extensiones `.webp`, `.png`, `.jpg` o `.jpeg`:

- `inicio`: menú inicial
- `creacion`: editor del personaje
- `comunicador`: solo interfaz, sin mensajes ni conversaciones
- `mapa`: vista general
- `codice`: interfaz del códice sin revelaciones argumentales

El generador solo publica las capturas existentes y no inventa imágenes. Antes de subir una captura del comunicador, oculta nombres privados, mensajes y cualquier spoiler. Para comprobar localmente: `node scripts/build-web.js`.

**Alcance:** la eliminación de referencias a IA se aplica a la web promocional, no al código del videojuego.
