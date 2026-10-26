# PENDIENTES.md — Hoja de ruta del fangame de Arcane

> **Actualización de alcance — rama `limpieza-2d-sin-ia`:** se aplaza el desarrollo 3D y la integración de IA. La prioridad es mantener un juego 2D estable, usar correctamente las imágenes de `arcaneData/arte` y conservar sus créditos. Las tareas de validación de Blender/GLB que siguen en este documento son históricas y no deben tratarse como prioridad de implementación. No borrar archivos 3D ni originales artísticos hasta completar una auditoría de dependencias.

> **Propósito:** reunir en un único sitio todo lo que falta por validar, diseñar o implementar en el juego. Este documento es el contrato de trabajo para Freebuff y otros agentes. Una tarea solo se marca como terminada cuando hay código o activos reales, comprobaciones automáticas y una prueba de juego cuando corresponda.
>
> **Regla de trabajo:** la propietaria del repositorio creará, revisará y fusionará manualmente las PR. Los agentes pueden analizar, proponer y trabajar en ramas aisladas, pero no deben fusionar PR, sobrescribir `main`, borrar ramas ni abrir PR sin permiso expreso.

## 0. Estado real comprobado en el repositorio

Última revisión: 26 de octubre de 2026.

- [x] El PR #75, «Sustituir el mapa procedural por escenarios de Blender/GLB», aparece como **fusionado en `main` el 26-10-2026**. No hay que borrarlo ni volver a abrirlo para recuperar sus cambios: ya están en la rama principal.
- [x] Existen `src/models/maps/piltover.blend` (aprox. 41 MiB) y `src/models/maps/zaun.blend` (aprox. 39 MiB).
- [x] Existen `src/models/maps/piltover.glb` (aprox. 24,5 MiB) y `src/models/maps/zaun.glb` (aprox. 23 MiB).
- [x] El renderizador 3D intenta cargar el GLB de la ciudad elegida y conserva una alternativa 2D si falla la carga.
- [x] El repositorio ya contiene un sistema de avatares 3D (`src/js/avatars3d.js`) y modelos GLB en `src/models/`; `src/js/world3d.js` crea actores para el jugador, personajes destacados y guardias.
- [ ] **No está confirmado en esta revisión que los dos mapas GLB se vean y se jueguen correctamente dentro de una compilación real.** La existencia de los archivos no demuestra que funcionen sus materiales, escala, colisiones, navegación, puntos de interés o rendimiento. No declarar terminado hasta comprobarlos.
- [ ] El rediseño global de interfaz descrito más abajo es una especificación pendiente. Las imágenes de referencia son conceptos visuales, no una implementación CSS/HTML del juego.
- [ ] Corregir la discrepancia de documentación: `src/js/avatars3d.js` usa una altura objetivo de **22 unidades de mundo** para los avatares; el README del mapa aún menciona una figura de 1,7 unidades. Tomar el valor del código como referencia provisional y confirmar la proporción con los modelos reales.

