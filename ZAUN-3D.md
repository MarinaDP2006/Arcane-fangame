# Zaun explorable: seis escenarios 3D

> **En pocas palabras:** Este documento reúne las ideas y los espacios previstos para el mapa de Zaun. La intención es que la ciudad se sienta vertical, industrial, densa y llena de luces y pasarelas. Las descripciones son una guía de diseño: el resultado actual puede ser más sencillo y hay que comprobarlo jugando, no solo leyendo el código.
| Imagen | Espacio | Lugar de entrada |
|---|---|---|
| 1 | Ciudad vertical, balcones y pasarelas, neón verde | Los Callejones |
| 2 | Árbol de las Luciérnagas, casas y plataformas sobre ramas | El Árbol de las Luciérnagas |
| 3 | Torre industrial central, anillos, brazos, neones violetas | La Fábrica |
| 4 | Fachada y local de La Última Gota | La Última Gota |
| 5 | Laboratorio de Singed, mesas, tubos y reactivos | Laboratorio del Sumidero |
| 6 | Jardín botánico, cúpula, plantas y quimtec | Invernadero oculto de Zaun (nuevo punto del mapa) |

Otras entradas de Zaun pueden reutilizar alguno de los escenarios con nombre propio: taller de Benzo, mercado, tejados, foso y escondite de Jinx.

## Cómo funcionan

1. Acércate a una de las entradas del mapa abierto y pulsa E.
2. Se abre el escenario tridimensional propio del lugar.
3. Explóralo con WASD o las flechas (Mayús para correr).
4. Busca una **pista azul**, acércate y pulsa E para inspeccionarla.
5. Dirígete a la **luz del objetivo** y vuelve a pulsar E.
6. Solo entonces se habilitan allí los diálogos, actividades y objetivos narrativos existentes. Pulsa Esc o «Salir al mapa» para abandonar el interior sin completar el objetivo.

Esto evita completar una misión de los lugares implementados pulsando «Continuar historia» desde el exterior. Sigue existiendo el comunicador global para conversaciones ya desbloqueadas y la historia de otras ubicaciones; es una primera fase de integración, no una reestructuración completa de todas las interacciones del RPG.

## Estado actualizado del mapa exterior

El mapa exterior ya añade siluetas 3D diferenciadas para varios lugares clave y evita que la generación aleatoria de edificios los tape. Los hitos están inspirados en la ambientación de Arcane, pero se construyen proceduralmente con geometría básica; no son copias exactas de los fotogramas. Para alcanzar ese nivel se necesitan modelos hechos a mano a partir de referencias, texturas propias y comparación visual ubicación por ubicación.

## Limitaciones conocidas y mejoras posteriores

- Los seis espacios son **geometría procedimental de Three.js**, no modelos 3D exactos de los fotogramas. Reproducen elementos arquitectónicos y paletas cromáticas, pero el acabado no es todavía una copia del 100 % ni tiene texturas artesanales o interiores de varias plantas realmente conectadas.
- Desde v1.22.0 tu protagonista se ve en tercera persona (muñeco con tu aspecto y ropa deducida del retrato, o `modelos/jugador.glb`), choca con la arquitectura y puede moverse con clic/toque. Los edificios tienen texturas de pincel, ventanas encendidas, chimeneas con humo, faroles, tendederos, botelleros y tanques de cultivo (ver `src/js/interior-kit.js`).
- Los edificios exteriores siguen usando mayoritariamente el generador urbano existente, con nuevos arcos de entrada de colores. Queda trabajo para recrear cada fachada con nivel de detalle equivalente al de las referencias.
- Las pistas son objetos interactivos físicos y diferentes en su descripción, pero requieren más animaciones y lógica de misiones para convertirse en rompecabezas complejos.
- Probar en Windows que la entrada no queda bloqueada por geometría, que los seis espacios funcionan y que los capítulos avanzan al salir.
- Se ha cambiado únicamente Zaun. Las imágenes de Piltover se recibirán aparte.

## Archivos

- `src/js/zaun-interiors.js`: escenas 3D, entrada y salida, cámara, movimiento y pistas.
- `src/js/game.js`: puerta obligatoria de exploración antes de mostrar acciones para los lugares de Zaun.
- `src/js/world3d.js`: hitos exteriores 3D propios para la Fábrica de Brillo, La Última Gota, Callejones, Benzo, Mercado, Sumidero, Escondite de Jinx, Invernadero, Árbol de las Luciérnagas, Puente de Zaun y Foso; sus huellas se reservan del generador aleatorio.
- `src/data/world.js`: nueva ubicación del invernadero.
- `src/css/styles.css`: interfaz a pantalla completa para la exploración.
- `src/index.html`: carga del módulo de exploración.

No se han ejecutado ni certificado pruebas de rendimiento o jugabilidad completas en Windows. Se deben realizar antes de afirmar que está terminado.


## Referencias de lore, cultura y diseño

- Universo oficial de Zaun: https://universe.leagueoflegends.com/en_US/region/zaun/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Zaun
- Universo oficial de Piltover: https://universe.leagueoflegends.com/en_US/region/piltover/
- Wiki en español: https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver
- Análisis de diseño de ambas ciudades: https://80.lv/articles/riot-games-on-designing-arcane-s-piltover-zaun
- Referencia visual de la autora: https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298 (si el agente no puede abrirla, pedir captura).

Zaun debe sentirse como una ciudad subterránea de hierro y cristal, construida en fisuras y cañones bajo Piltover. La arquitectura combina niveles densos, fachadas remendadas, hierro remachado, tuberías corroídas, vidrio de color, pasarelas, escaleras, ascensores y callejones. La niebla industrial debe crear profundidad, no ocultar rutas, personajes ni señales.

