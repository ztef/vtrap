import { vi_geometry_factory } from "./vi_geometry_factory.js";
import * as THREE from 'three';
import { vi_visualObject } from './vi_visual_object.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
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


    createGeometriesFromConfig(_config,_point) {
        const _group = new THREE.Group();
    
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
    
        // Create label geometry
        
        
        if (_config.label && _config.label.value) {
            const labelGeometry = new TextGeometry(_config.label.value, { font:this.font, size:_config.label.size,
                height: 0.01 });
            const labelMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
            labelMesh.position.set(_config.label.x || 0, _config.label.y || 0, _config.label.z || 0);
            _group.add(labelMesh);

            
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
    
        _group.position.set(_point.x, _point.y+0.2, _point.z);

        var _vo = this.geometry_factory.createVisualObject(_group,'hg');

        // Create a bounding box helper for the group
        const bbox = new THREE.Box3().setFromObject(_group);
        const bboxSize = new THREE.Vector3();
        bbox.getSize(bboxSize);

        // Create a transparent helper mesh that surrounds the group
        const geometry = new THREE.BoxGeometry(bboxSize.x, bboxSize.y, bboxSize.z);
        const material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
        const helperMesh = new THREE.Mesh(geometry, material);

        // Center the helper mesh on the group
        helperMesh.position.set(_point.x, _point.y+0.2, _point.z);

        _vo.setWrapper(helperMesh);



       return _vo;
    }
    
    
    


}