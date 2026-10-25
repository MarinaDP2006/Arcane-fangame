// Galería de referencias visuales de la autora. Usa los PNG originales del repositorio; no genera ni sustituye imágenes.
(function () {
  const items = [
    { file: 'CREACION DE PERSONAJES, MENUS Y AJUSTES INSPIRACION.png', title: 'Creación de personajes, menús y ajustes', note: 'Referencia visual para rehacer la interfaz de creación, navegación y ajustes.' },
    { file: 'INSPIRACION PANTALLAS SEGUN CIUDAD.png', title: 'Pantallas según ciudad', note: 'Diferenciar Piltover y Zaun en composición, luz, materiales y jerarquía visual.' },
    { file: 'INSPIRACION MODELOS 3D.png', title: 'Inspiración para modelos 3D', note: 'Guía de proporciones y presentación de personajes en el mundo.' },
    { file: 'COMO SE VERIAN LOS LUGARES, PANTALLAS Y PERSONAJE EN LAS CIUDADES (CIUDADES CUADRADAS).png', title: 'Lugares, pantallas y personaje en las ciudades', note: 'Referencia de cómo integrar escenario, personaje y HUD dentro de la escena.' },
    { file: 'INTERFAZ A MEJORAR DE CREACION Y USABILIDAD.png', title: 'Interfaz y usabilidad por mejorar', note: 'Puntos de referencia para mejorar legibilidad, flujo de creación y controles.' }
  ];
  function open() {
    document.querySelector('#arcane-inspiration')?.remove();
    const android = document.documentElement.dataset.platform === 'android';
    const src = (file) => android ? 'img/inspiracion/' + encodeURIComponent(file) : '../' + encodeURIComponent(file);
    const modal = document.createElement('section');
    modal.id = 'arcane-inspiration';
    modal.className = 'inspiration-backdrop';
    modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'inspiration-title');
    modal.innerHTML = '<div class="inspiration-panel"><header class="inspiration-head"><div><p class="eyebrow">ARCHIVO VISUAL · ARCANE</p><h2 id="inspiration-title">Creación e inspiración</h2><p>Referencias PNG originales guardadas en la rama main del repositorio.</p></div><button class="inspiration-close" type="button" aria-label="Cerrar galería">×</button></header><div class="inspiration-grid"></div></div>';
    const grid = modal.querySelector('.inspiration-grid');
    items.forEach((item) => {
      const card = document.createElement('article'); card.className = 'inspiration-card';
      const img = document.createElement('img'); img.src = src(item.file); img.alt = item.title; img.loading = 'lazy';
      const title = document.createElement('h3'); title.textContent = item.title;
      const note = document.createElement('p'); note.textContent = item.note;
      const link = document.createElement('a'); link.href = src(item.file); link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Abrir imagen completa';
      card.append(img, title, note, link); grid.append(card);
      img.addEventListener('error', () => { img.alt = 'No se ha podido cargar el PNG: ' + item.file; card.classList.add('inspiration-missing'); });
    });
    const close = () => modal.remove();
    modal.querySelector('.inspiration-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape' && modal.isConnected) { close(); document.removeEventListener('keydown', esc); } });
    document.body.append(modal); modal.querySelector('.inspiration-close').focus();
  }
  window.ArcaneInspiration = { open };
})();