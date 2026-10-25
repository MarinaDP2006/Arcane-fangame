# Tareas pendientes — Arcane-fangame

> **En pocas palabras:** Esta es la lista de trabajo pendiente con más detalle que el resumen de la raíz. Sirve para decidir qué conviene abordar después y para no confundir una idea con una función terminada. Marca las tareas solo cuando se hayan comprobado en el repositorio o en una compilación real, y anota qué falta cuando una tarea esté a medias.

Documento de seguimiento. Marca una tarea como completada solo tras verificarla en el repositorio o en una ejecución real.

## Pendientes prioritarias
- [ ] Implementar y probar opciones de diálogo seleccionables sin depender de una IA.
- [ ] Verificar que las elecciones afectan a la conversación y que se puede continuar con acciones libres.
- [ ] Guardar y cargar por separado el estado de partida y el historial de esta historia.
- [ ] Probar inicio, diálogo, elección, guardado, recarga y continuación.
- [ ] Revisar la corrección del parallax del título (PR #36) y mantener la navegación por clic.
- [ ] Probar escritorio y móvil, rutas de recursos, consola y compilación.
- [ ] Validar visualmente el nuevo mapa exterior 3D en Windows y Android: comprobar escala, solapamientos y rendimiento de los hitos de Piltover y Zaun.
- [ ] Sustituir progresivamente la geometría procedural de los hitos por modelos artesanales con referencias y derechos de uso verificados; no anunciar una copia exacta hasta completar la comparación visual.
- [ ] Tras los cambios de empaquetado, verificar una nueva ejecución de Actions y probar los instaladores de Windows, los paquetes macOS y el APK en dispositivos reales antes de anunciar una Release estable.
- [ ] Limpiar documentación obsoleta y comprobar que la web generada tiene una portada válida.
- [ ] Integrar Ollama solo como función opcional, tras conectar el proveedor y probarlo; la configuración actual está desactivada.
- [ ] Revisar el PR #38 del modelo personalizado, si sigue abierto; no asumir que el modelo está integrado en la app.

## Completadas desde la creación
- [x] Definida la identidad del fangame y el contexto de Piltover y Zaun.
- [x] Preparados `config/ollama.json` y `config/mundo.json`; no se cargan automáticamente.
- [x] Preparados archivos de perfil y Modelfile para el narrador local `arcane-narrador`.
- [x] Disponible el modo de rol libre mediante texto escrito por el jugador.
- [x] Documentados los comandos de desarrollo y la compilación/publicación.

## Regla de verificación
La configuración o documentación no demuestra que una función esté integrada. No marcar diálogos con opciones, guardado/carga ni integración de Ollama como terminados hasta probarlos en el juego.