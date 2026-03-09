/* ============================================
   ARVIN DEMAS NARYAMA — PORTFOLIO SCRIPTS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── CUSTOM CURSOR ── */
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');

    if (dot && ring) {
        let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

        window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        (function cursorLoop() {
            dx += (mx - dx) * 0.2;
            dy += (my - dy) * 0.2;
            rx += (mx - rx) * 0.08;
            ry += (my - ry) * 0.08;
            dot.style.left = dx + 'px';
            dot.style.top = dy + 'px';
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(cursorLoop);
        })();

        // Hover effects
        document.querySelectorAll('a, button, .project-card, .achievement-card, .service-card, .faq-question').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // Hide on touch
        if ('ontouchstart' in window) {
            dot.style.display = 'none';
            ring.style.display = 'none';
            document.documentElement.style.cursor = 'auto';
            document.body.style.cursor = 'auto';
        }
    }

    /* ── NAVBAR SCROLL EFFECT ── */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 100);
        });
    }

    /* ── MOBILE MENU ── */
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('active');
        });
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
            });
        });
    }

    /* ── ACTIVE NAV LINK ON SCROLL ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 150) {
                current = sec.getAttribute('id');
            }
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });

    /* ── FAQ ACCORDION ── */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const wasOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!wasOpen) item.classList.add('open');
        });
    });

    /* ── HERO CANVAS BACKGROUND ── */
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h;
        function resize() {
            w = canvas.width = canvas.parentElement.offsetWidth;
            h = canvas.height = canvas.parentElement.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const blobs = [
            { x: 0.3, y: 0.4, r: 250, color: 'rgba(16,185,129,0.12)', speed: 0.0003, angle: 0 },
            { x: 0.7, y: 0.3, r: 200, color: 'rgba(13,148,104,0.10)', speed: 0.0005, angle: 2 },
            { x: 0.5, y: 0.7, r: 180, color: 'rgba(16,185,129,0.08)', speed: 0.0004, angle: 4 },
        ];

        function drawBlobs() {
            ctx.clearRect(0, 0, w, h);
            blobs.forEach(b => {
                b.angle += b.speed;
                const bx = b.x * w + Math.sin(b.angle) * 60;
                const by = b.y * h + Math.cos(b.angle * 1.3) * 40;
                const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
                grad.addColorStop(0, b.color);
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(bx, by, b.r, 0, Math.PI * 2);
                ctx.fill();
            });
            requestAnimationFrame(drawBlobs);
        }
        drawBlobs();
    }

    /* ── HERO LETTER STAGGER ── */
    function animateHeroName() {
        const heroName = document.querySelector('.hero-name');
        if (!heroName) return;

        const text = heroName.textContent.trim();
        heroName.innerHTML = '';
        text.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            heroName.appendChild(span);
        });

        if (typeof gsap !== 'undefined') {
            gsap.to('.hero-name .letter', {
                opacity: 1, y: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: 'power3.out',
                delay: 0.3,
                onComplete: () => { startTypingEffect(); startCounters(); }
            });
        } else {
            // Fallback without GSAP
            document.querySelectorAll('.hero-name .letter').forEach((l, i) => {
                setTimeout(() => { l.style.opacity = 1; l.style.transform = 'translateY(0)'; }, 80 * i);
            });
            setTimeout(() => { startTypingEffect(); startCounters(); }, text.length * 80 + 200);
        }
    }

    /* ── TYPING EFFECT ── */
    function startTypingEffect() {
        const el = document.querySelector('.hero-sub');
        if (!el) return;
        const phrases = ['Information Systems', 'UI/UX Design', 'Web Development'];
        let pi = 0, ci = 0, deleting = false;
        const cursorSpan = '<span class="cursor-blink">|</span>';

        function tick() {
            const phrase = phrases[pi];
            if (!deleting) {
                ci++;
                el.innerHTML = phrase.substring(0, ci) + cursorSpan;
                if (ci === phrase.length) {
                    setTimeout(() => { deleting = true; tick(); }, 1800);
                    return;
                }
            } else {
                ci--;
                el.innerHTML = phrase.substring(0, ci) + cursorSpan;
                if (ci === 0) {
                    deleting = false;
                    pi = (pi + 1) % phrases.length;
                }
            }
            setTimeout(tick, deleting ? 40 : 80);
        }
        tick();
    }

    /* ── COUNTER ANIMATION ── */
    function startCounters() {
        document.querySelectorAll('.stat-num[data-target]').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const isFloat = String(target).includes('.');
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = (isFloat ? current.toFixed(2) : Math.round(current)) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    /* ── GSAP SCROLL ANIMATIONS ── */
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            // Fallback: simple IntersectionObserver
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.section, .project-card, .achievement-card, .service-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // Section lines
        gsap.utils.toArray('.section-line').forEach(line => {
            gsap.to(line, {
                scaleX: 1, duration: .8, ease: 'power2.out',
                scrollTrigger: {
                    trigger: line,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Section reveals
        gsap.utils.toArray('.section').forEach(sec => {
            const children = sec.querySelectorAll('.section-label, .section-title, .section-line');
            gsap.from(children, {
                y: 30, opacity: 0, duration: .6, stagger: .1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Project cards
        gsap.utils.toArray('.project-card').forEach((card, i) => {
            gsap.from(card, {
                y: 60, opacity: 0, duration: .7, delay: i * 0.15, ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Achievement cards — smooth stagger
        gsap.utils.toArray('.achievement-card').forEach((card, i) => {
            gsap.from(card, {
                y: 40, opacity: 0, duration: .6, delay: i * 0.1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Service cards stagger
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                y: 40, opacity: 0, duration: .6, delay: i * 0.1, ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // About section
        const aboutVis = document.querySelector('.about-visual');
        if (aboutVis) {
            gsap.from(aboutVis, {
                x: -60, opacity: 0, duration: .8, ease: 'power2.out',
                scrollTrigger: {
                    trigger: aboutVis,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            gsap.from(aboutText, {
                x: 60, opacity: 0, duration: .8, ease: 'power2.out',
                scrollTrigger: {
                    trigger: aboutText,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Footer CTA
        const footerCta = document.querySelector('.footer-cta-block');
        if (footerCta) {
            gsap.from(footerCta, {
                y: 60, opacity: 0, duration: .8, ease: 'power2.out',
                scrollTrigger: {
                    trigger: footerCta,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Footer photo rise
        const footerPhoto = document.querySelector('.footer-photo-wrapper');
        if (footerPhoto) {
            gsap.from(footerPhoto, {
                y: 100, opacity: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: footerPhoto,
                    start: 'top 95%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }

    /* ── 3D TILT ON PROJECT CARDS ── */
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ── INIT ── */
    animateHeroName();

    // Wait for GSAP to load (it's deferred)
    function waitForGSAP() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            initScrollAnimations();
        } else {
            setTimeout(waitForGSAP, 100);
        }
    }
    waitForGSAP();

    /* ═══════════════════════════════════════════
       HERO INTERACTIVE — FLUID CURSOR-DRIVEN
       Lerp-based parallax, glow, depth + ambient
       GPU-accelerated, 60fps, cinematic feel
       ═══════════════════════════════════════════ */
    (function initHeroInteractive() {
        const container = document.getElementById('heroInteractive');
        if (!container) return;

        const image = container.querySelector('.hero-image');
        const glow = container.querySelector('.hero-glow');
        const depth = container.querySelector('.hero-depth-layer');
        if (!image) return;

        /* ── CONFIG ── */
        const IMG_LERP    = 0.06;   // Image follow speed (lower = smoother)
        const GLOW_LERP   = 0.03;   // Glow trails behind cursor
        const DEPTH_LERP  = 0.04;   // Depth layer speed
        const IMG_RANGE   = 25;     // Max translate px for image
        const GLOW_RANGE  = 40;     // Max translate px for glow
        const DEPTH_RANGE = 8;      // Depth layer inverse translate px
        const ROTATE_MAX  = 3;      // Max rotation degrees
        const SCALE_BASE  = 1.05;   // Constant gentle zoom
        const IDLE_AMP    = 5;      // Idle oscillation amplitude px
        const IDLE_FREQ   = 0.0008; // Idle oscillation speed
        const IDLE_DELAY  = 2000;   // ms before idle motion kicks in

        /* ── STATE ── */
        let targetX = 0, targetY = 0;           // Normalized mouse (-1 to 1)
        let imgX = 0, imgY = 0;                 // Current image lerp values
        let glowX = 0, glowY = 0;               // Current glow lerp values
        let depthX = 0, depthY = 0;             // Current depth lerp values
        let lastMoveTime = Date.now();
        let isTouch = 'ontouchstart' in window;
        let animId;

        /* ── MOUSE TRACKING ── */
        function onMouseMove(e) {
            // Normalize cursor position relative to viewport center (-1 to 1)
            targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * 2;
            lastMoveTime = Date.now();
        }

        if (!isTouch) {
            window.addEventListener('mousemove', onMouseMove, { passive: true });
        }

        /* ── ANIMATION LOOP ── */
        function animate() {
            const now = Date.now();
            const isIdle = (now - lastMoveTime) > IDLE_DELAY;

            // If idle, apply ambient sine-wave oscillation
            let tx = targetX, ty = targetY;
            if (isIdle || isTouch) {
                const t = now * IDLE_FREQ;
                tx = Math.sin(t) * 0.3;
                ty = Math.cos(t * 0.7) * 0.2;
            }

            // Lerp image position
            imgX += (tx - imgX) * IMG_LERP;
            imgY += (ty - imgY) * IMG_LERP;

            // Lerp glow position (slower — trails behind)
            glowX += (tx - glowX) * GLOW_LERP;
            glowY += (ty - glowY) * GLOW_LERP;

            // Lerp depth layer (inverse direction)
            depthX += (-tx - depthX) * DEPTH_LERP;
            depthY += (-ty - depthY) * DEPTH_LERP;

            // Apply image transform: translate + scale + 3D rotation
            const iX = imgX * IMG_RANGE;
            const iY = imgY * IMG_RANGE;
            const rY = imgX * ROTATE_MAX;    // Rotate around Y axis based on horizontal
            const rX = -imgY * ROTATE_MAX;   // Rotate around X axis based on vertical
            image.style.transform =
                `translate3d(${iX}px, ${iY}px, 0) scale(${SCALE_BASE}) rotateX(${rX}deg) rotateY(${rY}deg)`;

            // Apply glow transform
            if (glow) {
                const gX = glowX * GLOW_RANGE;
                const gY = glowY * GLOW_RANGE;
                glow.style.transform =
                    `translate(calc(-50% + ${gX}px), calc(-50% + ${gY}px))`;
            }

            // Apply depth layer transform (inverse parallax)
            if (depth) {
                const dX = depthX * DEPTH_RANGE;
                const dY = depthY * DEPTH_RANGE;
                depth.style.transform =
                    `translate3d(${dX}px, ${dY}px, 0)`;
            }

            animId = requestAnimationFrame(animate);
        }
        animId = requestAnimationFrame(animate);

        /* ── ENTRANCE ANIMATION ── */
        function triggerEntrance() {
            if (typeof gsap !== 'undefined') {
                // GSAP cinematic entrance
                gsap.fromTo(container,
                    { opacity: 0, scale: 0.85, y: 40 },
                    {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1.2,
                        delay: 0.8,
                        ease: 'power3.out',
                        clearProps: 'scale,y',  // Allow CSS class to take over
                        onComplete: () => {
                            container.classList.add('is-visible');
                        }
                    }
                );
            } else {
                // CSS-only fallback with delay
                setTimeout(() => {
                    container.classList.add('is-visible');
                }, 800);
            }
        }

        // Wait for GSAP (loaded with defer)
        function waitForGSAPInteractive() {
            if (typeof gsap !== 'undefined') {
                triggerEntrance();
            } else {
                setTimeout(waitForGSAPInteractive, 150);
            }
        }
        waitForGSAPInteractive();
    })();
});

/* ═══════════════════════════════════════════════
   MOTION BACKGROUND — ANIMATED GRID / NETWORK
   Full-page canvas, thin glowing lines with
   slow wave drift + subtle mouse parallax
   Performance-optimized, ~60fps
   ═══════════════════════════════════════════════ */
(function initMotionBackground() {
    const canvas = document.getElementById('motionBackground');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    /* ── CONFIG ── */
    const GRID_SPACING  = 80;      // px between grid nodes
    const LINE_WIDTH    = 0.8;     // Thin lines
    const LINE_ALPHA    = 0.08;    // Base opacity (subtle)
    const GLOW_ALPHA    = 0.04;    // Glow layer opacity
    const GLOW_WIDTH    = 3;       // Glow line width
    const WAVE_AMP      = 12;      // Wave displacement px
    const WAVE_SPEED    = 0.0004;  // Wave animation speed
    const MOUSE_FACTOR  = 0.015;   // How much mouse influences nodes
    const MOUSE_LERP    = 0.03;    // Mouse smoothing speed
    const DOT_RADIUS    = 1.5;     // Node intersection dot size
    const DOT_ALPHA     = 0.12;    // Node dot opacity

    // Emerald accent matching the site palette
    const ACCENT_R = 16, ACCENT_G = 185, ACCENT_B = 129;

    /* ── STATE ── */
    let width, height;
    let cols, rows;
    let mouseX = 0, mouseY = 0;       // Smoothed mouse position
    let targetMX = 0, targetMY = 0;   // Raw mouse target
    let animId;

    /* ── RESIZE — recalculate grid dimensions ── */
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        cols = Math.ceil(width / GRID_SPACING) + 2;
        rows = Math.ceil(height / GRID_SPACING) + 2;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── MOUSE TRACKING ── */
    window.addEventListener('mousemove', (e) => {
        targetMX = (e.clientX / width - 0.5) * 2;   // -1 to 1
        targetMY = (e.clientY / height - 0.5) * 2;
    }, { passive: true });

    /* ── CALCULATE NODE POSITION with wave + mouse offset ── */
    function getNodePos(col, row, time) {
        const baseX = col * GRID_SPACING - GRID_SPACING;
        const baseY = row * GRID_SPACING - GRID_SPACING;

        // Layered sine waves for organic drift
        const waveX = Math.sin(time + row * 0.3 + col * 0.1) * WAVE_AMP
                    + Math.sin(time * 0.7 + col * 0.5) * WAVE_AMP * 0.4;
        const waveY = Math.cos(time * 0.8 + col * 0.3 + row * 0.1) * WAVE_AMP
                    + Math.cos(time * 0.5 + row * 0.4) * WAVE_AMP * 0.3;

        // Mouse influence (subtle parallax)
        const mx = mouseX * GRID_SPACING * MOUSE_FACTOR * (col - cols / 2);
        const my = mouseY * GRID_SPACING * MOUSE_FACTOR * (row - rows / 2);

        return {
            x: baseX + waveX + mx,
            y: baseY + waveY + my
        };
    }

    /* ── DRAW FRAME ── */
    function draw(timestamp) {
        const time = timestamp * WAVE_SPEED;

        // Smooth mouse interpolation
        mouseX += (targetMX - mouseX) * MOUSE_LERP;
        mouseY += (targetMY - mouseY) * MOUSE_LERP;

        ctx.clearRect(0, 0, width, height);

        // Draw horizontal grid lines
        for (let row = 0; row < rows; row++) {
            // Glow pass (wider, dimmer)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${GLOW_ALPHA})`;
            ctx.lineWidth = GLOW_WIDTH;
            for (let col = 0; col < cols; col++) {
                const p = getNodePos(col, row, time);
                if (col === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();

            // Sharp pass (thin, slightly brighter)
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${LINE_ALPHA})`;
            ctx.lineWidth = LINE_WIDTH;
            for (let col = 0; col < cols; col++) {
                const p = getNodePos(col, row, time);
                if (col === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // Draw vertical grid lines
        for (let col = 0; col < cols; col++) {
            // Glow pass
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${GLOW_ALPHA})`;
            ctx.lineWidth = GLOW_WIDTH;
            for (let row = 0; row < rows; row++) {
                const p = getNodePos(col, row, time);
                if (row === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();

            // Sharp pass
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${LINE_ALPHA})`;
            ctx.lineWidth = LINE_WIDTH;
            for (let row = 0; row < rows; row++) {
                const p = getNodePos(col, row, time);
                if (row === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
        }

        // Draw node dots at intersections
        ctx.fillStyle = `rgba(${ACCENT_R}, ${ACCENT_G}, ${ACCENT_B}, ${DOT_ALPHA})`;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const p = getNodePos(col, row, time);
                ctx.beginPath();
                ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        animId = requestAnimationFrame(draw);
    }
    animId = requestAnimationFrame(draw);
})();

/* ═══════════════════════════════════════════════
   HERO SHRINK — LANDONORRIS-STYLE SCROLL TRANSITION
   Full-bleed portrait → framed card on scroll
   GSAP ScrollTrigger pin + scrub
   ═══════════════════════════════════════════════ */
(function initHeroShrink() {
    function boot() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return setTimeout(boot, 200);
        }
        gsap.registerPlugin(ScrollTrigger);
        setupHeroShrink();
    }
    // Delay to let entrance animation play first
    setTimeout(boot, 2200);

    function setupHeroShrink() {
        const heroSection  = document.querySelector('.hero');
        const heroImg      = document.getElementById('heroInteractive');
        const accentSlash  = document.querySelector('.hero-accent-slash');
        const heroContent  = document.querySelector('.hero-content');
        const heroName     = document.querySelector('.hero-name-topleft');
        const heroBadge    = document.querySelector('.hero-badge');
        const heroTagline  = document.querySelector('.hero-tagline');
        const heroCtas     = document.querySelector('.hero-ctas');
        const heroStats    = document.querySelector('.hero-stats');
        const heroSub      = document.querySelector('.hero-sub');
        const scrollInd    = document.querySelector('.scroll-indicator');
        const marqueeWrap  = document.querySelector('.hero-marquee-wrap');

        if (!heroSection || !heroImg) return;

        // Compute the target small size for the frame
        const targetW = Math.min(340, window.innerWidth * 0.45);
        const targetH = Math.min(440, window.innerHeight * 0.55);

        // Get current (large) size
        const startW = heroImg.offsetWidth;
        const startH = heroImg.offsetHeight;

        /* ── Timeline: Hero Shrink ── */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: 'top top',
                end: '+=120%',            // 120% of viewport = scroll distance
                pin: true,                 // Pin the hero during transition
                scrub: 1,                  // Smooth scrub
                pinSpacing: true,
                anticipatePin: 1,
            }
        });

        // Phase 1: Fade out text content (0% → 30% of scroll)
        tl.to([heroName, heroBadge, heroSub], {
            opacity: 0,
            y: -30,
            duration: 0.3,
            ease: 'power2.in',
            stagger: 0.05
        }, 0);

        tl.to([heroTagline, heroCtas, heroStats], {
            opacity: 0,
            y: -20,
            duration: 0.25,
            ease: 'power2.in',
            stagger: 0.05
        }, 0.05);

        if (scrollInd) {
            tl.to(scrollInd, { opacity: 0, duration: 0.15 }, 0);
        }

        // Phase 2: Shrink the hero image container (20% → 70%)
        tl.to(heroImg, {
            width: targetW,
            height: targetH,
            borderRadius: '24px',
            duration: 0.5,
            ease: 'power2.inOut'
        }, 0.2);

        // Phase 3: Accent slash sweep (40% → 70%)
        if (accentSlash) {
            tl.fromTo(accentSlash,
                { opacity: 0, left: '20%', rotation: 25 },
                {
                    opacity: 1,
                    left: '80%',
                    rotation: 30,
                    duration: 0.3,
                    ease: 'power1.inOut'
                }, 0.35
            );
            tl.to(accentSlash, {
                opacity: 0,
                left: '120%',
                duration: 0.2
            }, 0.65);
        }

        // Phase 4: Subtle scale pulse on the image (70% → 100%)
        tl.to(heroImg, {
            scale: 0.98,
            duration: 0.15,
            ease: 'power1.in'
        }, 0.7);
        tl.to(heroImg, {
            scale: 1,
            duration: 0.15,
            ease: 'power1.out'
        }, 0.85);

        // Phase 5: Fade in background marquee text once image is fully shrunk
        if (marqueeWrap) {
            tl.to(marqueeWrap, {
                opacity: 1,
                duration: 0.15,
                ease: 'power2.inOut'
            }, 0.85);
        }
    }
})();

/* ═══════════════════════════════════════════════
   SCROLL-LINKED MARQUEE ENHANCEMENT
   Converts CSS auto-play marquee to scroll-driven
   horizontal translation for cinematic feel
   ═══════════════════════════════════════════════ */
(function initScrollLinkedMarquee() {
    function boot() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return setTimeout(boot, 200);
        }
        gsap.registerPlugin(ScrollTrigger);
        setupScrollMarquee();
    }
    boot();

    function setupScrollMarquee() {
        const marqueeLeft  = document.querySelector('.hero-marquee--left .hero-marquee-inner');
        const marqueeRight = document.querySelector('.hero-marquee--right .hero-marquee-inner');

        if (!marqueeLeft && !marqueeRight) return;

        // Override CSS animation — scroll drives horizontal position
        if (marqueeLeft) {
            marqueeLeft.style.animation = 'none';
            gsap.fromTo(marqueeLeft,
                { x: '0%' },
                {
                    x: '-30%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'top top',
                        end: '+=200%',
                        scrub: 1
                    }
                }
            );
        }

        if (marqueeRight) {
            marqueeRight.style.animation = 'none';
            gsap.fromTo(marqueeRight,
                { x: '-30%' },
                {
                    x: '0%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.hero',
                        start: 'top top',
                        end: '+=200%',
                        scrub: 1
                    }
                }
            );
        }
    }
})();

/* ═══════════════════════════════════════════════
   SCROLL STORY — CINEMATIC SECTION ANIMATIONS
   GSAP ScrollTrigger: parallax, text reveal,
   framed image, background color transition, SVG circuit
   ═══════════════════════════════════════════════ */
(function initScrollStory() {
    /* Wait for GSAP + ScrollTrigger to load */
    function boot() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return setTimeout(boot, 200);
        }
        gsap.registerPlugin(ScrollTrigger);
        setupScrollStory();
    }
    boot();

    function setupScrollStory() {
        const section   = document.getElementById('scrollStory');
        if (!section) return;

        const bg        = section.querySelector('.scroll-story__bg');
        const lines     = section.querySelectorAll('.scroll-story__line');
        const frame     = section.querySelector('.scroll-story__frame');
        const image     = section.querySelector('.scroll-story__image');
        const circuitPath = document.querySelector('.scroll-story__circuit-path');

        /* ── FEATURE 1: Parallax background ── */
        if (bg) {
            gsap.to(bg, {
                y: '30%',           // Moves slower than scroll
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true       // Ties animation to scroll position
                }
            });
        }

        /* ── FEATURE 2: Background color transition ── */
        // Dark → emerald-tinted → darker as user scrolls through
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            onUpdate: (self) => {
                const p = self.progress;
                // Interpolate: start dark → mid emerald tint → end dark
                const emeraldTint = Math.sin(p * Math.PI) * 0.06;
                const r = Math.round(8 + emeraldTint * 16);
                const g = Math.round(8 + emeraldTint * 185);
                const b = Math.round(8 + emeraldTint * 129);
                section.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
            }
        });

        /* ── FEATURE 3: Narrative text Block Reveal ── */
        if (lines.length > 0) {
            lines.forEach((line, i) => {
                const inner = line.querySelector('.text-inner');
                const block = line.querySelector('.block-overlay');

                if (!inner || !block) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                });

                // Block slides over text
                tl.fromTo(block, 
                    { scaleX: 0, transformOrigin: 'left' },
                    { scaleX: 1, duration: 0.4, ease: 'power2.inOut' }
                );
                // Text becomes visible
                tl.set(inner, { opacity: 1 });
                // Block slides away to right
                tl.to(block,
                    { scaleX: 0, transformOrigin: 'right', duration: 0.4, ease: 'power2.inOut' }
                );
                // Text slides up slightly
                tl.fromTo(inner,
                    { y: 10 },
                    { y: 0, duration: 0.4, ease: 'power2.out' },
                    '-=0.4'
                );
            });
        }

        /* ── FEATURE 4: Framed image entrance + scale ── */
        if (frame) {
            // Entrance: fade in + scale up
            gsap.fromTo(frame,
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: frame,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Image inside scales slowly during scroll (cinematic framing)
            if (image) {
                gsap.fromTo(image,
                    { scale: 1 },
                    {
                        scale: 1.08,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: frame,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true
                        }
                    }
                );
            }
        }

        /* ── FEATURE 5: SVG Circuit Animation ── */
        if (circuitPath) {
            // Get total length of the SVG path
            const length = circuitPath.getTotalLength();
            
            // Set up initial state for drawing animation
            gsap.set(circuitPath, {
                strokeDasharray: length,
                strokeDashoffset: length
            });

            // Animate strokeDashoffset to 0 as user scrolls through the section
            gsap.to(circuitPath, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 1.5 // Smooth drawing effect
                }
            });
        }
    }
})();