import {useRef, useEffect} from 'react';
import * as THREE from 'three';

let scaleDirection = 1; // 1 = bigger, -1 = smaller
const MAX_SCALE = 1.5;
const MIN_SCALE = 0.5;
const SCALE_SPEED = 0.005;

function App() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentRef?.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 10;

        const animate = () => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            cube.scale.x += SCALE_SPEED * scaleDirection;
            cube.scale.y += SCALE_SPEED * scaleDirection;
            cube.scale.z += SCALE_SPEED * scaleDirection;

            // Scale direction change if max/min scale is reached
            if (cube.scale.x >= MAX_SCALE || cube.scale.x <= MIN_SCALE) {
                scaleDirection = -scaleDirection;
            }

            camera.lookAt(cube.position);
            camera.position.x = Math.sin(Date.now() * 0.001) * 5;
            camera.position.y = Math.cos(Date.now() * 0.001) * 5;


            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        window.addEventListener('resize', handleResize);

        animate();

        // Cleanup when unmounting
        return () => {
            window.removeEventListener('resize', handleResize);
            currentRef?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef}></div>;
}

export default App;
