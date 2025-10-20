// ---- animação suave ao carregar ----
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  document.getElementById('year').textContent = new Date().getFullYear();
});

// ---- modal PIX ----
const pixBtn   = document.getElementById('openPix');
const pixModal = document.getElementById('pixModal');
const closePix = document.getElementById('closePix');

// abre o modal
function openModal() {
  pixModal.classList.add('open');
  closePix.focus();
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

// fecha o modal
function closeModal() {
  pixModal.classList.remove('open');
  pixBtn.focus();
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// eventos
pixBtn.addEventListener('click', openModal);
closePix.addEventListener('click', closeModal);

// fecha ao clicar fora da caixa
pixModal.addEventListener('click', (e) => {
  if (e.target === pixModal) closeModal();
});

// fecha com tecla Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && pixModal.classList.contains('open')) {
    closeModal();
  }
});
