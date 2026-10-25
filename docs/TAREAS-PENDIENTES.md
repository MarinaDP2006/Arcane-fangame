# Tareas pendientes — Arcane-fangame

Documento vivo de seguimiento. Marca una tarea como completada solo después de verificarla en el repositorio y/o en una ejecución real del juego.

## Pendientes

### Prioridad alta — jugabilidad
- [ ] Implementar opciones de diálogo seleccionables (varias respuestas por turno) sin depender de una IA.
- [ ] Comprobar que las elecciones cambian la conversación y que existe una forma clara de continuar o volver atrás.
- [ ] Guardar y cargar por separado el estado de partida y el historial de esta historia.
- [ ] Probar el flujo completo: iniciar partida, conversar, elegir opciones, guardar, recargar y continuar.

### Ollama — opcional, no bloqueante
- [ ] Revisar y, si procede, integrar el perfil local de Ollama; actualmente la configuración está desactivada y no implica integración automática.
- [ ] Revisar la propuesta de modelos separados en el PR [#38](https://github.com/MarinaDP2006/Arcane-fangame/pull/38). El modelo de Arcane debe mantenerse aislado del universo de Las ciudades del Umbral.
- [ ] Probar la selección del modelo y los errores de conexión sin impedir jugar sin IA.
- [ ] No guardar el historial de la historia dentro del modelo: persistirlo en los datos de la partida.

### Interfaz, compatibilidad y publicación
- [ ] Revisar el comportamiento del parallax del título: desactivar el movimiento por puntero y conservar la navegación por clic en las ciudades (PR #36, pendiente de revisión).
- [ ] Ejecutar pruebas en escritorio y móvil: imágenes, ventanas, navegación entre ciudades y controles.
- [ ] Revisar consola, errores de carga y rutas de recursos.
- [ ] Generar y verificar una compilación/publicación reproducible.
- [ ] Limpiar y actualizar la documentación antigua, eliminando instrucciones obsoletas y señalando qué funciones están realmente integradas.
- [ ] No integrar el PR #32 de preparación web hasta reconstruir y comprobar web/index.html, que ese cambio deja vacío intencionadamente.

## Completadas desde la creación del juego

- [x] Establecida la identidad del proyecto y el perfil del mundo de Arcane en español.
- [x] Preparada la estructura de configuración local para Ollama y el perfil de mundo (config/ollama.json y config/mundo.json); la integración automática sigue pendiente.
- [x] Incorporados elementos de interfaz y presentación para ciudades, imágenes y ventanas.
- [x] Disponible el modo de rol libre basado en texto escrito por el jugador.
- [x] Documentadas las instrucciones base para ejecutar un modelo local; los modelos personalizados separados están propuestos en el PR #38 y aún no deben considerarse integrados.

## Criterio de cierre

Una tarea solo se marca como completada después de comprobar el cambio. Las opciones de diálogo, el guardado/carga, la integración de Ollama y la publicación deben probarse en una ejecución real; no se consideran terminadas por existir documentación o configuración.
