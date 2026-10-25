# Modelos locales y Ollama

> **Alcance de esta fase: documentación separada, sin integración en el juego.** Puedes instalar Ollama y probar un modelo desde la terminal por curiosidad, pero el juego no lo necesita ni lo conecta. No actives ni configures Ollama dentro de Arcane: la historia, los comunicadores y los minijuegos de esta fase usan opciones y textos escritos. No se implementa IA nueva.

## 1. Instalar y comprobar Ollama por separado

1. Instala Ollama desde https://ollama.com/ y arranca el servicio.
2. Descarga un modelo compatible con tu equipo:

   ```bash
   ollama pull qwen3:4b
   ```

3. Comprueba que el modelo responde en la propia terminal:

   ```bash
   ollama run qwen3:4b
   ```

4. Para ver los modelos descargados:

   ```bash
   ollama list
   ```

Estos pasos prueban únicamente Ollama en tu ordenador. No prueban ni conectan el juego.

## 2. Perfil narrativo opcional para experimentación local

Desde la raíz del repositorio, si solo quieres experimentar fuera del juego:

```bash
ollama create arcane-narrador -f ollama/Modelfile.arcane
ollama run arcane-narrador
```

El perfil sirve como experimento independiente. No sustituye las opciones de diálogo escritas ni modifica el estado de una partida.

## 3. Lo que NO está integrado en esta fase

- No hay un proveedor Ollama nuevo conectado al juego por este bloque.
- No hay que seleccionar Ollama en Ajustes para jugar ni introducir una dirección de API.
- No se debe asumir que el chat, la historia o las decisiones envían texto a un modelo.
- La ausencia de Ollama, Internet o una GPU no debe bloquear la creación del personaje, la historia, los comunicadores ni los minijuegos.
- No se exponen puertos locales a Internet ni se añade una dependencia de IA.

## 4. Posible trabajo futuro (no implementado)

Una integración real requeriría, en otra fase y con pruebas específicas, un adaptador de proveedor, configuración y estado de conexión, manejo de errores y tiempos de espera, controles de privacidad, compatibilidad con escritorio/móvil/navegador y una ruta de respaldo a los diálogos escritos. Nada de eso se activa con esta guía.

## 5. Problemas habituales al probar Ollama por separado

- **El comando no responde:** comprueba que el servicio de Ollama está arrancado.
- **Modelo no encontrado:** ejecuta `ollama list` y copia el nombre exacto.
- **Respuestas demasiado lentas:** prueba un modelo más pequeño o una cuantización menor; la primera respuesta puede tardar mientras se carga.
- **No quieres usar IA:** cierra la terminal; no afecta al juego ni a las partidas.

**Importante:** esta guía es informativa. La experiencia jugable de Arcane en esta fase funciona con contenido local escrito y no depende de Ollama.
