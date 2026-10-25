# Pendientes de la rama de Arcane

> **En pocas palabras:** Esta es la lista corta para ver qué falta por hacer en el fangame. No es una promesa de que las tareas ya estén implementadas: marca algo como terminado solo cuando el código y, cuando corresponda, una partida de prueba lo confirmen. Para el detalle de tareas de desarrollo, consulta también `docs/TAREAS-PENDIENTES.md`.
Lista viva de lo que falta en el fangame de Arcane. Lo del mundo nuevo va en el repo RIFTS-GEARS.
Marca con `[x]` lo que se vaya cerrando.

## Historia y comunicador sin IA
- [ ] Mejorar y probar diálogos escritos, opciones de conversación, fondos contextuales y consecuencias de familia en una partida completa de cada ciudad.
- [ ] No integrar Ollama ni añadir nuevos requisitos de IA durante este bloque; mantener las opciones escritas como experiencia jugable principal.

## Historia libre con IA (función preexistente y opcional; fuera del alcance de este bloque)
- [ ] Probar con KoboldCpp y un modelo real una partida completa de la ruta de Zaun y otra de la de Piltover.
- [ ] Ajustar cuántos turnos dura una escena antes de avanzar (ahora como máximo 4 o 6) según cómo se sienta jugando.
- [ ] Revisar que los finales y los minijuegos se disparan bien cuando la IA elige el camino.
- [ ] Traducir al inglés y al francés los textos nuevos de la historia libre.

## Juego
- [x] Mapa 3D: el jugador es una bola de luz (color según hombre o mujer) que salta al andar; los personajes no se animan y se giran hacia ti al acercarte.
- [x] En Android y táctil no salen las teclas del teclado.

- [ ] Verificar en una partida real la bienvenida y el contexto sin spoilers según el origen; no marcarlo completo sin probar la versión actual.
- [x] Caitlyn, Ekko y Jinx con los modelos de Nina; guardias de Piltover y el Taller de Jayce y Viktor en el mapa.
- [ ] Modelos 3D fieles para el resto del reparto (Vi, Jayce, Viktor, Mel, Silco…), que siguen siendo prototipos.
- [x] Música en MP3 (menú, Piltover y Zaun en `assets/music`).
- [ ] Volver a activar los fondos 3D de los menús cuando se arreglen sus errores gráficos.
- [x] Revisar la interfaz en el móvil (Android en horizontal) con la caja de texto nueva de la historia (v1.30.0).

## Web
- [ ] Reconstruir y validar la portada web (`web/index.html`) y comprobar que `npm run web` genera una `web-dist/` completa antes de publicar.
- [ ] Integración futura, fuera del alcance actual: Ollama requeriría proveedor, ajustes, estado de conexión y pruebas; hasta entonces `config/ollama.json` sigue desactivado y no se debe presentar como integrado.
- [ ] Probar la reproducción real de `assets/music/sucker-instrumental.mp3.mp3` (Zaun) y `assets/music/a-bicentennial-instrumental.mp3` (Piltover) en una ejecución del juego. Las rutas están configuradas, pero falta verificar la reproducción en ejecución.
