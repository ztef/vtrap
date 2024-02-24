import { vi_geometry_factory } from "./vi_geometry_factory.js";
import * as THREE from 'three';
import { vi_visualObject } from './vi_visual_object.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {  CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
 
import {vi_Font } from "./vi_font.js";



export class vi_hipergeometry_factory {

    constructor(geometry_factory){
       
        this.graphics = {};
        this.geometry_factory = geometry_factory;

        this.font = vi_Font.getFont();

    }

   


    getHiperGeometry(point){


        // Define parameters
            const circleRadius = 1;
            const cylinderHeight = 1;
            const cylinderRadius = 0.1;
            const sphereRadius = 0.1;

            const d = 0.3;

            const cylinders = [];

            // Create a group to hold all geometries
            const group = new THREE.Group();

            // Create circle geometry
            const circleGeometry = new THREE.CircleGeometry(circleRadius, 32);
            const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);

            circle.rotation.x = -Math.PI / 2;

            circle.name = "base";

            group.add(circle);

            // Create cylinders
            const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

            for (let i = 0; i < 3; i++) {
                const cylinderGeometry = new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, cylinderHeight, 32);
                const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
                
                // Position cylinders at a distance 'd' from the center of the circle
                const angle = (i / 3) * Math.PI * 2;
                const x = circleRadius * Math.cos(angle);
                const z = circleRadius * Math.sin(angle);
                const distanceVector = new THREE.Vector3(x, 0, z).normalize().multiplyScalar(d);
                cylinder.position.set(distanceVector.x, (cylinderHeight / 2), distanceVector.z);
                
                cylinders.push(cylinder);
                group.add(cylinder);
            }

            // Create a sphere
            const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

            // Position the sphere over one of the cylinders
            const cylinderPosition = new THREE.Vector3();
            group.children[1].getWorldPosition(cylinderPosition);
            sphere.position.copy(cylinderPosition).add(new THREE.Vector3(0, cylinderHeight / 2 + sphereRadius + 0.5, 0));

            group.add(sphere);


            group.position.set(point.x, point.y+0.2, point.z);

            var vo = this.geometry_factory.createVisualObject(group,'hg');

            // Create a bounding box helper for the group
            const bbox = new THREE.Box3().setFromObject(group);
            const bboxSize = new THREE.Vector3();
            bbox.getSize(bboxSize);

            // Create a transparent helper mesh that surrounds the group
            const geometry = new THREE.BoxGeometry(bboxSize.x, bboxSize.y, bboxSize.z);
            const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
            const helperMesh = new THREE.Mesh(geometry, material);

            // Center the helper mesh on the group
            helperMesh.position.set(point.x, point.y+0.2, point.z);

            vo.setWrapper(helperMesh);



           return vo;


    }

    getIcon(iconPath){
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('/front/app/assets/gps.svg');

        // Create a shape from SVG data
        const svgData = parseSVGData('/front/app/assets/gps.svg');
        const shape = new THREE.Shape(svgData);

        // Extrude the shape to give it depth
        const extrudeSettings = { depth: 10, bevelEnabled: false };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Create a mesh using the custom geometry
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        return mesh;
    }


    createGeometriesFromConfig(_config,_point) {
        const _group = new THREE.Group();

        const nullMesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.01, 0.01, 0.01),
            new THREE.MeshBasicMaterial({color: 0xff0000})
        );
    
        // Helper function to create geometries based on the configuration
        function createGeometry(_shape, _properties) {
            let geometry;
            switch (_shape) {
                case 'Circle':
                    geometry = new THREE.CircleGeometry(_properties.radius, 32);
                    break;
                case 'Cylinder':
                    geometry = new THREE.CylinderGeometry(_properties.radiusTop, _properties.radiusBottom, _properties.height, 32);
                    break;
                case 'Box':
                    geometry = new THREE.BoxGeometry(_properties.width, _properties.height, _properties.depth);
                    break;
                // Add more cases for other shapes as needed
                default:
                    console.error('Invalid shape:', _shape);
                    return null;
            }
            return geometry;
        }
    
        // Create base geometry
        if (_config.base && _config.base.shape) {
            const baseGeometry = createGeometry(_config.base.shape, _config.base);
            const baseMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);

            base.rotation.x = -Math.PI / 2;

            base.name = "base";

            _group.add(base);

             
        }
    
        

        if (_config.label && _config.label.value) {
            var element = document.createElement('div');
            element.textContent = _config.label.value;
            element.style.position = 'absolute';
            element.style.left = '0px';
            element.style.top = '0px';
            
            element.style.color = 'black';
            element.style.fontFamily = 'Arial';
            element.style.fontSize = '15px';

            var cssObject = new CSS2DObject(element);
            cssObject.position.set(0,0,0);
            cssObject.center.set( 0, 0 );
      
            const lod = new THREE.LOD();

            lod.addLevel(cssObject, 2);
			lod.addLevel(nullMesh, 10);

            lod.position.set(0,0,0);

            _group.add(lod);   
      
            
        }
        
    
        // Create column geometries
        if (_config.columns && Array.isArray(_config.columns)) {
            _config.columns.forEach(column => {
                const columnName = Object.keys(column)[0];
                const columnConfig = column[columnName];
                if (columnConfig.shape) {
                    const columnGeometry = createGeometry(columnConfig.shape, columnConfig);
                    const columnMaterial = new THREE.MeshBasicMaterial({ color: columnConfig.color });
                    const column = new THREE.Mesh(columnGeometry, columnMaterial);
                    column.position.set(columnConfig.x || 0, columnConfig.height / 2 , columnConfig.z || 0);
                    _group.add(column);
                }
            });
        }


        // Crea Iconos

        //var icono = this.getIcon('');
        //icono.position.set(0,0,0)
        //_group.add(icono);
    
        //_group.position.set(_point.x, _point.y+0.2, _point.z);

         

        var _vo = this.geometry_factory.createVisualObject(_group,'hg');

        // Create a bounding box helper for the group5
        const bbox = new THREE.Box3().setFromObject(_group);
        const bboxSize = new THREE.Vector3();
        bbox.getSize(bboxSize);

        // Create a transparent helper mesh that surrounds the group
        const geometry = new THREE.BoxGeometry(bboxSize.x, bboxSize.y, bboxSize.z);
        const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        const helperMesh = new THREE.Mesh(geometry, material);

        // Center the helper mesh on the group
        helperMesh.position.set(_point.x, _point.y, _point.z);

        _vo.setWrapper(helperMesh);



       return _vo;
    }
    
    
    


}