# Web del fangame de Arcane

> **En pocas palabras:** Esta guía trata la parte web del proyecto. Distingue los archivos fuente de la web del resultado generado para publicar; los cambios deben probarse en navegador y no solo en el editor. Si la portada está en reconstrucción, no la presentes como una web terminada hasta comprobar enlaces, imágenes, navegación y diseño adaptable.

La portada pública presenta la historia, Piltover, Zaun, los personajes y el arte oficial de referencia usado por el proyecto. No incluye un enlace público directo a la demo jugable: las únicas acciones externas del sitio son **Releases** y **Problemas**.

- `index.html`: portada, ciudades, personajes, guía y sección de arte oficial.
- `demo.html` + `demo-juego.js`: demo mantenida en el repositorio para desarrollo y pruebas; no está enlazada desde la portada pública.
- `arte-oficial/`: carpeta generada al compilar la web con imágenes de lugares y retratos procedentes de `src/img/arte/`.
- `arte-propio/`: recursos gráficos propios de la interfaz web.
- `estilos.css`, `menu.js`, `privacidad.html`.

`npm run web` crea `web-dist/`. El generador copia una selección de arte oficial ya presente en el juego a `web-dist/arte-oficial/`; las fuentes y créditos quedan documentados en `arcaneData/arte/FUENTES.json`.

Arcane © Riot Games / Fortiche Production. Proyecto de fans no oficial; las imágenes son material de referencia de sus respectivos propietarios.
