# Auditoría de alcance y criterios de aceptación

Esta lista separa los recursos/datos que se pueden validar automáticamente de los comportamientos que aún requieren jugar la aplicación. Un workflow verde **no equivale** a una prueba visual o de jugabilidad completa.

## Comprobado automáticamente

- [x] Dos rutas iniciales: Piltover y Zaun.
- [x] Ruta de segunda parte/temporada.
- [x] Misiones persistentes e historias secundarias ramificadas.
- [x] Relaciones de personajes, Atlas y dos mapas explorables.
- [x] Catálogo de 15 minijuegos 3D: 7 de Piltover y 8 de Zaun, cada uno asignado a una localización.
- [x] Selección de ciudad conectada con el inicio de una nueva partida y el creador.
- [x] Escenario de la mansión Kiramman usando `src/img/arte/lugares/s2/mansion-kiramman.webp`.
- [x] Recursos locales que declara `src/index.html` presentes.
- [x] Icono SVG de la aplicación presente y enlazado por el HTML.

Estas comprobaciones se ejecutan con `npm run check` mediante `scripts/check-feature-contract.js`, además de las validaciones existentes de grafos, datos, sintaxis, escenarios e imágenes.

## Pendiente de prueba real/manual

- [ ] Abrir la compilación de Windows y probar el flujo completo: Jugar → elegir ciudad → creador → primera escena → juego.
- [ ] Probar cada botón principal, Ajustes, guardado/carga, importación/exportación y regreso al menú.
- [ ] Completar al menos una misión persistente y una historia secundaria por ciudad; verificar recompensas y que no se dupliquen al repetir acciones.
- [ ] Probar los 15 minijuegos en la aplicación empaquetada, incluyendo victoria, derrota, salida y retorno a la historia.
- [ ] Revisar visualmente los finales, las relaciones y los requisitos de decisiones en las dos rutas y en la segunda parte.
- [ ] Aplicar y verificar en el ejecutable la imagen panorámica exacta del menú que proporcionó la autora. El archivo de imagen debe incorporarse al repositorio; no debe sustituirse por un retrato aproximado.
- [ ] Confirmar que el despliegue de Render sirve el último CSS/HTML y que la portada llena la primera pantalla.
- [ ] Cuando la autora retire Ollama, eliminar referencias, IPC, dependencias/configuración y documentación que queden huérfanas; después repetir todas las comprobaciones y compilar.
- [ ] Revisar que el instalador y el portable muestran el icono correcto en Windows; Windows puede conservar caché del icono anterior.

## Criterio para declarar el juego listo

No se considera terminado solo porque el EXE exista o Actions esté verde. Deben pasar los checks automáticos, la compilación, la prueba manual de flujos y la comprobación visual del arte y las interfaces. Los problemas encontrados se registran aquí y se corrigen mediante PR antes de publicar una Release.
