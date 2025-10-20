// ---- animação suave ao carregar ----
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ---- modal PIX ----
const pixBtn   = document.getElementById('openPix');
const pixModal = document.getElementById('pixModal');
const closePix = document.getElementById('closePix');
const mainWrap = document.querySelector('main.wrap');

if (pixBtn && pixModal && closePix) {
  let prevFocusedEl = null;
  let focusable = [];
  let firstEl = null;
  let lastEl  = null;

  // util: define foco cíclico no modal
  function setFocusable() {
    focusable = pixModal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    firstEl = focusable[0] || closePix;
    lastEl  = focusable[focusable.length - 1] || closePix;
  }

  // trava o foco dentro do modal
  function onKeydownTrap(e) {
    if (e.key !== 'Tab') return;
    if (focusable.length === 0) return;

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  // abre o modal
  function openModal() {
    prevFocusedEl = document.activeElement;
    pixModal.classList.add('open');
    pixModal.setAttribute('aria-hidden', 'false');

    // desabilita o fundo para leitores de tela e tabulação
    if (mainWrap && 'inert' in HTMLElement.prototype) {
      mainWrap.inert = true;
    } else if (mainWrap) {
      mainWrap.setAttribute('aria-hidden', 'true');
      mainWrap.setAttribute('tabindex', '-1');
    }

    // trava scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    setFocusable();
    closePix.focus();

    // listeners para trap e tecla Esc
    document.addEventListener('keydown', onKeydownTrap);
    document.addEventListener('keydown', onEscClose);
  }

  // fecha com tecla Esc
  function onEscClose(e) {
    if (e.key === 'Escape' && pixModal.classList.contains('open')) {
      closeModal();
    }
  }

  // fecha o modal
  function closeModal() {
    pixModal.classList.remove('open');
    pixModal.setAttribute('aria-hidden', 'true');

    // reativa o fundo
    if (mainWrap && 'inert' in HTMLElement.prototype) {
      mainWrap.inert = false;
    } else if (mainWrap) {
      mainWrap.removeAttribute('aria-hidden');
      mainWrap.removeAttribute('tabindex');
    }

    // destrava scroll
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // solta listeners
    document.removeEventListener('keydown', onKeydownTrap);
    document.removeEventListener('keydown', onEscClose);

    // devolve foco
    (prevFocusedEl || pixBtn).focus();
  }

  // eventos principais
  pixBtn.addEventListener('click', openModal);
  closePix.addEventListener('click', closeModal);

  // fecha ao clicar fora da caixa
  pixModal.addEventListener('click', (e) => {
    if (e.target === pixModal) closeModal();
  });
}
