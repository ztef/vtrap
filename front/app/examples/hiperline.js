import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_3DSceneRenderer, vi_WindowFormater,} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
 
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



// CILINDRO

let point = hiperLine.locatePointByPath('1.0.1');

var color = 0x00ff00;

var g = geometry_factory.createGeometry('Cylinder',[1,1, 10,64]);
var m = geometry_factory.createObject(g,{x:point.x,y:5,z:point.z}, { color: color,transparent: false, opacity: 0.5 });

var o = geometry_factory.createVisualObject(m,'hb');

renderer.addGeometry(o); 


// GEOMETRIA COMPLEJA EJEMPLO


let hgf= new vi_hipergeometry_factory(geometry_factory);


let point1 = hiperLine.locatePointByPath('2.0.1');
let hg = hgf.getHiperGeometry(point1);


renderer.addGeometry(hg);


// GEOMETRIA COMPLEJA BASADA EN CONFIGURACION



var config = {
    "base": { "shape": "Circle", "radius": 1 },
    "label": { "value": "record number one", "x": 0, "y": 0, "z": 0, size:0.1 },
    "columns": [
        { "variable1": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": 10, "color": 0xff0000 } },
        { "variable2": { "shape": "Box", x:0.4,y:0, z:0.4, "width": 0.1, "height": 5, "depth": 0.1, "color": 0x0000ff } }
    ]
};

let point2 = hiperLine.locatePointByPath('3.0.1');
// Create geometries from configuration
const hg1 = hgf.createGeometriesFromConfig(config,point2);

// Add the group to the scene
renderer.addGeometry(hg1);

renderer.addLOD();

