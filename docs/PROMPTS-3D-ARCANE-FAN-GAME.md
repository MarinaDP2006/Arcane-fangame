# Prompts 3D para la rama Arcane Fan Game

> **En pocas palabras:** Aquí se guardan instrucciones y referencias para crear o encargar recursos 3D para el fangame. Úsalas como punto de partida y revisa cada resultado en el motor: una imagen bonita no garantiza que el modelo tenga escala, materiales, orientación, rendimiento o permisos de uso adecuados.
**Documento de producción de fan game no oficial. No afiliado a Riot Games ni a Fortiche.**

Esta rama conserva el contexto narrativo de *Arcane* para uso de fan game. No incluye archivos oficiales de modelos ni autoriza su redistribución. Los siguientes prompts sirven para crear modelos de fan-art propios, claramente no oficiales; verifica licencias de texturas, fuentes y referencias antes de publicar una build.

## Especificación de exportación
- GLB glTF 2.0, cuerpo entero, origen en los pies, frente +Z, escala aproximada 1.8 unidades.
- Estilo fan-art 3D estilizado, materiales mate, formas legibles, rig humanoide, A-pose, vistas frontal/lateral/trasera y pruebas de idle/walk/run.
- Para modelos finales se recomienda conservar una paleta y silueta reconocible solo en la medida necesaria para fan-art, sin copiar archivos 3D extraídos, mallas oficiales, texturas oficiales, capturas promocionales ni renders con marcas de agua.
- Los GLB de esta rama son prototipos geométricos de baja fidelidad hechos con primitivas, no sustituyen modelos artísticos finales, caras detalladas ni rigs completos.

## 10 prompts de modelo de fan-art

### 01 · Vi
«Modelo estilizado de cuerpo entero inspirado en Vi de Arcane, luchadora atlética adulta, pelo corto rosa, guantes industriales grandes como accesorio de lectura de silueta, chaqueta de trabajo oscura y botas resistentes. Expresión decidida, postura con peso frontal y manos listas para el combate. Materiales mates con desgaste en cuero y metal. No usar malla, textura ni arte oficial. Exportar como `vi.glb`, A-pose, frente/lado/espalda, rig humanoide, idle/walk/run.»

### 02 · Jinx
«Modelo de fan-art para Jinx, inventora adulta del submundo, complexión delgada, cabello azul largo recogido en dos trenzas, ropa práctica en tonos fríos con acentos oscuros y herramientas caseras aseguradas al cinturón. Mantener una expresión vivaz y frágil a la vez, sin convertirla en una caricatura de locura. Evitar armas excesivas, detalles de violencia gráfica y texturas extraídas. Exportar `jinx.glb`.»

### 03 · Caitlyn
«Modelo estilizado de Caitlyn, detective adulta alta con porte recto, pelo oscuro recogido, abrigo azul de inspector y equipamiento de observación discreto. Rifle largo como accesorio opcional separado y seguro para animar, no bloquear la cara. Materiales textiles mate, insignias solo recreadas como fan-art y nunca como logotipo de producto. Exportar `caitlyn.glb`.»

### 04 · Jayce
«Modelo de Jayce, inventor adulto alto, cabello castaño peinado hacia atrás, abrigo de taller elegante, guantes de trabajo y herramienta tecnológica de martillo a escala contenida. Mezclar autoridad pública con aspecto de científico que todavía trabaja con sus manos. Sin malla oficial ni logotipos. Exportar `jayce.glb`.»

### 05 · Viktor
«Modelo de Viktor, científico adulto delgado, piel clara, cabello castaño oscuro, bastón de apoyo y abrigo funcional con detalles mecánicos pequeños. Silueta ligeramente asimétrica que expresa fatiga física sin exagerar discapacidad. Materiales de laboratorio mate, A-pose y accesorios separados para facilitar animación. Exportar `viktor.glb`.»

### 06 · Ekko
«Modelo de Ekko, inventor y líder comunitario joven adulto, piel oscura, pelo claro corto con mechones estilizados, ropa urbana funcional, protección en antebrazos y un instrumento temporal original colgado a la espalda. Pose de equilibrio, zapatillas reforzadas, expresión atenta. No copiar una malla de fan-art existente. Exportar `ekko.glb`.»

### 07 · Mel
«Modelo de Mel Medarda, política adulta, piel marrón cálida, cabello oscuro recogido, vestuario formal dorado y negro con capas y joyería geométrica propia. Silueta elegante pero movible, materiales metálicos de bajo brillo, accesorios separados. Evitar copiar renders oficiales o texturas de la serie. Exportar `mel.glb`.»

### 08 · Silco
«Modelo de Silco, estratega adulto de aspecto delgado, rostro con cicatriz discreta y un ojo marcado por luz rojiza como detalle de fan-art, abrigo oscuro con cuello alto y postura quieta. La cicatriz no debe convertirse en gore. Diseño legible de lejos, materiales gastados y sin humo obligatorio en el modelo. Exportar `silco.glb`.»

### 09 · Vander
«Modelo de Vander, hombre adulto ancho de hombros, cabello oscuro con canas, barba recortada, camisa de taberna y delantal de trabajo. Manos grandes, rostro cansado y mirada protectora. La silueta se debe diferenciar por volumen, postura y ropa, no por una textura oficial. Exportar `vander.glb`.»

### 10 · Sevika
«Modelo de Sevika, luchadora adulta robusta, pelo oscuro recogido, brazo protésico industrial personalizado con piezas modulares y ropa resistente a golpes. El brazo debe tener juntas simples y áreas de pivote para el rig; no incluir sangre ni lesiones gráficas. Silueta asimétrica, postura firme y colores metálicos mate. Exportar `sevika.glb`.»

