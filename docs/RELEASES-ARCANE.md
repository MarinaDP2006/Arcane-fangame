# Compilar Arcane-fangame y crear releases

El fangame de Arcane vive en este repositorio (`MarinaDP2006/Arcane-fangame`, rama `main`). El mundo nuevo se lleva aparte, en `RIFTS-GEARS`.

## 1. El workflow «Compilar Arcane»

Todo está en un solo archivo: `.github/workflows/compilar.yml` (sustituye a los antiguos `build.yml` y `android.yml`).

| Job | Runner | Qué hace |
| --- | --- | --- |
| Comprobaciones del proyecto | Ubuntu | `npm ci --ignore-scripts`, `npm run check`, `npm run web` y `node --check` de todos los `.js` del repositorio. Lee la versión de `package.json`. |
| Windows (x64) | Windows | `npm ci` y `npm run dist:win`: instalador `Setup` y `portable`. |
| macOS (x64) y macOS (arm64) | macOS | `npm ci` y `npm run dist:mac` para una sola arquitectura: DMG y ZIP sin firmar. |
| Android (universal) | Ubuntu | JDK 21 (Temurin), Android SDK 36, `npm run android:sync` y `gradlew assembleDebug`. Con llave, también APK firmado y AAB. |
| Publicar Release (manual) | Ubuntu | Solo si lo lanzas a mano desde `main` con «publicar» marcado. |

Las compilaciones solo empiezan si las comprobaciones pasan, y cada sistema compila por separado: si falla uno, los demás siguen y el workflow queda en rojo. Ningún paso ignora errores.

Se ejecuta en cada push a `main`, en cada pull request hacia `main` y a mano. **Ni los push ni las etiquetas publican nada.**

## 2. Lanzarlo a mano y descargar los artefactos

1. Abre **Actions → Compilar Arcane (Windows, macOS y Android) → Run workflow**.
2. Elige la rama, deja **publicar** sin marcar y, si quieres, cambia **retencion** (días que se guardan los artefactos, de 1 a 90; por defecto 14).
3. Cuando termine, abre la ejecución y baja a **Artifacts**. Cada uno se llama `arcane-fangame-<versión>-<plataforma>-<arquitectura>`:
   - `arcane-fangame-1.27.0-windows-x64`
   - `arcane-fangame-1.27.0-macos-x64` y `arcane-fangame-1.27.0-macos-arm64`
   - `arcane-fangame-1.27.0-android-universal` (dentro, `arcane-fangame-1.27.0-android-universal-debug.apk`)

Con la CLI de GitHub: `gh workflow run compilar.yml --ref main -f retencion=14` y, al terminar, `gh run download <id-de-la-ejecución>`.

## 3. Publicar una versión

1. Sube el número de `version` en `package.json`, por ejemplo `1.28.0`, y fusiónalo en `main`.
2. Lanza el workflow a mano desde `main` con **publicar** marcado.
3. Si todas las compilaciones pasan, se crea la etiqueta `arcane-v1.28.0` y la Release con los instaladores y el APK. Si alguna falla, no se publica nada.

Crear una etiqueta o una Release a mano desde la web ya no lanza compilaciones.

## 4. Firma de Android (opcional)

Para publicar en Google Play se necesita una clave de firma propia y los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD` (Settings → Secrets and variables → Actions). Si existe la llave pero falta alguno de los otros tres, el job falla en vez de sacar un APK a medias. La llave se escribe en la carpeta temporal del runner y se borra al acabar. No uses ni subas el keystore al repositorio.

En pull requests desde forks GitHub no entrega secretos: solo se compila el APK de prueba.

## 5. Descargas

Las versiones aparecerán en la pestaña **Releases** de `https://github.com/MarinaDP2006/Arcane-fangame/releases`. No se debe anunciar una versión como estable hasta comprobar los builds y probar los instaladores.
