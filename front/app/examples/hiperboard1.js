import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana',null,[]);
//renderer.focus(0,0,0,100);

var conf = {
    board:{

        type:"hipercircle",
        origin: {x:0, y:0, z:0},
        amplitude: 50,
        angle:0,
        levels: [3,2],
        graphics:{
            labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false},
            center:{amplitude:30, color:0x00ff00, transparent:true, opacity:0.5 }
        },
        content:
        {
            board:{
                type:"hiperline",
                origin: {x:0,y:0,z:0},
                amplitude: 100,
                angle: 0,
                levels:[10],
                graphics:{
                    labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false},
                    line:{color:0x00ff00, transparent:true, opacity:0.5}
                },
                content:{

                    board:{
                        type:"hiperline",
                        origin: {x:0,y:0,z:0},
                        amplitude: 20,
                        angle: 0,
                        levels:[2],
                        graphics:{

                            mainline:true, 
                            labels :{ size:{size:0.7, height:0.1}, color:0x000000, align:true},
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



var hb = new vi_HiperBoard(renderer);
hb.addBoard(conf);
hb.draw();

//hb.setLabel('0', 'Valor 0');


//mask .2.1.1
//hiperlevels  3,2,10,2

/*
    0:0
    1:1
    2:.0.0.0

*/

//hb.drawLabels('0',['uno','dos','tres'], -10);
//hb.drawLabels('1',['A','B'], 0);
//hb.drawLabels('.0.0.0',['0','1','2','3','4','5','6','7','8','9'], 0);
//hb.drawLabels('.0.1.0',['0','1','2','3','4','5','6','7','8','9'], 0);

hb.drawLabelsbyLevel(0,['uno','dos','tres'], -10);
hb.drawLabelsbyLevel(1,['A','B'], 0);
hb.drawLabelsbyLevel(2,['0','1','2','3','4','5','6','7','8','9'], 0);

console.log(hb.mask);
console.log(hb.hiperlevels);









