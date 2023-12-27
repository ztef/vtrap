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
                            segments:10,
                            
                        }
                       ]
                }
            ]   
        },
        
    ]
}


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
            segments:10},
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
                    segments:10,
                    
                }
                ]
        }
    ]
              
};
*/
        
    




var board = new vi_abstractBoard('tablero',board_config, renderer);


board.draw();


board.addElement({id:0, cliente:'A', ruta:'R', mobil:'m1', tipo:'t1'});
board.addElement({id:1, cliente:'B', ruta:'R1', mobil:'m', tipo:'t1'});
board.addElement({id:2, cliente:'B', ruta:'R2', mobil:'m', tipo:'t1'});
board.addElement({id:3, cliente:'B', ruta:'R2', mobil:'m2', tipo:'t1'});
board.addElement({id:4, cliente:'C', ruta:'R', mobil:'m11', tipo:'t2'});










