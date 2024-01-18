import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana',null,[]);
const geometry_factory = new vi_geometry_factory();

//renderer.focus(0,0,0,100);


const lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = Math.PI/4; //  radianes
//const lineAngle = 0; //  radianes
const linelength = 200;
const levelsArray = [10,3,2];

const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);

hiperLine.setLevels(levelsArray);

hiperLine.setRenderEngine(renderer, geometry_factory);

hiperLine.draw(0);
hiperLine.draw(1);
hiperLine.draw(2);


// LABELS

hiperLine.drawLabels(0,['cero','uno','dos','tres'], -3);




// SLOTS

let object = {};

const sc = new vi_slot_controller(hiperLine);

sc.setDirection('out');  // up o out 
//sc.setGraphics();

sc.addSlot('1.0.1',1, object);
sc.addSlot('1.0.1',2, object);
sc.addSlot('1.0.1',3, object);

sc.addSlot('2.1.1',4, object);




