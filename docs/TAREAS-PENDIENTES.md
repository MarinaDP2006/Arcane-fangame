# Tareas pendientes — Arcane-fangame

> **En pocas palabras:** Esta es la lista de trabajo pendiente con más detalle que el resumen de la raíz. Sirve para decidir qué conviene abordar después y para no confundir una idea con una función terminada. Marca las tareas solo cuando se hayan comprobado en el repositorio o en una compilación real, y anota qué falta cuando una tarea esté a medias.

Documento de seguimiento. Marca una tarea como completada solo tras verificarla en el repositorio o en una ejecución real.

## Pendientes prioritarias

> **Alcance actual:** juego 2D ilustrado, diálogos escritos, sin integración de IA. Las tareas de mapas 3D, GLB y Blender quedan aplazadas; antes de eliminar sus archivos, comprobar referencias y dependencias.
- [ ] Implementar y probar opciones de diálogo seleccionables sin depender de una IA.
- [ ] Verificar que las elecciones afectan a la conversación y que se puede continuar con acciones libres.
- [ ] Guardar y cargar por separado el estado de partida y el historial de esta historia.
- [ ] Probar inicio, diálogo, elección, guardado, recarga y continuación.
- [ ] Revisar la corrección del parallax del título (PR #36) y mantener la navegación por clic.
- [ ] Probar escritorio y móvil, rutas de recursos, consola y compilación.
- [ ] Aplazado: validar visualmente el mapa exterior 3D. No es requisito para la fase 2D.
- [ ] Prioridad actual: validar que cada ubicación del mapa 2D tenga ilustración y que las rutas de arte existan.
- [ ] Tras los cambios de empaquetado, verificar una nueva ejecución de Actions y probar los instaladores de Windows, los paquetes macOS y el APK en dispositivos reales antes de anunciar una Release estable.
- [ ] Limpiar documentación obsoleta y comprobar que la web generada tiene una portada válida.
- [ ] Aplazado: integración de IA/Ollama. Mantener diálogos escritos y no presentar el proveedor como una función disponible.
- [ ] Revisar el PR #38 del modelo personalizado, si sigue abierto; no asumir que el modelo está integrado en la app.

## Completadas desde la creación
- [x] Definida la identidad del fangame y el contexto de Piltover y Zaun.
- [x] Preparados `config/ollama.json` y `config/mundo.json`; no se cargan automáticamente.
- [x] Preparados archivos de perfil y Modelfile para el narrador local `arcane-narrador`.
- [x] Disponible el modo de rol libre mediante texto escrito por el jugador.
- [x] Documentados los comandos de desarrollo y la compilación/publicación.

## Regla de verificación
La configuración o documentación no demuestra que una función esté integrada. No marcar diálogos con opciones, guardado/carga ni integración de Ollama como terminados hasta probarlos en el juego.