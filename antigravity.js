/**
 * Antigravity Canvas Particle Background
 * A high-performance HTML5 Canvas animation mimicking the "Google Antigravity" effect,
 * customized for a monochrome dark mode theme.
 */

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("antigravity-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d", { alpha: true });
    
    // Configuration
    const PARTICLE_COUNT = 400; // Between 300 and 500
    const REPULSION_RADIUS = 120; // Radius around mouse that pushes particles
    const REPULSION_FORCE = 0.5; // Strength of the push
    const DAMPING = 0.95; // Friction/damping to slow down pushed particles
    const RETURN_SPEED = 0.05; // Speed at which particles try to return to their natural drift
    
    // Palette: Whites, translucent grays, deep blacks/dark grays
    const PALETTE = [
        "rgba(255, 255, 255, 0.8)",  // Pure white (translucent)
        "rgba(255, 255, 255, 0.5)",  // Soft white
        "rgba(204, 204, 204, 0.4)",  // Light gray (#CCCCCC)
        "rgba(136, 136, 136, 0.3)",  // Mid gray (#888888)
        "rgba(34, 34, 34, 0.6)",     // Dark gray/Black
        "rgba(17, 17, 17, 0.8)"      // Very dark gray/Black (#111111)
    ];

    let width, height;
    let particles = [];
    
    // Mouse state
    const mouse = {
        x: -1000,
        y: -1000,
        active: false
    };

    /**
     * Handle Resize
     */
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // Adjust for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        
        initParticles();
    }

    window.addEventListener("resize", resize);

    /**
     * Mouse Tracking
     */
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseout", () => {
        mouse.active = false;
        mouse.x = -1000;
        mouse.y = -1000;
    });

    /**
     * Particle Class
     */
    class Particle {
        constructor() {
            this.reset();
            // Randomize starting position across the entire canvas
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        }

        reset() {
            this.radius = Math.random() * 3 + 1; // 1px to 4px
            this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
            
            // Natural slow drifting velocity
            this.baseDx = (Math.random() - 0.5) * 0.5;
            this.baseDy = (Math.random() - 0.5) * 0.5;
            
            // Current velocity
            this.dx = this.baseDx;
            this.dy = this.baseDy;
        }

        update() {
            // Check interaction with mouse
            if (mouse.active) {
                const diffX = this.x - mouse.x;
                const diffY = this.y - mouse.y;
                const distance = Math.sqrt(diffX * diffX + diffY * diffY);

                if (distance < REPULSION_RADIUS) {
                    // Calculate force based on distance (closer = stronger push)
                    const force = (REPULSION_RADIUS - distance) / REPULSION_RADIUS;
                    
                    // Apply force vector pointing away from mouse
                    this.dx += (diffX / distance) * force * REPULSION_FORCE;
                    this.dy += (diffY / distance) * force * REPULSION_FORCE;
                }
            }

            // Apply friction/damping to gently return to base velocity
            this.dx += (this.baseDx - this.dx) * RETURN_SPEED;
            this.dy += (this.baseDy - this.dy) * RETURN_SPEED;
            
            // Limit maximum speed slightly for smoothness after heavy push
            this.dx *= DAMPING;
            this.dy *= DAMPING;

            // Move particle
            this.x += this.dx;
            this.y += this.dy;

            // Screen wrapping (if they float off screen, wrap them around to maintain particle count)
            if (this.x < -this.radius) this.x = width + this.radius;
            else if (this.x > width + this.radius) this.x = -this.radius;
            
            if (this.y < -this.radius) this.y = height + this.radius;
            else if (this.y > height + this.radius) this.y = -this.radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    /**
     * Initialize Particles Array
     */
    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    /**
     * Main Animation Loop
     */
    function animate() {
        requestAnimationFrame(animate);
        
        // Clear canvas with a very slight fade for a smooth, natural look 
        // (alternatively, just clearRect for perfect sharpness)
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
    }

    // Start
    resize();
    animate();
});
