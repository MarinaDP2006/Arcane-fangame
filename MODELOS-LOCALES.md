# Perfiles de modelos locales

Los ajustes de Ollama están separados del código narrativo en `config/ollama.json` y `config/mundo.json`. El perfil de este repositorio usa `qwen3:4b` y contiene únicamente las reglas del mundo de **Arcane: Piltover y Zaun**.

## Preparar el modelo

1. Instala Ollama desde https://ollama.com/.
2. En una terminal ejecuta `ollama pull qwen3:4b`.
3. Comprueba el modelo con `ollama run qwen3:4b`.
4. Mantén el servicio en `http://127.0.0.1:11434` para uso local.

## Estado de la integración

El JSON es un perfil de configuración preparado y `enabled` permanece en `false`: la aplicación no lo carga automáticamente todavía. No se reactiva la IA por instalar Ollama. Para activarla habrá que conectar explícitamente el proveedor con el flujo narrativo de la versión actual y probarlo en Electron; la web pública no debe llamar directamente a un servicio local. No expongas el puerto de Ollama a Internet ni publiques tu IP privada.
