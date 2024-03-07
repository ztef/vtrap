import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
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


 windowFormater.formatWindow("#graphics0","Empresas",500,350);
 windowFormater.formatWindow("#graphics1","Eventos",500,350);


 const renderer0 = new vi_3DSceneRenderer('graphics0',controller,['tipos','empresas']);
 const renderer1 = new vi_3DSceneRenderer('graphics1',controller,['eventos']);


 var toolBoxConfig = {
        "options":[
          {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Universidades"}},
          {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
          {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},       
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
            renderer0.toggleDamping();
          }

          if(opcion == 'option3'){
            renderer0.setSkyBoxNight();
          }

 });

 
 renderer0.setupToolBox(toolbox);





 // Ventana Informativa :

 renderer0.setInfoWindow((domain, object_id)=>{

  let object = objectModel.readObject(domain, object_id);
  let html = '';

  if(domain == 'tipos'){
    html = object.data.fields.tipo;
  }

  if(domain == 'empresas'){
    html = object.data.fields.nombre + '<br/>' + object.data.fields.razon + '<br/>';
  }
  if(domain == 'eventos'){
    html = object.data.fields["evento"];
  }

  if(domain == 'participaciones'){
    html = object.data.fields["evento"];
  }


  return html;

});

renderer1.setInfoWindow((domain, object_id)=>{

  let object = objectModel.readObject(domain, object_id);
  let html = '';

  
  
  if(domain == 'eventos'){
    html = object.data.fields["evento"];
  }

  

  return html;

});





 const geometry_factory = new vi_geometry_factory();
 
 //renderer.focus(0,0,0,100);
 
 
// RENDER 0 :    Empresas y Participaciones

 const lineOrigin = { x: 0, y: 0, z: 0 };
 const lineAngle = 0; //  radianes
 const linelength = 50;
 const levelsArray = [4];
 
 const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);
 
 hiperLine.setLevels(levelsArray);
 hiperLine.defineLevels(['tipos']);
 
 hiperLine.setRenderEngine(renderer0, geometry_factory);
  
 hiperLine.setGraphics({labels :{ size:{size:0.7, height:0.1}, color:0x000000, align:true}});
 
 hiperLine.draw(0);

 

 
 // Al llegar los datos resuelve LABELS


 controller.addObserver('tipos',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);
           let point = hiperLine.drawLabel(''+data.id,  object.data.fields.tipo,2 );
                     
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });



// SLOTS
 
let object = {};
 
const sc0 = new vi_slot_controller(hiperLine,renderer0);

sc0.setDirection('out');  // up o out 



let hgf= new vi_hipergeometry_factory(geometry_factory);


 


 controller.addObserver('empresas',"objectAdded",(domain, _event, data)=>{

   switch (_event) {
    
      case 'objectAdded':
    
           let object = objectModel.readObject(domain, data.id);

           let estatus = object.data.fields.estatus;
           


           var config = {
            "base": { "shape": "Circle", "radius": 1 },
            "label": { "value":object.data.fields.nombre, "x": 0, "y": 0, "z": 0, size:0.1 },
            "columns": [
                { "variable1": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": estatus, "color": 0x00ff00 } },
            ]
        };
        
       
        const hg1 = hgf.createGeometriesFromConfig(config,{x:0,y:0,z:0});
        
        sc0.addObject2Slot(object.data.fields.tipo, domain+'.'+data.id, object,hg1);
           
        break;
  
      default:
        throw new Error(`Unsupported event: ${_event}`);
      }
 });





controller.addObserver('participaciones',"objectSelected",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectSelected':
   

          // lee la participacion
          let participacion = objectModel.readObject(domain, data.id);

          // lee el evento
          let evento = objectModel.readObjectbyField('eventos', 'evento', participacion.data.fields.evento);


          controller.triggerObjectSelected('eventos', {id:evento.data.fields.id});
          
          
          
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});



