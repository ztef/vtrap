import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
 
const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#ventana","Tablero",700,600);
 



// PARTE GRAFICA

const renderer = new vi_3DSceneRenderer('ventana');
const geometry_factory = new vi_geometry_factory();

renderer.focus(0,0,0,100);


const lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = 0; //  radianes
const linelength = 200;
const levelsArray = [10,3,2];

const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);

hiperLine.setLevels(levelsArray);

hiperLine.setRenderEngine(renderer, geometry_factory);

hiperLine.draw(0);
hiperLine.draw(1);
hiperLine.draw(2);




