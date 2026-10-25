# Guía de modelos 3D para Arcane-fangame

Esta guía explica cómo preparar e integrar modelos 3D sin asumir que el juego ya dispone de un renderizador 3D completo. El personaje jugable se muestra actualmente mediante su retrato elegido y la interfaz del creador; no reemplaces esa ruta por un modelo 3D obligatorio.

## 1. Preparar el recurso

- Usa modelos propios, con licencia compatible y procedencia documentada. No incluyas modelos extraídos de juegos comerciales sin permiso.
- Formato recomendado para intercambio: GLB/glTF 2.0. Conserva una copia editable del proyecto fuente fuera del paquete final.
- Mantén materiales PBR simples, texturas comprimidas y nombres de huesos consistentes.
- Para personajes, prepara una versión de prueba ligera (objetivo inicial: 20–40 mil triángulos, texturas de 1K y pocas luces). Son límites iniciales, no requisitos universales.

## 2. Dónde colocar los archivos

1. Crea una carpeta con nombre descriptivo bajo `src/assets/3d/` (por ejemplo, `src/assets/3d/oc-principal/`).
2. Añade un `README.md` junto al recurso con autoría, licencia, formato, escala, controles de animación y fuente.
3. No sobrescribas `src/img/arte/` ni las galerías de retratos: el modelo 3D es un recurso adicional.
4. Revisa `package.json`, la configuración de empaquetado y el constructor web antes de añadir archivos grandes; confirma que se incluyan en Windows, Android y web.

## 3. Integración recomendada por etapas

1. **Visor aislado:** crea una pantalla de prueba que cargue un GLB local y muestre un error claro si falta o no puede decodificarse.
2. **Controles:** permite rotación con ratón y táctil, limita el zoom y ofrece una alternativa accesible con botones.
3. **Animaciones:** empieza con idle y caminar; las animaciones no deben bloquear la narración ni la entrada del jugador.
4. **Rendimiento:** limita resolución, sombras, luces dinámicas y memoria de texturas; prueba en un Android de gama media y en escritorio.
5. **Fallback 2D:** si WebGL falla, el recurso no carga o el dispositivo es lento, conserva el retrato 2D y el juego narrativo.
6. **Pruebas de paquete:** valida rutas relativas en desarrollo, build web, Electron y Android. No uses rutas absolutas del ordenador del desarrollador.

## 4. Comprobaciones antes de fusionar

- [ ] El modelo y sus texturas cargan desde una instalación limpia.
- [ ] No hay errores de consola ni recursos 404.
- [ ] El menú, el creador, el chat y la partida siguen funcionando si se desactiva el visor.
- [ ] Ratón, teclado y táctil pueden usar los controles disponibles.
- [ ] Se documentan dispositivo probado, tamaño del archivo y licencia.
- [ ] Se conserva una alternativa 2D y movimiento reducido cuando corresponda.

## Estado

Esta guía es un plan de integración. No afirma que el juego ya incluya un motor 3D ni que exista una pantalla de visor terminada. La primera implementación debería ser un prototipo aislado antes de cambiar el creador o las escenas principales.
