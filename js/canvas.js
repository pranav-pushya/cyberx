// canvas.js — Matrix rain background animation

(function () {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\!@#$%^&*';

  let cols = 0;
  let drops = [];
  const FONT_SIZE = 14;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FONT_SIZE);
    drops = Array.from({ length: cols }, () => Math.random() * -100);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT_SIZE + 'px Share Tech Mono, monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      // Head character brighter
      if (drops[i] * FONT_SIZE > 0 && Math.random() > 0.95) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#00ff41';
      }

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i] += 0.5;
    }
  }

  let animId;
  function start() {
    resize();
    function loop() {
      draw();
      animId = requestAnimationFrame(loop);
    }
    loop();
  }

  // Pause when tab not visible to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      start();
    }
  });

  window.addEventListener('resize', resize);

  start();
})();
