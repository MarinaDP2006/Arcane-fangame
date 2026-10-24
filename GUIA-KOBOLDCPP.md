# Guía completa: instalar KoboldCpp, cargar Qwen o Llama y conectar la demo de Arcane

Esta guía es para reinstalar KoboldCpp en Windows desde cero y conectar la demo web de Arcane. KoboldCpp ejecuta el modelo en tu PC; la demo le envía las instrucciones de Arcane. **No necesitas cargar una tarjeta de personaje de Arcane en KoboldAI Lite** para que la demo funcione.

## 1. Preparar una instalación limpia

KoboldCpp es portátil: normalmente no tiene un instalador tradicional, sino un archivo `.exe`.

1. Cierra KoboldCpp y cualquier ventana de KoboldAI Lite.
2. Si vas a empezar desde cero, crea una carpeta como `C:\\Kobold`. Puedes guardar ahí el programa y crear `C:\\Kobold\\models` para los modelos.
3. Descarga KoboldCpp únicamente desde las [versiones oficiales de GitHub](https://github.com/LostRuins/koboldcpp/releases).
4. En Windows, elige el ejecutable compatible con tu equipo:
   - **NVIDIA moderna:** versión CUDA indicada en la página de versiones.
   - **AMD, Intel o sin CUDA:** versión `nocuda`/Vulkan que corresponda.
   - **CPU o equipo antiguo:** versión CPU/old CPU si las versiones actuales no funcionan.
5. Guarda el ejecutable en `C:\\Kobold`. No descargues modelos desde páginas de archivos ejecutables ni borres la carpeta de modelos si quieres conservarlos.

La instalación de KoboldCpp y los modelos son cosas separadas. Si eliminas el programa pero conservas los archivos `.gguf`, no tienes que volver a descargar los modelos.

## 2. Descargar un modelo: Qwen o Llama

KoboldCpp necesita un modelo en formato **GGUF**. No descargues el repositorio entero: selecciona un único archivo `.gguf` de cuantización Q4 para empezar. Los modelos de 8B suelen ocupar alrededor de 5 GB y necesitan memoria adicional para funcionar.

### Opción recomendada para probar primero: Qwen3 8B

- Repositorio: [Qwen/Qwen3-8B-GGUF en Hugging Face](https://huggingface.co/Qwen/Qwen3-8B-GGUF).
- Busca y elige el archivo **Q4_K_M** (suele llamarse `qwen3-8b-q4_k_m.gguf`).
- Qwen3 8B es una alternativa instruct multilingüe para probar narración y diálogo en español. No garantiza por sí solo una interpretación perfecta de cada personaje.

### Alternativa: Llama 3.1 8B Instruct

- Repositorio GGUF: [Meta-Llama-3.1-8B-Instruct-GGUF en Hugging Face](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF).
- Elige el archivo **Q4_K_M** para empezar.
- Es el tipo de modelo Llama instruct que ya habías probado. Puedes comparar sus respuestas con Qwen.

### Cómo descargarlo desde el propio KoboldCpp

1. Abre el ejecutable de KoboldCpp.
2. En **Quick Launch** o **Loaded Files**, localiza **HF Search** junto al campo del modelo.
3. Busca el nombre del repositorio (por ejemplo, `Qwen/Qwen3-8B-GGUF`) y pulsa **Search Huggingface**.
4. Selecciona el repositorio correcto y el archivo `.gguf` que termine en **Q4_K_M**.
5. Pulsa **Confirm Selection**. Comprueba que el campo del modelo ya contiene ese archivo.
6. Pulsa **Launch**. La primera vez se descargará el modelo; espera hasta que la consola indique que está listo y muestra la dirección/puerto local (normalmente **5001**).

**No cargues Qwen y Llama a la vez.** Prueba uno, cierra o detén esa sesión y vuelve a abrir KoboldCpp para seleccionar el otro modelo. Puedes conservar ambos archivos en `C:\\Kobold\\models`.

### Ajustes iniciales sugeridos

- **GPU Layers:** déjalo en `-1`/automático para empezar. Si falla por falta de memoria, reduce la carga de GPU o prueba un modelo más pequeño.
- **Context Size:** empieza con el valor predeterminado. Un contexto mayor usa más memoria.
- No cierres KoboldCpp mientras estés jugando: la demo necesita que el servidor esté activo.

## 3. Activar Remote Tunnel para la demo publicada

Usa esta opción cuando la demo está publicada en Render (HTTPS) y KoboldCpp se ejecuta en tu PC. El túnel crea una dirección HTTPS temporal para que el navegador pueda llegar al servidor local.

1. En KoboldCpp, antes de pulsar **Launch**, abre la pestaña **Network**.
2. Marca **Remote Tunnel**. En algunas versiones aparece como una casilla de la pantalla principal.
3. Pulsa **Launch** y espera a que el modelo termine de cargar.
4. En la consola busca el mensaje que indica que el túnel está listo, normalmente con una dirección parecida a `https://algo.trycloudflare.com`.
5. Copia la dirección HTTPS recién generada. Copia solo el origen, por ejemplo `https://algo.trycloudflare.com`; no añadas `/#`, `/v1/chat/completions` ni otras rutas.
6. **No reutilices un enlace de una sesión anterior.** El túnel puede cambiar al reiniciar KoboldCpp; usa siempre el enlace que aparece en la consola de la sesión actual.

### Pegar el túnel en la demo de Arcane

1. Abre [la demo de Arcane](https://arcane-fangame.onrender.com/index.html#inicio).
2. Entra en la partida y abre el panel de conexión de IA (**Conectar IA** o **Ajustes de IA**, según la pantalla).
3. Selecciona KoboldCpp/endpoint personalizado si aparece esa opción.
4. Pega la URL HTTPS recién generada en el campo de dirección, sin añadir rutas.
5. Pulsa **Probar conexión** y espera el resultado. Si el panel indica que está conectada, empieza una conversación nueva para probar.
6. Repite la prueba cada vez que reinicies KoboldCpp y el túnel haya cambiado.

**No pongas el enlace temporal antiguo en el repositorio ni en archivos públicos.** El enlace del túnel que compartiste anteriormente no debe considerarse permanente: al reinstalar y volver a iniciar, genera uno nuevo.

### Seguridad del túnel

El túnel expone tu KoboldCpp a través de Internet mientras siga activo. Cualquiera que consiga la dirección puede intentar enviar solicitudes a tu modelo y consumir los recursos de tu PC. No publiques el enlace, no lo incluyas en commits, capturas públicas ni documentación del juego. Cierra KoboldCpp cuando termines para cerrar el túnel. No abras el puerto 5001 en el router.

## 4. Comprobar que la demo usa realmente la IA

La demo puede seguir contestando con su **narrador local** cuando KoboldCpp está apagado o la conexión falla. Por eso, recibir una respuesta no demuestra que el modelo esté conectado.

1. En KoboldCpp, confirma que el modelo terminó de cargar y que el servidor sigue abierto.
2. En la demo, pulsa **Probar conexión** y comprueba que el panel confirma la conexión.
3. Haz una pregunta de prueba y revisa si el estado sigue conectado, no desconectado/narrador local.
4. Si el panel muestra error, vuelve a copiar la URL del túnel actual y prueba de nuevo.
5. Si conecta pero los personajes siguen mezclando voces o universos, prueba Qwen y Llama por separado. Los Save Slots de KoboldAI Lite no configuran la demo: Arcane envía su propio canon e instrucciones desde los archivos del juego.

## 5. Problemas frecuentes

| Síntoma | Qué comprobar |
|---|---|
| `No Models Selected` | Selecciona un archivo GGUF y vuelve a pulsar **Launch**. |
| El modelo aún se está descargando | Espera a que la descarga llegue al 100 % y el modelo termine de cargar. |
| KoboldAI Lite abre, pero la demo dice que no conecta | Lite y la API pertenecen al mismo servidor, pero la demo debe usar la dirección correcta. Con Remote Tunnel, usa la URL HTTPS actual. |
| La demo responde aunque esté desconectada | Es el narrador local/fallback; comprueba el estado de conexión, no solo el texto de la respuesta. |
| El túnel falla | Comprueba Internet y el cortafuegos; espera el mensaje de túnel listo. Reinicia KoboldCpp si no se crea. |
| Respuestas lentas o error de memoria | Prueba Q4_K_M, deja GPU Layers en automático o usa un modelo más pequeño. |

## Enlaces útiles

- [Descargas oficiales de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación oficial de KoboldCpp](https://koboldcpp.net/docs/)
- [Modelos GGUF de Qwen3 8B](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Modelo GGUF de Llama 3.1 8B Instruct](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)
- [Demo web de Arcane](https://arcane-fangame.onrender.com/index.html#inicio)
- [Repositorio de Arcane](https://github.com/MarinaDP2006/Arcane-fangame)

## Save Slots: importante

Los Save Slots de KoboldAI Lite guardan sesiones de Lite; no separan ni configuran los universos de las demos. Arcane manda su propio contexto de historia. No necesitas cargar una tarjeta de personaje de Umbral ni de Arcane en Lite para que la demo funcione.
