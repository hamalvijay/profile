export function startParticles(followMouse) {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".canvas");
    const ctx = canvas.getContext("2d");

    const MAX_PARTICLES = 500;
    const PARTICLES_PER_FRAME = 5;
    const FOLLOW_MOUSE = followMouse ?? false;

    let lastMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let mouseInside = false;

    const turquoiseRGB = getComputedStyle(document.documentElement)
      .getPropertyValue("--turquoise-rgb")
      .trim();

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.active = false;
      }

      reset(x, y) {
        this.active = true;
        this.originX = this.x = x;
        this.originY = this.y = y;

        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 0.5 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.radius = Math.random() * 2 + 1;
        this.life = 1;
      }

      update() {
        if (!this.active) return false;

        this.x += this.vx;
        this.y += this.vy;

        const dx = this.x - this.originX;
        const dy = this.y - this.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(canvas.width, canvas.height) * 0.8;

        this.life = 0.5 - dist / maxDist;
        if (this.life <= 0) {
          this.active = false;
        }
        return this.active;
      }

      draw() {
        if (!this.active) return;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${turquoiseRGB}, ${this.life})`;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    const particlePool = Array.from({ length: MAX_PARTICLES }, () => new Particle());

    function generateParticles(count) {
      let generated = 0;
      for (let p of particlePool) {
        if (!p.active && generated < count) {
          p.reset(lastMousePos.x, lastMousePos.y);
          generated++;
        }
        if (generated >= count) break;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (FOLLOW_MOUSE || !mouseInside) {
        generateParticles(PARTICLES_PER_FRAME);
      }

      for (let p of particlePool) {
        if (p.update()) {
          p.draw();
        }
      }

      requestAnimationFrame(animate);
    }

    // Input listeners
    window.addEventListener("mousemove", (e) => {
      if (FOLLOW_MOUSE) {
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
        mouseInside = true;
      }
    });

    window.addEventListener("mouseleave", () => {
      if (FOLLOW_MOUSE) {
        mouseInside = false;
      }
    });

    window.addEventListener("touchmove", (e) => {
      if (FOLLOW_MOUSE && e.touches.length > 0) {
        const touch = e.touches[0];
        lastMousePos.x = touch.clientX;
        lastMousePos.y = touch.clientY;
        mouseInside = true;
      }
    });

    window.addEventListener("touchend", () => {
      if (FOLLOW_MOUSE) {
        mouseInside = false;
      }
    });

    animate();
  });
}
