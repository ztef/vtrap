
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_HiperLine} from '../viOne/view/vi_hiperline.js';
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
            "collection":"products",
            "collectionName" : "PRODUCTS",
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
const geometry_factory = new vi_geometry_factory();

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

const lineOrigin = { x: 0, y: 0, z: 0 };
const lineAngle = 0; //Math.PI/4;   radianes
const linelength = 200;

const centro = { x: 0, y: 0, z: 0 };
const amplitude = 20;

// OPCIONES GRAFICAS

const hf = new vi_HiperCircle(amplitude, 0, centro);
 //const hf = new vi_HiperLine( linelength,lineAngle ,lineOrigin,);

      hf.setRenderEngine(renderer, geometry_factory);

      hf.setGraphics({
                     center:{lines:false},
                     labels :{ size:{size:0.1, height:0.001}, color:0x000000, align:false}, 
                      markers:{shape:'Circle',size:{size:.08,definition:8}}
                     });

var hb = new vi_HiperBoard(renderer);    

hb.setHiperGeomFactory(hgf);   //Utilizaremos hiper geometrias para los labels

var warehousesArray;
var familiesArray;
var productsArray;


// SLOT CONTROLLER 
const sc = new vi_slot_controller(hf,renderer);
sc.setDirection('out');  // up o out 

var warehouses;
var families;
var products;

controller.addObserver('','allCollectionsLoaded',(wh)=>{

         warehouses = objectModel.getUniqueFieldValues('warehouses', 'id');
         warehousesArray = [warehouses.length];
         
         families = objectModel.getUniqueFieldValues('families', 'family');
         familiesArray = [families.length];

         products = objectModel.getUniqueFieldValues('products', 'name');
         productsArray = [products.length];

         //hf.setLevels(productsArray);

         //hf.draw(0);

         var conf = {
            board:{
         
                type:"hiperline",
                origin: {x:0, y:0, z:0},
                amplitude: 1000,
                angle:0,
                levels: productsArray,   // Productos
                graphics:{
                    center:{amplitude:30, color:0x00ff00, transparent:true, opacity:0.5, lines:false },
                    labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false, html:{size:'8px', lod:true, min:5, max:50}},
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
                        amplitude: 30,
                        angle: 0,
                        levels: warehousesArray,   // Warehouses
                        graphics:{
                            mainline:false,
                            innerlines:false,
                            center:{amplitude:20,color:0x00ff00, transparent:true, opacity:0.5},
                            labels :{ size:{size:0.7, height:0.1}, color:0xff0000, align:false},
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

         hb.drawLabelsbyLevel(0,products, 1);






         //hf.drawLabels(0,products, 0);
         
        
         //controller.addObserver('inventory',"objectAdded",BLOC_INVENTORIES);
         //controller.addObserver('inventory',"objectUpdated",BLOC_INVENTORIES);
      

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
      units = units / 10;
        
      console.log('Inventario recibido, buscar slot');

       let  geomcfg = {
            "base": { "shape": "Circle", "radius": 1, "color":0xffff00 },
            "label": { "value": inventario.data.fields.name, "x": 0, "y": 0, "z":0, size:0.1 },
            "columns": [
               { "units": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": units, "color": 0x00ff00 } }
              
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

         let e = sc.getSlotandElement(p,'inventory.'+inventario.data.id);
         if(e){
            if(e.visual_object.isGroup){

               let units= e.visual_object.mesh.getObjectByName("units");
               const currentHeight = units.geometry.parameters.height;
               const newHeight = inventario.data.fields.units;
               const scaleFactor = (newHeight) / currentHeight;

               console.log("height actual ", currentHeight);
               console.log("height nuevo ", newHeight);

                
               units.scale.y *= scaleFactor;
               units.position.y = (newHeight / 2);
                
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






 