import { vi_3DSceneRenderer, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';

import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';

const windowFormater = new vi_WindowFormater();

windowFormater.formatWindow("#almacenes","Detalles",500,350);
windowFormater.positionDiv("almacenes",70,60);  



const renderer = new vi_3DSceneRenderer('almacenes',null,[]);
const geometry_factory = new vi_geometry_factory();

// model = Promise
var model = renderer.loadOBJ('./assets/simulator.obj','./assets/simulator.mtl',1);




var toolBoxConfig = {
    "options":[
      {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Universidades"}},
      {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
      {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Modo Oscuro"}},       
    ]
}

const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

      if(opcion == 'option1'){
       
        sc0.acceptVisitor((element)=>{
          if(element.object.data.fields.giro == 'Universidades'){
             if(element.visual_object.isGroup){
              let base = element.visual_object.mesh.getObjectByName("base");
              base.material.color.set(0xff0000);
             }else {
              element.visual_object.mesh.material.color.set(0xff0000);
             }
             
          } 
      });

      }

      if(opcion == 'option2'){
        renderer.toggleDamping();
      }

      if(opcion == 'option3'){
        renderer.setBackroundColor(0x000000);
      }

});


renderer.setupToolBox(toolbox);


// HIPERLINE  **********************

var lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = 0; //Math.PI/4;   radianes
const linelength = 200;
const levelsArray = [5];

var hiperLine;



model.then((model)=> {

    let base = model.getObjectByName("Plane");

    let origin = base.geometry.boundingBox.min;



    lineOrigin.x = origin.x;
    lineOrigin.y = origin.y;
    lineOrigin.z = origin.z;

    hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin);
    hiperLine.setLevels(levelsArray);
    hiperLine.setRenderEngine(renderer, geometry_factory);

    hiperLine.draw(0);

    hiperLine.drawLabels(0,['cero','uno','dos','tres','cuatro'], -3);
   
}).catch(function(error) {
   
    console.error('Error loading model:', error);
});





