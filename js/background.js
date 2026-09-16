/**
 * Akwasi Unblocked Games - Galaxy Canvas Background Engine
 * Deep black/navy space, animated stars, glowing nebulae, floating stardust.
 * Resilient: wrapped in fail-safe try/catch so background never blocks site rendering.
 */

export function initBackground() {
  try {
    const canvas = document.querySelector('#galaxy-canvas');
    if (!canvas || !canvas.getContext) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId = null;

    const stars = [];
    const STAR_COUNT = 160;
    const colors = ['#ffffff', '#67e8f9', '#a5b4fc', '#c084fc', '#fbcfe8'];

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.3 + 0.05,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let time = 0;
    function render() {
      time += 0.01;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      // Deep space gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040711');
      bgGrad.addColorStop(0.5, '#070c1d');
      bgGrad.addColorStop(1, '#050914');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric nebulae
      const neb1 = ctx.createRadialGradient(
        width * 0.25 + Math.sin(time * 0.5) * 40,
        height * 0.3 + Math.cos(time * 0.4) * 30,
        10,
        width * 0.25,
        height * 0.3,
        width * 0.45
      );
      neb1.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      neb1.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
      neb1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, width, height);

      const neb2 = ctx.createRadialGradient(
        width * 0.75 + Math.cos(time * 0.4) * 50,
        height * 0.7 + Math.sin(time * 0.5) * 35,
        10,
        width * 0.75,
        height * 0.7,
        width * 0.5
      );
      neb2.addColorStop(0, 'rgba(168, 85, 247, 0.07)');
      neb2.addColorStop(0.5, 'rgba(59, 130, 246, 0.03)');
      neb2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, width, height);

      // Twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        const pulse = Math.sin(time * 2 + i) * 0.3;
        const currentAlpha = Math.max(0.1, Math.min(1, star.alpha + pulse));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  } catch (err) {
    console.warn('Galaxy canvas background initialized in static CSS mode:', err);
  }
}
