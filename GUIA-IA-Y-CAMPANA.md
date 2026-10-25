# Guía de IA y campaña

> Usa esta guía si quieres entender cómo se conectan los diálogos, la campaña y la IA, o si vas a modificar una escena. Que haya perfiles o instrucciones para Ollama no significa que el juego ya lo utilice. Después de tocar una escena, comprueba sus elecciones, condiciones y consecuencias en una partida real.

Esta guía explica cómo se construye el chat libre, dónde se editan las voces y los diálogos, cómo está organizada la campaña y qué conviene probar antes de publicar cambios.

## 1. Cómo funciona la IA

El chat libre opcional usa **KoboldCpp**. El juego no incluye un modelo de lenguaje propio: KoboldCpp debe ejecutarse por separado en un ordenador y cargar un modelo compatible. El juego también puede jugarse con los diálogos escritos si no quieres configurar la IA.

- **Código principal:** `src/js/ai.js`.
- **Función que construye las instrucciones del personaje:** `systemPrompt(G, id)`.
- **Conexión:** API compatible con OpenAI en `/v1/chat/completions`, normalmente en el puerto `5001`.
- **Guía de conexión:** este repositorio no tiene actualmente una guía independiente llamada `GUIA-KOBOLDCPP.md`; consulta los ajustes disponibles en la versión instalada y el código de `src/js/ai.js`. La guía [MODELOS-LOCALES.md](MODELOS-LOCALES.md) describe la preparación de Ollama, que todavía no está integrada en el juego.

La configuración de Ollama que existe en el repositorio es preparatoria: **no significa que Ollama esté integrado automáticamente en el juego**. El perfil está desactivado por defecto y debe mantenerse así hasta implementar y probar el proveedor. La aplicación actual selecciona KoboldCpp para el chat con IA, salvo que la IA esté desactivada en Ajustes.

### Qué contexto recibe el modelo

El prompt se construye a partir del personaje de la partida y del estado narrativo disponible, como el capítulo actual, los vínculos, la afinidad, las decisiones y los recuerdos recientes de la conversación. El objetivo es que el personaje respete lo que sabe y lo que ha vivido; aun así, un modelo puede cometer errores o inventar detalles, por lo que hay que probarlo.

No incluyas claves privadas, contraseñas ni datos personales reales en los prompts o en los archivos del juego.

## 2. Dónde editar cada parte

| Archivo | Para qué sirve |
| --- | --- |
| `src/js/ai.js` | Conexión con KoboldCpp, construcción del prompt y envío de mensajes. |
| `src/data/ai-voices.js` | Forma de hablar, trato al protagonista y límites de cada personaje para el chat libre. |
| `src/data/arcane-lore.js` | Pasado, vínculos y motivaciones que ayudan a mantener la caracterización. |
| `src/data/relations.js` | Relaciones y su estado dentro de la partida. |
| `src/data/chat.js` | Conversaciones y diálogos escritos. |
| `src/data/chat-expansion.js` | Contenido adicional del comunicador desbloqueado durante la partida. |
| `src/data/story.js` | Estructura narrativa y capítulos base. |
| `src/data/story-expansion.js` | Capítulos y escenas añadidos a la campaña. |
| `src/data/alternate-fates.js` | Opciones adicionales para ciertos destinos alternativos. |
| `src/js/game.js` | Flujo de juego, elecciones, afinidad, progreso y compatibilidad de las partidas guardadas. |

**Para cambiar una voz:** edita la entrada correspondiente en `AI_VOICES` y, cuando proceda, el perfil de `ARCANE_LORE`.

**Para cambiar una conversación con opciones escritas:** modifica `chat.js` o `chat-expansion.js`.

**Para ampliar la campaña:** trabaja en los archivos de historia y comprueba que los identificadores de capítulos y nodos, las condiciones y los destinos de cada elección sean válidos. No cambies IDs existentes sin revisar la compatibilidad con las partidas guardadas.

## 3. Estructura narrativa

La campaña se presenta en dos partes:

- **Parte I · El inicio:** rutas de Zaun y Piltover, con decisiones sobre suministros, pruebas, testigos y relaciones entre las ciudades. Se añadieron los capítulos identificados como `z9`, `z10`, `p9` y `p10` antes de la conclusión de esta parte.
- **Parte II · Las consecuencias:** continúa con las pérdidas, los refugios y las negociaciones que conducen al conflicto final. Los capítulos `t7` y `t8` amplían esta sección antes de su conclusión.

La campaña amplía la historia base con una trama paralela protagonizada por el personaje creado por quien juega; no sustituye por completo los acontecimientos originales de Arcane. La interfaz narrativa principal utiliza «partes», aunque algunos identificadores y nombres internos conservan la nomenclatura anterior por compatibilidad.

### Destinos alternativos

`src/data/alternate-fates.js` añade decisiones que pueden cambiar algunos destinos. Entre las situaciones contempladas están:

- **Silco:** intervenir durante la escena de la cena; requiere Valor 3.
- **Cassandra:** organizar una evacuación reforzada; requiere Valor 3.
- **Isha:** actuar sobre los conductos durante el encuentro con Warwick; requiere Ingenio 3.
- **Jayce y Viktor:** aislar los conductos del Hexcore; requiere Ingenio 4.
- **Jinx:** preparar una retirada y haber alcanzado Afinidad 5 con ella.

Estas opciones no equivalen a que todo el reparto pueda sobrevivir ni a que todos los finales hayan sido reescritos. Tras modificar una de estas escenas, revisa también sus consecuencias posteriores para evitar que el juego vuelva a tratar como fallecido a un personaje salvado.

Los IDs antiguos de rutas, capítulos, escenas y progreso se conservan para favorecer la compatibilidad con partidas anteriores. Para probar finales alternativos, es preferible usar una partida nueva o una copia de una ranura, no sobrescribir una partida personal.

## 4. Caracterización y fuentes

Los perfiles de personajes y los diálogos del juego son textos originales preparados para este proyecto. Se utilizan como referencia el mundo y los personajes de Arcane:

- [Sitio oficial de Arcane](https://www.arcane.com/es-es/)
- [Netflix Tudum: personajes de Arcane](https://www.netflix.com/tudum/articles/arcane-every-league-of-legends-character)
- [Netflix Tudum: resumen de la primera temporada](https://www.netflix.com/tudum/articles/arcane-season-1-recap)

Estas fuentes sirven como referencia general; las decisiones y escenas alternativas son contenido propio del juego.

## 5. Comprobaciones antes de publicar

Desde la carpeta del repositorio, con Node.js instalado, ejecuta:

```powershell
npm ci
npm run check
npm start
```

Después, prueba manualmente:

1. Crear una partida nueva tanto en la ruta de Zaun como en la de Piltover.
2. Avanzar por las elecciones nuevas y comprobar que cada opción lleva a una escena válida.
3. Verificar cambios de afinidad, relaciones, indicadores de decisiones y consecuencias.
4. Probar el guardado y la carga de una partida creada antes de los cambios.
5. Revisar el salto de la Parte I a la Parte II y los finales alternativos.
6. Probar el chat libre actual con KoboldCpp, con más de un personaje, y confirmar que la partida sigue funcionando con la IA desactivada. No marcar la integración con Ollama como hecha hasta conectar y probar el proveedor real.
7. Comprobar que los personajes salvados no vuelven a aparecer como fallecidos en escenas posteriores.

`npm run check` ayuda a detectar errores automáticos, pero no sustituye una partida completa de prueba. No se debe afirmar que una campaña está validada hasta haber realizado esas pruebas manuales en la versión que se vaya a publicar.
