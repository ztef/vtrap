import { vi_geometry_factory } from "./vi_geometry_factory.js";


export class vi_hiperobject {

    constructor(geometry_factory){
       
        this.graphics = {};
        this.geometry_factory = geometry_factory;
    }


    define(path, id, object){


        
        
        var color = 0x00ff00;

        var g = this.geometry_factory.createGeometry('Sphere',[1,10, 10]);
        var m = this.geometry_factory.createObject(g,{x:point.x,y:point.y,z:point.z}, { color: color,transparent: false, opacity: 0.5 });



        var o = this.geometry_factory.createVisualObject(m,id);

        this.board.render.addGeometry(o); 




    }


}