import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';
import { vi_3DSceneRenderer} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';

import { vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_slot } from '../viOne/view/vi_slot.js';
 
const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE  
   const config = {
    "SPREADSHEET_ID": "1vidEnmZbmNoPutdAYao_fxTHREZy8CWWbKfnLTzhRgs",
    "collections" : [
      {
      "collection":"estados",
      "collectionName" : "ESTADOS"
     },
   
     {
      "collection":"municipios",
      "collectionName" : "MUNICIPIOS"
     },

     {
      "collection":"oxxos",
      "collectionName" : "OXXOS"
     }
   ]
   }
   
   const dataSource = new vi_DataSource('GoogleSheet', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#estados","Estados",500,350);
 windowFormater.formatWindow("#municipios","Municipios",500,350);
 windowFormater.formatWindow("#oxxos","OXXOs",500,350);


 const gridView = new vi_ObjectGridView('estados','estados',controller);
 const grid1View = new vi_ObjectGridView('municipios','municipios',controller);
 const grid2View = new vi_ObjectGridView('oxxos','oxxos',controller,
 ()=>{
    return "<th>ID</th><th>Unidad</th><th>Lat</th><th>Long</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.id}</td>
    <td>${data.fields["Nombre de la Unidad Económica"]}</td>
    <td>${data.position._lat}</td><td>${data.position._long}</td>`;
 });
     
 const remoteListener = remoteListenerFactory.createRemoteListener(dataSource,objectModel);






 // PARTE GRAFICA


 windowFormater.formatWindow("#graphics","Grafica",500,350);


 const renderer = new vi_3DSceneRenderer('graphics',controller,['municipios','estados','oxxos']);


 var toolBoxConfig = {
        "options":[
          {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Zonas Metropolitanas"}},
          {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
          {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},       
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
  if(domain == 'oxxos'){
    html = object.data.fields["Nombre de la vialidad"];
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
           
           //addSlot2Board()
           sc.addObject2Slot(object.data.fields.estado, domain+'.'+data.id, object);
           
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });


 function padWithZeros(number, width) {
  // Convert number to string
  let numberString = number.toString();
  // Calculate the number of zeros needed
  let zerosToAdd = width - numberString.length;
  // Add zeros to the left
  let paddedNumber = '0'.repeat(Math.max(0, zerosToAdd)) + numberString;
  return paddedNumber;
}


  var numoxxos =0;

 controller.addObserver('oxxos',"objectAdded",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectAdded':
   
          let object = objectModel.readObject(domain, data.id);
 
          let mpo = 'municipios.'+padWithZeros(object.data.fields["Clave entidad"],2) + '' + padWithZeros(object.data.fields["Clave municipio"] ,3);
 
          var color = 0x808080;
    
          var g = geometry_factory.createGeometry('Sphere',[0.3,10, 10]);
          var m = geometry_factory.createObject(g,{x:0,y:0,z:0}, { color: color,transparent: false, opacity: 0.5, side: THREE.DoubleSide });
          let geom = geometry_factory.createVisualObject(m,'oxxos.'+object.data.fields.id);
          
           // slot, element, id, object, geometry
           sc.addSlot2Element(object.data.fields["Clave entidad"],mpo,'oxxos.'+object.data.fields.id,object,geom);
           numoxxos = numoxxos + 1;
           console.log(numoxxos);

          
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});




 

 

   
 
 
 
 
 
 


