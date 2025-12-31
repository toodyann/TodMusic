  const player = document.getElementById('player');

  let startY = 0;
  let currentY = 0;
  let isSwiping = false;

  player.addEventListener('touchstart', (e) => {
    if (!player.classList.contains('fullscreen')) return;
    startY = e.touches[0].clientY;
    isSwiping = true;
  });

  player.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;

    currentY = e.touches[0].clientY;
    const diff = currentY - startY;

    if (diff > 0) {
      player.style.transform = `translateY(${diff}px)`;
    }
  });

  player.addEventListener('touchend', () => {
    if (!isSwiping) return;

    isSwiping = false;
    const diff = currentY - startY;

    if (diff > 120) {
      player.classList.remove('fullscreen');
    }

    player.style.transform = '';
  });