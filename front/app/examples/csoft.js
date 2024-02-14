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
    "SPREADSHEET_ID": "1v61Qm8yqRdjc3Jy3076BldKkGBV0B6vxRXgVNaqoYts",
    "collections" : [
      {
      "collection":"tipos",
      "collectionName" : "TIPOS"
     },
   
     {
      "collection":"empresas",
      "collectionName" : "EMPRESAS"
     },

     {
      "collection":"eventos",
      "collectionName" : "EVENTOS"
     },

     {
      "collection":"participaciones",
      "collectionName" : "PARTICIPACIONES"
     }

   ]
   }
   
   const dataSource = new vi_DataSource('GoogleSheet', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#tipos","Tipos",500,350);
 windowFormater.formatWindow("#empresas","Empresas",500,350);
 windowFormater.formatWindow("#eventos","Eventos",500,350);

 const grid0View = new vi_ObjectGridView('tipos','tipos',controller);
 const grid1View = new vi_ObjectGridView('eventos','eventos',controller);
 const grid2View = new vi_ObjectGridView('empresas','empresas',controller,
 ()=>{
    return "<th>ID</th><th>Nombre</th><th>Razon Social</th><th>Tipo</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.id}</td>
    <td>${data.fields["nombre"]}</td>
    <td>${data.fields["razon"]}</td><td>${data.fields.tipo}</td>`;
 });
     
 const remoteListener = remoteListenerFactory.createRemoteListener(dataSource,objectModel);






 // PARTE GRAFICA


 windowFormater.formatWindow("#graphics","Grafica",500,350);


 const renderer = new vi_3DSceneRenderer('graphics',controller,['tipos','empresas','eventos','participaciones']);


 var toolBoxConfig = {
        "options":[
          {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Universidades"}},
          {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
          {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},       
        ]
 }

 const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

          if(opcion == 'option1'){
           
            sc.acceptVisitor((element)=>{
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
            renderer.setSkyBoxNight();
          }

 });

 
 renderer.setupToolBox(toolbox);





 // Ventana Informativa :

 renderer.setInfoWindow((domain, object_id)=>{

  let object = objectModel.readObject(domain, object_id);
  let html = '';

  if(domain == 'tipos'){
    html = object.data.fields.tipo;
  }

  if(domain == 'empresas'){
    html = object.data.fields.nombre + '<br/>' + object.data.fields.razon + '<br/>'+'Capital Humano :' + object.data.fields.headcount;
  }
  if(domain == 'eventos'){
    html = object.data.fields["evento"];
  }

  if(domain == 'participaciones'){
    html = object.data.fields["evento"];
  }


  return html;

});




 const geometry_factory = new vi_geometry_factory();
 
 //renderer.focus(0,0,0,100);
 
 
 const lineOrigin = { x: 0, y: 0, z: 0 };
 const lineAngle = 0; //  radianes
 const linelength = 50;
 const levelsArray = [4];
 
 const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);
 
 hiperLine.setLevels(levelsArray);
 hiperLine.defineLevels(['tipos']);
 
 hiperLine.setRenderEngine(renderer, geometry_factory);
 
 hiperLine.draw(0);

 

 
 // Al llegar los datos resuelve LABELS


 controller.addObserver('tipos',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);
           let point = hiperLine.drawLabel(''+data.id,  object.data.fields.tipo, 15 );
                     
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


 


 controller.addObserver('empresas',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);

           let headcount = object.data.fields.headcount/10;
           


           var config = {
            "base": { "shape": "Circle", "radius": 1 },
            "label": { "value":object.data.fields.nombre, "x": 0, "y": 0, "z": 0, size:0.1 },
            "columns": [
                { "variable1": { "shape": "Cylinder", x:0.8,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": headcount, "color": 0xff0000 } },
            ]
        };
        
       
        const hg1 = hgf.createGeometriesFromConfig(config,{x:0,y:0,z:0});
        
        sc.addObject2Slot(object.data.fields.tipo, domain+'.'+data.id, object,hg1);
           
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });


 controller.addObserver('participaciones',"objectAdded",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectAdded':
   
          let object = objectModel.readObject(domain, data.id);

          let empresa = objectModel.readObjectbyField('empresas', 'nombre', object.data.fields.empresa);
          
          var color = 0x808080;
    
          var g = geometry_factory.createGeometry('Sphere',[0.2,10, 10]);
          var m = geometry_factory.createObject(g,{x:0,y:0,z:0}, { color: color,transparent: false, opacity: 0.5, side: THREE.DoubleSide });
          let geom = geometry_factory.createVisualObject(m,'participacion.'+object.data.fields.id);
          
           // slot, element, id, object, geometry
           sc.addSlot2Element(empresa.data.fields.tipo,'empresas.'+empresa.id,'participaciones.'+object.data.fields.id,object,geom);

          
          
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});



 

   
 
 
 
 
 
 