controller.addObserver('eventos',"objectSelected",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectSelected':
   

          // lee la participacion
          let evento = objectModel.readObject(domain, data.id);

          
          sc0.acceptVisitorToElements((element)=>{
            
            // DESMARCA TODO :
            
            if(element.visual_object.isGroup){
              let base = element.visual_object.mesh.getObjectByName("base");
              base.material.color.set(0x808080);
            }else {
              element.visual_object.mesh.material.color.set(0x808080);
            }
            

            // MARCA LA SELECCION

            if(element.object.collection == "participaciones"){

               if(element.object.data.fields.evento == evento.data.fields.evento){ 

                if(element.visual_object.mesh.material.color){    
                  element.visual_object.mesh.material.color.set(0xff0000);
                }
                if(element.parent){

                  if(element.parent.visual_object.isGroup){
                    let base = element.parent.visual_object.mesh.getObjectByName("base");
                    base.material.color.set(0xff0000);
                   }else {
                    element.parent.visual_object.mesh.material.color.set(0xff0000);
                   }

                 
                }
               }else {
               }

               // Empresa :

              


              }
            }     
        );

        

          
          
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});



// RENDER 1 : EVENTOS POR TIPO Vs PARTICIPACIONES

const centro = { x: 0, y: 0, z: 0 };
const amplitude = 30;
const _levelsArray = [6];

const hiperCircle = new vi_HiperCircle(amplitude, 0, centro);
hiperCircle.setLevels(_levelsArray);

hiperCircle.setRenderEngine(renderer1, geometry_factory);
hiperCircle.setGraphics({labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false}});

hiperCircle.draw(0);

const tiposArray = ['Evento', 'Capacitación','Webminar','Oportunidad Comercial','Conferencia','Capacitacion'];

 
hiperCircle.drawLabels(0,tiposArray, -5);


const sc1 = new vi_slot_controller(hiperCircle,renderer1);
sc1.setDirection('out');  // up o out 




controller.addObserver('eventos',"objectAdded",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectAdded':
   
          let evento = objectModel.readObject(domain, data.id);
          let estatus = 1;
           


          var config = {
           "base": { "shape": "Circle", "radius": 1 },
           "label": { "value":evento.data.fields.evento, "x": 0, "y": 0, "z": 0, size:0.1 },
           "columns": [
               { "variable1": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": estatus, "color": 0x00ff00 } },
           ]
       };
       
      
          const hg1 = hgf.createGeometriesFromConfig(config,{x:0,y:0,z:0});


          const index = tiposArray.indexOf(evento.data.fields.tipo);
          if(index >0){
       
              sc1.addObject2Slot(''+index, domain+'.'+data.id, evento,hg1);
          } else {
            console.log(evento.data.fields.tipo);
          }
                    
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});



controller.addObserver('participaciones',"objectAdded",(domain, _event, data)=>{

  switch (_event) {
   
     case 'objectAdded':
   

          // lee la participacion
          let participacion = objectModel.readObject(domain, data.id);

          // lee la empresa
          let empresa = objectModel.readObjectbyField('empresas', 'nombre', participacion.data.fields.empresa);
          

          // lee el evento
          let evento = objectModel.readObjectbyField('eventos', 'evento', participacion.data.fields.evento);


          var color = 0x808080;
    
          var g = geometry_factory.createGeometry('Sphere',[0.2,10, 10]);
          var m = geometry_factory.createObject(g,{x:0,y:0,z:0}, { color: color,transparent: false, opacity: 0.5, side: THREE.DoubleSide });
          let geom = geometry_factory.createVisualObject(m,'participacion.'+participacion.data.fields.id);
          
           // slot, element, id, object, geometry
           sc0.addSlot2Element(empresa.data.fields.tipo,'empresas.'+empresa.id,'participaciones.'+participacion.data.fields.id,participacion,geom);

          
          
       break;
 
     default:
       throw new Error(`Unsupported event: ${_event}`);
     }
});
 

   
 
 
 
 
 
 


