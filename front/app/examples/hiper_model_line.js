import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_3DSceneRenderer} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
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


 // Ventana Informativa :

 renderer.setInfoWindow((object_id)=>{
  return "OBJETO "+object_id;
});




 const geometry_factory = new vi_geometry_factory();
 
 //renderer.focus(0,0,0,100);
 
 
 const lineOrigin = { x: 0, y: 0, z: 0 };
 const lineAngle = 0; //  radianes
 const linelength = 200;
 const levelsArray = [32];
 
 const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);
 
 hiperLine.setLevels(levelsArray);
 
 hiperLine.setRenderEngine(renderer, geometry_factory);
 
 hiperLine.draw(0);

 



 
 // Al llegar los datos resuelve LABELS


 controller.addObserver('estados',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);
           let point = hiperLine.drawLabel(''+data.id,  object.data.fields.estado, -4 );
                     
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });



// SLOTS
 
let object = {};
 
const sc = new vi_slot_controller(hiperLine);

sc.setDirection('up');  // up o out 





 controller.addObserver('municipios',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);
           
             
           sc.addSlot(object.data.fields.estado, domain+'.'+data.id, object);


        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });




   
   

   
 
 
 
 
 
 


