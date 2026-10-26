# Guía de modelos 3D para Arcane-fangame

Esta guía cubre la integración de modelos 3D en el mapa abierto que ya existe en `src/js/world3d.js` y el sistema de avatares `src/js/avatars3d.js`. El editor conserva su retrato y el avatar 3D del mundo se usa después de crear la partida; el modelo importado no debe ser requisito para abrir el editor ni para jugar en 2D.

## 1. Preparar el recurso

- Usa modelos propios, con licencia compatible y procedencia documentada. No incluyas modelos extraídos de juegos comerciales sin permiso.
- Formato recomendado para intercambio: GLB/glTF 2.0. Conserva una copia editable del proyecto fuente fuera del paquete final.
- Mantén materiales PBR simples, texturas comprimidas y nombres de huesos consistentes.
- Para personajes, prepara una versión de prueba ligera (objetivo inicial: 20–40 mil triángulos, texturas de 1K y pocas luces). Son límites iniciales, no requisitos universales.

## 2. Dónde colocar los archivos

1. Para modelos incorporados al juego, usa `src/models/<id>.glb` y añade el nombre base a `src/models/index.json`.
2. Para modelos personales fuera del repositorio, usa Ajustes → Arte personal → modelos; Electron los lee desde la carpeta de arte del usuario y prepara ZIP/FBX/OBJ mediante `modelos.js`.
3. Añade una nota de autoría, licencia, formato, escala, orientación y animaciones. No sobrescribas `src/img/arte/` ni las galerías de retratos.
4. Revisa `package.json`, el empaquetado y las rutas de web/Electron. Las rutas deben funcionar sin depender de carpetas absolutas del ordenador del desarrollador.

## 3. Integración recomendada por etapas

1. **Visor aislado:** crea una pantalla de prueba que cargue un GLB local y muestre un error claro si falta o no puede decodificarse.
2. **Controles:** permite rotación con ratón y táctil, limita el zoom y ofrece una alternativa accesible con botones.
3. **Animaciones:** empieza con idle y caminar; las animaciones no deben bloquear la narración ni la entrada del jugador.
4. **Rendimiento:** limita resolución, sombras, luces dinámicas y memoria de texturas; prueba en un Android de gama media y en escritorio.
5. **Fallback 2D:** si WebGL falla, el recurso no carga o el dispositivo es lento, conserva el retrato 2D y el juego narrativo.
6. **Pruebas de paquete:** valida rutas relativas en desarrollo, build web, Electron y Android. No uses rutas absolutas del ordenador del desarrollador.

## 4. Comprobaciones antes de fusionar

- [ ] El modelo y sus texturas cargan desde una instalación limpia.
- [ ] No hay errores de consola ni recursos 404.
- [ ] El menú, el creador, el chat y la partida siguen funcionando si se desactiva el visor.
- [ ] Ratón, teclado y táctil pueden usar los controles disponibles.
- [ ] Se documentan dispositivo probado, tamaño del archivo y licencia.
- [ ] Se conserva una alternativa 2D y movimiento reducido cuando corresponda.

## Estado

El mapa exterior 3D y el cargador de modelos ya están implementados. La calidad de los modelos de cada personaje y la fidelidad arquitectónica de cada barrio aún deben comprobarse visualmente: un archivo `.glb` presente no garantiza malla completa, materiales correctos, buena escala ni animaciones. Antes de fusionar cambios, valida el mapa con zoom general y cercano y conserva el mapa 2D como alternativa.
