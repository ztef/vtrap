
import {vi_dimension}  from './vi_dimension.js';
import { vi_geometry_factory } from './vi_geometry_factory.js';

export class vi_abstractBoard {



    constructor(name, board_config, render_engine){
       
        this.name = name;
        this.render_engine = render_engine;
        this.dimensions = [];
        this.config = board_config;

        this.geometry_factory = new vi_geometry_factory();



        board_config.dimensions.forEach(dimension => {
            
                var dim = new vi_dimension(dimension, this, null);   // config, board, parent null == root
                this.addDimension(dim);

          });

        
    }


    addDimension(dim){
      
            this.dimensions.push(dim);
            
    }



   getMap(config){

        var acum = [];

        if(config.dimensions){

        config.dimensions.forEach(dimension => {
            
            var map = {dimension:dimension.name, label:dimension.label, axis:dimension.axis, offset:dimension.offset, value:dimension.value0, delta:dimension.delta, segments:dimension.segments};
            acum.push(map);

         });

        }

        return acum;

   }



   drawBoard(){
    this.dimensions.forEach((dimension)=>{

       dimension.draw();


    });
   }



   draw(config, origin){
    
        var w=0;
        var x = 0;

        for(w=0; w <= this.config.dimensions[0].segments; w++){

            this.drawbyType(this.config.dimensions[0],{x:x, y:0, z:0});
        
            x = x +  this.config.dimensions[0].delta;
        }
       
     
    
   }



   drawbyType(config, origin){

    if (config.containerType == "xyz"){

        this.drawXYZ(config, origin);

    }

    if (config.containerType == "polar"){

        this.drawPOLAR(config, origin);

    }


   }


