# Guía técnica — Arcane-fangame

Manual de orientación para el repositorio de **Arcane-fangame**. Este proyecto es independiente de **Las ciudades del Umbral**, que vive en `MarinaDP2006/RIFTS-GEARS`.

> Estado importante: el juego prioriza el rol libre sin IA. La configuración de Ollama es preparatoria, está desactivada y no se carga automáticamente. No describas una función como terminada solo porque exista un archivo de configuración o una guía.

## Qué leer

- [README](README.md): resumen del proyecto, comandos básicos y enlaces.
- [Guía de juego](GUIAJUEGO.md): cómo empezar y cómo probar el juego.
- [Modelos locales](MODELOS-LOCALES.md): estado real de Ollama y preparación local.
- [Compilaciones y releases](docs/RELEASES-ARCANE.md): workflow y artefactos.
- [Tareas pendientes](docs/TAREAS-PENDIENTES.md): lista de trabajo; revisar el estado antes de dar por cerrada una tarea.

## Desarrollo

```bash
npm ci
npm run check
npm start
npm run web
```

`npm run web` genera el sitio de distribución en `web-dist/`. Antes de publicar, verifica que la compilación termina correctamente y que el contenido generado corresponde a la versión actual. No reemplaces `web/index.html` por una página vacía.

## Narrativa y modelos locales

El modo de rol libre permite al jugador escribir lo que dice o hace. Las opciones de respuesta seleccionables deben tratarse como trabajo pendiente hasta que estén implementadas y probadas. No se requiere Ollama para jugar.

El perfil de `config/ollama.json` permanece desactivado por defecto y la aplicación no lo carga automáticamente. La web pública no debe conectarse directamente a un servicio Ollama del equipo del jugador. No expongas el puerto local de Ollama a Internet.

## Calidad antes de publicar

- Ejecuta `npm run check`.
- Prueba el inicio, creación del personaje, navegación, diálogos y guardado/carga en la versión actual.
- Comprueba escritorio y móvil, consola y rutas de recursos.
- Confirma que la web generada contiene una página de inicio válida.
- Verifica licencias y créditos de los recursos de Arcane; el proyecto es un fangame no oficial.