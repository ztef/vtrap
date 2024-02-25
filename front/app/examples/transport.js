import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_3DSceneRenderer} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';

import { vi_MapFactory, vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE PARA MOVILES   
   const config = {
    "SPREADSHEET_ID": "1kwMFxuKNH8vaZeI0G47xYeavJYHf0YvsEB3b7uNSgS0",
    "collections" : [{
      "collection":"unidades",
      "collectionName" : "UNIDADES"
    }]
   }
   
   const unitsDataSource = new vi_DataSource('GoogleSheet', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#units_menu","Unidades",500,350);
 windowFormater.positionDiv("units_menu",10,50);

 const gridView = new vi_ObjectGridView('unidades','units_menu',controller,()=>{
   return "<th>ID</th><th>Unidad</th><th>Marca</th><th>Modelo</th><th>TIPO</th>";
},
(id,collection,data)=>{
   return `<td>${data.fields.id}</td><td>${data.fields.unidad}</td><td>${data.fields.marca}</td><td>${data.fields.modelo}</td><td>${data.fields.tipo}</td>`;
});
     
 const unitsRemoteListener = remoteListenerFactory.createRemoteListener(unitsDataSource,objectModel);



// SECCION GRAFICA 


//MAPA

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 

const map = mapFactory.createMap("Cesium", controller,[]);


// Formatea el contendor de mapa como ventana
 windowFormater.formatWindow("#mapa","Mapa",500,350);

// Carga el mapa en su contenedor
map.loadMap('mapa');




windowFormater.formatWindow("#graphics","Grafica",500,350);


const renderer = new vi_3DSceneRenderer('graphics',controller,['unidades']);


var toolBoxConfig = {
       "options":[
         {"option1" : {"icon":"/front/app/assets/accident.svg","tooltip":"Unidades sin seguro"}},
         {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Toogle Damping"}},  
         {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},       
       ]
}

const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

         if(opcion == 'option1'){
          
           sc.acceptVisitor((element)=>{
             if(element.object.data.fields.poliza == 'SIN SEGURO' || element.object.data.fields.poliza == ''){
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
           renderer.setSkyBox();
         }

});


renderer.setupToolBox(toolbox);

 





// Ventana Informativa :

renderer.setInfoWindow((domain, object_id)=>{

 let object = objectModel.readObject(domain, object_id);
 let html = '';

 if(domain == 'unidades'){
   html = object.data.fields.unidad + ':' + object.data.fields.unidad + ' marca modelo :' + object.data.fields.marca + object.data.fields.modelo;
 }

 return html;

});




const geometry_factory = new vi_geometry_factory();

//renderer.focus(0,0,0,100);


const lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = 0; //  radianes
const linelength = 200;
var levelsArray = [];

var hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);


// SLOTS
 
const sc = new vi_slot_controller(hiperLine);
sc.setDirection('out');  // up o out 
let hgf= new vi_hipergeometry_factory(geometry_factory);






controller.addObserver('unidades','collectionLoaded',(col)=>{
                                 // colecccion, campo, 
         let tipos = objectModel.getUniqueFieldValues('unidades', 'tipo');

         levelsArray = [tipos.length];
         
         hiperLine.setLevels(levelsArray);
         hiperLine.defineLevels(['tipos']);

         hiperLine.setRenderEngine(renderer, geometry_factory);

         hiperLine.draw(0);

         hiperLine.drawLabels(0, tipos, 10);

         let unidades = objectModel.getObjectsByCollection('unidades');
         unidades.forEach(unidad => {


                 let geomcfg = {};
             

               let capacidad = unidad.data.fields.capacidad/2;

               let en_uso = unidad.data.fields.en_uso == 'SI';
               let color = 0xffff00;
               if(!en_uso){color = 0x808080}

                 geomcfg = {
                   "base": { "shape": "Circle", "radius": 1, "color":color },
                   "label": { "value": unidad.data.fields.unidad, "x": 0, "y": 0, "z":0, size:0.1 },
                   "columns": [
                       { "capacidad": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": capacidad, "color": 0xff0000 } },
                       { "variable2": { "shape": "Box", x:0.4,y:0, z:0.4, "width": 0.1, "height": 0.5, "depth": 0.1, "color": 0x0000ff } }
                   ]
                 };

                 if(unidad.data.fields.gps == 'SI'){
                  geomcfg.icons = {'icon':'gps'}
                 }
             
            
                  let hg = hgf.createGeometriesFromConfig(geomcfg,{x:0,y:0,z:0});
                  sc.addObject2Slot(''+tipos.indexOf(unidad.data.fields.tipo), 'unidades.'+unidad.id, unidad,hg);


            
         });

         





});



