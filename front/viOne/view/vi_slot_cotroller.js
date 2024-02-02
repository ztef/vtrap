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



    addObject2Slot(path, id, object, hg = null){   // hipergeometria = null


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
        

        var vo;   // visual object

        if(hg == null){
        
                var color = 0x00ff00;

                var g = this.geometry_factory.createGeometry('Sphere',[1,10, 10]);
                var m = this.geometry_factory.createObject(g,{x:point.x,y:point.y,z:point.z}, { color: color,transparent: false, opacity: 0.5, side: THREE.DoubleSide });
                vo = this.geometry_factory.createVisualObject(m,id);

        } else {
            vo = hg;
            vo.setPosition({x:point.x,y:point.y,z:point.z});
            vo.id = id;
        }


        this.board.render.addGeometry(vo); 
        const element = new vi_element(path, id, vo, object);
        slot.addElement(element);


        


    }


    acceptVisitor(visitor) {
        this.slots.forEach(slot => {
            slot.elements.forEach(element =>{
                visitor(element);
            });          
        });
    }



}