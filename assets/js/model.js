// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('modelCanvas1'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

let mixer;  // To handle animations
let model;  // Variable to store the loaded model

// Load GLB model
const loader = new THREE.GLTFLoader();
loader.load('assets/model/brain.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.set(0, 1.4, 0);
    model.castShadow = true;
    model.receiveShadow = true;
    scene.add(model);

    // Create atmosphere/glow effect around the model
    const atmosphereGeometry = new THREE.SphereGeometry(4.2, 10, 10); // Slightly larger than the model
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            'c': { type: 'f', value: 0.5 }, // Lowering this value reduces glow intensity
            'p': { type: 'f', value: 1 }, // Adjust the power to control the falloff of the glow
            glowColor: { type: 'c', value: new THREE.Color(0x003E5E) }, // Updated Glow color
            viewVector: { type: 'v3', value: camera.position }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            uniform float c;
            uniform float p;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
                gl_FragColor = vec4(glowColor * intensity, 0.8); // Adjust opacity (last value)
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Check if animations exist
    if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            action.play();
        });
    }
});

// Adjust camera position to better fit the model inside the custom section
camera.position.set(0, 1, 4.5);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the mixer for animations if present
    if (mixer) {
        mixer.update(0.01);
    }

    renderer.render(scene, camera);
}
animate();

// Ensure the canvas resizes properly
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Add mouse move event listener to adjust model rotation
document.addEventListener('mousemove', (event) => {
    if (model) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

        // Rotate the model slightly based on mouse position
        model.rotation.y = mouseX * 0.2;  // Adjust the multiplier to control the rotation sensitivity
        model.rotation.x = -mouseY * 0.2; // Adjust the multiplier to control the rotation sensitivity
    }
});
