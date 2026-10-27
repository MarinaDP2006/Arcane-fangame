# Imágenes de la web

La web pública organiza sus recursos por ciudad, personajes e interfaz:

- `ciudades/piltover/`: recursos de `PILTOVER.zip`, con referencias de lugares por temporada.
- `ciudades/zaun/`: recursos de `ZAUN.zip`.
- `personajes/`: retratos WebP sincronizados desde el juego.
- `interfaz/`: favicon canónico e icono rasterizado.

El generador `npm run web` copia estos archivos a `web-dist/assets/img/`; los enlaces del sitio deben apuntar a esa estructura pública, nunca a una ruta local del repositorio que no se publique.

Consulta `web/assets/img/ciudades/README.md`, `web/assets/img/personajes/README.md` y `web/assets/img/interfaz/README.md` para detalles y créditos.