La cultura zaunita no se limita a la delincuencia: incluir mercados, talleres, bares, música, lugares comunitarios, santuarios, inventores, redes de apoyo y orgullo local. Los barones químicos, la desigualdad y los mercados negros deben expresarse mediante zonas y relaciones espaciales concretas.

Shimmer/Brillo debe mostrarse como una sustancia peligrosa ligada a laboratorios, distribución, control territorial y consecuencias físicas/narrativas; no como decoración púrpura en cada calle. Quimtec debe parecer experimental, industrial y a menudo improvisada. Hextech se diferencia por sus cristales/energía mágica y acabado más refinado, aunque pueden existir contrabando e investigación compartida.

La ciudad necesita conexiones jugables con Piltover: puentes, descensores/ascensores, escaleras, túneles, pasarelas y estaciones. El Puente del Progreso es un hito con significado político diferente para cada ciudad. Los POI y accesos deben coincidir con el mapa 2D y los IDs de src/data/world.js.

Para el mapa completo, no pedir a Freebuff que sustituya el escenario por edificios procedurales. Generar y comparar mundos independientes con Marble (https://marble.worldlabs.ai/) y SpAItial (https://spaitial.ai/), corregir la mejor base en Blender y exportar GLB convencional. Comprobar los formatos: un Gaussian Splat no es automáticamente una malla GLB con colisiones. El estado real está en PENDIENTES.md y src/models/maps/README.md.


## Dirección artística ampliada para IA y Freebuff

### Identidad visual, cultura y shimmer
Zaun es la **Ciudad de Hierro y Cristal**, una ciudad subterránea que se extiende por cañones, fisuras y niveles bajo Piltover. No es simplemente Piltover recoloreada de verde: tiene arquitectura remendada, densidad, verticalidad, comercio callejero, talleres, mercados negros, laboratorios, rivalidad entre barones químicos y una comunidad orgullosa, inventiva y resistente. Combina hierro en celosía, remaches, metal oxidado, tuberías, madera reutilizada, vidrio de colores, luces químicas, humo, pasarelas y edificios construidos unos sobre otros. Debe haber zonas habitadas y vibrantes además de lugares tóxicos y peligrosos.

El **shimmer** es una sustancia quimtec peligrosa y potente con efectos físicos y sociales; debe aparecer como producto clandestino, rastro químico, luz magenta/violeta o verde según la escena, laboratorios y conflictos de poder. No llenar toda Zaun de líquido fluorescente: su presencia debe tener una función narrativa y concentrarse en lugares concretos. La quimtec es práctica, improvisada y arriesgada, en contraste con la hextech más regulada y prestigiosa de Piltover.

### Niveles y accesos
Representar niveles de altura claramente conectados: zonas altas y comerciales próximas a Piltover; niveles intermedios con mercados, talleres, tabernas y pasarelas; niveles inferiores con niebla industrial, canales de residuos, tuberías, maquinaria y calles más estrechas. Incorporar escaleras, ascensores/plataformas industriales, descensores, puentes y puntos de control donde tenga sentido. El Puente del Progreso y los pasos entre ciudades deben ser reconocibles y coherentes con el mapa 2D. La luz superior llega filtrada por humo y estructuras; las profundidades se iluminan con cristales, lámparas, vitrales y neones.

### Prompt visual específico
> Escenario 3D completo, navegable y coherente de Zaun para un RPG narrativo de fantasía industrial pictórica. Ciudad subterránea vertical en profundos cañones bajo Piltover, formada por niveles superpuestos de barrios, mercados, fábricas, laboratorios, talleres, tabernas, pasarelas y calles estrechas. Arquitectura de hierro remachado y celosía, acero y cobre corroídos, vidrio de colores, madera reutilizada, fachadas reparadas, escaleras, tuberías que conectan edificios, chimeneas, ascensores industriales, puentes, canales y rejillas que expulsan vapor. Luz crepuscular filtrada por humo, luces químicas verdes, cian y magenta usadas con intención, reflejos en suelo húmedo, zonas con niebla densa y zonas comerciales cálidas. Incluir mercados negros, puestos excéntricos, señales hechas a mano y barrios vivos; sugerir el tráfico de shimmer y la quimtec sin cubrir todo de neón. Diferenciar zonas superiores, intermedias y profundas, con rutas transitables a escala humana. No convertir la ciudad en ruinas vacías ni en una copia oscura de Piltover. Sin HUD, texto ilegible ni personajes incrustados en el escenario. Entregar una malla 3D convencional editable/exportable, no solo una panorámica o Gaussian Splat.

### Referencias para investigar
- [Universo oficial de Zaun](https://universe.leagueoflegends.com/en_US/region/zaun/)
- [Galería oficial de Zaun](https://universe.leagueoflegends.com/en_US/region/zaun/?mv=image-gallery)
- [Wiki Fandom en español: Zaun](https://leagueoflegends.fandom.com/es/wiki/Zaun)
- [Galería oficial: Zaun's Underbelly](https://cmsassets.rgpub.io/sanity/images/dsfx7636/universe/d7858e6a65fed5e14321604dbde4f144640bd795-1920x1067.jpg)
- [Arte conceptual de una calle de Zaun](https://www.djahalland.com/arcane)

Las referencias describen el mundo; no sustituyen una auditoría del GLB final. Revisar derechos de las imágenes antes de incluirlas como assets redistribuidos.