## Reglas de calidad
1. Revisar escala, pivote, normales, pesos de rig, animaciones en bucle y materiales.
2. No incluir assets extraídos del juego o la serie.
3. Los prototipos generados por código en esta rama son formas de bloqueo visual; no deben describirse como modelos artísticos terminados ni animaciones completas.
4. Para publicación, marcar el juego como fan-made y no oficial, revisar las políticas de la plataforma y consultar las directrices vigentes de fan content.


## Prompt maestro actualizado para Freebuff: mapas 2D/3D y herramientas disponibles

> Soy la propietaria de MarinaDP2006/Arcane-fangame. No sé programar ni conozco la lógica interna del juego; aunque el proyecto usa JavaScript, necesito que me guíes en español sencillo y no des por hecho que sé modificar código. Explica los pasos en español sencillo, por fases, con nombres exactos de archivos y comprobaciones visibles. No supongas que sé usar Blender, terminal o nodos complejos; si hace falta, guíame de una acción cada vez.
>
> **Antes de actuar**, lee PENDIENTES.md, PILTOVER-3D.md, ZAUN-3D.md, PLAN-3D.md y src/models/maps/README.md; inspecciona la rama, el estado de Git y el contenido actual. No hagas cambios destructivos, no reemplaces archivos originales, no hagas push/merge ni abras PR. Yo crearé y revisaré manualmente las PR.
>
> **Referencias de lore y arte:** estudia [Piltover oficial](https://universe.leagueoflegends.com/en_US/region/piltover/), [Zaun oficial](https://universe.leagueoflegends.com/en_US/region/zaun/), las galerías de ambas regiones y las páginas [Piltóver Fandom ES](https://leagueoflegends.fandom.com/es/wiki/Pilt%C3%B3ver) y [Zaun Fandom ES](https://leagueoflegends.fandom.com/es/wiki/Zaun). Busca y compara imágenes de arquitectura, calles, niveles, puentes, controles de acceso, población, mercados, laboratorios, shimmer, quimtec y hextech. Usa fuentes oficiales primero y Fandom como apoyo de lore. No descargues imágenes de terceros al juego sin verificar derechos.
>
> **Referencia visual que ha indicado la autora:** [proyecto de Neta](https://neta.art/w/b2a0b258-f552-4a6d-9392-e1ff1557f298). Intenta abrirlo y estudiar la composición del mapa 2D. Si la página no es accesible, no finjas haberla visto: pide una captura al usuario y continúa solo con las demás referencias hasta recibirla.
>
> **Herramientas que ya tengo:** Marble (https://marble.worldlabs.ai/), SpAItial (https://spaitial.ai/), ComfyUI instalado en mi PC y Open3D Viewer. Propón un flujo que use realmente estas herramientas y distingue sus funciones: Marble/SpAItial para generar mundos a partir de prompts e imágenes; ComfyUI para moodboards, vistas cenitales, materiales, fachadas, iluminación y referencias consistentes (no asumir que genera una ciudad GLB completa sin workflows/modelos específicos); Open3D Viewer para abrir/inspeccionar archivos 3D y animaciones disponibles; Blender para limpiar y exportar mallas; tú/Freebuff para guiar los pasos e integrar el resultado en el código.
>
> **Diseño requerido:** el mapa 2D debe ser una vista superior clara, atractiva y jugable con distritos, calles, niveles, puentes, accesos, marcadores y POI. El mapa 3D debe representar esa misma geografía en volumen real, con edificios completos y calles transitables. No sustituir la ciudad por cajas o geometría procedural. Piltover debe transmitir una ciudad costera de progreso, comercio y artesanía: piedra/mármol marfil, latón/bronce, vidrio, torres, cúpulas, puentes monumentales y hextech azul-dorada. Zaun debe ser una ciudad subterránea vertical de hierro y cristal: edificios superpuestos, tuberías, escaleras, mercados, talleres, humo, vidrio coloreado, luces químicas, quimtec y presencia narrativa del shimmer. Mostrar niveles superiores/intermedios/profundos y accesos entre ciudades; el Puente del Progreso tiene significado cultural distinto para ambas.
>
> **Proceso:** (1) auditoría sin editar; (2) moodboard/hojas de referencia con ComfyUI; (3) generar Piltover y Zaun por separado en Marble/SpAItial; (4) comprobar formato y malla en Open3D Viewer; (5) corrección en Blender; (6) alinear POI y colisiones con src/data/world.js; (7) probar GLB en juego con personajes, cámara y mapa 2D; (8) ejecutar comprobaciones; (9) entregar informe y pasos para que yo cree una PR manual.
>
> **Formato técnico:** priorizar GLB/glTF 2.0 con geometría convencional, materiales/texturas y escala consistente. Si Marble/SpAItial entrega Gaussian Splat, PLY u otro formato, explica qué significa y cómo convertirlo o por qué no sirve directamente. No declarar que hay colisiones o navegación solo porque la ciudad se vea bien. No sobrescribir piltover.glb, zaun.glb, .blend fuente o modelos de personajes sin una copia temporal y mi aprobación.
>
> **Mi primer pedido:** no generes ni edites nada todavía. Dame un plan paso a paso adaptado a las herramientas que ya tengo, dime qué debo pulsar o descargar primero y cómo sabremos si el resultado sirve. Después espera mi aprobación.
