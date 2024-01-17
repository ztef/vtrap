import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana');
renderer.focus(0,0,0,100);




var conf = {
    

       
            board:{
                type:"hiperline",
                origin: {x:0,y:0,z:0},
                amplitude: 100,
                angle: 0,
                levels:[10],
                graphics:{
                    line:{color:0x00ff00, transparent:true, opacity:0.5}
                },
                content:{

                    board:{
                        type:"hiperline",
                        origin: {x:0,y:0,z:0},
                        amplitude: 100,
                        angle: Math.PI/2,
                        levels:[10],
                        graphics:{
                            line:{color:0x00ff00, transparent:true, opacity:0.5}
                        },
                        content:{

                           
                        }
                    }

                }
            }
        

    
}


var hb = new vi_HiperBoard(renderer);
hb.addBoard(conf);
hb.draw();

//hb.setLabel('0', 'Valor 0');




hb.drawLabels('.0',['uno','dos','tres'], 5);
hb.drawLabels('0.0',['uno','dos','tres'], 15);



// CILINDRO

let point = hb.locatePointByPath('0.0');

var color = 0x00ff00;

var g = hb.geometry_factory.createGeometry('Cylinder',[1,1, 10,64]);
var m = hb.geometry_factory.createObject(g,{x:point.x,y:point.y+5,z:point.z}, { color: color,transparent: false, opacity: 0.5 });



var o = hb.geometry_factory.createVisualObject(m,'hb');

renderer.addGeometry(o); 





