# Ollama: modelo separado para Arcane-fangame

## Estado actual

Esta guía es preparatoria. El perfil existente `config/ollama.json` sigue con `enabled: false`. Crear el modelo de Ollama **no integra automáticamente** Ollama en el juego. La aplicación debe implementar y probar explícitamente el proveedor antes de enviarle conversaciones. El juego debe seguir funcionando si Ollama está apagado.

## Crear el modelo personalizado

Requisitos: Ollama instalado y el modelo base descargado. Desde la raíz del repositorio:

```bash
ollama pull qwen3:4b
ollama create arcane-narrador -f ollama/Modelfile.arcane
ollama list
ollama run arcane-narrador
```

El Modelfile define un modelo personalizado llamado `arcane-narrador` basado en `qwen3:4b`, con instrucciones exclusivas para Piltover y Zaun.

## Selección por juego

Ollama mantiene un servicio local y permite tener varios modelos instalados a la vez. No hace falta iniciar un servidor Ollama distinto para cada historia: cada solicitud debe indicar el nombre del modelo correcto. Para este juego, el nombre será `arcane-narrador`.

El perfil de este repositorio debe apuntar a ese nombre cuando se implemente la integración:

```json
{
  "enabled": false,
  "provider": "ollama",
  "baseUrl": "http://127.0.0.1:11434",
  "model": "arcane-narrador",
  "worldProfile": "config/mundo.json"
}
```

Este fragmento es una referencia de configuración, no un cambio que active la integración. No habilites la opción hasta que la app lea el perfil y se hayan probado errores, tiempos de espera y modo sin IA.

## Cómo mantener las historias separadas

- Usa `arcane-narrador` solo para Arcane-fangame y `config/mundo.json` de este repositorio.
- La aplicación debe enviar en cada solicitud las instrucciones del juego y el historial de la partida actual.
- Guarda partidas, variables y recuerdos narrativos en los datos de la partida de la aplicación, identificados por juego y por partida. Ollama no almacena automáticamente la memoria de cada historia como una campaña persistente.
- No reutilices el historial de RIFTS-GEARS ni su perfil de mundo en este juego.
- El JSON de mundo no se incorpora automáticamente al Modelfile: hay que cargarlo y añadir sus reglas al contexto desde la aplicación si se desea que el modelo lo use.

## Uso seguro

Mantén el servicio en `127.0.0.1:11434` para uso local. No expongas el puerto a Internet. La web pública no debe llamar directamente a un servicio Ollama local. En móvil, el servicio del PC no estará disponible automáticamente sin una configuración de red explícita y protegida.

## Comprobación manual

1. Ejecuta `ollama run arcane-narrador` y pide una escena en Piltover.
2. Pide una escena en Zaun y comprueba que cambia el ambiente.
3. Comprueba que no introduce Aurelia, Nácar ni la Resonancia.
4. Recuerda que esta prueba de terminal no demuestra que el juego ya esté integrado con Ollama.