   drawPOLAR(config, origin){


        var id = 'base';

        var pos = {x:origin.x, y:origin.y, z:origin.z, color:0x0088ff};
        var g = this.geometry_factory.createGeometry('Circle',[10,64]);
        var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: pos.color,  onlyRendered: false });
        var o = this.geometry_factory.createVisualObject(m,id);
    
        this.render_engine.addGeometry(o);



        var dimensions_map;

        dimensions_map = this.getMap(config);

        dimensions_map.forEach((dim)=>{

             
                    if(dim.axis == 'x'){

                        var max_y = origin.x + 200; 
                        for(var a = dim.value; a <= 360; a = a + dim.delta ){

                            var pos = origin;


                            pos.x = max_y * Math.sin((a * Math.PI )/ 180);
                            pos.y = max_y * Math.cos((a * Math.PI)/  180);
                
                            this.render_engine.addLine(origin, pos) ;


                        }

                       
                    }
                    if(dim.axis == 'y'){

                        var max_y = 50; 
                        var pos = {x:origin.x, y:origin.y, z:origin.z, color:0x0088ff};
                        var delimiter = false;
                        var color = pos.color;
                        for(var i = 0; i <= dim.segments; i = i +1 ){



                            var a = dim.delta * i;
                            var id = dim.name;

                            if(delimiter){
                                color = 0x000000;
                                 a = a -dim.delta + 1;
                            }    else {
                                color = pos.color;
                            }



                            var g = this.geometry_factory.createGeometry('Circle',[a,64]);
                            var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: color,transparent: true, opacity: 0.5 });
                            var o = this.geometry_factory.createVisualObject(m,id);
                        
                            this.render_engine.addGeometry(o);


                            delimiter = ! delimiter;
                            pos.z = pos.z - 1;
                          


                        }

                       
                    }
                   

           


        });



   }



    
    drawXYZ(config, origin){

                 var dimensions_map;

                dimensions_map = this.getMap(config);

                dimensions_map.forEach((dim)=>{

                    // Crea geometria :


                    if(config.axis){
      
                        var pos = dim.value;
                        for(var i=0; i < dim.segments; i ++){


                            var magnitude = dim.value + dim.delta * i;
                            var axis = dim.axis;
                            var pos = {x:origin.x, y:origin.y, z:origin.z, color:0x0088ff};

                            if(dim.offset){
                                 pos = this.addV(origin,pos);                                                        
                            }


                            pos[axis] = pos[axis] + magnitude;
                            var id = dim.name + origin.x +'_' + i;


                            var g = this.geometry_factory.createGeometry('Plane',[5,10,1,1]);

                            // color: color, transparent: true, opacity: opacity }  0x0088ff, 0.5
                            var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: pos.color, transparent: true, opacity: 0.5  });
                            var o = this.geometry_factory.createVisualObject(m,id);
                            
                            this.render_engine.addGeometry(o);

                        }
                    }



                    // LABELS

                    if(config.labels){


                            if(dim.label){

                                var pos = origin;
                                var rotate = {x:0, y:0, z:0};

                                if(dim.axis == 'x'){
                                    pos =  this.addV(origin, {x:30, y:-10, z:0});
                                }

                                if(dim.axis == 'y'){
                                    pos =  this.addV(origin, {x:-10, y:30, z:0});
                                    rotate = {x:0, y:0, z:3.1415/2};
                                }

                                if(dim.axis == 'z'){
                                    pos =  this.addV(origin, {x:-10, y:-10, z:30});
                                    rotate = {x:0, y:3.1415/2, z:0};
                                }

                                if(dim.axis != 'color'){
                                    this.render_engine.addLabel(dim.label,pos,rotate,{size:3, height:0.3});
                                }


                            
                            }

                  }



                    // EJES


                    if(config.axis){

                            if(dim.axis == 'x'){
                                this.render_engine.addLine(origin, this.addV(origin, { x: 200, y: 0, z: 0 })) 
                            }
                            if(dim.axis == 'y'){
                                this.render_engine.addLine(origin, this.addV(origin, { x: 0, y: 200, z: 0 })) 
                            }
                            if(dim.axis == 'z'){
                                this.render_engine.addLine(origin, this.addV(origin, { x: 0, y: 0, z: 200 })) 
                            }

                   }


                });

       


    }
    

    addV(vector1, vector2) {
        return {
            x: vector1.x + vector2.x,
            y: vector1.y + vector2.y,
            z: vector1.z + vector2.z,
        };
    }




    addElement(data){

        var segments = [];

        // Obtiene los segmentos en los que cae , en cada dimension

        this.dimensions.forEach((dimension)=>{

            var segs = dimension.getSegments(data,[],'');
            segs.forEach((s)=>{
                segments.push(s);

            });


        });


        // Obtiene la posicion que corresponde de acuerdo a los segmentos en que cae

        var pos = {x:0, y:0, z:0, color:0};
        segments.forEach((segment)=>{
               
                    // calcula posicion del elemento
                    pos[segment.axis] = pos[segment.axis] + segment.position;
                  
        });

    

        // Resuelve LABELS

        if(this.config.labels){

                    segments.forEach((segment)=>{ 
                        

                        if(segment.axis != "color" && segment.dimension_ptr.segmentLabel && !segment.hasLabel){


                            var posit =  {x:pos.x, y:0, z:0};
                            var rotate = {x:0, y:0, z:0};
                            var counterpart = '';

                            if(segment.axis == 'x'){
                                rotate.z = 3.1415/2;      // corre hacia y
                                counterpart = 'y';
                            } 


                            if(segment.axis == 'y'){
                                counterpart = 'x';
                            }

                            if(segment.axis == 'z'){
                                counterpart = 'x';
                            }



                            var root_segment = (segment.dimension_ptr.parent == null); // true si es un root segment

                            if(root_segment){
                                    posit[counterpart] = -5;            // posicion absoluta
                            } else {

                                                                        // posicion relativa

                                var parent_axis = segment.dimension_ptr.parent.axis;
                                posit[segment.axis] = pos[segment.axis];
                                posit[counterpart] = 10;         

                            }

                            this.render_engine.addLabel(segment.name,posit,rotate,{size:1, height:0.1});


                            segment.hasLabel = true;
                        }
                        


                    });
   
        }
 

        // CONVIERTE A COORDENADAS POLARES :

        if (this.config.boardType == "polar"){

            pos.x = pos.y * Math.sin((pos.x * Math.PI )/ 180);
            pos.y = pos.y * Math.cos((pos.x * Math.PI)/  180);

        }





        var g = this.geometry_factory.createGeometry('Sphere',[2,10,10]);
        var m = this.geometry_factory.createObject(g,{x:pos.x,y:pos.y,z:pos.z}, { color: pos.color });
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