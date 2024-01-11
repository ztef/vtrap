import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana');
renderer.focus(0,0,0,100);

var conf = {
    board:{

        type:"radial",
        origin: {x:0, y:0, z:0},
        amplitude: 50,
        angle:0,
        levels: [3,2],
        graphics:{
            center:{amplitude:30, color:0x00ff00, transparent:true, opacity:0.5 }
        },
        content:
        {
            board:{
                type:"linear",
                origin: {x:0,y:0,z:0},
                amplitude: 100,
                angle: 0,
                levels:[10],
                graphics:{
                    line:{color:0x00ff00, transparent:true, opacity:0.5}
                },
                content:{

                    board:{
                        type:"linear",
                        origin: {x:0,y:0,z:0},
                        amplitude: 20,
                        angle: 0,
                        levels:[2],
                        graphics:{
                            line:{color:0x00ff00, transparent:true, opacity:0.5}
                        },
                        content:{
                        }
                    }

                }
            }
        }

    }
}


var conf1 = {
    

       
            board:{
                type:"linear",
                origin: {x:0,y:0,z:0},
                amplitude: 500,
                angle: 0,
                levels:[5,2],
                graphics:{
                    line:{color:0x00ff00, transparent:true, opacity:0.5}
                },
                content:{

                    board:{
                        type:"linear",
                        origin: {x:0,y:0,z:0},
                        amplitude: 50,
                        angle: 0,
                        levels:[5,2],
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
hb.addBoard(conf1);
hb.draw();

hb.setLabel('0.1.1.0', 'Valor 0');











