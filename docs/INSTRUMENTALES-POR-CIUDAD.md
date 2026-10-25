# Instrumentales por ciudad

El reproductor asigna una pista local a cada zona del juego:

- **Zaun:** `assets/music/sucker-instrumental.mp3`
- **Piltover:** `assets/music/a-bicentennial-instrumental.mp3`
- **Menú principal:** `assets/music/menu-theme.mp3`

## Instalar las pistas

Copia los archivos de audio que tengas derecho a utilizar en la carpeta `assets/music/` de la raíz del repositorio. Los nombres deben coincidir exactamente con los indicados arriba. No hace falta cambiar código para sustituir una pista por otra.

La aplicación hace un fundido al cambiar de ciudad y repite la pista en bucle. Si falta un archivo, el navegador no puede reproducirlo o la pista no se carga, el juego vuelve automáticamente a la música sintetizada original. Así la música opcional no bloquea la partida.

## Importante sobre distribución

Los títulos `Sucker` y `A Bicentennial` corresponden a música comercial protegida por derechos de autor. Este repositorio configura los nombres y la reproducción, pero no incluye ni descarga esas grabaciones. Añade únicamente archivos que estés autorizado a usar y distribuir; tener acceso a una canción en una plataforma de streaming no suele conceder permiso para incluirla en una aplicación.

## Comprobación

1. Coloca ambos MP3 en `assets/music/`.
2. Inicia el juego con `npm start`.
3. Activa la música en Ajustes.
4. Entra en una partida de Zaun y confirma que suena la pista correspondiente; repite en Piltover.
5. Retira temporalmente una pista para confirmar que funciona la música sintetizada de respaldo.

El audio de escritorio y la compilación móvil deben incluir la carpeta `assets/music/`; comprueba el paquete final si estás preparando una publicación.
