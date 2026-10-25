# Plan de correcciones y pruebas antes del release de PC y Android

> Objetivo: dejar una lista única y concreta para retomar mañana, descansar hoy y no publicar un release sin comprobar los bloqueos actuales.
>
> Alcance: correcciones sin IA. No integrar Ollama ni activar funciones de IA como parte de estas tareas.

## Estado conocido

- [ ] **Mapa 3D negro en PC y Android.** PR #65: https://github.com/MarinaDP2006/Arcane-fangame/pull/65
  - Cambia el orden de capas entre el lienzo WebGL y la capa 2D.
  - Añade un color de fondo de reserva para Piltover.
  - Importante: son mitigaciones plausibles; no está confirmado que solucionen la causa real. Hay que verificar la escena dentro del juego.
- [ ] **Ventana de controles/guía bloqueada en móvil.** PR #66: https://github.com/MarinaDP2006/Arcane-fangame/pull/66
  - Hace desplazable el overlay en pantallas táctiles, adapta los paneles al viewport y mantiene accesible «Continuar».
  - Requiere prueba real en Android, no solo CI.
- [ ] **Comunicador sin IA y opciones acordes al progreso.**
  - PR #49: https://github.com/MarinaDP2006/Arcane-fangame/pull/49
  - PR #64: https://github.com/MarinaDP2006/Arcane-fangame/pull/64
  - Comprobar que las conversaciones siguen siendo escritas, que no aparece el modo libre y que no se ofrecen relaciones/opciones románticas adelantadas ni temas de personajes aún no conocidos.
- [ ] **Revisar CI de todos los PR relevantes** antes de generar el release. Una comprobación verde no sustituye las pruebas manuales.

## Orden recomendado para mañana

### 1. Antes de compilar

- [ ] Abrir los PR #65 y #66 y confirmar que sus ejecuciones de GitHub Actions terminaron correctamente.
- [ ] Revisar conflictos y archivos cambiados.
- [ ] No fusionar un PR con comprobaciones pendientes o fallidas.
- [ ] Confirmar qué commit/PR se incluye en cada build. No asumir que una compilación automática contiene cambios que todavía no se han fusionado o incorporado a la rama de release.

### 2. Prueba rápida de PC

- [ ] El juego inicia sin errores fatales.
- [ ] La vista 2D sigue funcionando.
- [ ] El mapa 3D muestra suelo, edificios y entorno; no queda negro.
- [ ] Se puede cambiar de vista o volver a 2D si falla WebGL.
- [ ] Se puede abrir y cerrar controles, menús y comunicador.
- [ ] Las opciones del chat respetan el capítulo/temporada y las relaciones actuales.

### 3. Prueba rápida de Android

- [ ] La ventana inicial de controles se puede desplazar.
- [ ] El botón «Continuar» responde y la ventana se cierra.
- [ ] No queda una capa invisible bloqueando toques.
- [ ] Los menús y el comunicador se pueden abrir y cerrar.
- [ ] El mapa 2D se ve y responde al tacto.
- [ ] El mapa 3D se ve y responde; si falla, se puede recuperar el control y seguir en 2D.
- [ ] Comprobar en orientación usada para jugar y revisar que los controles no queden fuera de pantalla.

### 4. Criterio de release

- [ ] Crear/descargar el instalador de PC solo después de pasar las comprobaciones anteriores.
- [ ] Sincronizar y compilar Android después de integrar los cambios seleccionados; instalar el APK resultante en el dispositivo y repetir la prueba táctil.
- [ ] Anotar el número de versión y el commit incluidos en cada build.
- [ ] Si el mapa 3D sigue negro o Android sigue bloqueado, **no declarar esas funciones corregidas**. Se puede posponer el release o publicar solo si se decide conscientemente mantener la limitación, documentándola y asegurando que el 2D sigue accesible.

## Diagnóstico si persiste el mapa negro

Registrar en PC la consola del navegador/DevTools y buscar errores de WebGL, Three.js, carga de recursos o excepciones de JavaScript. En Android, anotar el modelo del dispositivo, versión de Android, orientación y el punto exacto donde se bloquea. No borrar partidas ni reinstalar hasta tener claro que no hay riesgo para los datos guardados.

## Fuera de alcance

- No integrar IA ni configurar Ollama en este bloque.
- No añadir funciones narrativas nuevas antes de resolver los bloqueos de lanzamiento.
- No marcar el mapa 3D como arreglado basándose solo en que el código compila.
