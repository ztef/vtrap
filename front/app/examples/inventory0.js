
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import {vi_3DSceneRenderer ,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';
import { vi_toolbox } from '../viOne/view/vi_toolbox.js';

const windowFormater = new vi_WindowFormater();

    

// CREA UN CONTROLADOR
   const controller = new vi_Controller();
 
// CREA UN MODELO DE OBJETOS 
   const objectModel = new vi_ObjectModel(controller);

// CREA UNA FABRICA PARA LISTENERS REMOTOS   
   const remoteListenerFactory = new vi_RemoteListenerFactory();

// CREA UN DATASOURCE PARA MOVILES (FIREBASE)   
   const config = {
    "credentials":{
        "apiKey": "AIzaSyA_vZkjrsR7tz9TFfw4_PEwfpDe0Pz0zZA",
        "authDomain": "sundekinventory.firebaseapp.com",
        "projectId": "sundekinventory",
        "storageBucket": "sundekinventory.appspot.com",
        "messagingSenderId": "505209625267",
        "appId": "1:505209625267:web:9193f409272639bc91eec6",
        "measurementId": "G-V4MG6QSJZH"
      },"collections" : [

         {
            "collection":"warehouses",
            "collectionName" : "WAREHOUSES",
            "loadType":"shot"
         },

         {
         "collection":"families",
         "collectionName" : "FAMILIES",
         "loadType":"shot"
        },
         
   
        {
         "collection":"inventory",
         "collectionName" : "INVENTORY",
         "loadType":"suscription"
        }
      ]
    }

   const dbDataSource = new vi_DataSource('Firebase', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#families_div","Families of Products",500,350);
 windowFormater.positionDiv("families_div",10,50);

 windowFormater.formatWindow("#warehouses_div","Warehouses",500,350);
 windowFormater.positionDiv("warehouses_div",10,50);

 windowFormater.formatWindow("#graphics","Inventory",500,350);
 windowFormater.positionDiv("graphics",10,50);

 const familiesView = new vi_ObjectGridView('families','families_div',controller,
 ()=>{
    return "<th>ID</th><th>Family</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.id}</td><td>${data.fields.family}</td>`;
 });

 const whView = new vi_ObjectGridView('warehouses','warehouses_div',controller,
 ()=>{
    return "<th>ID</th><th>Warehouse</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.id}</td><td>${data.fields.name}</td>`;
 });
     
 const dbRemoteListener = remoteListenerFactory.createRemoteListener(dbDataSource,objectModel);



// GRAPHICS

const renderer = new vi_3DSceneRenderer('graphics',controller,[]);



var toolBoxConfig = {
   "options":[
     {"option1" : {"icon":"/front/app/assets/out.png","tooltip":"Marcar Out of Stock"}},
     {"option2" : {"icon":"/front/app/assets/damp.png","tooltip":"Cambiar Damping"}},  
     {"option3" : {"icon":"/front/app/assets/sky.png","tooltip":"Sky Box"}},  
     {"option4" : {"icon":"/front/app/assets/dark.png","tooltip":"Modo Oscuro"}},
     {"option5" : {"icon":"/front/app/assets/day.png","tooltip":"Modo Claro"}},  
     {"option6" : {"icon":"/front/app/assets/reset.png","tooltip":"Reset"}},        
   ]
}

const toolbox = new vi_toolbox(toolBoxConfig,(opcion)=>{

     if(opcion == 'option1'){
      
       sc.acceptVisitor((element)=>{
         if(element.object.data.fields.units < 30){
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

     if(opcion == 'option4'){
      renderer.setBackroundColor(0x000000);
    }
    if(opcion == 'option5'){
      renderer.setBackroundColor(0xffffff);
    }
    if(opcion == 'option6'){
      
      sc.acceptVisitor((element)=>{
        if(element.object.data.fields.units >= 0){
           if(element.visual_object.isGroup){
            let base = element.visual_object.mesh.getObjectByName("base");
            base.material.color.set(0xf4A020);
           }else {
            element.visual_object.mesh.material.color.set(0xf4A020);
           }
           
        } 
    });

    }

});


renderer.setupToolBox(toolbox);






const geometry_factory = new vi_geometry_factory();



renderer.setInfoWindow((domain, object_id)=>{

   let object = objectModel.readObject(domain, object_id);
   let html = '';
 
   if(domain == 'inventory'){
     html = 'CODE: '+object.data.fields.code + '<br>Family :' + object.data.fields.family + '<br>Product :' + object.data.fields.name +'<br>Units :'+object.data.fields.units;
   }
 
 
   return html;
 
 });

//renderer.focus(0,0,0,100);

let hgf= new vi_hipergeometry_factory(geometry_factory);


var hb = new vi_HiperBoard(renderer);
var warehousesArray;
var familiesArray;


// SLOT CONTROLLER 
const sc = new vi_slot_controller(hb,renderer);
sc.setDirection('out');  // up o out 
sc.setDelta(1);

var warehouses;
var families;

controller.addObserver('','allCollectionsLoaded',(wh)=>{

         warehouses = objectModel.getUniqueFieldValues('warehouses', 'id');
         warehousesArray = [warehouses.length];
         
         families = objectModel.getUniqueFieldValues('families', 'family');
         familiesArray = [families.length];

         var conf = {
            board:{
         
                type:"hiperline",
                origin: {x:0, y:0, z:0},
                amplitude: 150,
                angle:0,
                levels: warehousesArray,   //families
                graphics:{
                  center:{amplitude:30, color:0x00ff00, transparent:true, opacity:0.5, lines:false },
                  labels :{ size:{size:0.7, height:0.1}, color:0x0000ff, align:false, html:false},
                  line:{color:0x00ff00, transparent:true, opacity:0.5},
                  markers:{shape:'Circle',size:{size:.08,definition:8}},
                  mainline:true,
                  innerlines:false,
              },
                content:
                {
                    board:{
                        type:"hiperline",
                        origin: {x:0,y:0,z:0},
                        amplitude: 100,
                        angle: 0,
                        levels:  familiesArray,   // families
                        graphics:{
                           mainline:false,
                           innerlines:false,
                           center:{amplitude:20,color:0xffffff, transparent:true, opacity:0.5},
                           labels :{ size:{size:0.7, height:0.1}, color:0x0000ff, align:false, html:false},
                           line:{color:0x00ff00, transparent:true, opacity:0.5},
                           mainline:false,
                           innerlines:false,
                       },
                        content: {}
                    }
                }
         
            }
         }
         
          
         hb.addBoard(conf);
         hb.draw();
         
         hb.drawLabelsbyLevel(0,warehouses, 0);
         hb.drawLabelsbyLevel(1,families, -10);
         
        
         
         console.log("Mascara :", hb.mask);
         console.log("Hiperlevels :", hb.hiperlevels);

        
         controller.addObserver('inventory',"objectAdded",BLOC_INVENTORIES);
         controller.addObserver('inventory',"objectUpdated",BLOC_INVENTORIES);
      

});



function BLOC_INVENTORIES(domain, event, data){

   var object;
   var router;
   var inventario;

  switch (event) {
    
   case 'objectAdded':

      inventario = objectModel.readObject(domain, data.id);  
      let units = inventario.data.fields.units; 
      if(units == 0){
         units = 1;
      }

      let _color = 0x00ff00;
      if (units < 30){
         _color = 0xff0000;
      } 
      units = units / 100;
      
      

      console.log('Inventario recibido, buscar slot');

       let  geomcfg = {
            "base": { "shape": "Circle", "radius": 0.25, "color":0xf4A020 },
            "label": { "value": inventario.data.fields.name, "x": 0, "y": 0, "z":0, size:0.1 },
            "columns": [
               { "units": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.01, "radiusBottom": 0.01, "height": units, "color": _color } }
              
            ]
         };

  
        let hg = hgf.createGeometriesFromConfig(geomcfg,{x:0,y:0,z:0});

        {
        const p1 = warehouses.indexOf(inventario.data.fields.whouse);
        const p2 = families.indexOf(inventario.data.fields.family);
        const p = p1+'.'+p2;

        sc.addObject2Slot(p, 'inventory.'+inventario.data.id, inventario,hg);
        }


     break;

   case 'objectUpdated':

       inventario = objectModel.readObject(domain, data.id);   
        
       console.log('Inventario modificado, buscar slot');

       {
         const p1 = warehouses.indexOf(inventario.data.fields.whouse);
         let p2 = families.indexOf(inventario.data.fields.family);
         let p = p1+'.'+p2;

         let e = sc.getElementFromSlot(p,'inventory.'+inventario.data.id);
         if(e){
            if(e.visual_object.isGroup){

               console.log("Quitando cilindro");

               let units= e.visual_object.mesh.getObjectByName("units");
               let unitsVal = units.geometry.parameters.height * 100; // aplica el mismo factor pero inverso 

               
               console.log("Unidades actuales ", unitsVal);

               //units.geometry.dispose();
               //units.material.dispose();

               let newUnits = inventario.data.fields.units;

               console.log("Unidades nuevas ", newUnits);

               let base = e.visual_object.mesh.getObjectByName("base");
               
               let _color = 0x00ff00;
               if(newUnits < 30){ 
                  _color = 0xff0000;
                     base.material.color.set(0xff0000);
               } else {
                     base.material.color.set(0xf4A020);
               }

               var scaleFactorY = newUnits / unitsVal;

               var newHeight = newUnits / 100;  //aplica el factor de nuevo

               // Store the current position of the cylinder
               var currentPosition = units.position.clone();

               // Resize the cylinder along the y-axis
               units.scale.setY(scaleFactorY);

               // AJUSTA POSICION

               // Calculate the difference in height after scaling
               var deltaY = (units.geometry.parameters.height - units.geometry.parameters.height * scaleFactorY);

               // Adjust the position of the cylinder to maintain its bottom at y = 0
               units.position.y = 0 + newHeight / 2;


                
              }else {
               e.visual_object.mesh.material.color.set(0xff0000);
              }
         }

       }




     break;

  
   default:
     throw new Error(`Unsupported event: ${event}`);
   }

  
}

controller.addObserver('families',"objectSelected",(domain, event, data)=>{

   let familia = objectModel.readObject(domain, data.id); 

   let famNumber = families.indexOf(familia.data.fields.family);

   if(famNumber >=0){
         let id = "marker.root.0."+famNumber;
         renderer.flyToEntity(id);

   }

});






 