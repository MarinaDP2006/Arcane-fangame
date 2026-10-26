# Piltover 3D: cinco referencias, cinco espacios explorables

> **En pocas palabras:** Este documento describe la intención visual y los espacios de Piltover dentro del mapa. Úsalo para comparar lo que se quiere construir con lo que realmente aparece en el juego. Las referencias sirven para orientar el diseño; no significan que todos los edificios estén modelados al detalle ni que el mapa ya haya pasado una revisión visual en todos los dispositivos.
| Imagen | Espacio jugable | Localización del mapa | Elementos arquitectónicos |
|---|---|---|---|
| 1 | Sala del Consejo | `consejo` | Mesa circular, asientos, piedra clara, ventanas monumentales geométricas, adornos de bronce |
| 2 | Laboratorio de Jayce y Viktor | `taller-jayce` | Estanterías, mesas técnicas, pizarra con esquemas, piezas hextec iluminadas |
| 3 | Torre y horizonte de las Hexpuertas | `hexpuertas` | Agujas, pasarelas, anillo luminoso, aeronaves suspendidas y torres art déco |
| 4 | Fortaleza de Stillwater | `muelle-stillwater` | Muros defensivos, almenas, torre de vigilancia, mar y luz crepuscular |
| 5 | Puente del Progreso | `puente` | Torres de piedra, cables tensores, arcos y agua inferior |

También se permite explorar espacios secundarios usando variantes arquitectónicas: Academia (`academia`), Ejecutores (`ejecutores`), Mansión Kiramman (`mansion-kiramman`), Plaza del Progreso (`plaza`) y Mercado de Artesanos (`artesanos`).

## Recorrido obligatorio en el juego

1. Acércate al lugar en el mapa abierto de Piltover y pulsa **E**.
2. Accede al escenario 3D; recorre el espacio usando **WASD o flechas**.
3. Encuentra la **pista hextec azul**, aproxímate y pulsa E para investigarla.
4. Busca el marcador luminoso del objetivo, y pulsa E otra vez.
5. Solo entonces se habilita la acción de la ubicación (empezar o continuar un capítulo, hablar o realizar una actividad).
6. Pulsa **Esc** o «Volver al mapa» para abandonar el espacio sin investigar.

El botón de Historia ya no inicia directamente capítulos de las ubicaciones explorables si no se ha completado el recorrido correspondiente. Se mantiene el progreso en el estado del juego como `G.acts["interior:" + chapterId]`.

## Implementación

- `src/js/piltover-interiors.js`: cinco composiciones 3D, reutilización de variantes, exploración y dos puntos interactivos.
- `src/js/game.js`: integración con actividades, personajes, objetivo narrativo y protección frente a saltarse la entrada.
- `src/js/world3d.js`: hitos exteriores 3D propios para Academia, Consejo, Mansión Kiramman, Plaza, Hexpuertas, Stillwater y Puente del Progreso; se reservan sus huellas para que los edificios aleatorios no los tapen.
- `src/css/styles.css`: interfaz de exploración clara y dorada.
- `src/index.html`: carga del motor interior antes de `game.js`.

El módulo de Zaun sigue intacto. No se han eliminado imágenes, audio, capítulos, personajes ni guardados.

## Protagonista y edificios (v1.22.0)

- Tu protagonista camina por el escenario en tercera persona: es el muñeco 3D de `avatars3d.js` con tu piel, pelo, peinado, ojos y accesorios del creador, y la ropa se deduce del retrato (chaqueta de cuero con solapas, abrigo de Piltover con botonadura dorada, uniforme con hombreras, vestido con corsé, bata, peto de taller, ropa de la calle con bufanda, top con vendas). Si existe `modelos/jugador.glb`, se usa ese modelo.
- Movimiento con WASD/flechas o con clic/toque en el suelo; clic en la pista o el objetivo cuando estás cerca equivale a pulsar E.
- Los edificios chocan: no se atraviesan mesas, columnas ni muros; los peldaños bajos se suben solos (escalinata de Stillwater, plataformas).
- Texturas de pincel generadas (piedra, metal, madera), columnas, estandartes, ventanas con arco, cúpulas y agujas, farolas, dirigibles, núcleo hextec, sombras del sol y polvo dorado en el aire.
- Stillwater y el Puente se rehicieron para que la pista y el objetivo queden sobre la explanada o el tablero (antes quedaban dentro de la geometría).
- Código común en `src/js/interior-kit.js`.

## Estado actualizado del mapa exterior

El mapa exterior ahora añade siluetas 3D específicas para los principales hitos de Piltover y despeja el generador de edificios a su alrededor. Esto mejora la lectura de la ciudad, pero sigue siendo geometría procedural creada en código; no son modelos oficiales ni una copia exacta de cada fotograma de la serie. Para acercarse más a una reproducción fiel faltan modelos artesanales basados en referencias de cada edificio, materiales/texturas específicos y revisión visual comparativa.

## Límites y comprobaciones que faltan

- Los escenarios son **procedimentales**, sin modelos arquitectónicos artesanales, texturas pintadas específicas, o navegación vertical en varias plantas. No es posible certificar que sean una recreación idéntica a los fotogramas.
- Los objetivos son exploración y examen de pistas; todavía no hay puzles singulares con herramientas para cada lugar.
- Debe probarse en Windows que el acceso desde el mundo abierto no queda bloqueado, las pistas se pueden encontrar, el botón E cierra correctamente y la historia sigue con cada elección.
- Las actividades secundarias y el comunicador global siguen siendo accesibles fuera del sistema de interiores; el requisito de entrar se aplica a las acciones contextuales de las ubicaciones.
- No se ha generado ni validado una compilación nueva de Windows en esta tarea.

