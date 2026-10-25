# Pendientes de la rama de Arcane
Lista viva de lo que falta en el fangame de Arcane. Lo del mundo nuevo va en el repo RIFTS-GEARS.
Marca con `[x]` lo que se vaya cerrando.

## Historia libre con IA
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
- [ ] Integrar Ollama de verdad en el juego (proveedor, ajustes, estado de conexión y pruebas); hasta entonces `config/ollama.json` sigue desactivado y el chat de IA de escritorio continúa usando KoboldCpp.
- [ ] Probar la reproducción real de `assets/music/sucker-instrumental.mp3.mp3` (Zaun) y `assets/music/a-bicentennial-instrumental.mp3` (Piltover) en una ejecución del juego. Las rutas están configuradas, pero falta verificar la reproducción en ejecución.
