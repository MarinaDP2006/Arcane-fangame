# Compilaciones y Releases — Arcane-fangame

> **En pocas palabras:** Esta guía ayuda a distinguir una compilación de prueba de una versión publicada para descargar. Las compilaciones de GitHub Actions pueden incluir archivos descargables temporales; una release es una publicación aparte. Antes de compartir un enlace, comprueba que la ejecución terminó correctamente, que el artefacto sigue disponible y para qué sistema operativo se creó.

Repositorio: [MarinaDP2006/Arcane-fangame](https://github.com/MarinaDP2006/Arcane-fangame). Versión fuente actual: la indicada en `package.json` (no copies ejemplos antiguos de versiones).

## Compilación automatizada

Workflow: [Compilar Arcane (Windows, macOS y Android)](../.github/workflows/compilar.yml).

- Se ejecuta en cada push a `main`, en cada PR a `main` y manualmente desde Actions.
- Primero valida `npm ci --ignore-scripts`, `npm run check`, `npm run web` y la sintaxis JavaScript rastreada.
- Si pasan las comprobaciones, compila en trabajos separados Windows x64, macOS Intel (x64), macOS Apple Silicon (arm64) y Android universal.
- Los builds automáticos no publican Releases. Los artefactos de Actions son temporales y se guardan durante el periodo de retención elegido.

## Descargar una compilación de prueba

1. Abre **Actions → Compilar Arcane (Windows, macOS y Android)**.
2. Entra en una ejecución con resultado correcto y baja a **Artifacts**.
3. Descarga solo el artefacto de tu dispositivo y descomprímelo si el navegador lo entrega como ZIP.

| Dispositivo | Archivo |
|---|---|
| Windows x64 | Instalador `Arcane-fangame-<versión>-Setup.exe` o portable `Arcane-fangame-<versión>-portable.exe`. |
| macOS Intel | `Arcane-Fangame-<versión>-mac-x64.dmg` o ZIP equivalente. |
| macOS Apple Silicon | `Arcane-Fangame-<versión>-mac-arm64.dmg` o ZIP equivalente. |
| Android / tableta | `arcane-fangame-<versión>-android-universal-debug.apk`, APK de prueba para instalar directamente. |

Los nombres concretos son los que adjunte la ejecución; no uses el nombre de una versión antigua como garantía del contenido.

### Android: prueba frente a publicación

- **Debug APK:** sirve para instalar y probar la app directamente en un dispositivo compatible. No es un paquete firmado para publicar en Google Play.
- **Release APK y AAB:** solo se generan si están configurados correctamente los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD`. El AAB es el formato de entrega habitual a Google Play.
- No guardes el keystore ni contraseñas en el repositorio, en Issues o en el artefacto de una compilación.

Antes de probar en Android, instala el APK en una tableta o teléfono real, abre una partida, verifica audio, controles táctiles, rotación, guardado y reanudación. Una compilación correcta no sustituye estas pruebas.

## Publicar una Release

1. Confirma que los cambios están en `main` y que `version` de `package.json` usa formato `X.Y.Z`.
2. Abre **Actions → Compilar Arcane (Windows, macOS y Android) → Run workflow**, elige `main`, deja retención entre 1 y 90 días y marca **Publicar la Release**.
3. El trabajo de publicación solo corre si todos los builds de Windows, macOS y Android han terminado correctamente.
4. Se crea o actualiza la Release `arcane-v<versión>` con los artefactos generados en esa ejecución. Si falla una plataforma, no se publica una versión parcial.

La publicación es manual. Un push normal no publica una Release. No marques una versión como estable hasta instalarla y probarla en los dispositivos que quieras soportar.

## Enlaces

- [Releases publicadas](https://github.com/MarinaDP2006/Arcane-fangame/releases)
- [Ejecuciones de compilación](https://github.com/MarinaDP2006/Arcane-fangame/actions/workflows/compilar.yml)
- [Pendientes](TAREAS-PENDIENTES.md)
