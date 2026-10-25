# Modelos locales — Arcane-fangame

Esta guía describe la preparación local de Ollama para el universo de **Arcane: Piltover y Zaun**. No comparte personajes, historias ni memoria con Las ciudades del Umbral.

## Modelo base

1. Instala Ollama desde https://ollama.com/.
2. Ejecuta `ollama pull qwen3:4b`.
3. Comprueba el modelo con `ollama run qwen3:4b`.
4. Para uso local, deja el servicio en `http://127.0.0.1:11434`.

## Modelo personalizado de Arcane

El repositorio incluye `ollama/Modelfile.arcane`. Desde la raíz del repositorio, crea el modelo personalizado:
```bash
ollama create arcane-narrador -f ollama/Modelfile.arcane
ollama run arcane-narrador
```

## Estado de integración

`config/ollama.json` está desactivado (`enabled: false`) y la aplicación no lo carga automáticamente. Instalar Ollama o crear un modelo no activa la IA dentro del juego. La conexión con el proveedor y las pruebas de integración siguen siendo trabajo separado.

El historial de la partida debe guardarse en los datos de la partida, no dentro del modelo. No expongas el puerto de Ollama a Internet ni publiques direcciones IP privadas. La web pública no debe llamar directamente a un servicio local del jugador.