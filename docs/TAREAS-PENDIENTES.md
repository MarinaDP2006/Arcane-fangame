# Tareas pendientes — Arcane-fangame (versión actual)

Revisión: 27 de octubre de 2026. La hoja completa está en [`PENDIENTES.md`](../PENDIENTES.md).

## En ejecución

- [ ] Integrar la estructura pública de imágenes procedentes de `PILTOVER.zip` y `ZAUN.zip` en `web/assets/img/ciudades/`, servirlas desde `web-dist/` y validar las rutas en Render.
- [ ] Verificar el despliegue real de Render después de fusionar; el éxito de GitHub Actions no prueba que el dominio sirva el nuevo build.
- [ ] Probar manualmente Windows: inicio, mapa 2D, conversaciones, decisiones, misiones, vínculos, guardado y continuación.
- [ ] Probar los 15 minijuegos 3D (7 Piltover / 8 Zaun) y comprobar que se bloquean fuera de su ciudad, con controles de ratón/teclado/táctil.
- [ ] Completar pruebas visuales del rediseño de interfaz en distintas resoluciones y verificar foco de teclado/contraste.
- [ ] Actualizar capturas actuales y retirar el uso de capturas históricas como prueba de la interfaz final.

## En progreso / requiere más contenido

- [ ] Añadir escenas y consecuencias específicas donde el diario todavía presente solo objetivos.
- [ ] Profundizar los arcos de relaciones con escenas y reacciones persistentes.
- [ ] Añadir recursos de arte/sonido únicamente cuando mejoren una función real; no inflar artificialmente el instalador.

## Comprobaciones de referencia

```bash
npm ci
npm run check
npm run check:web
npm run dist:win
```

Al marcar una tarea como completada, anotar cómo fue probada. La configuración de Render y un build exitoso no sustituyen una visita real a la web ni una prueba jugada.
