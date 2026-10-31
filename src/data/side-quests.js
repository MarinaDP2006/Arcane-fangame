// Historias secundarias jugables: pequeñas tramas ramificadas con decisiones persistentes.
// No necesitan IA: todos los textos, elecciones y efectos están escritos en estos datos.
window.SIDE_QUESTS = [
  {
    id: 'ultima-gota-historia',
    requiresAlive: ['vander', 'vi'],
    title: 'Lo que sostiene un hogar',
    city: 'zaun',
    seasonMin: 1,
    requiresMet: ['vander'],
    location: 'ultima-gota',
    intro: 'Vander intenta mantener La Última Gota a salvo, pero alguien está robando suministros destinados a las familias del barrio.',
    start: 'aviso',
    completionFlag: 'sidequest_ultima_gota_completa',
    reward: { aff: { vander: 1, vi: 1 }, rep: { zaun: 1 }, flags: ['sidequest_ultima_gota_completa'] },
    steps: {
      aviso: {
        heading: 'Un barril menos',
        lines: [
          { s: 'vander', t: 'Han desaparecido medicinas y comida del almacén. Si acuso a alguien sin pruebas, el barrio entero pagará las consecuencias.' },
          { s: 'vi', t: 'Dime a quién buscamos y salgo ahora mismo. Pero esta vez intentaré no romper la puerta antes de llamar.' }
        ],
        choices: [
          { id: 'mirar-registros', label: 'Revisar los registros y seguir las entregas', response: 'Primero averigüemos dónde se perdió el cargamento.', next: 'rastro', fx: { aff: { vander: 1 }, stats: { ingenio: 1 }, flags: ['sidequest_ultima_gota_metodo'] } },
          { id: 'hablar-calle', label: 'Preguntar discretamente por el barrio', response: 'La gente hablará si no siente que la estamos acusando.', next: 'testigos', fx: { aff: { vi: 1 }, rep: { zaun: 1 }, flags: ['sidequest_ultima_gota_testigos'] } }
        ]
      },
      rastro: {
        heading: 'El camino del cargamento',
        lines: [
          { s: 'narrador', t: 'Las notas de entrega señalan un almacén vacío. En el suelo quedan huellas pequeñas y una bolsa con vendas limpias.' },
          { s: 'vander', t: 'Quienquiera que lo haya hecho no se llevó las cosas para venderlas. Parece que alguien estaba intentando ayudar sin pedir permiso.' }
        ],
        choices: [
          { id: 'esperar', label: 'Esperar a que vuelva quien dejó las huellas', response: 'No convirtamos una necesidad en un delito antes de saber la historia.', next: 'decision' },
          { id: 'llevar-vander', label: 'Volver con Vander y hablar antes de actuar', response: 'No tienes que cargar tú solo con todas las decisiones.', next: 'decision', fx: { aff: { vander: 1 } } }
        ]
      },
      testigos: {
        heading: 'Lo que cuenta la gente',
        lines: [
          { s: 'narrador', t: 'Una vecina explica que vio a una persona salir con las medicinas y dejarlas frente a una casa donde vive una familia enferma.' },
          { s: 'vi', t: 'Podríamos recuperar lo que queda y fingir que no lo vimos… o preguntar por qué nadie se atrevió a pedir ayuda.' }
        ],
        choices: [
          { id: 'dejar-medicina', label: 'Dejar las medicinas en la casa y buscar otra solución', response: 'La necesidad no desaparece porque cerremos el almacén.', next: 'decision', fx: { aff: { vi: 1 }, rep: { zaun: 1 } } },
          { id: 'invitar-hablar', label: 'Invitar a la persona a hablar con Vander', response: 'Puede reparar el daño sin que el barrio la convierta en enemiga.', next: 'decision', fx: { aff: { vander: 1 } } }
        ]
      },
      decision: {
        heading: 'Una regla nueva',
        lines: [
          { s: 'vander', t: 'No puedo prometer que siempre habrá suficiente. Sí puedo prometer que nadie tendrá que robar a escondidas para pedir ayuda.' },
          { s: 'vi', t: 'No arreglamos Zaun en una noche. Pero hoy alguien va a dormir con menos miedo.' }
        ],
        choices: [
          { id: 'fondo-comun', label: 'Crear una reserva comunitaria de emergencia', response: 'Que cualquiera pueda pedir ayuda y devolverla cuando pueda.', complete: true, fx: { aff: { vander: 1 }, rep: { zaun: 1 }, flags: ['sidequest_ultima_gota_fondo'] } },
          { id: 'turnos', label: 'Organizar turnos para vigilar y repartir suministros', response: 'Compartir la responsabilidad también es una forma de confianza.', complete: true, fx: { aff: { vi: 1 }, rep: { zaun: 1 }, flags: ['sidequest_ultima_gota_turnos'] } }
        ]
      }
    }
  },
  {
    id: 'rumores-callejones-historia',
    requiresAlive: ['vi'],
    title: 'El precio de un rumor',
    city: 'zaun',
    seasonMin: 1,
    requiresMet: ['vi'],
    location: 'callejones',
    intro: 'Un rumor sobre una redada está haciendo que la gente abandone sus hogares. Vi quiere encontrar la fuente antes de que cunda el pánico.',
    start: 'rumor',
    completionFlag: 'sidequest_rumores_completa',
    reward: { aff: { vi: 1 }, rep: { zaun: 1 }, flags: ['sidequest_rumores_completa'] },
    steps: {
      rumor: {
        heading: 'Palabras que corren',
        lines: [
          { s: 'vi', t: 'Tres personas repiten la misma historia, pero ninguna vio nada. Si es mentira, alguien quiere asustar al barrio.' },
          { s: 'narrador', t: 'En una pared, un aviso escrito a toda prisa nombra una hora y una calle. La tinta todavía está fresca.' }
        ],
        choices: [
          { id: 'seguir-tinta', label: 'Seguir el rastro del aviso', response: 'La tinta y el papel pueden decirnos quién lo escribió.', next: 'archivo', fx: { stats: { ingenio: 1 }, flags: ['sidequest_rumores_rastro'] } },
          { id: 'preguntar-miedo', label: 'Preguntar a quien está asustado, sin presionar', response: 'Primero averigüemos qué teme la gente y quién se está aprovechando.', next: 'vecinos', fx: { aff: { vi: 1 }, rep: { zaun: 1 } } }
        ]
      },
      archivo: {
        heading: 'Una firma conocida',
        lines: [
          { s: 'narrador', t: 'El papel procede de una imprenta que cerró hace meses. Alguien reutiliza material viejo para dar credibilidad a una amenaza nueva.' },
          { s: 'vi', t: 'Tenemos una pista, no una persona culpable. No voy a golpear a la primera sombra que encontremos.' }
        ],
        choices: [
          { id: 'prueba-publica', label: 'Guardar la prueba y avisar a los vecinos', response: 'La información útil debe llegar antes que el miedo.', next: 'cierre', fx: { rep: { zaun: 1 } } },
          { id: 'seguir-solo', label: 'Seguir la pista en privado un poco más', response: 'No des más detalles hasta saber quién está detrás.', next: 'cierre', fx: { aff: { vi: 1 } } }
        ]
      },
      vecinos: {
        heading: 'La voz del barrio',
        lines: [
          { s: 'narrador', t: 'Una comerciante admite que compartió el rumor porque alguien le prometió protección. No quería poner a nadie en peligro.' },
          { s: 'vi', t: 'La gente no necesita otra amenaza. Necesita saber dónde acudir cuando alguien intenta comprar su silencio.' }
        ],
        choices: [
          { id: 'red-apoyo', label: 'Organizar una red vecinal de avisos seguros', response: 'Que nadie tenga que elegir entre callarse y ponerse en riesgo.', next: 'cierre', fx: { aff: { vi: 1 }, rep: { zaun: 1 } } },
          { id: 'promesa-cautela', label: 'Prometer discreción y buscar más pruebas', response: 'No pondremos a la comerciante en el centro del conflicto.', next: 'cierre', fx: { stats: { sigilo: 1 } } }
        ]
      },
      cierre: {
        heading: 'El rumor se detiene',
        lines: [
          { s: 'vi', t: 'La redada nunca estuvo confirmada. No puedo controlar todo lo que se dice por aquí, pero sí puedo ayudar a que la gente tenga a quién preguntar.' }
        ],
        choices: [
          { id: 'cuidar-barrio', label: 'Ayudar a Vi a mantener un canal de avisos', response: 'La confianza también se construye compartiendo información.', complete: true, fx: { aff: { vi: 1 }, rep: { zaun: 1 }, flags: ['sidequest_rumores_red'] } },
          { id: 'documentar', label: 'Documentar quién difundió el rumor y cómo', response: 'La próxima vez podremos distinguir una advertencia real de una manipulación.', complete: true, fx: { stats: { ingenio: 1 }, rep: { zaun: 1 }, flags: ['sidequest_rumores_documentado'] } }
        ]
      }
    }
  },
  {
    id: 'promesa-hexgate-historia',
    requiresAlive: ['jayce', 'viktor'],
    title: 'El progreso tiene testigos',
    city: 'piltover',
    seasonMin: 1,
    requiresMet: ['jayce', 'viktor'],
    location: 'hexpuertas',
    intro: 'Un fallo menor en las Hexpuertas ha dejado a varios trabajadores sin cobrar. Jayce quiere arreglar la máquina; Viktor pregunta quién se hará cargo de las personas.',
    start: 'fallo',
    completionFlag: 'sidequest_hexgate_completa',
    reward: { aff: { jayce: 1, viktor: 1 }, rep: { piltover: 1 }, flags: ['sidequest_hexgate_completa'] },
    steps: {
      fallo: {
        heading: 'Una máquina, muchas vidas',
        lines: [
          { s: 'jayce', t: 'La avería es pequeña. Puedo corregirla antes del siguiente turno.' },
          { s: 'viktor', t: 'El mecanismo no es la única pieza rota. Si los trabajadores perdieron su sueldo, arreglar el engranaje no les devolverá la comida.' }
        ],
        choices: [
          { id: 'reparar', label: 'Reparar primero la Hexpuerta y registrar el incidente', response: 'La máquina debe ser segura; luego publicaremos los datos.', next: 'auditoria', fx: { aff: { jayce: 1 }, stats: { ingenio: 1 }, flags: ['sidequest_hexgate_reparacion'] } },
          { id: 'trabajadores', label: 'Hablar primero con los trabajadores afectados', response: 'No podemos llamar progreso a algo que no escucha a quienes lo mantienen.', next: 'asamblea', fx: { aff: { viktor: 1 }, rep: { piltover: 1 } } }
        ]
      },
      auditoria: {
        heading: 'Los números completos',
        lines: [
          { s: 'viktor', t: 'La auditoría demuestra que el fallo se había señalado antes. Nadie quiso detener el servicio porque el retraso habría costado dinero.' },
          { s: 'jayce', t: 'Entonces el informe debe incluir también mi responsabilidad. No basta con reparar lo que se ve.' }
        ],
        choices: [
          { id: 'publicar', label: 'Publicar el informe entero', response: 'La ciudad merece conocer el coste real del progreso.', next: 'acuerdo', fx: { aff: { viktor: 1 }, rep: { piltover: 1 } } },
          { id: 'reforma', label: 'Proponer una auditoría independiente periódica', response: 'Además de la verdad, necesitamos una forma de detectar el próximo fallo.', next: 'acuerdo', fx: { aff: { jayce: 1 }, stats: { ingenio: 1 } } }
        ]
      },
      asamblea: {
        heading: 'Escuchar antes de decidir',
        lines: [
          { s: 'narrador', t: 'Los trabajadores explican que los retrasos y los accidentes menores se registran como errores individuales, nunca como un problema de diseño.' },
          { s: 'jayce', t: 'No volveré a llamar pequeño a un fallo sin preguntar a quienes están en la sala cuando ocurre.' }
        ],
        choices: [
          { id: 'comision', label: 'Crear una comisión con trabajadores e inventores', response: 'Quienes usan una tecnología también deben poder cuestionarla.', next: 'acuerdo', fx: { aff: { jayce: 1, viktor: 1 }, rep: { piltover: 1 } } },
          { id: 'compensar', label: 'Asegurar los pagos perdidos y revisar protocolos', response: 'La reparación debe llegar también a las personas afectadas.', next: 'acuerdo', fx: { aff: { viktor: 1 }, rep: { piltover: 1 } } }
        ]
      },
      acuerdo: {
        heading: 'Una promesa verificable',
        lines: [
          { s: 'viktor', t: 'Un invento puede abrir una puerta. La responsabilidad consiste en mirar quién se queda al otro lado.' },
          { s: 'jayce', t: 'Dejaremos por escrito qué vamos a cambiar y quién comprobará que se cumple.' }
        ],
        choices: [
          { id: 'supervision', label: 'Aprobar controles independientes y públicos', response: 'La confianza debe poder comprobarse, no solo prometerse.', complete: true, fx: { aff: { viktor: 1 }, rep: { piltover: 1 }, flags: ['sidequest_hexgate_controles'] } },
          { id: 'comite', label: 'Crear una mesa permanente de trabajadores e inventores', response: 'Ninguna mejora debería hacerse sin escuchar a quienes la mantienen.', complete: true, fx: { aff: { jayce: 1 }, rep: { piltover: 1 }, flags: ['sidequest_hexgate_comite'] } }
        ]
      }
    }
  },
  {
    id: 'refugio-luciernagas-historia',
    requiresAlive: ['ekko'],
    title: 'Una luz que no se compra',
    city: 'zaun',
    seasonMin: 1,
    requiresMet: ['ekko'],
    location: 'arbol',
    intro: 'En el refugio de las Luciérnagas, una familia recién llegada necesita ayuda. Ekko no quiere que la protección se convierta en una deuda imposible de pagar.',
    start: 'refugio',
    completionFlag: 'sidequest_luciernagas_completa',
    reward: { aff: { ekko: 1 }, rep: { zaun: 1 }, flags: ['sidequest_luciernagas_completa'] },
    steps: {
      refugio: {
        heading: 'Un sitio para respirar',
        lines: [
          { s: 'ekko', t: 'Podemos darles un lugar esta noche. Pero si aceptamos a todo el mundo sin organizar recursos, el refugio se vendrá abajo.' },
          { s: 'narrador', t: 'Una niña guarda una pieza de chatarra como si fuera un tesoro. Su madre no pide dinero; solo pregunta si puede quedarse hasta el amanecer.' }
        ],
        choices: [
          { id: 'reparto', label: 'Organizar turnos y repartir lo disponible', response: 'El refugio tiene que cuidar de quienes llegan y de quienes ya están aquí.', next: 'plan', fx: { stats: { ingenio: 1 }, rep: { zaun: 1 } } },
          { id: 'confianza', label: 'Darles una noche segura y conocerlos primero', response: 'La organización importa, pero también importa no tratar a nadie como una cifra.', next: 'familia', fx: { aff: { ekko: 1 } } }
        ]
      },
      plan: {
        heading: 'Lo que puede sostenerse',
        lines: [
          { s: 'ekko', t: 'Si cada cual aporta lo que puede, no depende todo de una sola persona. Eso es lo que quiero que sea este lugar.' }
        ],
        choices: [
          { id: 'red', label: 'Pedir apoyo a otros talleres del barrio', response: 'La comunidad es más fuerte cuando comparte la carga.', next: 'futuro', fx: { rep: { zaun: 1 }, flags: ['sidequest_luciernagas_red'] } },
          { id: 'inventario', label: 'Hacer inventario para evitar desperdicios', response: 'Cuidar lo que ya tenemos también salva vidas.', next: 'futuro', fx: { stats: { ingenio: 1 }, flags: ['sidequest_luciernagas_inventario'] } }
        ]
      },
      familia: {
        heading: 'No es caridad',
        lines: [
          { s: 'narrador', t: 'Al amanecer, la niña deja su pieza de chatarra junto a las herramientas de Ekko. Él la devuelve a sus manos y le enseña a repararla.' },
          { s: 'ekko', t: 'No tienes que pagar por dormir a salvo. Cuando puedas, ayudarás a otra persona. No antes.' }
        ],
        choices: [
          { id: 'acompanar', label: 'Acompañar a la familia hasta que encuentre un hogar', response: 'La seguridad no debería terminar cuando se abre la puerta.', next: 'futuro', fx: { aff: { ekko: 1 }, rep: { zaun: 1 } } },
          { id: 'taller', label: 'Enseñar a la niña a reparar su pieza', response: 'Una habilidad puede convertirse en una puerta hacia el futuro.', next: 'futuro', fx: { stats: { ingenio: 1 } } }
        ]
      },
      futuro: {
        heading: 'El mañana empieza aquí',
        lines: [
          { s: 'ekko', t: 'No puedo prometer que el mundo vaya a ser justo. Pero aquí dentro no vamos a pedirle a nadie que se gane el derecho a estar vivo.' }
        ],
        choices: [
          { id: 'refugio-abierto', label: 'Mantener el refugio abierto con reglas acordadas entre todos', response: 'La seguridad y la dignidad tienen que ir juntas.', complete: true, fx: { aff: { ekko: 1 }, rep: { zaun: 1 }, flags: ['sidequest_luciernagas_abierto'] } },
          { id: 'aprendizaje', label: 'Crear un taller para que la gente recupere autonomía', response: 'Ayudar también es dar herramientas para elegir el propio camino.', complete: true, fx: { aff: { ekko: 1 }, stats: { ingenio: 1 }, flags: ['sidequest_luciernagas_taller'] } }
        ]
      }
    }
  },
  {
    id: 'comuna-viktor-historia',
    requiresAlive: ['viktor'],
    title: 'La paz que exige preguntas',
    city: 'zaun',
    seasonMin: 2,
    requiresMet: ['viktor'],
    location: 'fabrica',
    intro: 'La comuna promete terminar con el sufrimiento, pero algunos residentes no parecen capaces de explicar qué aceptaron. Hay que escucharles antes de decidir qué hacer.',
    start: 'entrada',
    completionFlag: 'sidequest_comuna_viktor_completa',
    reward: { aff: { viktor: 1 }, rep: { zaun: 1 }, flags: ['sidequest_comuna_viktor_completa'] },
    steps: {
      entrada: {
        heading: 'El precio del silencio',
        lines: [
          { s: 'viktor', t: 'Les di una forma de dejar de sufrir. Si vuelven al dolor, quizá les esté pidiendo que soporten algo que ya no pueden soportar.' },
          { s: 'narrador', t: 'Una residente os mira, asiente y luego se queda en silencio. No puedes saber si está de acuerdo o si está esperando permiso para hablar.' }
        ],
        choices: [
          { id: 'consentimiento', label: 'Hablar con los residentes a solas y comprobar su consentimiento', response: 'Nadie debería decidir por ellos, ni siquiera alguien que quiera curarlos.', next: 'voces', fx: { aff: { viktor: 1 }, flags: ['sidequest_comuna_consentimiento'] } },
          { id: 'registro', label: 'Buscar los registros de lo que se les explicó', response: 'La compasión no sustituye a la transparencia.', next: 'registros', fx: { stats: { ingenio: 1 }, flags: ['sidequest_comuna_registros'] } }
        ]
      },
      voces: {
        heading: 'Una elección propia',
        lines: [
          { s: 'narrador', t: 'Cuando no hay nadie vigilando, la residente confiesa que quiere quedarse, pero desea poder marcharse sin ser considerada una traidora.' },
          { s: 'viktor', t: 'Nunca quise que mi ayuda se convirtiera en una prisión. Pero el miedo a perderlos me hizo no escuchar lo que pedían.' }
        ],
        choices: [
          { id: 'salida-libre', label: 'Exigir que cualquiera pueda marcharse cuando quiera', response: 'La ayuda solo es ayuda cuando existe la posibilidad de decir que no.', next: 'acuerdo', fx: { rep: { zaun: 1 } } },
          { id: 'mediacion', label: 'Proponer una mediación elegida por los residentes', response: 'Que las personas afectadas decidan cómo quieren resolverlo.', next: 'acuerdo', fx: { aff: { viktor: 1 } } }
        ]
      },
      registros: {
        heading: 'Lo que no se escribió',
        lines: [
          { s: 'narrador', t: 'Los registros describen el procedimiento, pero no contienen una explicación clara de los riesgos ni de cómo revocar el consentimiento.' },
          { s: 'viktor', t: 'Confundí la urgencia de curar con el derecho a decidir. No son lo mismo.' }
        ],
        choices: [
          { id: 'publicar-limites', label: 'Hacer públicos los límites y riesgos del procedimiento', response: 'La verdad también forma parte de cualquier tratamiento.', next: 'acuerdo', fx: { stats: { ingenio: 1 }, rep: { zaun: 1 } } },
          { id: 'supervision-residentes', label: 'Dar a los residentes control sobre las reglas', response: 'Quien vive con las consecuencias debe tener voz sobre ellas.', next: 'acuerdo', fx: { aff: { viktor: 1 } } }
        ]
      },
      acuerdo: {
        heading: 'Una decisión que pertenece a todos',
        lines: [
          { s: 'viktor', t: 'No puedo deshacer lo ocurrido. Sí puedo aceptar límites, incluso cuando crea que sé cuál es la solución.' }
        ],
        choices: [
          { id: 'derecho-salida', label: 'Establecer el derecho a abandonar la comuna y recibir información completa', response: 'La paz no puede depender de renunciar a la propia voluntad.', complete: true, fx: { rep: { zaun: 1 }, flags: ['sidequest_comuna_derecho_salida'] } },
          { id: 'consejo-comuna', label: 'Crear un consejo de residentes con capacidad para decidir', response: 'Las personas que reciben la ayuda también deben gobernarla.', complete: true, fx: { aff: { viktor: 1 }, rep: { zaun: 1 }, flags: ['sidequest_comuna_consejo'] } }
        ]
      }
    }
  },
  {
    id: 'puente-dos-ciudades-historia',
    requiresAlive: ['caitlyn', 'sevika'],
    title: 'Un puente no es un acuerdo',
    city: 'ambas',
    seasonMin: 2,
    requiresMet: ['caitlyn', 'sevika'],
    location: 'puente-zaun',
    intro: 'Mientras se negocia el futuro de ambas ciudades, una evacuación amenaza con convertirse en otra pelea por el control del puente.',
    start: 'bloqueo',
    completionFlag: 'sidequest_puente_completa',
    reward: { aff: { caitlyn: 1, sevika: 1 }, rep: { piltover: 1, zaun: 1 }, flags: ['sidequest_puente_completa'] },
    steps: {
      bloqueo: {
        heading: 'Dos ciudades, una salida',
        lines: [
          { s: 'caitlyn', t: 'Si abrimos el paso sin organizarlo, habrá heridos. Si lo cerramos, dejamos a familias atrapadas.' },
          { s: 'sevika', t: 'Zaun ya ha oído suficientes promesas de seguridad que solo protegen a los de arriba. Necesito garantías, no discursos.' }
        ],
        choices: [
          { id: 'observadores', label: 'Proponer observadores de ambas ciudades', response: 'Nadie debe controlar el paso sin que la otra parte pueda comprobarlo.', next: 'negociacion', fx: { aff: { caitlyn: 1, sevika: 1 }, rep: { zaun: 1 } } },
          { id: 'prioridad-civiles', label: 'Asegurar primero una salida para civiles', response: 'La discusión política puede esperar; las familias no.', next: 'evacuacion', fx: { aff: { caitlyn: 1 }, rep: { piltover: 1 } } }
        ]
      },
      negociacion: {
        heading: 'Garantías por escrito',
        lines: [
          { s: 'sevika', t: 'Quiero que el acuerdo diga quién responde si el paso vuelve a cerrarse y cómo se va a reclamar.' },
          { s: 'caitlyn', t: 'Lo pondremos por escrito y dejaremos un registro que ninguna ciudad pueda borrar en secreto.' }
        ],
        choices: [
          { id: 'registro-publico', label: 'Crear un registro público de incidentes y decisiones', response: 'La transparencia permite exigir responsabilidades a ambos lados.', next: 'acuerdo-negociado', fx: { rep: { piltover: 1, zaun: 1 } } },
          { id: 'mediadores', label: 'Designar mediadores que no pertenezcan a ninguna autoridad', response: 'Nadie debe ser juez de su propio comportamiento.', next: 'acuerdo-negociado', fx: { aff: { sevika: 1 }, stats: { carisma: 1 } } }
        ]
      },
      evacuacion: {
        heading: 'Primero, abrir el paso',
        lines: [
          { s: 'narrador', t: 'El primer grupo cruza sin escoltas armadas. Al otro lado, voluntarios de Zaun ofrecen agua y ayudan a localizar a los familiares.' },
          { s: 'sevika', t: 'Esto no soluciona las deudas entre las ciudades. Pero demuestra que por una vez alguien ha puesto a la gente por delante de la bandera.' }
        ],
        choices: [
          { id: 'acompanar-grupos', label: 'Organizar grupos pequeños y reunificación familiar', response: 'Cada persona debe poder saber dónde están los suyos.', next: 'acuerdo-evacuacion', fx: { aff: { sevika: 1 }, rep: { zaun: 1 } } },
          { id: 'revisar-acceso', label: 'Mantener el acceso abierto y revisar la seguridad juntos', response: 'La seguridad ha de ser una responsabilidad compartida.', next: 'acuerdo-evacuacion', fx: { aff: { caitlyn: 1 }, rep: { piltover: 1 } } }
        ]
      },
      'acuerdo-negociado': {
        heading: 'Un paso bajo vigilancia',
        lines: [
          { s: 'caitlyn', t: 'El registro ya está abierto y los mediadores pueden comprobar cada cierre. No es confianza ciega: es una forma de exigir cuentas.' },
          { s: 'sevika', t: 'El paso seguirá siendo frágil. Si alguien incumple, la gente de ambos lados tendrá pruebas y una voz para reclamar.' }
        ],
        choices: [
          { id: 'negociacion-comite', label: 'Dar a representantes vecinales de ambas ciudades poder para revisar el registro', response: 'Quienes cruzan el puente deben poder señalar cuándo falla el acuerdo.', complete: true, fx: { aff: { caitlyn: 1, sevika: 1 }, rep: { piltover: 1, zaun: 1 }, flags: ['sidequest_puente_comite', 'sidequest_puente_negociacion'] } },
          { id: 'negociacion-revision', label: 'Publicar el pacto con una fecha próxima para renegociarlo', response: 'Una promesa temporal debe poder cambiar si no protege a la gente.', complete: true, fx: { stats: { carisma: 1 }, rep: { piltover: 1, zaun: 1 }, flags: ['sidequest_puente_pacto', 'sidequest_puente_negociacion'] } }
        ]
      },
      'acuerdo-evacuacion': {
        heading: 'Después del cruce',
        lines: [
          { s: 'narrador', t: 'Las familias ya están reunidas al otro lado. El paso queda abierto mientras los voluntarios cuentan a quienes han llegado y buscan a los que faltan.' },
          { s: 'caitlyn', t: 'Evacuar primero no resuelve quién controla el puente. Pero ahora podemos hablar sin pedir a las familias que esperen en medio del peligro.' },
          { s: 'sevika', t: 'Que esto no se convierta en otra fotografía para los de arriba. La gente tendrá que poder volver a cruzar cuando lo necesite.' }
        ],
        choices: [
          { id: 'evacuacion-comite', label: 'Mantener un comité ciudadano para organizar los próximos cruces', response: 'La ayuda de hoy puede convertirse en una responsabilidad compartida mañana.', complete: true, fx: { aff: { caitlyn: 1, sevika: 1 }, rep: { piltover: 1, zaun: 1 }, flags: ['sidequest_puente_comite', 'sidequest_puente_evacuacion'] } },
          { id: 'evacuacion-revision', label: 'Acordar una ruta de paso y revisarla con civiles antes de cada apertura', response: 'La seguridad debe responder a quienes realmente usan el puente.', complete: true, fx: { stats: { carisma: 1 }, rep: { piltover: 1, zaun: 1 }, flags: ['sidequest_puente_pacto', 'sidequest_puente_evacuacion'] } }
        ]
      }
    }
  }
];
