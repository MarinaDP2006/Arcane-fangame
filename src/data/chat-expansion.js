// Nuevos temas del comunicador que recuerdan las decisiones de la campaña ampliada.
// Se cargan después de chat.js y ofrecen respuestas escritas incluso con IA desactivada.
(function () {
  const CHAT = window.CHAT;
  if (!CHAT || CHAT.expansionV2) return;
  // Introduce una conversación reactiva sin modificar ni repetir temas anteriores.
  function topic(id, option) {
    if (!CHAT[id]) return;
    CHAT[id].hub.push(option);
  }

  topic('vi', { t: 'Sobre mi nombre en la lista de vigilancia…', tone: 'serio',
    req: { flag: 'testigos_protegidos' }, once: true, fx: { aff: 1 },
    say: ['(Se queda mirando tu mano.) Quemaste el papel. No los nombres. Eso es lo que me da miedo.',
      'Mira, no pienso decirte cómo vivir. Pero si vienen a por ti, no vas a enfrentarte a ellos sin alguien a tu lado.'] });
  topic('vi', { t: 'Quería acompañarte, no arreglarte la vida.', tone: 'amable',
    req: { flag: 'busca_jinx' }, once: true, fx: { aff: 2 },
    say: ['(Exhala lentamente.) Bien. Porque no hay nada que arreglar en cinco minutos.',
      'Puedes quedarte un rato. Sin hablar también vale.'] });
  topic('jinx', { t: '¿Y si construimos algo que no explote?', tone: 'astuto',
    req: { stat: 'ingenio', min: 2 }, once: true, fx: { aff: 1 },
    say: ['(Entorna los ojos.) ¿Y perderme la parte divertida? ... ¿Algo para limpiar el aire de los críos?',
      'No mires así. También sé construir cosas útiles. Solo que nadie suele preguntarlo.'] });
  topic('caitlyn', { t: 'Aceptaste investigar aquella lista. ¿Te arrepientes?', tone: 'serio',
    req: { flag: 'lista_investigada' }, once: true, fx: { aff: 1 },
    say: ['Me arrepiento de no haber preguntado antes cómo se escribieron esos nombres.',
      'Hay informes que pueden destruir carreras. Lo preocupante es que algunos puedan destruir vidas.'] });
  topic('caitlyn', { t: 'Gracias por priorizar la evacuación.', tone: 'amable',
    req: { flag: 'evacuacion_civiles' }, once: true, fx: { aff: 2 },
    say: ['No fue una elección noble. Fue la única orden que podría defender mirando a esa gente a los ojos.',
      '(Baja la mirada un instante.) Antes quizá habría pensado otra cosa.'] });
  topic('ekko', { t: '¿Llegaron los filtros a todas las familias?', tone: 'pregunta',
    req: { flag: 'filtros_luciernagas' }, once: true, fx: { aff: 2 },
    say: ['No a todas. Pero ayer una niña pudo correr sin quedarse sin aire a mitad de la escalera.',
      'Lo sé porque volvió para devolverme la caja. La había pintado de azul. (Sonríe.)'] });
  topic('ekko', { t: 'Quiero saber qué pasó con los refugios.', tone: 'pregunta',
    req: { flag: 'evacuacion_civiles' }, once: true, fx: { aff: 1 },
    say: ['Quedan mantas para dos noches. Después habrá que improvisar.',
      'Lo bueno es que ya no improviso solo. Has aparecido cuando la gente necesitaba manos.'] });
  topic('jayce', { t: 'Vi la alteración de los registros hextec.', tone: 'serio',
    req: { flag: 'registros_hextec' }, once: true, fx: { aff: 1 },
    say: ['Me pasé años pensando que el error más peligroso de una máquina era técnico.',
      '(Señala los registros.) Pero alguien cambió una cifra para dejar a un barrio sin aire. Eso no lo arregla ningún cristal.'] });
  topic('mel', { t: '¿Crees que aquel acuerdo sobre los filtros sirvió de algo?', tone: 'pregunta',
    req: { flag: 'acuerdo_filtros' }, once: true, fx: { aff: 1 },
    say: ['Sirvió para que las cajas cruzaran el puente. No para que el Consejo aprendiera la lección.',
      'Una negociación puede salvar una vida sin salvar una institución. Son dos trabajos diferentes, {name}.'] });
  topic('mel', { t: 'Dijiste que había llegado el momento de revelar la verdad.', tone: 'serio',
    req: { flag: 'apoya_mel' }, once: true, fx: { aff: 1 },
    say: ['La verdad no pierde su peso porque quien la pronuncie sea mi madre.',
      'No te prometo que no me duela. Te prometo que no cambiaré las pruebas para ahorrarme el dolor.'] });
  topic('silco', { t: 'Nunca olvidé el trato sobre los filtros.', tone: 'serio',
    req: { flag: 'trato_ruta_zaun' }, once: true, fx: { aff: 1 },
    say: ['(Deja el vaso sin probarlo.) La ciudad recuerda quién alimenta sus máquinas. También quién permite que las familias respiren.',
      'No confundas mi agradecimiento con una promesa. Pero tu trato se cumplió.'] });
  topic('sevika', { t: 'Pediste un asiento real para Zaun.', tone: 'serio',
    req: { flag: 'voz_zaun' }, once: true, fx: { aff: 2 },
    say: ['No necesito que me inviten a una mesa porque quedan sillas libres.',
      'Necesito saber que la próxima vez que nos quiten algo, no bastará con pedirnos paciencia. ¿Tú lo entiendes, verdad?'] });
  // Conversaciones posteriores a las decisiones del tercer acto de la temporada 2.
  // Todas se desbloquean por una bandera narrativa: no adelantan información al jugador.
  topic('sevika', { t: '¿Y si esta tregua no dura?', tone: 'serio',
    req: { flag: 'tregua_tactica' }, once: true, fx: { aff: 1 },
    say: ['Una tregua no es confianza. Es una lista de cosas que ambos lados perderían si vuelven a disparar.',
      'Si quieres que dure, consigue que la gente de Zaun vea resultados en las calles, no firmas en un despacho.'] });
  topic('ekko', { t: '¿Cómo protegemos a quienes no pueden luchar?', tone: 'serio',
    req: { flag: 'evacuacion_civiles' }, once: true, fx: { aff: 2 },
    say: ['Primero rutas seguras, luego comida, agua y alguien que se quede a escuchar. La gente no deja de tener miedo porque la saques del peligro.',
      'No podemos salvar a todo el mundo en una noche. Pero sí podemos dejar de tratar a los civiles como daños inevitables.'] });
  topic('jinx', { t: 'No tenías que ayudar con la evacuación.', tone: 'amable',
    req: { flag: 'jinx_ayuda_evacuacion' }, once: true, fx: { aff: 2 },
    say: ['Ya, bueno. No te acostumbres a verme haciendo cosas sensatas.',
      '(Hace girar una pieza entre los dedos.) Había niños en el pasillo. No iba a dejar que se quedaran allí. No conviertas esto en una gran conversación.'] });
  topic('jayce', { t: '¿Qué viste realmente en el núcleo?', tone: 'serio',
    req: { flag: 'confia_jayce' }, once: true, fx: { aff: 1 },
    say: ['Vi una posibilidad, no una profecía. El error fue creer que comprender el mecanismo significaba comprender a las personas.',
      'Si volvemos a tocar el Hexgate, nadie debería poder hacerlo sin explicar qué arriesga la ciudad entera.'] });
  topic('viktor', { t: 'No quiero que el sufrimiento decida por todos.', tone: 'serio',
    req: { flag: 'apela_viktor' }, once: true, fx: { aff: 1 },
    say: ['Yo también quise acabar con el dolor. Llegué a confundir la ausencia de dolor con la ausencia de libertad.',
      'Si alguna vez vuelvo a ofrecer una solución perfecta, pregúntame qué parte de la humanidad exige a cambio.'] });
  topic('caitlyn', { t: '¿Qué pasó con el paso seguro?', tone: 'pregunta',
    req: { flag: 'puente_abierto' }, once: true, fx: { aff: 1 },
    say: ['Se mantuvo abierto mientras pudimos sostenerlo. No todos cruzaron a tiempo y no voy a fingir que eso no importa.',
      'Mañana tendremos que revisar cada nombre y cada desaparición. Un corredor humanitario no sirve si nadie responde por quienes faltan.'] });
  topic('mel', { t: '¿Te arrepientes de haber pedido apoyo?', tone: 'serio',
    req: { flag: 'apoya_mel' }, once: true, fx: { aff: 1 },
    say: ['Me arrepiento de haber pensado que podía controlar el coste de cada alianza.',
      'Pedir apoyo no me exime de responsabilidad. Solo significa que ya no puedo fingir que las consecuencias son únicamente mías.'] });
  // No enumerar esta marca: el validador recorre Object.values(CHAT) como personajes.
  Object.defineProperty(CHAT, 'expansionV2', { value: true, enumerable: false });
})();
