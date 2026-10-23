# Publicar Arcane-fangame y crear releases

El fangame de Arcane vive en este repositorio (`MarinaDP2006/Arcane-fangame`, rama `main`). El mundo nuevo se lleva aparte, en `RIFTS-GEARS`.

## 1. Lanzar una versión

1. Sube el número de `version` en `package.json`, por ejemplo `1.28.0`, y fusiónalo en `main`.
2. En **Actions**, abre «Compilar escritorio (Windows y Mac)», pulsa **Run workflow**, marca **publicar** y ejecútalo. Haz lo mismo con «Compilar móvil (Android)».
3. Se crea la etiqueta `arcane-v1.28.0` y la Release con los instaladores y el APK.

También vale crear a mano la etiqueta `arcane-v<versión>` desde **Releases → Draft a new release**.

## 2. Crear los releases

Tras crear la etiqueta, entra en `Arcane-fangame → Actions` y espera a que terminen los workflows de escritorio y Android. El workflow de escritorio crea la Release con instaladores Windows, DMG y ZIP de macOS, y el de Android adjunta un APK de prueba. Si algún build falla, no anuncies la versión como estable.

Para publicar en Google Play se necesita una clave de firma propia y los secretos `ANDROID_KEYSTORE_BASE64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` y `ANDROID_KEY_PASSWORD`. No uses ni subas el keystore al repositorio.

## 3. Descargas

Las versiones aparecerán en la pestaña **Releases** de `https://github.com/MarinaDP2006/Arcane-fangame/releases`. No se debe anunciar una versión como estable hasta comprobar los builds y probar los instaladores.
