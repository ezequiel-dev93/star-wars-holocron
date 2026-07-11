import * as THREE from 'three';
import gsap from 'gsap';

export class HeroLights {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 20;

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Luz ambiental suave para no dejar la escena completamente negra
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(this.ambientLight);

        // Luz interactiva que seguirá a los personajes
        this.pointLight = new THREE.PointLight(0xffffff, 0, 40); 
        this.pointLight.position.set(0, 0, 2);
        this.scene.add(this.pointLight);

        // Plano de fondo para que la luz rebote y se vea el resplandor
        const planeGeo = new THREE.PlaneGeometry(150, 150);
        const planeMat = new THREE.MeshStandardMaterial({ 
            color: 0x050505, // Gris muy oscuro
            roughness: 0.6,
            metalness: 0.4
        });
        this.backgroundPlane = new THREE.Mesh(planeGeo, planeMat);
        this.backgroundPlane.position.z = -2;
        this.scene.add(this.backgroundPlane);

        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize);

        this.animate = this.animate.bind(this);
        this.animate();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    focusOn(clientX, clientY, colorHex) {
        const rect = this.container.getBoundingClientRect();
        const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

        // Proyectar coordenadas 2D de la pantalla al plano 3D (z=0)
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

        const targetColor = new THREE.Color(colorHex);

        // Animar la luz hacia la nueva posición
        gsap.to(this.pointLight.position, {
            x: pos.x,
            y: pos.y,
            duration: 0.8,
            ease: "power2.out"
        });

        // Encender la luz y cambiar su color
        gsap.to(this.pointLight, {
            intensity: 80, // Ajustar si es muy brillante o muy tenue
            duration: 0.8,
            ease: "power2.out"
        });

        gsap.to(this.pointLight.color, {
            r: targetColor.r,
            g: targetColor.g,
            b: targetColor.b,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    reset() {
        // Apagar la luz cuando el ratón sale del personaje
        gsap.to(this.pointLight, {
            intensity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    animate() {
        this.requestID = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        window.removeEventListener('resize', this.onWindowResize);
        cancelAnimationFrame(this.requestID);
        this.renderer.dispose();
        if (this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}
