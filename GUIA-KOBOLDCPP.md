# KoboldCpp 1.123.1 en Windows: Qwen/Llama en PC, móvil y tablet

Esta configuración usa **KoboldCpp en el PC de casa**, sin Remote Tunnel, Cloudflare ni servicios externos. La misma instancia sirve al juego de escritorio y a los juegos web abiertos desde Render.

## Dirección predeterminada de este PC

- PC con KoboldCpp: **192.168.1.139**
- Dirección base: `http://192.168.1.139:5001`
- API compatible con OpenAI: `http://192.168.1.139:5001/v1`
- Chat completions: `http://192.168.1.139:5001/v1/chat/completions`
- Lista de modelos: `http://192.168.1.139:5001/v1/models`

La dirección `192.168.1.139` es la IP privada actual de la red local. Si Windows asigna otra IP al PC, vuelve a ejecutar `ipconfig` y actualiza la dirección en Ajustes del juego y en el panel de la demo.

## 1. Preparar KoboldCpp

1. Abre KoboldCpp **1.123.1** desde su ejecutable.
2. En **Model / Quick Launch**, selecciona un solo archivo GGUF.
3. En **Network**, deja **Host** vacío, pon **Port: 5001** y mantén **Remote Tunnel desactivado**.
4. Configura una contraseña en **Password**. El juego y la demo tienen un campo opcional para esa contraseña; escríbela allí también. No publiques la contraseña.
5. Pulsa **Launch** y espera a que el modelo termine de cargar.

KoboldCpp admite una sola instancia/modelo cargado a la vez en esta configuración: selecciona Qwen o Llama, no ambos a la vez.

## 2. Modelo Qwen o Llama

Empieza con un único GGUF cuantizado **Q4_K_M**:

- **Qwen3 8B:** [Qwen/Qwen3-8B-GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF).
- **Llama 3.1 8B Instruct:** [Meta-Llama-3.1-8B-Instruct-GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF).

En KoboldCpp puedes usar **HF Search**, elegir el repositorio y el archivo Q4_K_M, pulsar **Confirm Selection** y después **Launch**. Si falta memoria, reduce GPU Layers, conserva el contexto predeterminado o prueba un modelo más pequeño.

## 3. Conectar el juego en el PC

1. Deja KoboldCpp abierto con el modelo listo.
2. Abre el juego de Arcane.
3. Entra en **Ajustes → IA de la historia y los chats**.
4. Selecciona/activa **KoboldCpp**. La dirección predeterminada es `http://192.168.1.139:5001/v1/chat/completions`.
5. Si configuraste Password, introdúcela en el campo de contraseña.
6. Pulsa **Buscar mi modelo** y después **Probar conexión**.

Si estás usando el mismo PC donde ejecutas KoboldCpp, la IP local de arriba también debe funcionar. No necesitas cargar una tarjeta de personaje en KoboldAI Lite: Arcane envía su propio contexto desde el juego.

## 4. Conectar desde el móvil o la tablet

1. Conecta el dispositivo a la **misma Wi-Fi** que el PC.
2. En el juego, abre **Ajustes → IA** y usa la dirección predeterminada `http://192.168.1.139:5001/v1/chat/completions`.
3. Introduce la contraseña de KoboldCpp, si configuraste una, y pulsa **Probar conexión**.
4. Si no conecta, comprueba el cortafuegos de Windows y que la red no tenga aislamiento entre dispositivos.

No uses `localhost` en el móvil/tablet: allí significa el propio teléfono/tablet, no el PC.

## 5. Usar la demo publicada en Render (HTTPS), sin túneles

La demo tiene como dirección predeterminada `http://192.168.1.139:5001`.

1. Abre la web de Arcane desde Chrome actualizado.
2. En la demo, abre **Conectar IA**.
3. Selecciona o deja **Mi KoboldCpp** e introduce `http://192.168.1.139:5001`.
4. Si activaste Password en KoboldCpp, escribe la contraseña en su campo.
5. Pulsa **Probar conexión**. En Chrome 142 o posterior puede aparecer un permiso llamado **Acceso a la red local**; elige **Permitir**.
6. Haz una prueba de conversación y confirma que el estado indica conexión, no narrador local.

Para cambiar el permiso en Chrome: icono a la izquierda de la barra de direcciones → **Configuración de sitios** → **Acceso a la red local** → **Permitir**. Debes concederlo por separado en cada dispositivo/navegador.

**Compatibilidad:** no todos los navegadores ni todas las versiones permiten desde una web HTTPS conectarse a una IP HTTP privada. Si el navegador sigue bloqueando la llamada después de autorizar el acceso local, esta configuración sin túnel no puede forzar ese permiso. En ese caso usa el juego instalado o sirve la web desde tu PC en la red local por HTTP. No abras el puerto 5001 del router ni publiques KoboldCpp en Internet.

## 6. Cortafuegos de Windows

En el primer inicio, permite KoboldCpp en **redes privadas** cuando Windows Firewall lo pregunte. Si no aparece la pregunta, abre **Seguridad de Windows → Firewall y protección de red → Permitir una aplicación a través del firewall** y permite KoboldCpp en perfil **Privado**.

Para comprobar la dirección en Windows:

```bat
ipconfig
```

Busca **Dirección IPv4** en el adaptador Wi-Fi/Ethernet conectado a tu red. La IP de esta guía es `192.168.1.139`; si cambia, reemplázala en los ajustes.

## 7. Diagnóstico rápido

| Síntoma | Qué revisar |
|---|---|
| `/v1/models` no abre en el PC | Espera a que el modelo termine de cargar y comprueba el puerto 5001. |
| Funciona en el PC, pero no en móvil/tablet | Misma Wi-Fi, Host vacío, cortafuegos privado y sin aislamiento de clientes en el router. |
| La demo en Render muestra error de red local | Acepta **Acceso a la red local** en Chrome moderno. Si el navegador no permite HTTPS → IP privada HTTP, usa el juego instalado o web local; no actives túneles. |
| Error de autenticación | Introduce la misma contraseña de KoboldCpp en el campo de contraseña de la demo/juego. |
| La demo sigue respondiendo pero parece desconectada | Comprueba el indicador: una respuesta del narrador local no demuestra que KoboldCpp esté conectado. |
| Respuestas lentas o falta de memoria | Q4_K_M, GPU Layers automático o modelo más pequeño. |

## Enlaces útiles

- [Descargas oficiales de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación oficial de KoboldCpp](https://koboldcpp.net/docs/)
- [Modelo Qwen3 8B GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Modelo Llama 3.1 8B Instruct GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)
- [Releases de Arcane-fangame](https://github.com/MarinaDP2006/Arcane-fangame/releases)
- [Problemas de Arcane-fangame](https://github.com/MarinaDP2006/Arcane-fangame/issues)
