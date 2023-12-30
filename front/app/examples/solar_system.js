import { vi_abstractBoard } from '../viOne/view/vi_abstract_board.js';
import { vi_geometry_factory, vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Detalles",500,350);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana');

/*
var gf = new vi_geometry_factory();
var g1 = gf.createGeometry('Sphere',[10,10,10]);


var m1 = gf.createObject(g1,{x:0,y:0,z:0}, { color: 0x00ff00 });
var o1 = gf.createVisualObject(m1,"ID1")

var m2 = gf.createObject(g1,{x:100,y:100,z:100}, { color: 0xff0000 });
var o2 = gf.createVisualObject(m2,"ID2")

*/


//renderer.addGeometry(o1);
//renderer.addGeometry(o2);


//renderer.createGridOfPlanes(5, 5, 20, 0x0088ff, 0.5); 


//renderer.createColoredPlane(100, 0x0088ff, 0.5);
//renderer.createWireframedPlane(100, 10);


renderer.focus(0,0,0,100);






var board_config = {

    boardType: "xyz",
    labels: false,
    axis:false,
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            segmentLabel: true,
            axis:"x",
            value0: 20,
            delta:20,
            segments:10,
            dimensions : [
                {
                    name:"ruta",
                    label:"Rutas",
                    segmentLabel: true,
                    axis:"y",
                    value0: 20,
                    delta:20,
                    segments:10,
                       dimensions : [
                        {
                            name:"mobil",
                            label:"Moviles",
                            segmentLabel: false,
                            axis:"z",
                            value0: 0,  
                            delta:20, 
                            segments:10,
                            
                            
                        }
                       ]
                }
            ]   
        },

        {
            name:"tipo",
            label:"color",
            axis:"color",
            value0: 0,  
            delta:0, 
            map: {"truck": 0xFF0000, "car":0x00FF00, "default":0x0000FF},
            segments:10,  
        }
        
    ]
}



var board_config1 = {

    boardType: "xyz",
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            segmentLabel: true,
            axis:"x",
            value0: 20,
            delta:20,
            segments:10},
        {
            name:"ruta",
            label:"Rutas",
            segmentLabel: true,
            axis:"y",
            value0: 20,
            delta:20,
            segments:10,
                dimensions : [
                {
                    name:"mobil",
                    label:"mobil",
                    segmentLabel: false,
                    axis:"z",
                    value0: 0,  
                    delta:20, 
                    segments:10,
                    
                }
                ]
        },
        {
            name:"tipo",
            label:"color",
            axis:"color",
            value0: 0,  
            delta:0, 
            map: {"truck": 0xFF0000, "car":0x00FF00, "default":0x0000FF},
            segments:10,  
        }
    ]
              
};

        
    
var board_config2 = {

    boardType: "xyz",
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            segmentLabel: true,
            axis:"x",
            value0: 20,
            delta:20,
            segments:10,
            dimensions : [
                {
                    name:"ruta",
                    label:"Rutas",
                    segmentLabel: true,
                    axis:"x",
                    value0: 0,
                    delta:5,
                    segments:10,
                       dimensions : [
                        {
                            name:"mobil",
                            label:"",
                            segmentLabel: false,
                            axis:"y",
                            value0: 20,  
                            delta:7, 
                            segments:10,
                            
                            
                        }
                       ]
                }
            ]   
        },

        {
            name:"tipo",
            label:"color",
            axis:"color",
            value0: 0,  
            delta:0, 
            map: {"truck": 0xFF0000, "car":0x00FF00, "default":0x0000FF},
            segments:10,  
        }
        
    ]
}

var board_config3 = {

    boardType: "polar",
    labels: false,
    axis:false,
    dimensions : [
        {
            name:"cliente",
            label:"Clientes",
            segmentLabel: true,
            axis:"x",                   // alfa
            value0: 0,                  // 0 grados
            delta:45,                   // 10 grados
            segments:10,   
        },
        {
            name:"ruta",
            label:"Rutas",
            segmentLabel: true,
            axis:"y",
            value0: 20,
            delta:20,
            segments:10,
               dimensions : [
                {
                    name:"mobil",
                    label:"Moviles",
                    segmentLabel: false,
                    axis:"z",
                    value0: 0,  
                    delta:20, 
                    segments:10,
                    
                    
                }
               ]
        },

        {
            name:"tipo",
            label:"color",
            axis:"color",
            value0: 0,  
            delta:0, 
            map: {"truck": 0xFF0000, "car":0x00FF00, "default":0x0000FF},
            segments:10,  
        }
        
    ]
}



var board_config4 = {

  
    dimensions : [
        {
            name:"world",
            label:"World",
            type:"container",
            containerType: "xyz",
            labels: false,
            axis:false,
            segmentLabel: true,
            axis:"x",
            value0: 0,
            delta:500,
            segments:3,
               dimensions : [
                {
                    name:"cliente",
                    type:"dimension",
                    label:"Clientes",
                    segmentLabel: true,
                    axis:"x",                   // alfa
                    value0: 0,                  // 0 grados
                    delta:45,                   // 10 grados
                    segments:10,   
                },
                {
                    name:"ruta",
                    type:"dimension",
                    label:"Rutas",
                    segmentLabel: true,
                    axis:"x",
                    offset: {x:0, y:10, z:0},
                    value0: 20,
                    delta:20,
                    segments:10,
                       dimensions : [
                        {
                            name:"mobil",
                            type:"dimension",
                            label:"Moviles",
                            segmentLabel: false,
                            axis:"z",
                            value0: 0,  
                            delta:20, 
                            segments:10,
                            
                            
                        }
                       ]
                }
               ]
        }  
       ,
        {
            name:"tipo",
            type:"dimension",
            label:"color",
            axis:"color",
            value0: 0,  
            delta:0, 
            map: {"truck": 0xFF0000, "car":0x00FF00, "default":0x0000FF},
            segments:10,  
        }
        
    ]
}


var board = new vi_abstractBoard('tablero',board_config4, renderer);


//board.drawBoard();




board.addElement({id:0, world:'w', cliente:'A', ruta:'R', mobil:'m1', tipo:'truck'});
board.addElement({id:1, world:'w1', cliente:'B', ruta:'R1', mobil:'m2', tipo:'truck'});
board.addElement({id:2, world:'w1', cliente:'B', ruta:'R2', mobil:'m3', tipo:'car'});
board.addElement({id:3, world:'w1', cliente:'B', ruta:'R2', mobil:'m4', tipo:'car'});
board.addElement({id:4, world:'w1', cliente:'C', ruta:'R', mobil:'m5', tipo:'truck'});










