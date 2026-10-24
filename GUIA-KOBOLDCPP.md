# IA local con KoboldCpp

KoboldCpp es la única IA del juego: la historia libre y los chats funcionan con una IA en tu propio PC, sin internet y sin clave. No hay otros servicios de IA.

## En el PC

1. Abre `koboldcpp.exe`. Si tu PC es antiguo o no tiene tarjeta gráfica moderna, usa `koboldcpp-oldpc.exe`.
2. En **Model** elige el archivo `.gguf` del modelo. Para el rol en español va mejor **Qwen** que Llama.
3. Si tienes tarjeta gráfica, sube **GPU Layers** todo lo que aguante. Si va justa de memoria, déjalo en 0.
4. Pulsa **Launch** y espera a que la ventana diga que escucha en el puerto **5001**.
5. En el juego abre **Ajustes → IA de la historia y los chats**, deja activado **Usar KoboldCpp**, deja la dirección como está y pulsa **Probar conexión**.

Mientras KoboldCpp esté abierto, los personajes te responden con ese modelo.

## Desde la tablet o el móvil

1. El PC y la tablet tienen que estar en la misma wifi. No hace falta activar «Remote Tunnel».
2. En el juego del móvil escribe en **Dirección** la de tu PC, por ejemplo `192.168.1.40`. El puerto 5001 se pone solo. Mientras pongas «localhost», el móvil usa los diálogos escritos, porque «localhost» sería el propio móvil.
3. Si no conecta, deja pasar a KoboldCpp en el cortafuegos de Windows cuando lo pregunte.

## Si va lento

- Un modelo de 5 GB sin tarjeta gráfica puede tardar 30 segundos o más por respuesta. El juego espera hasta 90 segundos.
- Prueba con un modelo más pequeño o con más **GPU Layers**.
- Si la IA no contesta, el juego ofrece los diálogos escritos para que no te quedes atascada.

## En la web (demo de Render)

La demo de la web (`/demo.html`) también habla con KoboldCpp. Dentro de la partida, el botón **Conectar IA** deja escribir la dirección y **Probar conexión** comprueba que contesta. La dirección se guarda en ese navegador. También se puede abrir la demo con `demo.html?kobold=<dirección>`.

- **En el mismo PC donde está KoboldCpp:** deja `http://localhost:5001`. Si el navegador pregunta si la web puede acceder a dispositivos de tu red local, pulsa **Permitir**.
- **Desde otro aparato (móvil, tablet u otro PC):** la web va por `https` y el navegador bloquea las llamadas a `http://192.168.x.x` (contenido mixto). Para eso abre KoboldCpp con túnel: en la pestaña **Network** marca **Remote Tunnel**, o lánzalo con `--remotetunnel`. KoboldCpp mostrará una dirección `https://….trycloudflare.com`; pégala en **Conectar IA**. Esa dirección cambia cada vez que abres KoboldCpp y cualquiera que la tenga puede usar tu IA mientras esté abierto, así que no la publiques.
- La app de Android también puede usar la dirección de tu PC en casa (`http://192.168.1.x:5001`) desde **Ajustes**, sin túnel.
- Si KoboldCpp no contesta, la demo sigue con el narrador local.

El servidor de Render nunca ve lo que escribes: el navegador habla directamente con tu KoboldCpp.

## Importante: Save Slots y separación de juegos

Los **Save Slots de KoboldAI Lite no configuran las demos**. La demo de Arcane envía sus propias instrucciones desde `web/demo-base.json` y `web/demo-juego.js`; el juego descargable define además sus prompts por personaje en `src/js/ai.js`. No cargues la tarjeta de Las ciudades del Umbral para intentar arreglar Arcane ni al revés: cada demo debe conectarse al mismo endpoint de KoboldCpp, pero envía su propio canon y su propio reparto. Si ves respuestas genéricas, comprueba que el estado de conexión diga que está conectado y no «narrador local». Llama 3.1 8B Instruct puede seguir mal instrucciones complejas; un modelo de rol/instrucciones con buen español puede mejorar la fidelidad, pero ningún prompt garantiza una imitación perfecta.

**Seguridad:** el enlace `trycloudflare.com` funciona como una puerta pública temporal mientras el túnel esté activo. No lo publiques ni lo compartas; si ya lo has compartido públicamente, cierra el túnel y genera otro.
