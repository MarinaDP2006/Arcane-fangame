# Tareas pendientes — Arcane-fangame

Documento de seguimiento. Marca una tarea como completada solo tras verificarla en el repositorio o en una ejecución real.

## Pendientes prioritarias
- [ ] Implementar y probar opciones de diálogo seleccionables sin depender de una IA.
- [ ] Verificar que las elecciones afectan a la conversación y que se puede continuar con acciones libres.
- [ ] Guardar y cargar por separado el estado de partida y el historial de esta historia.
- [ ] Probar inicio, diálogo, elección, guardado, recarga y continuación.
- [ ] Revisar la corrección del parallax del título (PR #36) y mantener la navegación por clic.
- [ ] Probar escritorio y móvil, rutas de recursos, consola y compilación.
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