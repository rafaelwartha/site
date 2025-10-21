// animação suave e ano do rodapé
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// modal PIX acessível
const pixBtn   = document.getElementById('openPix');
const pixModal = document.getElementById('pixModal');
const closePix = document.getElementById('closePix');
const mainWrap = document.querySelector('main.wrap');

if (pixBtn && pixModal && closePix) {
  let prevFocusedEl = null;
  let focusable = [];
  let firstEl = null;
  let lastEl  = null;

  function setFocusable() {
    focusable = pixModal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    firstEl = focusable[0] || closePix;
    lastEl  = focusable[focusable.length - 1] || closePix;
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

  function openModal() {
    prevFocusedEl = document.activeElement;
    pixModal.classList.add('open');
    pixModal.setAttribute('aria-hidden', 'false');

    if (mainWrap && 'inert' in HTMLElement.prototype) {
      mainWrap.inert = true;
    } else if (mainWrap) {
      mainWrap.setAttribute('aria-hidden', 'true');
      mainWrap.setAttribute('tabindex', '-1');
    }

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    setFocusable();
    closePix.focus();

    document.addEventListener('keydown', onKeydownTrap);
    document.addEventListener('keydown', onEscClose);
  }

  function onEscClose(e) {
    if (e.key === 'Escape' && pixModal.classList.contains('open')) {
      closeModal();
    }
  }

  function closeModal() {
    pixModal.classList.remove('open');
    pixModal.setAttribute('aria-hidden', 'true');

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

    (prevFocusedEl || pixBtn).focus();
  }

  pixBtn.addEventListener('click', openModal);
  closePix.addEventListener('click', closeModal);
  pixModal.addEventListener('click', (e) => {
    if (e.target === pixModal) closeModal();
  });
}
