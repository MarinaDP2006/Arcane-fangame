# Guía para reconstruir la web desde cero
## 1. Estructura recomendada

```text
web/
├── index.html                 # Punto de entrada 
├── privacidad.html            # Política de privacidad independiente
├── css/
│   └── estilos.css            # Estilos de la web, no del juego
├── js/
│   ├── app.js                 # Arranque y navegación general
│   └── componentes/
│       ├── menu.js
│       └── dialogos.js
├── pages/
│   ├── ciudades.html
│   ├── personajes.html
│   └── como-jugar.html
├── assets/
│   ├── img/
│   │   ├── ciudades/
│   │   ├── personajes/
│   │   └── interfaz/
│   ├── video/
│   └── audio/
└── archivo/
    └── index-anterior.html    # Referencia antigua, no publicar como home
```

Los recursos artísticos que ya existen en `web/arte-oficial/`, `web/arte-propio/` y `web/fuentes/` se conservan de momento para no romper rutas de otros archivos. Cuando se muevan, hay que actualizar **todas** sus referencias antes de borrar las carpetas antiguas.

## 2. Crear el HTML principal


Esqueleto inicial sugerido (cópialo cuando quieras empezar a rellenar el index):
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#101319">
  <title>Nombre del proyecto</title>
  <link rel="stylesheet" href="css/estilos.css">
  <script src="js/app.js" defer></script>
</head>
<body>
  <header class="cabecera"></header>
  <main id="contenido"></main>
  <footer class="pie"></footer>
</body>
</html>
```

## 3. Convención de nombres
- Archivos y carpetas en minúsculas, sin espacios ni tildes: `como-jugar.html`, `personajes/`, `menu-principal.js`.
- Una responsabilidad por archivo; evita nombres vagos como `misc.js`, `final2.css` o `nuevo.html`.
- `web/css/` contiene solo estilos de la web. Los estilos del juego permanecen en `src/css/`.
- `web/js/` contiene código exclusivo de la web. El motor del juego permanece en `src/js/`.
- `web/assets/img/ciudades/` guarda imágenes clasificadas por ciudad; usa nombres como `piltover-panoramica.webp`.
- No dupliques la misma imagen si se puede reutilizar; optimiza imágenes grandes a WebP/AVIF y conserva proporciones.
- No guardes claves privadas, tokens ni secretos en JavaScript del navegador.

## 4. Cómo trabajar por fases
1. **Base:** HTML semántico, estilos globales, variables de color y tipografía.
2. **Diseño adaptable:** móvil primero; después tablet y escritorio con Grid/Flexbox.
3. **Componentes:** cabecera, botones, tarjetas, galerías y pie.
4. **Contenido:** textos revisados, fichas de personajes y lugares.
5. **Interacción:** solo funciones que realmente estén conectadas.
6. **Accesibilidad y rendimiento:** contraste, foco visible, `prefers-reduced-motion`, imágenes optimizadas y carga diferida.
7. **Pruebas:** comprobar enlaces, imágenes, consola, teclado y anchos de 360, 768, 1280 y 1440 px.
