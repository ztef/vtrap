import { vi_element } from "./vi_element.js";
import { vi_geometry_factory } from "./vi_geometry_factory.js";
import { vi_slot } from "./vi_slot.js";



export class vi_slot_controller {

    constructor(board){
        this.board = board;
        this.graphics = {};
        this.axis = 'y';
        this.delta = 3;
        this.slots = new Map();
        this.geometry_factory = new vi_geometry_factory();
    }


    setDirection(direction){

        if(direction == 'up'){
            this.axis = 'y';
        }
        if(direction == 'out'){
            this.axis = 'z';
        }
        
    }



    addSlot(path, id, object){


        var slot;

        if (!this.slots.has(path)) {

            let point = this.board.locatePointByPath(path);
            let angle = this.board.getAngleForPoint(point);

            slot = new vi_slot(point, this.delta, this.axis, angle);
            this.slots.set(path, slot );
           
          
          } else {
           
            slot = this.slots.get(path);
          
        }

        

        let point = slot.getTopPoint(this.axis);
        
        var color = 0x00ff00;

        var g = this.geometry_factory.createGeometry('Sphere',[1,10, 10]);
        var m = this.geometry_factory.createObject(g,{x:point.x,y:point.y,z:point.z}, { color: color,transparent: false, opacity: 0.5 });



        var o = this.geometry_factory.createVisualObject(m,id);

        this.board.render.addGeometry(o); 

        const element = new vi_element(path, id, o, object);

        slot.addElement(element);


        //const material = o.mesh.material;
        //    if (material) {
        //        material.color.set(0xff0000); // Change to red (adjust the color as needed)
        //    }


    }


    acceptVisitor(visitor) {
        this.slots.forEach(slot => {
            slot.elements.forEach(element =>{
                visitor(element);
            });          
        });
    }



}