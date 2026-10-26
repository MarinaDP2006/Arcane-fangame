// Navegación accesible de la portada pública. No depende de bibliotecas externas.
(() => {
  const button = document.querySelector('.menu-boton');
  const menu = document.getElementById('menu');
  if (!button || !menu) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const closeMenu = (restoreFocus = false) => {
    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('abierto');
    if (restoreFocus) button.focus();
  };

  button.addEventListener('click', () => {
    const open = !isOpen();
    button.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('abierto', open);
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) closeMenu(true);
  });

  const desktop = window.matchMedia('(min-width: 761px)');
  const onBreakpoint = (event) => {
    if (event.matches) closeMenu(false);
  };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  else desktop.addListener(onBreakpoint);
})();
