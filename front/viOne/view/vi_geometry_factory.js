import * as THREE from 'three';
import { vi_visualObject } from './vi_visual_object.js';



export class vi_geometry_factory {
    

    createGeometry(geometryType, data) {
        switch (geometryType) {
          case 'Circle':
  
             
              return new THREE.CircleGeometry(data[0], data[1]);

            break;

            case 'Circlebuffer':
  
             
           // return new THREE.CircleBufferGeometry(data[0], data[1]);

            break;


            case 'Plane':
  
             
              return new THREE.PlaneGeometry(data[0], data[1], data[2], data[3] );

            break;



           case 'Sphere':
            
                return  new THREE.SphereGeometry(data[0], data[1], data[2]);
            break;

          case 'Cube':

                return new THREE.BoxGeometry(data[0], data[1], data[2]);

            break;
  
          default:
            throw new Error(`Unsupported geometry type: ${geometryType}`);
        }
      }


      /*
      
        const planeGeometry = new THREE.PlaneGeometry(size, size);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      
      */




      createObject(geometry, pos , color) {

        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        


        const material = new THREE.MeshBasicMaterial(color);
        
        const mesh = new THREE.Mesh(geometry, material);
       
        mesh.position.copy(position);
      
        return mesh;
      }



      createBasicObject(geometry, pos , color) {

        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        


        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });

        const objectWireframe = new THREE.Line(geometry, lineMaterial);
        
       
       
        objectWireframe.position.copy(position);
      
        return objectWireframe;
      }





        createVisualObject(mesh, id){

            return new vi_visualObject(mesh,id);
        }


     createPlane(id,center,size, color){
      const g1 = this.createGeometry('Plane',size);
      const  m1 = this.createObject(g1,center, color);
      
      return this.createVisualObject(m1,"id")
     
    }


 
}