# PENDIENTES.md — Estado y hoja de ruta actual

**Última revisión: 27 de octubre de 2026 · Versión del juego: 1.30.3**

Este documento describe la versión actual de `main`. No uses las instrucciones antiguas de ramas históricas para decidir el alcance actual. El mapa de exploración es **2D**; los minijuegos son experiencias separadas en **3D/WebGL**. La integración de IA no forma parte de la partida actual.

## Estado comprobado en el repositorio

- [x] La portada pública está separada del juego y no incluye una demo jugable.
- [x] La web se prepara en `web-dist/`; Render está definido por `render.yaml` y sirve `web-dist/` con `server/roleplay-server.js`.
- [x] El favicon canónico vive en `web/icono-arcane.svg`; `scripts/art-manifest.js` mantiene sincronizado `src/icono-arcane.svg` para el ejecutable.
- [x] El mapa 2D incluye Piltover y Zaun conectadas por el Puente del Progreso.
- [x] La historia y los diálogos son escritos y pueden ejecutarse sin proveedor de IA.
- [x] El diario de misiones contiene objetivos por temporada, personajes, afinidad y confianza.
- [x] El motor de historias secundarias incluye seis tramas ramificadas con decisiones, consecuencias y progreso guardado.
- [x] El catálogo tiene 15 desafíos 3D, 7 de Piltover y 8 de Zaun. Cada desafío se ofrece desde la ciudad que le corresponde.
- [x] Hay comprobaciones de datos/sintaxis y compilación automática de Windows.
- [x] La ejecución de Actions de `main` #40413308675 terminó correctamente y publicó el artefacto `arcane-fangame-1.30.3-windows-x64` (276.754.679 bytes, enlace temporal hasta el 9 de noviembre de 2026).
- [~] El rediseño de la interfaz se ha ampliado, pero aún necesita una prueba visual/manual completa en escritorio y móvil.
- [~] Los minijuegos 3D ya están implementados como retos WebGL con geometría y controles propios; falta probar manualmente los 15 modos, dispositivos modestos y rutas de victoria/derrota.
- [ ] La configuración de Render existe en el repositorio, pero el estado de despliegue del servicio alojado debe confirmarse en el panel o con `/api/health` después de cada despliegue. Una ejecución de GitHub Actions no demuestra que Render esté sirviendo el último commit.

## Prioridad P0 — Web, arte y Render

- [ ] Fusionar y validar la PR actual de recursos web antes de asumir que los nuevos directorios están en producción.
- [ ] Verificar que `npm run check:web` genera `web-dist/` y confirma todas las imágenes enlazadas desde la portada.
- [ ] Confirmar que las imágenes de `PILTOVER.zip` y `ZAUN.zip` se ven en la web en Linux/Render, con rutas estables en minúsculas donde corresponda.
- [ ] Confirmar que `web/index.html` usa el favicon de `web/icono-arcane.svg` y que el paquete de escritorio sincroniza ese mismo origen.
- [ ] Tras la fusión, comprobar el deploy de Render, la portada y `/api/health`. Si falla, corregir el build/start command del servicio enlazado; el repositorio por sí solo no permite inspeccionar el panel de Render.
- [ ] Mantener la web como sitio informativo. No volver a publicar un HTML de demo, un iframe de juego ni recursos de desarrollo que no sean usados por la portada.
- [ ] Conservar créditos y fuentes en `arcaneData/arte/FUENTES.json`. No borrar los originales artísticos ni las referencias aportadas.

## Prioridad P0 — Prueba jugable del juego actual

- [ ] Descargar el artefacto de Windows desde Actions (instrucciones en el README) e instalarlo en una máquina Windows limpia.
- [ ] Probar inicio, selección de ciudad, creación del personaje, diálogo, cada tipo de decisión, cierre, guardado, recarga y continuación.
- [ ] Comprobar que las relaciones guardan afinidad, confianza y estado (amistad, mejores amigos, pareja/familia cuando cumpla sus requisitos) y que no ofrecen romance en situaciones no permitidas.
- [ ] Probar las seis historias secundarias, guardar a mitad de trama, reabrir y confirmar que restaura el paso y las elecciones.
- [ ] Probar los 15 minijuegos, con teclado y puntero/táctil, validando éxito, derrota, reintento, salida, ciudad correcta y retorno a la historia.
- [ ] Confirmar que el mapa principal sigue siendo 2D y que los minijuegos abren una vista 3D separada; si WebGL no está disponible, mostrar un mensaje de fallo entendible sin congelar la partida.
- [ ] Probar todas las rutas del Atlas y los puntos de interés. No declarar correcta una imagen solo porque existe: comprobar que coincide con su lugar y que se carga en el empaquetado.
- [ ] Repetir `npm run check`, `npm run check:web` y la compilación de Windows después de cada cambio significativo.

## Prioridad P1 — Hacer crecer el juego sin inflarlo artificialmente

- [ ] Añadir escenas y consecuencias reales a las misiones que todavía son solo objetivos del diario.
- [ ] Completar la progresión de relaciones con escenas específicas y pruebas de extremos (afinidad negativa, confianza insuficiente, personaje inaccesible y partida antigua).
- [ ] Profundizar la identidad jugable de cada uno de los 15 minijuegos con recursos propios, objetivos claros, animación, sonidos y dificultad ajustada por ciudad.
- [ ] Seguir ampliando arte y audio únicamente cuando se utilicen en el juego. No añadir archivos vacíos, duplicados o relleno para alcanzar un peso objetivo.
- [ ] Revisar tamaños y rendimiento del instalador. La compilación actual publicada por Actions ronda 276,8 MB en el paquete descargable; supera los 300 MB solo si contenido real adicional lo justifica, no por relleno.
- [ ] Actualizar documentación y capturas después de probar la versión real. Identificar las capturas antiguas como históricas y no presentarlas como la interfaz actual.

## Cómo se consideran terminadas las tareas

- `[x]`: implementado y verificado por una comprobación fiable.
- `[~]`: implementado parcialmente o pendiente de prueba manual.
- `[ ]`: pendiente.

Una configuración de despliegue no demuestra que el servicio esté activo. Un catálogo no demuestra que todos sus retos sean divertidos/estables; hay que jugarlos. Un archivo de imagen no demuestra que se cargue desde el ejecutable o desde Render.
