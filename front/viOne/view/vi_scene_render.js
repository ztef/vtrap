/*


    VISUAL INTERACTION SYSTEMS

    General Purpose 3DScene Renderer on top of Three.js 




*/

import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { MapControls } from 'three/addons/controls/MapControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PerspectiveCamera, OrthographicCamera } from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export class vi_3DSceneRenderer {
    constructor(containerId, useOrthographicCamera = false) {
        this.container = document.getElementById(containerId);
        this.objects = new Map();
        this.useOrthographicCamera = useOrthographicCamera; // Determine camera type
        this.init();
        this.selectedObject = null;
        this.font = null;
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.setupRenderer();
        this.setupControls();
        this.addResizeListener();
        this.addClickListener();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
    }

    
   

    setupFont() {
        const loader = new FontLoader();
    
        return new Promise((resolve, reject) => {
            loader.load('/front/app/assets/gentilis_bold.typeface.json', (font) => {
                this.font = font;
                resolve();
            }, undefined, reject);
        });
    }




    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
    
        if (this.useOrthographicCamera) {
            const frustumSize = 200;
            this.camera = new OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                1,
                1000
            );
        } else {
            this.camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
            this.camera.position.set(0.3570062481736582, 2.098977770789573, 0.8855386452745455);
            this.camera.lookAt(0.03575237012985329, -0.8778986564012193, -0.47750991311074553);
            this.camera.near = 0.1; 
            this.camera.far = 30000; 
        }
    
        this.camera.updateProjectionMatrix();
    }

    setupLights(){

                const dirLight1 = new THREE.DirectionalLight( 0xffffff, 3 );
				dirLight1.position.set( 1, 1, 1 );
				this.scene.add( dirLight1 );

				const dirLight2 = new THREE.DirectionalLight( 0x002288, 3 );
				dirLight2.position.set( - 1, - 1, - 1 );
				this.scene.add( dirLight2 );

				const ambientLight = new THREE.AmbientLight( 0x555555 );
				this.scene.add( ambientLight );
    }


    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    
    setupControls() {

        
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.keys = ['KeyA', 'KeyS', 'KeyD'];



        /*
        this.controls = new MapControls( this.camera, this.renderer.domElement );

			
				this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				this.controls.dampingFactor = 0.05;

				this.controls.screenSpacePanning = false;

				this.controls.minDistance = 0;
				this.controls.maxDistance = 1500;

				this.controls.maxPolarAngle = Math.PI / 2;

        */

    }



    addResizeListener() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                this.renderer.setSize(width, height);
                this.camera.aspect = width / height;  // Update this line
                this.camera.updateProjectionMatrix();
                this.controls.handleResize();
            }
        });
    
        resizeObserver.observe(this.container);
    }

    addClickListener() {
        this.container.addEventListener('click', (event) => {
          
            const clickedObject = this.selectObject(event.clientX, event.clientY);
            if (clickedObject) {
                this.handleObjectSelection(clickedObject);
            }
        });
    }

    selectObject(clientX, clientY) {
       


        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;


        console.log("x:",x," y:",y);
    
        // Convert 2D mouse coordinates to normalized device coordinates (-1 to 1)
        const mouse = new THREE.Vector2((x / canvas.clientWidth) * 2 - 1, - (y / canvas.clientHeight) * 2 + 1);
    
        // Create a 3D vector representing the mouse in world coordinates
        const mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouse3D.unproject(this.camera);
    
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
    
        // Set the raycaster's threshold for point clouds
        raycaster.params.Points.threshold = 0.1;
    
        // Intersect with objects in the scene
        const intersects = raycaster.intersectObjects(this.scene.children, true);
    
        // Return the clicked object, if any
        return intersects.length > 0 ? intersects[0].object : null;
    }

    handleObjectSelection(object) {
       
        const customObject = this.objects.get(object);
        if (customObject) {
            console.log('Selected custom object ID:', customObject.id);
            this.selectedObject = object;
            // Change the color of the selected object (assuming it has a material)
            const material = object.material;
            if (material) {
                material.color.set(0xff0000); // Change to red (adjust the color as needed)
            }
            // Transform the selected object (for example, scale it on the z-axis)
            object.scale.z += 0.1;
        } else {
            console.log('Selected  x object ID:', object);
            if (object.name === 'Plane_17' && object.isMesh) {
                // Create a cylinder
                const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 5, 32);
                const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color, adjust as needed
                const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    
                // Set the position of the cylinder on the top-left corner of the plane
                const planeBoundingBox = new THREE.Box3().setFromObject(object);
                const planeSize = new THREE.Vector3();
                planeBoundingBox.getSize(planeSize);
    
                const planePosition = new THREE.Vector3();
                object.getWorldPosition(planePosition);
    
                // Adjust the position to the top-left corner
                    cylinder.position.x = planePosition.x;
                    cylinder.position.y = planePosition.y + planeSize.y / 2;
                    cylinder.position.z = planePosition.z;

                // Add the cylinder to the scene
                this.scene.add(cylinder);
                const material = object.material;
                if (material) {
                    material.color.set(0xff0000); 
                }
        }

    }

    }

    loadGLTFModel(gltfUrl) {
        const loader = new GLTFLoader();
    
        loader.load(gltfUrl, (gltf) => {
            this.scene.add(gltf.scene);
          
        }, undefined, (error) => {
            console.log(error);
        });
    }


    loadGLTFModelc(gltfUrl) {
        const loader = new GLTFLoader();
    
        // Create a DRACOLoader instance
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/front/app/build/jsm/loaders/draco/'); // Set the path to the Draco decoder (where DracoDecoder.js is located)
        loader.setDRACOLoader(dracoLoader); // Provide the DRACOLoader instance to the GLTFLoader
    
        // Load the model
        loader.load(gltfUrl, (gltf) => {
            this.scene.add(gltf.scene);
          
        }, undefined, (error) => {
            console.log(error);
        });
    }

    addGeometry(visualObject) {    
        this.objects.set(visualObject.mesh, visualObject);
        this.scene.add(visualObject.mesh);
    }


    addLine(o = { x: 0, y: 0, z: 0 }, d = { x: 0, y: 0, z: 0 }) {
        // Create a line along the x-axis
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(o.x, o.y, o.z),
            new THREE.Vector3(d.x, d.y, d.z),
        ]);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
    
        // Add the line to the scene
        this.scene.add(line);
    }

    addLabel(label, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }) {
        // Load the font
        this.setupFont().then(() => {
            // Create text geometry
            const textGeometry = new TextGeometry(label, {
                font: this.font,
                size: 2,
                height: 0.1,
            });
    
            // Create a material for the text
            const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
            // Create a mesh using the text geometry and material
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    
            // Position the text
            textMesh.position.set(position.x, position.y, position.z);
    
            // Set the rotation of the text
            textMesh.rotation.set(rotation.x, rotation.y, rotation.z);
    
            // Add the text mesh to the scene
            this.scene.add(textMesh);
        }).catch((error) => {
            console.error('Error loading font:', error);
        });
    }

    focus(x, y, z, distance) {
        // Set the position of the camera to be at a certain distance from the target point
        this.camera.position.set(x, y, z + distance);

        // Set the camera's look-at point to the target point
        this.camera.lookAt(x, y, z);

        // Update the controls to reflect the new camera position
        this.controls.target.set(x, y, z);
        this.controls.update();
    }


    loadOBJModel(objUrl, mtlUrl,  scale) {


       
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();

        
        mtlLoader.load(
            mtlUrl,
            (materials) => {
                materials.preload();

                objLoader.setMaterials(materials);

                objLoader.load(
                    objUrl,
                    (object) => {
                       
                       
                        this.scene.add(object);

                        this.pointToModel(object);
                      
                      
                    },
                    
                );
            },
           
        );
    }

    pointToModel(model) {
        // Calculate the center of the model's bounding box
        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());
    
        // Assuming `camera` is your THREE.PerspectiveCamera
        const distance = this.calculateDistanceToModel(model); 
        this.camera.position.set(center.x, center.y, center.z + distance);
        this.camera.lookAt(center);
    }

    calculateDistanceToModel(model) {
      
        const boundingBox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        return Math.max(size.x, size.y, size.z) * 2; 
    }




    createWireframedPlane(size, divisions) {
        const planeGeometry = new THREE.PlaneGeometry(size, size, divisions, divisions);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, wireframe: true });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2; // Rotate the plane to align with the X-Y plane
        this.scene.add(plane);
    
    }


    createGridOfPlanes(n, m, planeSize, color, opacity) {
        const spacing = planeSize * 1.5; // Adjust the spacing between planes

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                const x = i * spacing - (n * spacing) / 2;
                const z = j * spacing - (m * spacing) / 2;
                this.createColoredPlane(planeSize, color, opacity, x, 0, z);
            }
        }
    }

    createColoredPlane(size, color, opacity, x = 0, y = 0, z = 0) {
        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(x, y, z);
        plane.rotation.x = -Math.PI / 2; // Rotate the plane to align with the X-Y plane
        this.scene.add(plane);
    }


    createColoredSinglePlane(size, color, opacity) {
        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2; // Rotate the plane to align with the X-Y plane
        this.scene.add(plane);
    }





    animate() {
        requestAnimationFrame(() => this.animate());

       // console.log('Camera Position:', this.camera.position);
       // console.log('Camera Direction:', this.camera.getWorldDirection(new THREE.Vector3()));
    
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}


