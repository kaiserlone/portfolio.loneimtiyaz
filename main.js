        gsap.registerPlugin(ScrollTrigger);
        // --- 1. ADVANCED CURSOR WITH VELOCITY BULGE ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// 1. Variables to track positions
let mouse = { x: 0, y: 0 }; // Actual mouse position
let outline = { x: 0, y: 0 }; // Lagging outline position

// 2. Track Mouse Movement
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
});

// 3. Animation Loop (Runs 60fps)
const animateCursor = () => {
    // Calculate distance between mouse and outline (The "Lag")
    let distX = mouse.x - outline.x;
    let distY = mouse.y - outline.y;

    // Move outline towards mouse (0.1 = 10% of the distance per frame)
    // Adjust 0.1 to make it faster (0.2) or slower (0.05)
    outline.x += distX * 0.2;
    outline.y += distY * 0.2;

    // --- BULGE CALCULATION ---
    // Get total velocity (hypotenuse of x/y distance)
    const velocity = Math.sqrt(distX**2 + distY**2);
    
    // Base scale is 1. We add a fraction of the velocity.
    // 0.005 controls sensitivity. Lower = less bulge, Higher = more bulge.
    let scale = 0.8 + (velocity * 0.006);
    
    // Clamp the scale so it doesn't get too huge (max 1.5x size)
    scale = Math.min(scale, 5);

    // Apply position AND scale
    // We use two translates: one for position, one to keep it centered (-50%)
    cursorOutline.style.transform = `
        translate(${outline.x}px, ${outline.y}px) 
        translate(-50%, -50%) 
        scale(${scale})
    `;

    requestAnimationFrame(animateCursor);
};

// Start the loop
animateCursor();

        
        // // --- 2. THREE.JS (Gold Wireframe) ---
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