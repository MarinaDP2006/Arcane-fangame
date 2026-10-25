# Modelos locales y Ollama

Esta guía explica cómo usar Ollama como proveedor local de la historia libre y del chat con personajes. Selecciónalo desde **Ajustes → IA de la historia y los chats → Proveedor de IA → Ollama**. El modelo se ejecuta en tu equipo; el juego no aloja ni descarga modelos por ti.

## 1. Instalar y comprobar Ollama

1. Instala Ollama desde https://ollama.com/ y arranca el servicio.
2. Descarga un modelo compatible:

   ```bash
   ollama pull qwen3:4b
   ```

3. Comprueba que responde:

   ```bash
   ollama run qwen3:4b
   ```

## 2. Crear el perfil narrativo de Arcane (opcional)

Desde la raíz del repositorio:

```bash
ollama create arcane-narrador -f ollama/Modelfile.arcane
ollama run arcane-narrador
```

En Ajustes selecciona Ollama y deja el modelo `arcane-narrador`. Si prefieres otro modelo instalado, escribe su identificador o pulsa **Listar modelos de Ollama** y selecciónalo.

## 3. Conectar el juego

- En el mismo PC, la dirección predeterminada es `http://127.0.0.1:11434/v1/chat/completions`.
- Pulsa **Probar conexión** en Ajustes. Si falla, comprueba que Ollama está activo, que el modelo existe (`ollama list`) y que la versión instalada expone la API compatible con OpenAI en `/v1/chat/completions`.
- Para usar Ollama desde un móvil o tableta, `127.0.0.1` no es el PC: escribe la IP local del PC y el puerto 11434. Configura Ollama para aceptar conexiones desde la red local y comprueba el firewall.
- No expongas el puerto de Ollama a Internet. Usa solo una red de confianza y restringe el acceso cuando sea posible.
- En navegador web, las reglas de CORS y los permisos de red local pueden impedir la conexión; prueba primero la aplicación de escritorio o el transporte nativo móvil.

## 4. Problemas habituales

- **No conecta:** revisa la dirección, el puerto 11434, el firewall y que el servicio esté iniciado.
- **Modelo no encontrado:** ejecuta `ollama list` y copia exactamente el nombre mostrado.
- **Respuestas demasiado lentas:** prueba un modelo más pequeño o una cuantización menor; la primera respuesta puede tardar en cargar el modelo.
- **No hay respuesta de IA:** desactiva la IA para continuar con los diálogos escritos. El progreso narrativo y la partida no deben depender de que el modelo esté disponible.

## Estado y límites

Ollama usa la API compatible con OpenAI para generación de texto y listado de modelos. La calidad, velocidad y consumo de memoria dependen del modelo y del equipo. Esta integración necesita validación práctica en escritorio, navegador y Android; no se afirma que todos los modelos o dispositivos funcionen igual. El estado narrativo de la partida se guarda en el juego, no dentro del modelo.

Este perfil es exclusivo de Arcane: no comparte personajes, historias ni memoria con Las ciudades del Umbral.
