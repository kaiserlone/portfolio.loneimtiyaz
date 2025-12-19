        gsap.registerPlugin(ScrollTrigger);
        
        // --- 1. CURSOR SCRIPT (The Invert Effect) ---
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            // Outline follows with slight delay (GSAP for smoothness)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });
        
        // --- 2. THREE.JS (Gold Wireframe) ---
        const initThreeJS = () => {
            const container = document.getElementById('canvas-container');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.appendChild(renderer.domElement);
            
            // Object: Gold Icosahedron
            const geometry = new THREE.IcosahedronGeometry(3.5, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0x48245D,
                wireframe: true,
                transparent: true,
                opacity: 0.9
            });
            const sphere = new THREE.Mesh(geometry, material);
            scene.add(sphere);
            
            sphere.position.x = 2;
            
            function animate() {
                requestAnimationFrame(animate);
                sphere.rotation.y += 0.001;
                renderer.render(scene, camera);
            }
            animate();
            
            // Mouse Interaction (Parallax)
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;
            
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            
            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX - windowHalfX);
                mouseY = (event.clientY - windowHalfY);
            });
            
            // Smooth parallax loop
            setInterval(() => {
                targetX = mouseX * 0.001;
                targetY = mouseY * 0.001;
                
                sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
                sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
                
                // Slight position shift
                sphere.position.x += 0.01 * ((2.5 + targetX) - sphere.position.x);
            }, 16);
            
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        };
        
        // --- 3. GSAP ANIMATIONS ---
        const initGSAP = () => {
            
            // Stats
            document.querySelectorAll('.counter').forEach(counter => {
                let target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    snap: { innerText: 1 },
                    onUpdate: function() { this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText); }
                });
            });
            
            // Standard Fade Ups
            gsap.utils.toArray('.gs_fade_up').forEach(elem => {
                gsap.from(elem, {
                    scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
            
            // Fade Lefts
            gsap.utils.toArray('.gs_fade_left').forEach(elem => {
                gsap.from(elem, {
                    scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" },
                    x: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });
            
            // Hero
            const tl = gsap.timeline();
            tl.from(".gs_reveal", { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out" })
                .from(".gs_reveal_img", { x: 50, opacity: 0, duration: 1.2, ease: "power2.out" }, "-=0.8");
            
            // --- CURVED TIMELINE ---
            const timelinePath = document.querySelector(".timeline-path");
            const dots = document.querySelectorAll(".timeline-dot");
            const length = timelinePath.getTotalLength();
            
            gsap.set(timelinePath, { strokeDasharray: length, strokeDashoffset: length });
            
            gsap.to(timelinePath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".experience-container",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                    toggleActions: "play none none reverse"
                }
            });
            
            dots.forEach((dot, i) => {
                gsap.from(dot, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: ".experience-container",
                        start: `top ${35 + (i * 20)}%`, // Staggered trigger points
                        toggleActions: "play none none reverse"
                    }
                });
            });
        };
        
        window.addEventListener('load', () => {
            initThreeJS();
            initGSAP();
        });