# Modelos locales

> **Alcance actual: documentación, no integración.** Este archivo explica cómo probar Ollama por separado en tu ordenador. No añade IA al juego, no cambia el chat ni la historia, no activa `config/ollama.json` y no hace que el juego dependa de Ollama. En esta fase, los cambios de historia y comunicador se implementan con opciones y diálogos escritos. No sigas estos pasos como requisito para jugar.

Esta guía prepara Ollama para el universo de **Arcane: Piltover y Zaun**. No comparte personajes, historias ni memoria con Las ciudades del Umbral.

## Requisitos y preparación

1. Instala Ollama desde https://ollama.com/.
2. Abre Ollama y comprueba que el servicio local esté activo en http://127.0.0.1:11434.
3. Descarga el modelo base ejecutando: ollama pull qwen3:4b
4. Comprueba que responde: ollama run qwen3:4b

## Crear y probar el narrador de Arcane

El repositorio incluye ollama/Modelfile.arcane, con instrucciones de rol propias de Arcane. Desde la raíz del repositorio ejecuta:

    ollama create arcane-narrador -f ollama/Modelfile.arcane
    ollama run arcane-narrador

Para consultar los modelos instalados: ollama list.

## Estado real de la integración en el juego

**Importante: preparar Ollama y crear arcane-narrador no significa que la IA del juego ya esté conectada a Ollama.** En el estado actual del repositorio, config/ollama.json está desactivado (enabled: false) y la aplicación no lo carga automáticamente. Los controles actuales de IA del juego siguen describiendo KoboldCpp. Por tanto, no se debe afirmar que la IA del chat funciona al 100 % con Ollama hasta que el código del proveedor, los ajustes y las pruebas de conexión estén integrados.

La integración pendiente debe, como mínimo:
- Leer y validar config/ollama.json sin activarlo silenciosamente.
- Llamar al API local de Ollama con el modelo configurado (arcane-narrador si ya se ha creado).
- Mostrar en Ajustes el estado de conexión y errores útiles.
- Permitir desactivar la IA y mantener los diálogos escritos como alternativa.
- Probar chat libre, continuidad de contexto y recuperación cuando Ollama no esté disponible.

El servicio local suele usar http://127.0.0.1:11434. No expongas ese puerto a Internet. El historial y el estado narrativo de cada partida deben guardarse en los datos de la partida, no dentro del modelo. Una web pública no debe llamar directamente al servicio local del jugador sin una integración explícita que gestione conectividad y permisos.

## Universo independiente

Este perfil es exclusivo de Arcane. No reutilices su mundo, personajes ni memoria en **Las ciudades del Umbral**; ese proyecto tiene su propia configuración.
