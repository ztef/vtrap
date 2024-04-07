import { vi_HiperLine } from '../viOne/view/vi_hiperline.js';
import { vi_3DSceneRenderer} from '../viOne/all.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';
import { vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';

const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE    
   const config = {
    "DATABASE_ID": "InndotEnrollDBP",
    "collections" : [
      {
         "collection":"sucursales",
         "sql" : "select id, nombre from sucursal",
         "collectionName" : "SUCURSALES",
         "loadType":"shot"
      },
      {
      "collection":"personas",
      "sql" : "select  id, apellido_paterno, estatus, estatus_enrolamiento, fecha_registro, sexo, sucursal_registro_id from persona where YEAR(fecha_registro) = 2024 order by fecha_registro",
      "collectionName" : "PERSONAS",
      "loadType":"shot"
      }
     
   
   ]
   }
   
const sucursalesDataSource = new vi_DataSource('MSSQL', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#personas","Personas",500,350);
 windowFormater.positionDiv("personas",10,50);

 windowFormater.formatWindow("#sucursales","Sucursales",500,350);
 windowFormater.positionDiv("sucursales",10,50);

 const gridView = new vi_ObjectGridView('sucursales','sucursales',controller);
 //const gridView1 = new vi_ObjectGridView('personas','personas',controller);
     
 const cedisRemoteListener = remoteListenerFactory.createRemoteListener(sucursalesDataSource,objectModel);



// --------------------  PARTE GRAFICA --------------------------------

const renderer = new vi_3DSceneRenderer('personas',controller,['personas']);
const geometry_factory = new vi_geometry_factory();

var toolBoxConfig = {
   "options":[
     {"option1" : {"icon":"/front/app/assets/metro.png","tooltip":"Marcar Cancelados"}},
     {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
     {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},       
   ]
}

const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

     if(opcion == 'option1'){
      
       sc.acceptVisitor((element)=>{
         if(element.object.data.fields.estatus == 'CANCELADO'){
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


renderer.setInfoWindow((domain, object_id)=>{

   let object = objectModel.readObject(domain, object_id);
   let html = '';
 
   if(domain == 'personas'){
     html = 'CODE: '+object.data.fields.apellido_paterno + '<br> :' + object.data.fields.apellido_materno + '<br> :';
   }

   return html;
 
 });






renderer.setupToolBox(toolbox);

const lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = Math.PI/4; //  radianes
//const lineAngle = 0; //  radianes
const linelength = 100;
const levelsArray = [22];

const hiperLine = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);


const sc = new vi_slot_controller(hiperLine,renderer);
      sc.setDirection('out');  // up o out 
      sc.setDelta(0.10);


controller.addObserver('sucursales','collectionLoaded',(_sucursales)=>{

   let sucursales = objectModel.getUniqueFieldValues('sucursales', 'nombre');
   let sucursalesArray = [sucursales.length];

   hiperLine.setLevels(sucursalesArray);

   hiperLine.setRenderEngine(renderer, geometry_factory);

   hiperLine.draw(0);
   
   hiperLine.drawLabels(0,sucursales, -3);



   controller.addObserver('personas','objectAdded',(domain, event, data)=>{

      let p = objectModel.readObject(domain, data.id); 
      let sucursal = p.data.fields.sucursal_registro_id;
      if(sucursal != null){

         var color = 0x808080;

         var g = geometry_factory.createGeometry('Cube',[0.05,0.05, 5]);
         var m = geometry_factory.createObject(g,{x:0,y:0,z:0}, { color: color,transparent: false, opacity: 0.5, side: THREE.DoubleSide });
         let vo = geometry_factory.createVisualObject(m,p.data.fields.id);

         sc.addObject2Slot(sucursal, 'personas.'+p.data.id, p, vo);


      }    
   
   });




});












let object = {};


//sc.setGraphics();

sc.addObject2Slot('1.0.1',1, object);
sc.addObject2Slot('1.0.1',2, object);
sc.addObject2Slot('1.0.1',3, object);

sc.addObject2Slot('2.1.1',4, object);




