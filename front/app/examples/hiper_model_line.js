import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_3DSceneRenderer} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';

import { vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE  
   const config = {
    "SPREADSHEET_ID": "1ScKQhYHCGazc0flEAA48edorpElNS_-gIXdfLdwe9bQ",
    "collections" : [
      {
      "collection":"estados",
      "collectionName" : "ESTADOS"
     },
   
     {
      "collection":"municipios",
      "collectionName" : "MUNICIPIOS"
     }
   ]
   }
   
   const dataSource = new vi_DataSource('GoogleSheet', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#estados","Estados",500,350);
 windowFormater.formatWindow("#municipios","Municipios",500,350);


 const gridView = new vi_ObjectGridView('estados','estados',controller);
 const grid1View = new vi_ObjectGridView('municipios','municipios',controller);
     
 const remoteListener = remoteListenerFactory.createRemoteListener(dataSource,objectModel);






 // PARTE GRAFICA


 windowFormater.formatWindow("#graphics","Grafica",500,350);


 const renderer = new vi_3DSceneRenderer('graphics',controller,['municipios','estados']);


 var toolBoxConfig = {
        "options":[
          {"option1" : {"icon":"/front/app/assets/icon.png","tooltip":"Marcar Capitales"}},
          {"option2" : {"icon":"/front/app/assets/icon.png","tooltip":"Toogle Damping"}},  
          {"option3" : {"icon":"/front/app/assets/icon.png","tooltip":"Sky Box"}},       
        ]
 }

 const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

          if(opcion == 'option1'){
           
            sc.acceptVisitor((element)=>{
              if(element.object.data.fields.capital == 'si'){
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

  if(domain == 'municipios'){
    html = object.data.fields.municipio + ' poblacion :' + object.data.fields.poblacion;
  }

  if(domain == 'estados'){
    html = object.data.fields.estado;
  }


  return html;

});




 const geometry_factory = new vi_geometry_factory();
 
 //renderer.focus(0,0,0,100);
 
 
 const lineOrigin = { x: 0, y: 0, z: 0 };
 const lineAngle = 0; //  radianes
 const linelength = 200;
 const levelsArray = [33];
 
 const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);
 
 hiperLine.setLevels(levelsArray);
 hiperLine.defineLevels(['estados']);
 
 hiperLine.setRenderEngine(renderer, geometry_factory);
 
 hiperLine.draw(0);

 

 
 // Al llegar los datos resuelve LABELS


 controller.addObserver('estados',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);
           let point = hiperLine.drawLabel(''+data.id,  object.data.fields.estado, 15 );
                     
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });



// SLOTS
 
let object = {};
 
const sc = new vi_slot_controller(hiperLine);

sc.setDirection('out');  // up o out 



let hgf= new vi_hipergeometry_factory(geometry_factory);


 


 controller.addObserver('municipios',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);

          let geomcfg = {};
           if(true){
                geomcfg = {
                  "base": { "shape": "Circle", "radius": 1 },
                  "label": { "value": object.data.fields.municipio, "x": 0, "y": 0, "z":0, size:0.1 },
                  "columns": [
                      { "variable1": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": 1, "color": 0xff0000 } },
                      { "variable2": { "shape": "Box", x:0.4,y:0, z:0.4, "width": 0.1, "height": 0.5, "depth": 0.1, "color": 0x0000ff } }
                  ]
                };
          } else {
                geomcfg = {
                  "base": { "shape": "Circle", "radius": 1 },
                  
                  "columns": [
                      { "variable1": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": 10, "color": 0xff0000 } },
                      { "variable2": { "shape": "Box", x:0.4,y:0, z:0.4, "width": 0.1, "height": 5, "depth": 0.1, "color": 0x0000ff } }
                  ]
                };

          }
           
           let hg = hgf.createGeometriesFromConfig(geomcfg,{x:0,y:0,z:0});
           sc.addObject2Slot(object.data.fields.estado, domain+'.'+data.id, object,hg);
           
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });




 

 

   
 
 
 
 
 
 


