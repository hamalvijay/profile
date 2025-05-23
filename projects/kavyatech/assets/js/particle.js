export function startParticle(){
    $(function() {
        const canvas = $("#canvas")[0];
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = $(window).width();
            canvas.height = $(window).height();
        }
        $(window).on("resize", resizeCanvas);
        resizeCanvas();

        let particles = [];
        let lastMousePos = { x: $(window).width() *0.7, y: $(window).height() / 2};
        let mouseInside = false;

        class Particle {
            constructor(x, y) {
            this.originX = x;
            this.originY = y;
            this.x = x;
            this.y = y;

            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 4 + 0.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = Math.random() * 2 + 1;
            this.life = 1;
            }

            update() {
            this.x += this.vx;
            this.y += this.vy;

            const dx = this.x - this.originX;
            const dy = this.y - this.originY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = Math.min(canvas.width, canvas.height) * 0.8;
            this.life = 0.5 - (dist / maxDist) / 2;

            return this.life > 0;
            }

            draw(ctx) {
            const rootStyles = getComputedStyle(document.documentElement);
            const turquoiseRGB = rootStyles.getPropertyValue('--turquoise-rgb').trim();
            ctx.beginPath();
            ctx.fillStyle = `rgba(${turquoiseRGB}, ${this.life})`;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            }
        }

        function generateParticles(count) {
            for (let i = 0; i < count; i++) {
            particles.push(new Particle(lastMousePos.x, lastMousePos.y));
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            generateParticles(10);

            particles = particles.filter(p => p.update());
            particles.forEach(p => p.draw(ctx));

            requestAnimationFrame(animate);
        }
        animate();

        // Mouse input
        $(window).on("mousemove", function(e) {
            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;
            mouseInside = true;
        });

        $(window).on("mouseleave", function() {
            mouseInside = false;
        });

        // Touch input
        $(window).on("touchmove", function(e) {
            if (e.originalEvent.touches.length > 0) {
            const touch = e.originalEvent.touches[0];
            lastMousePos.x = touch.clientX;
            lastMousePos.y = touch.clientY;
            mouseInside = true;
            }
        });

        $(window).on("touchend", function() {
            mouseInside = false;
        });
    });
}