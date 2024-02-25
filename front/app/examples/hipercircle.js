import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';

 
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
 
hiperCircle.drawLabels(0,['uno','dos','tres','cuatro','cinco'], -5);
hiperCircle.drawLabels(1,['A','B','C'], 0);


let point = hiperCircle.locatePointByPath('0.0.0');

var color = 0x00ff00;

var g = geometry_factory.createGeometry('Cylinder',[2,2, 10,64]);
var m = geometry_factory.createObject(g,{x:point.x,y:point.y+5,z:point.z}, { color: color,transparent: false, opacity: 0.5 });



var o = geometry_factory.createVisualObject(m,'hb');

renderer.addGeometry(o); 


