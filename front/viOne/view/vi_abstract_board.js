
import {vi_dimension}  from './vi_dimension.js';
import { vi_geometry_factory } from './vi_geometry_factory.js';

export class vi_abstractBoard {


    /*
    
   var board_config = {

    boardType: "xyz",
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            axis:"x",
            value0: 0,
            delta:20,
            segments:10,
            dimensions : [
                {
                    name:"ruta",
                    label:"Rutas",
                    axis:"y",
                    value0: 0,
                    delta:20,
                    segments:10,
                       dimensions : [
                        {
                            name:"mobil",
                            label:"mobil",
                            axis:"z",
                            value0: 0,  
                            delta:20, 
                            segments:0,
                            dimensions: [
                                {
                                    name:"tipo",
                                    label:"tipo",
                                    value0: "#FF0000",
                                    delta: "",
                                    segments:0,
                                    axis:"color"   
                                }
                            ]
                        }
                       ]
                }
            ]   
        },
        
    ]
}
    
    */ 


    constructor(name, board_config, render_engine){
       
        this.name = name;
        this.render_engine = render_engine;
        this.dimensions = [];
        board_config.dimensions.forEach(dimension => {
            
                var dim = new vi_dimension(dimension);
                this.addDimension(dim);



          });

          this.geometry_factory = new vi_geometry_factory();


    }


    addDimension(dim){
      
            this.dimensions.push(dim);
            
    }

    
    draw(){

        var dimensions_map;


        this.dimensions.forEach((dimension)=>{

            dimensions_map = dimension.getMap([]);

                dimensions_map.forEach((subd)=>{

                    // Crea geometria :
      
                    var pos = subd.value;
                    for(var i=0; i < subd.segments; i ++){


                        var magnitude = subd.value + subd.delta * i;
                        var axis = subd.axis;
                        var pos = {x:0, y:0, z:0, color:0x0088ff};
                        pos[axis] = magnitude;
                        var id = dimension.name + '_' + i;


                        var g = this.geometry_factory.createGeometry('Plane',[5,10,1,1]);

                        // color: color, transparent: true, opacity: opacity }  0x0088ff, 0.5
                        var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: pos.color, transparent: true, opacity: 0.5  });
                        var o = this.geometry_factory.createVisualObject(m,id);
                          
                        this.render_engine.addGeometry(o);

                    }




                });




        }); 


        console.log('MAPA');


    }
    



    addElement(data){

        var segments;

        // Checa data para cada dimension :
        this.dimensions.forEach((dimension)=>{

            segments = dimension.getSegments(data,[],'');
            //console.log(segments);

        });

        var pos = {x:0, y:0, z:0};
        segments.forEach((segment)=>{
               pos[segment.axis] = pos[segment.axis] + segment.position;
        });

        console.log(pos);

        var g = this.geometry_factory.createGeometry('Sphere',[3,10,10]);
        var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: 0xFF0000 });
        var o = this.geometry_factory.createVisualObject(m,data.id);
          
        this.render_engine.addGeometry(o);
    
    };


    print(){

        console.log("TABLERO :");
        this.dimensions.forEach((dimension)=>{

            console.log('Dimension : ', dimension.name);
            dimension.print();

        });
    }




}