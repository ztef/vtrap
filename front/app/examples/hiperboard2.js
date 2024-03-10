import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana',null,[]);
renderer.focus(0,0,0,100);


var conf = {
    

       
            board:{
                type:"hiperline",
                origin: {x:0,y:0,z:0},
                amplitude: 300,
                angle: 0,
                levels:[5,2],
                graphics:{
                    labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false},
                    line:{color:0x00ff00, transparent:true, opacity:0.5},
                    mainline:true,
                    innerlines:false,
                },
                content:{

                    board:{
                        type:"hipercircle",
                        origin: {x:0,y:0,z:0},
                        amplitude: 10,
                        angle: Math.PI/2,
                        levels:[5],
                        graphics:{
                            labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false},
                            center:{color:0x00ff00, amplitude:10, transparent:true, opacity:0.5}
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




hb.drawLabels('0.0.0',['uno','dos','tres'], -5);








