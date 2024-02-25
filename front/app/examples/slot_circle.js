import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana',null,[]);
const geometry_factory = new vi_geometry_factory();

//renderer.focus(0,0,0,100);


const centro = { x: 0, y: 0, z: 0 };
const amplitude = 30;
 
const levelsArray = [5,3,2];

 

const hiperCircle = new vi_HiperCircle(amplitude, 0, centro);
hiperCircle.setLevels(levelsArray);


hiperCircle.setRenderEngine(renderer, geometry_factory);

hiperCircle.draw(0);
hiperCircle.draw(1);
hiperCircle.draw(2);
 
hiperCircle.drawLabels(0,['uno','dos','tres'], -5);



// SLOTS

let object = {};

const sc = new vi_slot_controller(hiperCircle, renderer);
sc.setDirection('out');      // La direccion del stackeo up/out
//sc.setGraphics();

sc.addObject2Slot('1.0.1', 1,object);
sc.addObject2Slot('1.0.1', 2,object);
sc.addObject2Slot('1.0.1', 3,object);

sc.addObject2Slot('2.1.1', 4,object);




