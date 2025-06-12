document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES ---
    const loadingTime = 4000; // 4 segundos

    // --- ELEMENTOS ---
    const openButton = document.getElementById('open-button');
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const progressBar = document.getElementById('progress-bar-inner');
    const loadingPercentage = document.getElementById('loading-percentage');
    const backgroundMusic = document.getElementById('background-music');
    const cursor = document.querySelector('.custom-cursor');
    const panels = document.querySelectorAll('.panel');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    // --- CURSOR PERSONALIZADO ---
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // --- PARTÍCULAS ---
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() * 0.5 - 0.25);
            this.speedY = (Math.random() * 0.5 - 0.25);
            this.color = `hsl(${Math.random() * 50 + 300}, 100%, 70%)`;
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            this.x += this.speedX; this.y += this.speedY;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
    }
    function handleParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let particle of particlesArray) {
            particle.update();
            particle.draw();
        }
        requestAnimationFrame(handleParticles);
    }

    // --- BOTÃO INICIAL E CARREGAMENTO ---
    openButton.addEventListener('click', () => {
        startScreen.classList.remove('visible');
        loadingScreen.classList.add('visible');
        
        // FADE-IN DA MÚSICA
        backgroundMusic.volume = 0;
        backgroundMusic.play().catch(e => console.error("Audio play failed:", e));
        let fadeAudio = setInterval(() => {
            if (backgroundMusic.volume < 0.5) { // Volume máximo de 50%
                backgroundMusic.volume += 0.05;
            } else {
                clearInterval(fadeAudio);
            }
        }, 200);

        // BARRA DE PROGRESSO
        let progress = 0;
        const interval = setInterval(() => {
            progress++;
            progressBar.style.width = `${progress}%`;
            loadingPercentage.textContent = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.remove('visible');
                    document.body.style.overflow = 'auto';
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }, 500);
            }
        }, loadingTime / 100);
    });

    // --- GALERIA EXPANSÍVEL ---
    panels.forEach(panel => {
        panel.addEventListener('click', () => {
            panels.forEach(p => p.classList.remove('active'));
            panel.classList.add('active');
        });
    });

    // --- ANIMAÇÃO DE ROLAGEM (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2 // O elemento aparece quando 20% dele estiver visível
    });

    revealElements.forEach(el => observer.observe(el));

    // --- INICIALIZAÇÃO ---
    initParticles();
    handleParticles();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });
});