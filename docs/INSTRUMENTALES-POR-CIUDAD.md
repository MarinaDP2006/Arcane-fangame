# Instrumentales por ciudad

El reproductor asigna una pista local a cada zona del juego:

- **Zaun:** assets/music/sucker-instrumental.mp3.mp3 (nombre actual del archivo subido; tiene la extensión .mp3 duplicada).
- **Piltover:** assets/music/a-bicentennial-instrumental.mp3
- **Menú principal:** assets/music/menu-theme.mp3

## Instalar y nombrar las pistas

Copia los archivos de audio que tengas derecho a utilizar en assets/music/ de la raíz del repositorio. Los nombres deben coincidir exactamente con los que usa src/js/audio.js. El archivo de Zaun que ya aparece en el repositorio se llama sucker-instrumental.mp3.mp3; por eso el código apunta ahora a ese nombre exacto. Si prefieres un nombre limpio, renombra el archivo a sucker-instrumental.mp3 y cambia también TRACK_FILES.zaun en src/js/audio.js.

La aplicación hace un fundido al cambiar de ciudad y repite la pista en bucle. Si falta un archivo, el navegador no puede reproducirlo o la pista no se carga, el juego vuelve automáticamente a la música sintetizada original.

## Importante sobre distribución

Los títulos Sucker y A Bicentennial corresponden a música comercial protegida por derechos de autor. Este repositorio configura los nombres y la reproducción, pero no verifica los derechos de los archivos subidos. Añade y distribuye únicamente audio que estés autorizado a usar; tener acceso a una canción en una plataforma de streaming no suele conceder permiso para incluirla en una aplicación.

## Comprobación

1. Confirma que los tres archivos aparecen en assets/music/ con los nombres exactos.
2. Inicia el juego con npm start.
3. Activa la música en Ajustes.
4. Entra en una partida de Zaun y confirma que suena la pista correspondiente; repite en Piltover.
5. Retira temporalmente una pista para confirmar que funciona la música sintetizada de respaldo.

El audio de escritorio y la compilación móvil deben incluir assets/music/; comprueba el paquete final si estás preparando una publicación.