**Pruebas recomendadas en Windows:** `npm ci`, `npm run check`, `npm start`, después iniciar una partida de Piltover, visitar los cinco escenarios, salir con Esc y regresar, activar objetivo y comprobar su continuación.


## Referencias de arte y relación con Zaun

Referencias:
- Universo oficial de Piltover: https://universe.leagueoflegends.com/en_US/region/piltover/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver
- Universo oficial de Zaun: https://universe.leagueoflegends.com/en_US/region/zaun/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Zaun
- Análisis del diseño de ambas ciudades: https://80.lv/articles/riot-games-on-designing-arcane-s-piltover-zaun
- Tablero visual de la autora: https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298 (si no abre en el navegador del agente, solicitar una captura).

Piltover debe leerse como metrópolis costera elevada sobre acantilados: avenidas, plazas, comercio marítimo, piedra marfil, oro/latón, cobre patinado, torres, agujas, balcones, cúpulas, Academia, Consejo, talleres y Hexpuertas. La Hextech debe parecer refinada y precisa, con cristales y energía mágica integrados en aparatos construidos con cuidado; no usar runas aleatorias como decoración.

La cultura se expresa con instituciones visibles, casas de comerciantes, talleres, academias, Ejecutores y celebraciones del progreso. Evitar que cada barrio sea igual de lujoso: representar diferencias de función, riqueza y acceso.

Piltover y Zaun deben ser dos ciudades interdependientes separadas por altura, riqueza y política, no dos mapas sin conexión. El horizonte de Piltover debe sugerir la profundidad bajo sus acantilados. Los accesos a Zaun deben llevar a ascensores, puentes, pasarelas, descensores o estaciones identificables. El Puente del Progreso es un hito espacial y narrativo.

Este documento define dirección artística y recorridos previstos; no certifica que todos los interiores y modelos se hayan inspeccionado visualmente en la compilación actual. Para generar escenarios completos con IA, usar Marble y SpAItial y corregir/exportar la malla desde Blender según src/models/maps/README.md.


## Dirección artística ampliada para IA y Freebuff

### Identidad visual y cultura
Piltover es la **Ciudad del Progreso**: metrópolis costera sobre los acantilados y pasos que la conectan con Zaun. Debe comunicar comercio, artesanía, investigación, prestigio y optimismo tecnológico, pero también desigualdad y poder de los clanes mercantiles. La arquitectura combina piedra y mármol claros, marfil, bronce trabajado, vidrio brillante, torres acanaladas, cúpulas, pasarelas elegantes y puertas marítimas monumentales. La hextech se presenta como tecnología refinada y controlada: cristales azules, mecanismos precisos, laboratorios ordenados, iluminación azul-dorada y símbolos de prestigio.

### Relación y accesos a Zaun
Piltover y Zaun son sociedades distintas pero conectadas. La ciudad debe tener rutas legibles hacia el Puente del Progreso, los accesos industriales y las zonas de transición. Desde la vista general deben entenderse las alturas, los acantilados, el canal/puertas marítimas y la ciudad que se extiende hacia abajo. El puente es un hito narrativo: para Piltover representa progreso; para muchos zaunitas recuerda abandono y control. No crear un portal mágico genérico ni un teletransporte sin explicación.

### Prompt visual específico
> Escenario 3D navegable de Piltover para un RPG narrativo de fantasía industrial pictórica. Gran ciudad costera construida sobre acantilados, por encima de los niveles de Zaun. Composición vertical legible desde un mapa 2D cenital y desde cámara de juego: avenidas, plazas, escalinatas, puentes entre mesetas, canales y accesos identificables. Arquitectura de mármol y piedra marfil, latón y bronce envejecido, vidrio, torres acanaladas, cúpulas, ornamento art nouveau, monumentos y edificios mercantiles de escala variada. Hextech refinada con cristales azules y luz dorada, laboratorios limpios, Academia, Consejo, Hexpuertas y Puente del Progreso como siluetas reconocibles. Luz diurna cálida, cielo azul y nubes bajo los acantilados; materiales ricos y pictóricos, no plástico brillante ni edificios repetidos. Calles y plazas deben ser realmente transitables, con suelo continuo y espacio para personajes. Sin HUD, texto falso ni personajes pegados a la arquitectura. Generar una malla 3D convencional editable/exportable, no solo una panorámica o Gaussian Splat.

### Referencias para investigar
- [Universo oficial de Piltover](https://universe.leagueoflegends.com/en_US/region/piltover/)
- [Galería oficial de Piltover](https://universe.leagueoflegends.com/en_US/region/piltover/?mv=image-gallery)
- [Wiki Fandom en español: Piltóver](https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver)
- [Referencia visual de avenida dorada](https://cdn.oneesports.gg/cdn-data/2023/09/LeagueofLegends_Piltover_VisionsofProgress.jpg)
- [Referencia visual del puente](https://img.4gamers.com.tw/ckfinder-th/image2/auto/2023-09/Arcane%20Piltover-230907-054726.jpg?versionId=9v8bFRByVg3MUaAam7AMxlCueivwNvPN)

Las imágenes externas se usan como referencias de análisis; no se deben empaquetar en el juego sin revisar derechos y procedencia. El aspecto final debe ser coherente, no una copia literal de una única imagen.