Referencias de código:
- [PR #75 ya fusionada](https://github.com/MarinaDP2006/Arcane-fangame/pull/75)
- [Mapa 3D](https://github.com/MarinaDP2006/Arcane-fangame/blob/main/src/js/world3d.js)
- [Avatares 3D](https://github.com/MarinaDP2006/Arcane-fangame/blob/main/src/js/avatars3d.js)
- [Definición de ciudades, lugares y misiones del mundo](https://github.com/MarinaDP2006/Arcane-fangame/blob/main/src/data/world.js)
- [Modelos incluidos](https://github.com/MarinaDP2006/Arcane-fangame/tree/main/src/models)
- [Guía de escenarios](https://github.com/MarinaDP2006/Arcane-fangame/blob/main/src/models/maps/README.md)

### Cómo marcar el trabajo
- `[ ]` pendiente.
- `[x]` implementado y validado con la prueba indicada.
- `[~]` trabajo parcial/prototipo o pendiente de prueba manual. No se considera finalizado.
- No marcar como terminado un diseño solo porque una IA haya generado una imagen bonita, un mapa de muestra o un modelo que aún no se ha probado dentro del juego.

---

## 1. Prioridad P0 — Validar los mapas 3D que ya están en main

### 1.1 Abrir, inspeccionar y validar los cuatro activos
- [ ] Abrir `piltover.blend` y `zaun.blend` con Blender y comprobar que no estén vacíos, dañados ni dependan de recursos externos que solo existan en el PC del autor.
- [ ] Abrir ambos GLB en un visor glTF/Blender y comprobar mallas, materiales, texturas, orientación, normales, escala, origen y nombres de objetos.
- [ ] Confirmar que ambos GLB corresponden a una ciudad completa, no solo a una panorámica, un suelo aislado o una representación tipo Gaussian Splat sin geometría utilizable.
- [ ] Confirmar texturas embebidas, materiales PBR y ausencia de rutas locales absolutas.
- [ ] Medir el tamaño en memoria y la fluidez en el hardware objetivo. Si hace falta, optimizar mallas/texturas sin destruir el aspecto pictórico.
- [ ] Ejecutar el exportador/validador de Blender que existe en `tools/blender/export_arcane_map.py` con ambos proyectos y documentar errores encontrados.
- [ ] Revisar el resultado real en el juego con el zoom mínimo, medio y máximo, vista cenital y cámara inclinada; revisar también cambio Piltover↔Zaun y el fallback 2D cuando WebGL o un archivo falla.
- [ ] Hacer una prueba de rendimiento en Windows y, si se distribuye allí, Android/web; si la versión móvil no soporta bien la escena completa, ofrecer una calidad reducida sin romper la alternativa 2D.

### 1.2 Geografía y puntos de interés (POI)
- [ ] Mantener la zona de juego de referencia de 3000 × 2200 unidades.
- [ ] Alinear edificios y suelo con las coordenadas de `src/data/world.js`. En el mapa 3D, el render usa ejes X/altura Y/profundidad Z. Seguir la conversión y exportación descritas en el README del mapa.
- [ ] Verificar que cada rótulo/medallón se encuentre encima de su edificio real y que la cámara no apunte a una calle o fachada equivocada.
- [ ] Añadir y revisar los empties `POI__<id>` de `CITY_WORLD` para todos los lugares usados por la historia.
- [ ] **Piltover:** comprobar Academia, Taller de Jayce, Sala del Consejo, Jefatura de los Ejecutores, Mansión Kiramman, Plaza del Progreso, Mercado de Artesanos, Hexpuertas, Muelle de Stillwater y Puente del Progreso.
- [ ] **Zaun:** comprobar Puente del Progreso, Fábrica de Brillo, Foso de peleas, Tejados de las Chimeneas, La Última Gota, Callejones, Tienda de Benzo, Mercado de las Tuberías, Laboratorio del Sumidero, Escondite de Jinx e Invernadero oculto.
- [ ] Mantener el vínculo narrativo entre el Puente del Progreso de ambas ciudades, sin invertir las ciudades de destino.

### 1.3 Colisiones y movimiento — prueba imprescindible
- [ ] Comprobar que el personaje no atraviese paredes, suelos, edificios, barandillas o grandes tuberías.
- [ ] Comparar las huellas de colisión y la navegación de `world.js` con los edificios reales que aparecen en los GLB. **El fondo 3D visible y las colisiones del juego son sistemas distintos; no asumir que coinciden solo porque la cámara muestra un edificio.**
- [ ] Si las colisiones actuales se basan en rectángulos de los datos 2D, alinear esos datos con el escenario o crear una representación de colisión/zonas transitables apropiada. No dibujar geometría urbana falsa para disimular un problema.
- [ ] Evitar que los puntos de aparición, guardias, NPC, accesos a lugares y caminos principales queden dentro de una pared o en el vacío.
- [ ] Probar movimiento con teclado, ratón y táctil; verificar que el movimiento automático no elija rutas imposibles.

### 1.4 Dirección artística de cada ciudad
- [ ] **Piltover:** piedra marfil, oro envejecido, bronce/cobre verdoso, balcones ornamentados, arcos art nouveau, torres altas, cúpulas, puentes monumentales, Hexpuertas y mar de nubes. Luz diurna cálida, rica en volumen y profundidad; no convertirla en una ciudad genérica de bloques blancos.
- [ ] **Zaun:** viviendas superpuestas, hierro remachado, cobre oxidado, pasarelas y escaleras, tuberías que conecten de forma creíble, talleres, canales oscuros, luces químicas verdes y magenta, humo y atmósfera de ciudad subterránea. Debe sentirse densa, húmeda y vertical, no como Piltover oscurecida.
- [ ] Mantener un tratamiento de fantasía industrial pictórica, materiales ricos y siluetas claras; evitar el aspecto de maqueta gris, plástico brillante o generación 3D genérica.
- [ ] Inspeccionar el resultado a nivel de calle: las calles deben tener una escala humana y ofrecer espacios transitables, no solo resultar bonitas desde lejos.

Referencias autorizadas como punto de partida artístico (revisar licencias antes de redistribuir imágenes):
- [Universo oficial de Zaun](https://universe.leagueoflegends.com/en_US/region/zaun/)
- [Universo oficial de Piltover](https://universe.leagueoflegends.com/en_US/region/piltover/)
- [Proceso de arte de Arcane — Fortiche](https://forticheprod.com/blog/the-art-and-making-of-arcane-artbook-arcane/)
- [World Labs Marble](https://marble.worldlabs.ai/)
- [SpAItial](https://spaitial.ai/)

### 1.5 Prompt de generación de ciudades
Usar **dos generaciones y dos proyectos independientes**, no una imagen fusionada de ambas ciudades. Prompt base para Marble/SpAItial, sustituyendo el bloque artístico según la ciudad:

> Crea un mundo 3D amplio, continuo y navegable para un RPG narrativo de fantasía industrial pictórica inspirado en la dirección artística de Arcane. No es una ilustración plana ni una maqueta con edificios repetidos. Incluye calles conectadas, aceras, plazas, callejones, desniveles, escaleras, puentes, accesos, fachadas con profundidad, ventanas, balcones, materiales con desgaste, iluminación cinematográfica y zonas transitables a escala humana. Mantén una composición urbana coherente desde vista panorámica, cenital e interior de calle. No incluyas HUD, letras, menús ni personajes como parte fija de la arquitectura. Deja claros los lugares principales para poder anclar marcadores interactivos más adelante. Entrega el formato 3D editable/de exportación de mayor calidad disponible y especifica si es una malla convencional, un GLB o un Gaussian Splat.

**Bloque Piltover:** ciudad próspera en mesetas y acantilados sobre nubes; arquitectura clara de piedra marfil con oro envejecido y cobre patinado, puentes de arcos monumentales, cúpulas, agujas, art nouveau, plazas elegantes, Academia, Consejo y Hexpuertas; luz diurna azul-dorada. La ciudad debe conservar amplias avenidas y plazas.

**Bloque Zaun:** ciudad subterránea que desciende bajo Piltover; bóveda rocosa lejana, niveles verticales de viviendas y talleres, pasarelas de hierro, tuberías, chimeneas, canales, escaleras y callejones compactos; metal oscuro oxidado, madera reparada, cristal químico, neones verdes y magenta, niebla industrial y focos cálidos. Mantener líneas de visión legibles y calles navegables.

### 1.6 Blender y exportación final
- [ ] Corregir en Blender los artefactos de IA, partes flotantes, intersecciones, mallas rotas y materiales sin textura. La IA produce un borrador; Blender da coherencia y calidad de juego.
- [ ] Mantener una sola convención de ejes, origen, escala y orientación. No escalar por separado cada parte sin revisar los POI.
- [ ] Crear zonas/colliders transitables o alinear las colisiones usadas por el juego con el arte real.
- [ ] Exportar con texturas embebidas a `src/models/maps/piltover.glb` y `src/models/maps/zaun.glb`.
- [ ] Conservar los `.blend` fuente para las revisiones artísticas. Documentar versión de Blender y parámetros de exportación.
- [ ] Revalidar `npm run check` y crear una compilación limpia de Windows después de los cambios. Probar el ejecutable real; un CI verde por sí solo no valida el aspecto.

---

## 2. Prioridad P0 — Personajes, modelos 3D y renderizado sobre el mapa

### 2.1 Auditoría de modelos que ya existen
- [x] Hay modelos GLB en `src/models/`; no volver a pedir que se generen desde cero sin comprobar primero los activos existentes.
- [ ] Crear una tabla de auditoría por archivo: personaje, tamaño en bytes, número de mallas, materiales/texturas, altura real, orientación frontal, animaciones incluidas, licencia/fuente y resultado en juego.
- [ ] Revisar especialmente los GLB pequeños: comprobar su contenido y apariencia, no inferir su calidad solo por el tamaño.
- [ ] Identificar qué archivos son modelos completos, cuáles son bustos/recursos de prueba y cuáles se comportan como respaldo.
- [ ] Verificar que los modelos de los personajes destacados del mapa se carguen desde `src/models/` y que la ruta del paquete se conserve tras compilar.
- [ ] Mantener un modelo de respaldo si un archivo falta o falla; nunca ocultar errores devolviendo un objeto completamente negro o invisible sin aviso.

### 2.2 Escala, orientación y cámara
- [ ] Usar como referencia provisional la altura objetivo de 22 unidades definida en `src/js/avatars3d.js`; medir la geometría real de cada GLB y normalizarla sin modificar el original.
- [ ] Comprobar a tres distancias: vista general, conversación a distancia media y primer plano. El personaje debe ser reconocible sin parecer gigante ni convertirse en un punto.
- [ ] Confirmar pies en el suelo, centro de pivote correcto, frontal correcto, manos/armas no atravesando el cuerpo y pelo/accesorios visibles.
- [ ] Corregir la orientación importada en el adaptador de modelo; no rotar a mano un GLB compartido para arreglar un único personaje.
- [ ] Ajustar luz y sombras para que cada personaje contraste con el entorno sin parecer pegado como un recorte.
- [ ] Comprobar rendimiento y memoria al mostrar varios NPC; evitar cargar varias veces la misma geometría o textura cuando sea posible.

### 2.3 Animación, movimiento y actores
- [ ] Probar reposo, caminar, correr, giro, detenerse, saludar y transición de movimiento. Si el archivo no incluye animaciones, no afirmar que tiene animación real.
- [ ] Conservar la compatibilidad con el respaldo articulado existente, pero dar prioridad a modelos GLB fieles cuando sean válidos.
- [ ] Verificar que el avatar del jugador refleje el personaje creado: rostro, tono de piel, pelo, ropa, accesorios y silueta.
- [ ] Verificar que los personajes destacados de Piltover y Zaun aparezcan solo en zonas apropiadas para su presencia narrativa y no se dupliquen cuando la historia crea el mismo actor.
- [ ] Guardias de Piltover: uniformes coherentes, puestos de vigilancia, rotación hacia el jugador y distancia adecuada de entradas y caminos.
- [ ] NPC residentes: evitar apariciones dentro de paredes, tejados, agua, huecos o fuera del mundo; distribuirlos por calles transitables y usar rutinas ligeras.
- [ ] En conversaciones, encuadrar a ambos personajes y pasar a una cámara cercana sin tapar las opciones ni el texto.
- [ ] Revisar expresiones/gestos y animaciones faciales si los modelos disponen de ellos. Si no, priorizar una pose legible y cambios de cámara antes que simular funciones que el modelo no soporta.

### 2.4 Prompt para el agente de personajes
> Trabaja solo en la integración y validación de personajes 3D del repositorio Arcane-fangame. Primero inventaría y abre los GLB existentes; no generes sustitutos para activos válidos. Revisa `src/js/avatars3d.js`, `src/js/world3d.js`, las definiciones de personajes y los puntos de aparición en `src/data/world.js`. Mide alturas reales, materiales, orientación, animaciones, licencias y peso de cada archivo. Corrige la normalización sin alterar los originales, comprueba al jugador, personajes destacados, guardias y NPC en cámara cenital, media y cercana. Evita duplicados entre NPC ambientales y actores narrativos. No toques los mapas de Blender ni la interfaz global, no crees ni fusiones PR y no marques como probado lo que solo hayas inferido desde el código. Entrega una tabla antes/después, archivos modificados, pruebas ejecutadas y los defectos que requieren revisión humana.

---

## 3. Prioridad P0 — Rediseño visual integral de la interfaz RPG

**Estado:** especificación pendiente; las imágenes de referencia generadas son inspiración visual, no un rediseño instalado en HTML/CSS. No declarar el diseño implementado hasta que existan los cambios reales y se vea el juego ejecutándose.

### 3.1 Dirección artística común
- [ ] Transformar la interfaz para que parezca un RPG narrativo terminado, con jerarquía visual, espacios deliberados, tipografía legible y paneles integrados en el mundo.
- [ ] Base común: azul noche/petróleo, metal oscuro, líneas finas doradas, glifos hextec, marcos ornamentales discretos, superficies translúcidas y luz volumétrica en el escenario.
- [ ] Piltover: marfil, azul, oro y latón; iluminación limpia, simetría, piedra trabajada y decoración refinada.
- [ ] Zaun: carbón, hierro oxidado, verde químico y magenta; luces de neón puntuales, cristales y texturas usadas, sin hacer ilegible el texto.
- [ ] El cambio de ciudad modifica fondo, acentos, iconos ambientales y decoración, pero conserva la misma estructura de controles para que el jugador no tenga que aprender dos interfaces.
- [ ] Reducir tarjetas genéricas, rectángulos uniformes, degradados excesivos, botones flotantes arbitrarios y zonas vacías sin función.
- [ ] Utilizar retratos y modelos del juego; evitar imágenes aleatorias que no correspondan al personaje, al capítulo o al lugar.
- [ ] Crear estados hover, focus, seleccionado, deshabilitado, carga, error y confirmación; animaciones breves y no intrusivas.
- [ ] Comprobar lectura con ventana pequeña, escalado de Windows, mando/táctil si corresponde, y Android horizontal. El texto de historia nunca debe quedar tapado por el HUD.

### 3.2 Pantalla por pantalla: especificación de lo que debe verse

#### A. Inicio, carga y reanudación
- [ ] Fondo cinematográfico de la ciudad guardada o de un plano panorámico dividido entre Piltover y Zaun.
- [ ] Logo/título, progreso de carga discreto y mensaje del capítulo o partida que se va a reanudar.
- [ ] Si falla el fondo 3D, usar una ilustración 2D limpia y explicar solo el error técnico si es necesario; no mostrar una pantalla negra vacía.

#### B. Menú principal
- [ ] Fondo cinematográfico con profundidad, arquitectura, luz y movimiento ambiental suave.
- [ ] Opciones claras: **Continuar**, **Nueva partida**, **Elegir ciudad**, **Historia**, **Personajes/Comunicador**, **Códice**, **Ajustes**, **Créditos** y **Salir** cuando proceda.
- [ ] Mostrar nombre de la partida, ciudad, capítulo y último guardado si existe.
- [ ] Mantener el marco azul noche/dorado como base; el arte y los acentos cambian con la ciudad elegida.
- [ ] No entrar directamente en el mapa sin ofrecer continuar o iniciar una partida.

#### C. Selector de ciudad — pantalla clave
- [ ] Mostrar **ambas ciudades en una composición panorámica dividida**, Piltover iluminada a la izquierda y Zaun oscura e industrial a la derecha.
- [ ] Cada mitad debe tener ilustración reconocible, paleta propia, un símbolo, una breve descripción, ambiente y botón grande para elegir.
- [ ] La selección debe verse claramente enfocada; al confirmar, transición cinematográfica al creador de personaje o a la partida según el flujo elegido.
- [ ] Ciudad seleccionada determina el prólogo, lugar de origen, misiones iniciales, contactos disponibles, reacciones y acceso al otro distrito.
- [ ] El puente conecta las ciudades dentro del mundo; no convertir la selección inicial en una frontera que impida viajar después.

#### D. Creación del personaje original (OC)
- [ ] Diseñar un flujo por pasos, con vista previa persistente del personaje y posibilidad de volver atrás sin perder los datos.
- [ ] Paso 1: nombre, pronombres, aspecto general, edad adulta/adecuada al lore si se usan edades explícitas y descripción corta.
- [ ] Paso 2: apariencia — tono de piel, rostro, ojos, pelo, color, peinado, constitución, ropa, accesorios, marcas/cicatrices; cambios visibles en el avatar y retrato.
- [ ] Paso 3: origen — Piltover, Zaun u origen externo si la historia lo permite; barrio de crianza, clase social, oficio y acceso a recursos.
- [ ] Paso 4: antecedentes — familia, tutor, mentor, pérdida, deuda, afiliación, formación académica/técnica, vínculo con quimtec/hextec y secreto opcional.
- [ ] Paso 5: personalidad y atributos iniciales — por ejemplo, ingenio, valor, sigilo y carisma; asignación clara y sin opciones que no produzcan ningún efecto.
- [ ] Paso 6: resumen revisable de todas las elecciones, aviso de consecuencias principales sin spoilers graves y botón confirmar.
- [ ] No permitir combinaciones contradictorias sin explicarlas; ofrecer reglas de validación y alternativas narrativas en vez de bloquear al usuario arbitrariamente.
- [ ] Guardar el OC en la partida y permitir edición limitada posterior si no rompe la continuidad.

#### E. Prólogo y contextualización del OC en el canon
- [ ] Generar un prólogo diferente según ciudad y antecedentes; evitar una bienvenida genérica que ignore el perfil recién creado.
- [ ] Introducir al jugador de forma plausible en la historia de Arcane, sin sustituir de golpe las decisiones canónicas de los personajes principales.
- [ ] Mostrar contactos, localizaciones y objetivos coherentes con el origen.
- [ ] Mantener registro de lo que el jugador sabe en cada capítulo para evitar spoilers prematuros.
- [ ] Añadir consecuencias persistentes: reputación, relaciones, acceso a zonas, confianza de facciones, información disponible, conflictos, misiones desbloqueadas y reacciones en diálogos.
- [ ] El OC debe tener repercusión en el lore, pero las acciones del canon y sus personajes no deben cambiar de forma aleatoria ni contradictoria. Las variaciones deben proceder de elecciones y flags explícitos.

#### F. Juego principal / exploración del mundo
- [ ] Renderizar el mapa GLB completo de la ciudad activa y colocar encima el avatar real del jugador, personajes, guardias, NPC, nombres de lugares y elementos interactivos.
- [ ] HUD de RPG limpio: minimapa/atlas accesible, objetivo principal, objetivos secundarios, ciudad/distrito actual y botón de interacción contextual.
- [ ] Indicador de personaje cercano; al entrar en rango mostrar opciones reales como **Hablar**, **Investigar**, **Entrar**, **Recoger**, **Viajar** o **Iniciar actividad** según el contexto.
- [ ] Al tocar un lugar, mover al personaje hacia un punto alcanzable y abrir su menú solo cuando corresponda; no dejar al avatar andando dentro de paredes.
- [ ] Evitar que los marcadores 2D floten lejos del edificio, tapen al actor o aparezcan fuera de pantalla.
- [ ] Cámara con transición, inclinación y zoom cómodos; ofrecer recentrar la cámara y recuperar el mapa si se queda en un ángulo malo.
- [ ] Renderizar sombras, niebla y luces sin destruir la legibilidad ni consumir memoria de manera excesiva.
- [ ] Mantener una alternativa 2D funcional en caso de fallo del renderizador o de los activos.

#### G. Interacción con un lugar
- [ ] Al seleccionar una ubicación, mostrar un panel con nombre, descripción, ilustración/retrato, personajes presentes, servicios disponibles y misiones vinculadas.
- [ ] Botones contextuales coherentes: explorar, hablar, investigar, actividad/minijuego, viaje o regresar; ocultar acciones imposibles.
- [ ] Indicar si está bloqueado, por qué y cuál es el requisito, sin revelar spoilers no descubiertos.
- [ ] Mostrar cambios de reputación o recursos cuando sucedan, no en cada pulsación irrelevante.

#### H. Historia / escenas narrativas
- [ ] Presentación cinematográfica por capítulo y escena: título, fondo contextual, personajes presentes, texto por bloques legibles y opciones de diálogo claras.
- [ ] No avanzar automáticamente demasiado rápido; ofrecer continuar/pausar y permitir releer líneas recientes.
- [ ] Los resultados de una elección deben registrarse: flags, relaciones, inventario, objetivos, reputación y cambios futuros.
- [ ] Incluir historial reciente, resumen de capítulo y recuperación de la escena si el jugador cierra accidentalmente.
- [ ] La IA narrativa, si se habilita, será opcional y separada de la historia escrita que siempre debe poder jugarse sin proveedor externo.

#### I. Chat / Comunicador de personajes
- [ ] Interfaz tipo comunicador del universo: lista de contactos con retratos, estado, mensajes no leídos, última conversación y filtros.
- [ ] Conversación con burbujas diferenciadas, marca temporal, contexto y opciones de respuesta cuando la escena requiera controlar el canon.
- [ ] Desbloquear contactos en función de encuentros, confianza, capítulo y decisiones; no presentar como conocido a un personaje que el OC aún no conoce.
- [ ] Los mensajes pueden ofrecer pistas, rumores, encargos, consecuencias o relaciones; registrar las pistas que cambien la misión.
- [ ] Mostrar indicadores de relación/confianza solo cuando el sistema tenga datos reales para respaldarlos.
- [ ] Evitar que un chat libre altere misiones o lore sin actualizar el estado narrativo mediante acciones validadas.
- [ ] El modo de chat escrito y determinista debe seguir funcionando sin IA; si existe modo IA, separarlo claramente y ofrecer ajuste/opt-in.

#### J. Ficha del personaje
- [ ] Retrato grande y avatar 3D rotatorio; nombre, origen, antecedentes y afiliación.
- [ ] Atributos, competencias, inventario/equipo y reputación por facción.
- [ ] Relaciones con personajes, nivel de confianza y hechos importantes; indicar qué cifras son valores jugables y cuáles son narrativas.
- [ ] Registro de decisiones relevantes y consecuencias ya desbloqueadas, sin mostrar secretos no descubiertos.
- [ ] Poder ver y editar los aspectos permitidos del OC sin perder progreso.

#### K. Códice y atlas
- [ ] Códice con categorías: personajes, lugares, facciones, hextec, quimtec, objetos, historia descubierta y rumores.
- [ ] Distinguir entradas descubiertas, parciales y bloqueadas; las imágenes y descripciones deben corresponder al juego.
- [ ] Atlas con ambos mapas, distritos, viajes, misiones y POI; leyenda legible y filtros por servicios/personajes/objetivos.
- [ ] Al seleccionar un lugar del atlas, mostrar descripción y estado de acceso; centrar la cámara al elegir “viajar” solo si la historia lo permite.

#### L. Diario de misiones y objetivos actualizados
- [ ] Separar misiones principales, secundarias, personales/de relación, exploración, actividades y ocultas.
- [ ] Cada misión incluye título, contexto conocido, objetivo actual, pasos opcionales, personaje implicado, ubicación y recompensa/impacto conocido.
- [ ] Los objetivos cambian con flags reales de la partida: “hablar con X”, “encontrar la pista”, “volver al taller”, “entregar el objeto”, etc.; no quedarse en un texto estático tras completar el paso.
- [ ] Diferenciar activo, actualizado, completado, fallido y bloqueado. Mostrar una notificación discreta solo cuando exista cambio.
- [ ] Vincular objetivos con el HUD y el atlas; destacar el camino sin teletransportar ni obligar a la ruta más directa.
- [ ] Revisar las misiones existentes y crear una tabla de validación que cubra todos los finales y resultados relevantes.

#### M. Minijuegos y actividades
- [ ] Auditar los minijuegos actuales y sus puntos de entrada en `src/data/world.js`, `src/js/minigames.js` y `src/js/minigames-extra.js`. No reemplazar lo que ya funciona sin pruebas.
- [ ] Actualizar interfaz y dificultad para que combinen con el mundo RPG, se puedan entender en segundos y tengan estados claros de inicio, éxito, fallo y volver.
- [ ] Priorizar las actividades que ya existen: runas, circuito hextec, tiro de Ejecutores, foso de peleas, carrera por tejados, chatarra, Chompers/trampas y análisis químico.
- [ ] Cada minijuego debe afectar solo a recompensas/flags diseñados: ingenio, valor, sigilo, carisma, materiales, relación, pistas o progreso de misión.
- [ ] Evitar que repetir una actividad permita conseguir recursos/reputación sin límite, que una derrota rompa la historia o que la misma recompensa se entregue dos veces.
- [ ] Mejorar controles, instrucciones, feedback, accesibilidad y dificultad móvil; revisar foco de teclado y botones táctiles.
- [ ] Comprobar que completar/fallar una actividad actualice el diario y que la misión pueda continuar.

#### N. Inventario, objetos y recursos
- [ ] Inventario con icono/imagen, cantidad, categoría, descripción, origen y usos posibles.
- [ ] Diferenciar objetos de misión, pistas, consumibles, equipo y coleccionables.
- [ ] Mostrar claramente cuándo no se puede gastar, entregar o descartar un objeto.
- [ ] Vincular recogida/uso/entrega con el progreso de misión y evitar duplicados en guardados.

#### O. Ajustes
- [ ] Secciones claras: gráficos, audio, controles, idioma, accesibilidad y opciones de historia/IA si existen.
- [ ] Calidad gráfica, sombras, modo 3D/2D cuando sea compatible, cámara, volumen y subtítulos.
- [ ] No mostrar opciones falsas ni botones sin acción; persistir preferencias y probar reinicio.
- [ ] Conservar el estilo base azul noche/dorado, con acentos de ciudad; usar fondos de menús 3D solo si son estables y tienen alternativa 2D.

#### P. Pausa, guardado, carga y finales
- [ ] Menú de pausa que no tape toda la pantalla innecesariamente: continuar, guardar, cargar, ajustes, volver al menú.
- [ ] Confirmación antes de sobrescribir o borrar partidas; indicador de hora/capítulo/ciudad al guardar.
- [ ] Guardar OC, ciudad, decisiones, flags, relaciones, inventario, estado de misiones y minijuegos.
- [ ] Probar restauración de partida tras cerrar y reabrir el juego.
- [ ] Finales coherentes con ciudad, relaciones y decisiones; mostrar resumen de decisiones y permitir volver a una partida anterior cuando corresponda.

#### Q. Web, Windows, Android y accesibilidad
- [ ] Comprobar todas las pantallas en ventana Windows, pantalla grande, Android horizontal y tamaños estrechos; no dar por adaptado un diseño por funcionar en una sola resolución.
- [ ] Asegurar navegación mediante teclado, ratón y controles táctiles según plataforma.
- [ ] Revisar rendimiento al combinar mapa, sombras, modelos, texturas, música y UI.
- [ ] Validar empaquetado: rutas relativas de GLB, texturas, audio, fuentes y archivos de historia.
- [ ] Probar el mapa 2D de respaldo, errores de WebGL, archivos ausentes, partida antigua y partidas nuevas.
- [ ] Probar y traducir las cadenas de interfaz que se hayan añadido; no dejar mezclas accidentales de idiomas.

---

## 4. Prioridad P1 — Historia, diálogos, relaciones y continuidad del canon

- [ ] Hacer una pasada completa de prólogo, capítulos y finales partiendo de un guardado limpio en Piltover y otro en Zaun.
- [ ] Revisar todas las opciones de diálogo, respuestas de personajes, entradas del códice, marcadores de misiones y minijuegos vinculados.
- [ ] Definir un esquema coherente de estado narrativo: origen, antecedentes, capítulo, decisiones, alianzas, relaciones, reputación, pistas, misiones y acontecimientos.
- [ ] Crear una matriz de consecuencias: para cada elección importante, especificar qué flag cambia, qué diálogos reacciona, qué objetivo se actualiza y qué contenido queda disponible/bloqueado.
- [ ] Hacer que el OC influya en el lore mediante conexiones plausibles: origen, oficio, reputación, contactos, favores y decisiones. No hacer que reemplace automáticamente a Vi, Jinx, Caitlyn u otros protagonistas en acontecimientos que les pertenecen.
- [ ] Añadir contexto sin spoilers: revelar hechos en el orden en que el personaje jugador los puede conocer.
- [ ] El chat de personajes, la historia principal y el diario deben leer el mismo estado de partida; no mantener tres sistemas de consecuencias independientes.
- [ ] Probar KoboldCpp/IA narrativa solo como modo opcional si esa integración sigue en alcance. No añadir Ollama, una API, claves o nuevos servicios como requisito silencioso.
- [ ] Probar que los finales y los minijuegos se disparen bien tras decisiones de la historia libre.
- [ ] Traducir correctamente cualquier texto nuevo a los idiomas que el juego ya soporte.

---

## 5. Rediseño: prompt completo para el agente de interfaz

Usar este prompt cuando la auditoría inicial esté terminada y se autorice la rama de diseño:

> Eres el responsable de dirección artística de interfaz y frontend de **Arcane-fangame**, un RPG narrativo con exploración de Piltover y Zaun. Inspecciona primero el HTML, CSS, menús, pantallas, sistema de navegación, historia, comunicador, ficha, códice, atlas, misiones, minijuegos, ajustes y guardado que ya existen. No hagas un prototipo aislado: implementa el rediseño en las pantallas reales manteniendo las funciones existentes.
>
> **Dirección visual:** RPG cinematográfico, fantasía industrial pictórica inspirada en Arcane; marco común azul noche/petróleo y oro fino. Piltover utiliza marfil, latón, oro envejecido y azul; Zaun utiliza carbón, hierro oxidado, verde químico y magenta. Texturas y materiales elegantes, profundidad, iluminación contextual y composición clara. Evita el estilo de panel web genérico, tarjetas repetidas, tipografía demasiado pequeña, texto sobre fondos ruidosos, botones sin función o animaciones que estorben.
>
> **Debes diseñar e implementar por separado:** inicio/carga; menú principal; selector panorámico dividido de Piltover/Zaun; creador de personaje por pasos con vista previa 3D; prólogo contextual al OC; exploración del mapa 3D con HUD y minimapa; menú de localización; historia/escenas; comunicador de personajes; ficha del OC; relaciones; códice; atlas; diario de misiones; minijuegos; inventario; pausa/guardado/carga; ajustes y finales. Para cada pantalla conserva la lógica que existe, mejora jerarquía/legibilidad, añade estados hover/focus/seleccionado/deshabilitado/cargando y enlaza cada botón con una acción real.
>
> El selector de ciudad debe mostrar ambas ciudades al mismo tiempo. En el juego, el HUD no debe tapar a los personajes ni el texto; los objetivos deben actualizarse según la partida. El creador del OC debe recoger origen, antecedentes, afiliación, aspecto, personalidad y atributos, y esas elecciones deben tener consecuencias persistentes en diálogos, contactos, misiones, reputación y reacciones, con continuidad plausible del canon.
>
> Los mapas GLB y avatares existentes son activos reales del juego: no los sustituyas por imágenes planas ni por edificios generados con cajas. Usa imágenes conceptuales solo como referencia, no como contenido final de interfaz. Mantén compatibilidad con Windows y Android horizontal y un fallback razonable cuando WebGL no esté disponible.
>
> **Proceso obligatorio:** primero entrega auditoría de pantallas y un plan de cambios, luego trabaja en una rama aislada de diseño. No modifiques `world3d.js`, los GLB/BLEND ni la lógica de misiones si no es imprescindible; pide autorización antes de cruzar ese alcance. Ejecuta `npm run check`, revisa errores de consola, comprueba que todos los controles funcionen y entrega capturas comparativas de las pantallas implementadas. No abras ni fusiones PR; la propietaria lo hará manualmente.

---

## 6. Freebuff: cómo organizar los agentes y qué decir primero

Freebuff Desktop permite coordinar trabajo en paralelo mediante agentes en espacios de trabajo separados. No empieces enviando a cuatro agentes a modificar todo el repositorio a la vez: primero pide una auditoría, recibe el informe y luego asigna las tareas con límites de archivos. La documentación pública de Freebuff explica el trabajo de agentes especializados y las áreas de implementación/revisión: [README oficial de Freebuff](https://github.com/CodebuffAI/freebuff).

### Primer mensaje para el chat nuevo de Freebuff

Copia y pega este mensaje primero. Es una auditoría sin cambios para que el agente aprenda el proyecto antes de editar:

> Trabajamos en mi repositorio GitHub `MarinaDP2006/Arcane-fangame`. Antes de cambiar nada, confirma qué carpeta/repositorio y rama tienes abiertos; ejecuta `git status -sb`, identifica el último commit y lee `PENDIENTES.md`, `src/models/maps/README.md`, `src/js/world3d.js`, `src/js/avatars3d.js`, `src/js/world.js`, `src/data/world.js`, `src/js/scenes.js`, `src/js/game.js`, los CSS y los scripts de pruebas.
>
> Importante: el PR #75 ya está fusionado en `main`. Los escenarios `src/models/maps/piltover.blend`, `zaun.blend`, `piltover.glb` y `zaun.glb` ya existen. Comprueba qué está realmente implementado y qué necesita validación; no afirmes que has inspeccionado visualmente los GLB si no puedes abrirlos con una herramienta 3D.
>
> **En esta primera fase no edites archivos, no instales paquetes, no hagas commit/push, no crees ni fusiones PR y no borres ramas.** Entrega: (1) arquitectura actual; (2) matriz implementado/parcial/pendiente; (3) defectos reproducibles y pruebas disponibles; (4) dependencias y riesgos; (5) plan dividido en agentes de mapa, personajes, interfaz y sistemas narrativos; (6) los archivos concretos que tocaría cada agente; (7) orden recomendado de implementación y criterios de aceptación. Espera mi aprobación antes de modificar el repositorio.

### Después de recibir la auditoría
- [ ] Abrir una tarea de mapas/colisiones aislada.
- [ ] Abrir una tarea de personajes/animación aislada, evitando los mismos archivos que el agente de mapas.
- [ ] Abrir una tarea de interfaz en otra rama/espacio de trabajo.
- [ ] Abrir la tarea narrativa/objetivos después de que el auditor identifique dónde se guarda el estado de partida.
- [ ] Ejecutar un agente revisor al final, sin que modifique automáticamente el trabajo de los demás.

Reglas para todos los agentes:
1. No escribir en `main`, no fusionar PR ni borrar ramas.
2. No marcar una tarea hecha porque compile solamente: especificar pruebas y resultado.
3. No generar arquitectura procedural como sustituto de los GLB; los mapas son activos de escena completos.
4. No tocar el mismo archivo desde dos agentes paralelos.
5. Informar de archivos modificados, decisiones, comandos, resultados y limitaciones reales.
6. No reemplazar ni sobrescribir modelos fuente; conservar originales y licencias.
7. Evitar cambios de historia que no estén enlazados al estado real de la partida.

**Selección del modelo:** el catálogo público de Freebuff consultado enumera GPT-6 Luna y GPT-6.1 Sol, entre otros; no encuentro un modelo publicado literalmente como «GPT Astra 6». La lista visible en tu selector puede variar por versión o disponibilidad, así que elige el modelo de razonamiento/código que aparezca ahí. La calidad del prompt, los límites de cada tarea y la revisión de cambios importan más que ejecutar todos los agentes a la vez.

---

## 7. Orden de trabajo recomendado para no romper el juego
1. **Validar mapas ya presentes**: abrir ambos .blend/.glb, probar el render, POI, colisiones, escala y fallback 2D.
2. **Validar actores 3D**: jugador creado, modelos de personajes, guardias, NPC, animaciones y encuadre.
3. **Implementar el rediseño visual** pantalla a pantalla, conservando la lógica y rutas existentes.
4. **Conectar el creador OC con la narrativa**: origen, vínculos, relaciones, decisiones, flags, diálogo y misiones.
5. **Revisar misiones y minijuegos** para que actualicen el estado de la partida y el HUD.
6. **Hacer pruebas integrales** de una partida de Piltover y una de Zaun, nuevos guardados, cargas, finales y fallback 2D.
7. **Crear PR manuales pequeños**, una por tema, con capturas, resultados de `npm run check` y lista exacta de riesgos conocidos.

No cerrar el proyecto hasta que una partida real permita crear el OC, elegir ciudad, explorar un mapa 3D, ver y hablar con personajes, recibir objetivos actualizados, completar actividades y conservar las consecuencias al guardar/cargar.


---

## 9. Dirección artística unificada: lore, mapa 2D y escenarios 3D con Marble + SpAItial

### Fuentes visuales y de lore
- Zaun oficial: https://universe.leagueoflegends.com/en_US/region/zaun/
- Piltover oficial: https://universe.leagueoflegends.com/en_US/region/piltover/
- Zaun en español: https://leagueoflegends.fandom.com/es/wiki/Zaun
- Piltóver en español: https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver
- Tablero de referencia de la autora: https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298
- Diseño de ambas ciudades: https://80.lv/articles/riot-games-on-designing-arcane-s-piltover-zaun

Las wikis pueden mezclar continuidades distintas de Runeterra; usar el arte de Arcane y las fuentes oficiales como referencia visual primaria. Registrar contradicciones en vez de mezclarlas sin criterio. La página de Neta no pudo verificarse desde el lector web de esta sesión: Freebuff debe abrirla en su navegador y pedir una captura si no carga. No fingir que ha visto la imagen.

### Requisitos de lore y arquitectura

**Piltover**
- [ ] Metrópolis costera elevada sobre acantilados, comercio marítimo, puertas marítimas, avenidas y plazas transitables.
- [ ] Piedra marfil, latón/oro envejecido, cobre patinado, arcos, balcones, cúpulas, agujas y ornamentación art nouveau.
- [ ] Academia, Consejo, talleres, casas de comerciantes, Hexpuertas y presencia de los Ejecutores como hitos reconocibles.
- [ ] Cultura de comercio, prestigio, educación, invención y fe en el progreso; representar también desigualdad y control institucional.
- [ ] Hextech refinada: cristales/energía mágica y aparatos precisos; no añadir runas aleatorias sin función.

**Zaun**
- [ ] Ciudad subterránea en fisuras y cañones, niveles verticales, pasarelas, escaleras, ascensores, puentes y calles conectadas.
- [ ] Hierro remachado, tuberías corroídas, vidrio coloreado, metal recuperado, talleres, mercados, bares, canales y humo por capas.
- [ ] Smog/Zaun Gris visible en profundidad, sin tapar navegación, personajes ni señalización.
- [ ] Cultura vibrante e inventiva: vendedores, música, comunidad, santuarios, redes informales, mercados negros y rivalidad industrial; no representar solo pobreza y fábricas.
- [ ] Barones químicos, laboratorios y comercio ilícito deben tener espacios coherentes con su poder.
- [ ] Shimmer/Brillo debe tener producción/distribución y consecuencias visibles (laboratorios, recipientes, señales de riesgo y control territorial cuando la misión lo justifique), no ser decoración omnipresente.
- [ ] Distinguir quimtec industrial, experimental y corrosiva de Hextech refinada basada en cristales y energía mágica.

**Conexión**
- [ ] Mostrar Piltover arriba y Zaun en niveles inferiores; diseñar puentes, rampas, escaleras, ascensores/descensores, pasarelas, túneles y estaciones.
- [ ] El Puente del Progreso debe ser reconocible y políticamente cargado.
- [ ] Cada acceso tiene origen, destino y condición narrativa clara.
- [ ] Los lugares del mapa 2D deben coincidir con los POI del GLB y los IDs de src/data/world.js; misiones y guardados comparten esos IDs.

### Protocolo obligatorio de mapas IA

1. Buscar imágenes por ciudad y tipo de espacio: panorámica, nivel de calle, fachadas, accesos verticales, mercados, talleres, tecnología y barrios residenciales. Registrar URL, descripción y ciudad.
2. Generar dos mundos independientes con Marble (https://marble.worldlabs.ai/) y repetir el proceso con SpAItial (https://spaitial.ai/) para comparar continuidad, legibilidad y exportación. No aceptar el primer resultado automáticamente.
3. Priorizar malla 3D convencional con materiales editables. Verificar plan, formato, licencia y derechos de exportación. Gaussian Splat/SPZ/PLY no es automáticamente GLB ni incluye necesariamente colisiones.
4. Importar a Blender; limpiar mallas, materiales y escala; corregir calles y accesos; mantener estética pictórica artesanal de Arcane.
5. Alinear POI y coordenadas con los datos actuales; crear empties POI__<id>, resolver colisiones y probar rutas caminables.
6. Exportar los fuentes .blend y los GLB finales a src/models/maps/piltover.blend, zaun.blend, piltover.glb y zaun.glb. Embebe texturas y evita rutas absolutas.
7. Probar en el juego real con avatar, guardias, NPC, POI, misiones, colisiones, zoom general/medio/calle, cambio de ciudad y fallback 2D. Adjuntar capturas y resultados.

### Prompt actualizado para Freebuff — mapas 2D y 3D con Marble y SpAItial

> Trabaja en MarinaDP2006/Arcane-fangame. Antes de editar, lee PENDIENTES.md, src/models/maps/README.md, PILTOVER-3D.md, src/js/world3d.js y src/data/world.js. Comprueba rama y estado Git. No abras ni fusiones PR y no escribas en main.
>
> Investiga las fuentes oficiales y las wikis enlazadas para arquitectura, cultura, acceso entre ciudades, Hextech, quimtec, Shimmer/Brillo, comercio y desigualdad. Busca imágenes de referencia reales de ambas ciudades: panorámicas, nivel de calle, puentes/descensores, mercados, talleres, Academia/Consejo, fábricas, espacios de Shimmer y barrios residenciales. Registra URLs, ciudad y motivo de uso; no incorpores imágenes de terceros al juego sin autorización.
>
> Abre el tablero Neta https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298. Si no abre, pide una captura a la autora. No inventes su contenido.
>
> El mapa 2D debe seguir siendo legible y jugable con distritos, POI, rutas y accesos claros. La versión 3D debe traducir esa misma geografía a volumen real. src/data/world.js es la fuente de verdad de IDs y coordenadas; no inventes posiciones desconectadas.
>
> Usa tanto Marble como SpAItial para generar/comparar dos mundos independientes: uno de Piltover y otro de Zaun. Si necesitas login o no puedes operar los servicios externos, entrega los prompts y pasos exactos para que la autora genere las escenas; no afirmes que ya las generaste. Prueba exportación de malla convencional. No renombres Gaussian Splat/SPZ/PLY a GLB.
>
> Piltover: metrópolis costera sobre acantilados, piedra marfil, oro/latón, cobre patinado, plazas, torres, Academia, Consejo, Hexpuertas, comercio marítimo y Hextech refinada basada en cristales.
>
> Zaun: ciudad subterránea vertical, hierro remachado, vidrio coloreado, tuberías corroídas, pasarelas, escaleras, ascensores, mercados, talleres, bares, canales, humo y luces químicas. Mostrar cultura y comunidad además de peligro. Shimmer/Brillo debe tener espacios de producción y distribución con consecuencias narrativas; quimtec debe parecer experimental e industrial, no igual a Hextech.
>
> Después de comparar resultados, importa la mejor base a Blender, limpia geometría/materiales, corrige escala y accesos, alinea POI, crea colisiones/zonas transitables y exporta GLB con texturas embebidas. Mantén fuentes y no sustituyas el entorno por edificios procedurales.
>
> Primera entrega sin modificar archivos: referencias visuales encontradas, comparación Marble/SpAItial (formatos y límites), plano 2D alineado con POI, plan Blender y lista de archivos a cambiar. Espera aprobación; luego trabaja en una rama aislada y prueba en juego real. Entrega capturas, comandos y resultados; no marques como validado lo que no hayas ejecutado.


---

## 9. Actualización de producción visual: lore, mapa 2D/3D, ComfyUI y Open3D Viewer

Esta sección amplía las tareas anteriores. La guía central de producción es src/models/maps/README.md; las descripciones específicas están en PILTOVER-3D.md y ZAUN-3D.md.

### Referencias de lore e imágenes
- [Zaun — Universo oficial](https://universe.leagueoflegends.com/en_US/region/zaun/) y [galería oficial](https://universe.leagueoflegends.com/en_US/region/zaun/?mv=image-gallery).
- [Piltover — Universo oficial](https://universe.leagueoflegends.com/en_US/region/piltover/) y [galería oficial](https://universe.leagueoflegends.com/en_US/region/piltover/?mv=image-gallery).
- [Zaun — Fandom en español](https://leagueoflegends.fandom.com/es/wiki/Zaun).
- [Piltóver — Fandom en español](https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver).
- [Referencia visual oficial de Zaun: niveles inferiores](https://cmsassets.rgpub.io/sanity/images/dsfx7636/universe/d7858e6a65fed5e14321604dbde4f144640bd795-1920x1067.jpg).
- [Referencia visual de Piltover: avenida dorada](https://cdn.oneesports.gg/cdn-data/2023/09/LeagueofLegends_Piltover_VisionsofProgress.jpg).
- [Referencia de composición de mapa indicada por la autora](https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298). La herramienta web no ha podido abrir esta página; cualquier agente debe pedir una captura si tampoco puede verla, no inventar su contenido.

### Requisitos artísticos que deben conservarse
- [ ] Piltover no debe ser solo una ciudad blanca: incluir costa/acantilados, comercio, Academia, Consejo, plazas, mármol/piedra marfil, bronce y latón, vidrio, torres, cúpulas, puentes, Hexpuertas y tecnología hextech azul-dorada. Cultura de progreso, artesanía y prestigio, junto con jerarquía social y poder de los clanes mercantiles.
- [ ] Zaun no debe ser Piltover recoloreada: ciudad subterránea en cañones y niveles; hierro en celosía, remaches, vidrio coloreado, tuberías, pasarelas, mercados, talleres, tabernas, laboratorios, humo, luces químicas y barrios habitados. Mostrar cultura propia, inventiva, mercado negro, barones químicos y contraste entre zonas vivas y zonas tóxicas.
- [ ] Shimmer y quimtec deben aparecer como elementos narrativos con localización y consecuencias, no como decoración fluorescente uniforme. Mostrar laboratorios, tráfico clandestino, riesgos y efectos ambientales donde la historia los requiera.
- [ ] El Puente del Progreso y los accesos entre ciudades deben ser reconocibles. El puente significa progreso para parte de Piltover y control/abandono para muchos zaunitas.
- [ ] El mapa 2D debe ser una vista superior atractiva, clara y navegable, con distritos, calles, alturas, puentes, accesos y POI. El mapa 3D debe representar esa misma geografía en volumen real, con calles transitables. Ambos deben compartir IDs, coordenadas, misiones y bloqueos.

### Cómo utilizar las herramientas instaladas
- [ ] Marble (https://marble.worldlabs.ai/): generar propuestas de mundos explorables a partir de texto e imágenes; comprobar el formato que permite descargar la cuenta actual.
- [ ] SpAItial (https://spaitial.ai/): generar escenarios alternativos desde texto/imágenes; confirmar la salida descargable y priorizar malla convencional cuando se necesite editar y exportar GLB.
- [ ] ComfyUI (https://docs.comfy.org/): usar primero para moodboards, vistas cenitales, referencias de calles/fachadas, materiales, iluminación y hojas de estilo consistentes. No asumir que la instalación local ya incluye modelos o workflows 3D; revisar qué checkpoints/nodos hay antes de instalar nada.
- [ ] Open3D Viewer (https://open3d.app/glb-viewer): abrir los GLB descargados, inspeccionar desde varios ángulos, materiales y animaciones incluidas. El visor no prueba colisiones ni navegación del juego.
- [ ] Blender: limpieza final, escala, orientación, organización de escena, corrección de malla/materiales, POI y exportación.
- [ ] Freebuff: coordinar el proceso y realizar la integración de código mediante agentes/rama de trabajo. La usuaria no programa; dar pasos guiados y explicados en español. No hacer merge, push ni PR sin autorización.

### Primer trabajo de Freebuff
- [ ] Antes de generar nada, leer README.md, PILTOVER-3D.md, ZAUN-3D.md, PLAN-3D.md, src/models/maps/README.md y este archivo.
- [ ] Comprobar si la referencia de Neta es accesible. Si no, pedir a la autora una captura.
- [ ] Preparar una auditoría y un plan sin editar archivos, instalar dependencias o reemplazar los GLB actuales.
- [ ] Proponer un workflow de ComfyUI concreto a partir de los modelos/nodos que ya existan en el PC; no indicar que se descargue un workflow arbitrario sin verificar compatibilidad y requisitos de VRAM.
- [ ] Crear dos escenarios separados (Piltover y Zaun), inspeccionar las salidas con Open3D Viewer, corregir en Blender y probar copias temporales dentro del juego.
- [ ] Mantener backups y no sustituir los activos actuales hasta comparar capturas, escala, POI, materiales, rendimiento y colisiones.
- [ ] Entregar instrucciones por pasos de usuario no técnico, con comprobación visual tras cada etapa.

### Criterios de aceptación
- [ ] Se pueden comparar capturas de mapa 2D, Piltover 3D y Zaun 3D.
- [ ] Los POI, accesos y misiones apuntan a los lugares correctos en ambos modos.
- [ ] Los personajes, guardias y NPC se mueven sobre superficies transitables y guardan escala legible.
- [ ] No se declara listo por una captura bonita: debe cargar el GLB en el juego, funcionar la cámara, respetarse el fallback 2D y pasar las pruebas de rendimiento.
- [ ] Los agentes entregan informe, archivos cambiados, pruebas y pasos para que la autora pueda revisar la PR manualmente.
