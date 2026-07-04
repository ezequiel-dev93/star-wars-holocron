import * as THREE from 'three';

export class ForceParticles {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.jediParticles = [];
        this.sithParticles = [];
        this.jediLines = [];
        this.sithLines = [];
        this.mouse = new THREE.Vector2();
        this.targetMouse = new THREE.Vector2();
        this.time = 0;
        this.maxConnections = 20;
        this.maxDistance = 1.8;
        this.hoveredSphere = null;

        // Color palettes
        this.jediColors = [0x5FB3F6, 0x88CCFF, 0x00FFFF, 0x4DD0E1, 0x80DEEA];
        this.sithColors = [0xFF0000, 0x8B0000, 0xDC143C, 0xFF4500, 0xB22222];

        this.init();
        this.createDenseSpheres();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 5, 40);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 12;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Point lights
        this.jediLight = new THREE.PointLight(0x5FB3F6, 1.5, 15);
        this.jediLight.position.set(4, 0, 0);
        this.scene.add(this.jediLight);

        this.sithLight = new THREE.PointLight(0xFF0000, 1.5, 15);
        this.sithLight.position.set(-4, 0, 0);
        this.scene.add(this.sithLight);
    }

    createDenseSpheres() {
        const particleCount = 250;

        // JEDI DENSE SPHERE (Right - Blue)
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 6, 6);
            const color = this.jediColors[i % this.jediColors.length];
            const material = new THREE.MeshBasicMaterial({
                color: 0x5FB3F6,
                transparent: true,
                opacity: 0.9
            });
            const particle = new THREE.Mesh(geometry, material);

            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const radius = 2.5;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            particle.position.set(4 + x, y, z);

            particle.userData = {
                center: new THREE.Vector3(4, 0, 0),
                basePosition: new THREE.Vector3(x, y, z), // Position relative to center
                originalColor: 0x5FB3F6,
                paletteColor: color,
                velocity: new THREE.Vector3(0, 0, 0)
            };

            this.jediParticles.push(particle);
            this.scene.add(particle);
        }

        // SITH DENSE SPHERE (Left - Red)
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.02, 6, 6);
            const color = this.sithColors[i % this.sithColors.length];
            const material = new THREE.MeshBasicMaterial({
                color: 0xFF0000,
                transparent: true,
                opacity: 0.9
            });
            const particle = new THREE.Mesh(geometry, material);

            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            const radius = 2.5;

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            particle.position.set(-4 + x, y, z);

            particle.userData = {
                center: new THREE.Vector3(-4, 0, 0),
                basePosition: new THREE.Vector3(x, y, z),
                originalColor: 0xFF0000,
                paletteColor: color,
                velocity: new THREE.Vector3(0, 0, 0)
            };

            this.sithParticles.push(particle);
            this.scene.add(particle);
        }
    }

    updateConnections() {
        // Remove old Jedi lines
        this.jediLines.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });
        this.jediLines = [];

        // Remove old Sith lines
        this.sithLines.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });
        this.sithLines = [];

        // Create Jedi connections
        for (let i = 0; i < this.jediParticles.length; i++) {
            const particleA = this.jediParticles[i];
            let connections = 0;

            for (let j = i + 1; j < this.jediParticles.length; j++) {
                if (connections >= this.maxConnections) break;

                const particleB = this.jediParticles[j];
                const distance = particleA.position.distanceTo(particleB.position);

                if (distance < this.maxDistance) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array([
                        particleA.position.x, particleA.position.y, particleA.position.z,
                        particleB.position.x, particleB.position.y, particleB.position.z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const opacity = 1 - (distance / this.maxDistance);

                    let lineColor;
                    if (this.hoveredSphere === 'jedi') {
                        lineColor = new THREE.Color().lerpColors(
                            particleA.material.color,
                            particleB.material.color,
                            0.5
                        );
                    } else {
                        lineColor = new THREE.Color(0x5FB3F6);
                    }

                    const material = new THREE.LineBasicMaterial({
                        color: lineColor,
                        transparent: true,
                        opacity: opacity * 0.35,
                        blending: THREE.AdditiveBlending
                    });

                    const line = new THREE.Line(geometry, material);
                    this.jediLines.push(line);
                    this.scene.add(line);
                    connections++;
                }
            }
        }

        // Create Sith connections
        for (let i = 0; i < this.sithParticles.length; i++) {
            const particleA = this.sithParticles[i];
            let connections = 0;

            for (let j = i + 1; j < this.sithParticles.length; j++) {
                if (connections >= this.maxConnections) break;

                const particleB = this.sithParticles[j];
                const distance = particleA.position.distanceTo(particleB.position);

                if (distance < this.maxDistance) {
                    const geometry = new THREE.BufferGeometry();
                    const positions = new Float32Array([
                        particleA.position.x, particleA.position.y, particleA.position.z,
                        particleB.position.x, particleB.position.y, particleB.position.z
                    ]);
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

                    const opacity = 1 - (distance / this.maxDistance);

                    let lineColor;
                    if (this.hoveredSphere === 'sith') {
                        lineColor = new THREE.Color().lerpColors(
                            particleA.material.color,
                            particleB.material.color,
                            0.5
                        );
                    } else {
                        lineColor = new THREE.Color(0xFF0000);
                    }

                    const material = new THREE.LineBasicMaterial({
                        color: lineColor,
                        transparent: true,
                        opacity: opacity * 0.35,
                        blending: THREE.AdditiveBlending
                    });

                    const line = new THREE.Line(geometry, material);
                    this.sithLines.push(line);
                    this.scene.add(line);
                    connections++;
                }
            }
        }
    }

    updateSphereParticles(particles, isJedi) {
        particles.forEach((particle) => {
            // DEMO 1 STYLE: Smooth return to base position
            const targetPos = particle.userData.center.clone().add(particle.userData.basePosition);
            const currentPos = particle.position.clone();
            const diff = targetPos.sub(currentPos);

            // Smooth interpolation back to original position (like Demo 1)
            particle.position.x += diff.x * 0.05;
            particle.position.y += diff.y * 0.05;
            particle.position.z += diff.z * 0.05;

            // Apply velocity (for mouse interaction)
            particle.position.add(particle.userData.velocity);

            // Damping (friction) - DEMO 1 style
            particle.userData.velocity.multiplyScalar(0.92);

            // Mouse interaction - DEMO 1 style: Push particles away
            const mouseWorld = new THREE.Vector3(
                this.mouse.x * 5,
                this.mouse.y * 5,
                this.camera.position.z * 0.5
            );

            const direction = particle.position.clone().sub(mouseWorld);
            const distance = direction.length();

            // Only affect particles within range (like Demo 1)
            if (distance < 3) {
                direction.normalize();
                const force = (1 - distance / 3) * 0.15; // Stronger near cursor
                particle.userData.velocity.add(direction.multiplyScalar(force));
            }

            // Update colors based on hover
            const currentSphere = isJedi ? 'jedi' : 'sith';
            if (this.hoveredSphere === currentSphere) {
                particle.material.color.lerp(new THREE.Color(particle.userData.paletteColor), 0.08);
            } else {
                particle.material.color.lerp(new THREE.Color(particle.userData.originalColor), 0.08);
            }

            // Subtle opacity variation
            particle.material.opacity = 0.75 + Math.sin(this.time + particle.position.x * 0.5) * 0.15;
        });
    }

    detectHoveredSphere() {
        const mouseWorld = new THREE.Vector3(this.mouse.x * 5, this.mouse.y * 5, 0);

        const jediCenter = new THREE.Vector3(4, 0, 0);
        const distToJedi = mouseWorld.distanceTo(jediCenter);

        const sithCenter = new THREE.Vector3(-4, 0, 0);
        const distToSith = mouseWorld.distanceTo(sithCenter);

        if (distToJedi < 3.5) {
            this.hoveredSphere = 'jedi';
        } else if (distToSith < 3.5) {
            this.hoveredSphere = 'sith';
        } else {
            this.hoveredSphere = null;
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        const isMobile = this.container.clientWidth < 768;
        const spacing = isMobile ? 3.5 : 4;

        // Update centers
        this.jediParticles.forEach(particle => {
            particle.userData.center.set(spacing, 0, 0);
        });

        this.sithParticles.forEach(particle => {
            particle.userData.center.set(-spacing, 0, 0);
        });

        this.jediLight.position.set(spacing, 0, 0);
        this.sithLight.position.set(-spacing, 0, 0);
    }

    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.targetMouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
        this.targetMouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.016; // ~60fps

        // Smooth mouse interpolation
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

        // Detect hover
        this.detectHoveredSphere();

        // Update both spheres (DEMO 1 style behavior)
        this.updateSphereParticles(this.jediParticles, true);
        this.updateSphereParticles(this.sithParticles, false);

        // Very subtle camera movement (minimal like Demo 1)
        this.camera.position.x = Math.sin(this.time * 0.05) * 0.2;
        this.camera.position.y = Math.cos(this.time * 0.04) * 0.15;
        this.camera.lookAt(0, 0, 0);

        // Update connections every 3 frames
        if (Math.floor(this.time * 60) % 3 === 0) {
            this.updateConnections();
        }

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        window.removeEventListener('resize', () => this.onWindowResize());
        this.container.removeEventListener('mousemove', (e) => this.onMouseMove(e));

        this.jediLines.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });

        this.sithLines.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });

        this.jediParticles.forEach(particle => {
            this.scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });

        this.sithParticles.forEach(particle => {
            this.scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        });

        this.renderer.dispose();
        if (this.renderer.domElement.parentNode === this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}