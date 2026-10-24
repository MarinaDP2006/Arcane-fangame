# Guía de KoboldCpp para Rifts & Gears: Arcane

Esta guía configura KoboldCpp en Windows para usar Qwen o Llama desde el juego instalado y desde la demo web. El modelo se ejecuta en tu PC; no necesitas Remote Tunnel ni abrir puertos del router para jugar en la misma Wi-Fi.

## Dirección predeterminada de este PC

- **IP del PC:** `192.168.1.139`
- **Puerto de KoboldCpp:** `5001`
- **Dirección base:** `http://192.168.1.139:5001`
- **Comprobación de la API:** `http://192.168.1.139:5001/v1/models`

La demo y el juego usan esa dirección como valor inicial. Solo funciona mientras el PC tenga esa IPv4 y el dispositivo esté conectado a la misma red local. Si la IP cambia, actualízala en Ajustes → IA o en «Conectar IA». En el mismo PC también puedes usar `http://localhost:5001`.

## 1. Descargar KoboldCpp

1. Descarga el ejecutable únicamente desde [KoboldCpp Releases](https://github.com/LostRuins/koboldcpp/releases).
2. Guárdalo, por ejemplo, en `C:\\Kobold`. Puedes conservar los modelos en `C:\\Kobold\\models`.
3. Elige la versión compatible con tu hardware: CUDA para una GPU NVIDIA compatible, Vulkan/no-CUDA para otras GPU compatibles, o CPU si corresponde.

## 2. Cargar Qwen o Llama

KoboldCpp necesita un modelo GGUF. Para empezar, descarga una cuantización Q4_K_M de un solo modelo:

- [Qwen3 8B GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Llama 3.1 8B Instruct GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)

En KoboldCpp, usa **HF Search**, selecciona el archivo `.gguf`, confirma la selección y pulsa **Launch**. Carga un modelo cada vez. Mantén KoboldCpp abierto mientras juegas.

## 3. Ajustes de red (sin Remote Tunnel)

En KoboldCpp, antes de **Launch**, abre **Network** y configura:

- **Host:** vacío (o `0.0.0.0` para escuchar en la red local).
- **Port:** `5001`.
- **Remote Tunnel:** desactivado.
- **Password:** recomendable; si la configuras, introduce la misma contraseña en el juego/demo.

No expongas el puerto 5001 a Internet ni configures port forwarding en el router.

## 4. Permitir la conexión en Windows y la Wi-Fi

1. En el PC, ejecuta `ipconfig` y comprueba que la IPv4 de la conexión usada sigue siendo `192.168.1.139`.
2. Marca la red de Windows como **Privada** si es tu red doméstica de confianza.
3. Si Windows Firewall pregunta, permite KoboldCpp solo en redes privadas. Si hace falta una regla manual, abre PowerShell como administrador y ejecuta:
   ```powershell
   New-NetFirewallRule -DisplayName "KoboldCpp LAN 5001" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 5001 -Profile Private
   ```
4. En el PC y el móvil/tablet, abre `http://192.168.1.139:5001/v1/models`. Debe aparecer JSON. En el móvil no uses `localhost`, porque apuntaría al propio móvil.

## 5. Conectar la demo web

Abre la demo web publicada de Arcane (usa la URL de Render configurada para este proyecto), entra en la partida y abre **Conectar IA**. La dirección inicial es `http://192.168.1.139:5001`; pulsa **Probar conexión**. Si Chrome/Edge muestra el permiso **Acceso a la red local**, pulsa **Permitir**. Si antes lo bloqueaste, abre la información del sitio → configuración/permisos del sitio → Acceso a la red local → Permitir. Si activaste **Password** en KoboldCpp, introduce esa contraseña en el campo correspondiente.

La prueba se inicia mediante el botón para respetar el permiso del navegador. Si el JSON de `/v1/models` no abre desde el móvil, primero resuelve la Wi-Fi/firewall; cambiar la configuración de la demo no arreglará la conexión de red.

## 6. Conectar el juego instalado

En **Ajustes → IA**, activa KoboldCpp. La dirección inicial es `http://192.168.1.139:5001`; pulsa **Probar conexión**. En el mismo PC, `http://localhost:5001` también sirve. Introduce la contraseña si configuraste Password en KoboldCpp.

## 7. Problemas frecuentes

| Problema | Qué comprobar |
|---|---|
| `/v1/models` no abre | Modelo cargado, Host vacío/`0.0.0.0`, puerto 5001, firewall privado y misma Wi-Fi. |
| El móvil no llega | No uses `localhost`; revisa que no sea una Wi-Fi de invitados con aislamiento de dispositivos. |
| La web HTTPS pide permiso | Permite Acceso a la red local para la web y vuelve a pulsar Probar conexión. |
| La demo contesta sin IA | Comprueba el estado de conexión; el narrador local no demuestra que KoboldCpp esté conectado. |
| Error de contraseña | Usa exactamente la contraseña configurada en Network → Password. |
| Cambió la IP | Actualiza el campo de dirección; `192.168.1.139` es la IPv4 actual conocida, no una dirección fija garantizada por el router. |

## Enlaces oficiales

- [Descargas y versiones de KoboldCpp](https://github.com/LostRuins/koboldcpp/releases)
- [Documentación de KoboldCpp](https://koboldcpp.net/docs/)
- [Qwen3 8B GGUF](https://huggingface.co/Qwen/Qwen3-8B-GGUF)
- [Llama 3.1 8B Instruct GGUF](https://huggingface.co/gaianet/Meta-Llama-3.1-8B-Instruct-GGUF)

Los Save Slots de KoboldAI Lite solo guardan sesiones de Lite; el juego envía su propio contexto de Arcane. No hace falta cargar una tarjeta de personaje en Lite.
