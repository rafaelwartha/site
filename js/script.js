// animação suave e ano do rodapé
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ----------- FUNÇÃO DE CONFETE -----------
function explodirConfete() {
  if (typeof confetti === "undefined") return;

  // rajada central
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 }
  });

  // segunda rajada lateral colorida
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 100,
      angle: 60,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 100,
      spread: 100,
      angle: 120,
      origin: { x: 1 }
    });
  }, 350);
}

// ----------- MODAL BASE (FUNÇÃO REUTILIZÁVEL) -----------
function criarModalSistema(btnAbrirId, modalId, btnFecharId, mainWrap) {
  const botaoAbrir = document.getElementById(btnAbrirId);
  const modal = document.getElementById(modalId);
  const botaoFechar = document.getElementById(btnFecharId);

  if (!(botaoAbrir && modal && botaoFechar)) return;

  let prevFocusedEl = null;
  let focusable = [];
  let firstEl = null;
  let lastEl = null;

  function setFocusable() {
    focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    firstEl = focusable[0] || botaoFechar;
    lastEl = focusable[focusable.length - 1] || botaoFechar;
  }

  function onKeydownTrap(e) {
    if (e.key !== 'Tab') return;
    if (!focusable.length) return;
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }

  function onEscClose(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  }

  function openModal() {
    prevFocusedEl = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    // 🚀 dispara confete se for o modal do sorteio
    if (modalId === 'sorteioModal') {
      explodirConfete();
    }

    if (mainWrap && 'inert' in HTMLElement.prototype) {
      mainWrap.inert = true;
    } else if (mainWrap) {
      mainWrap.setAttribute('aria-hidden', 'true');
      mainWrap.setAttribute('tabindex', '-1');
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    setFocusable();
    botaoFechar.focus();

    document.addEventListener('keydown', onKeydownTrap);
    document.addEventListener('keydown', onEscClose);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (mainWrap && 'inert' in HTMLElement.prototype) {
      mainWrap.inert = false;
    } else if (mainWrap) {
      mainWrap.removeAttribute('aria-hidden');
      mainWrap.removeAttribute('tabindex');
    }

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    document.removeEventListener('keydown', onKeydownTrap);
    document.removeEventListener('keydown', onEscClose);

    (prevFocusedEl || botaoAbrir).focus();
  }

  botaoAbrir.addEventListener('click', openModal);
  botaoFechar.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// ----------- CHAMADAS -----------
const mainWrap = document.querySelector('main.wrap');

// Modal PIX
criarModalSistema('openPix', 'pixModal', 'closePix', mainWrap);

// Modal Sorteio
criarModalSistema('openSorteio', 'sorteioModal', 'closeSorteio', mainWrap);
