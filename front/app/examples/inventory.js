
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import {vi_3DSceneRenderer ,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';
import { vi_slot_controller } from '../viOne/view/vi_slot_cotroller.js';
import { vi_hipergeometry_factory } from '../viOne/view/vi_hipergeometry_factory.js';

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

 windowFormater.formatWindow("#graphics","Warehouses",500,350);
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

const renderer = new vi_3DSceneRenderer('graphics',null,[]);
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
var levelsArray;
var familiesArray;


// SLOT CONTROLLER 
const sc = new vi_slot_controller(hb,renderer);
sc.setDirection('out');  // up o out 

var warehouses;
var families;

controller.addObserver('','allCollectionsLoaded',(wh)=>{

         warehouses = objectModel.getUniqueFieldValues('warehouses', 'name');
         levelsArray = [warehouses.length];
         
         families = objectModel.getUniqueFieldValues('families', 'family');
         familiesArray = [families.length];

         var conf = {
            board:{
         
                type:"hipercircle",
                origin: {x:0, y:0, z:0},
                amplitude: 50,
                angle:0,
                levels: levelsArray,   //warehouses
                graphics:{
                    center:{amplitude:10, color:0x00ff00, transparent:true, opacity:0.5 }
                },
                content:
                {
                    board:{
                        type:"hipercircle",
                        origin: {x:0,y:0,z:0},
                        amplitude: 20,
                        angle: 0,
                        levels: familiesArray,   // families
                        graphics:{
                            center:{amplitude:20,color:0x00ff00, transparent:true, opacity:0.5},
                            line:{color:0x00ff00, transparent:true, opacity:0.5},
                            labels:{size:0.25, height:0.1}
                        },
                        content: {}
                    }
                }
         
            }
         }
         
          
         hb.addBoard(conf);
         hb.draw();
         
         hb.drawLabelsbyLevel(0,warehouses, -30);
         hb.drawLabelsbyLevel(1,families, 0);
         
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
        
      console.log('Inventario recibido, buscar slot');

       let  geomcfg = {
            "base": { "shape": "Circle", "radius": 1, "color":0xffff00 },
            "label": { "value": "inventario x", "x": 0, "y": 0, "z":0, size:0.1 },
            "columns": [
               { "units": { "shape": "Cylinder", x:0,y:0, z:0, "radiusTop": 0.1, "radiusBottom": 0.1, "height": units, "color": 0xff0000 } },
               { "variable2": { "shape": "Box", x:0.4,y:0, z:0.4, "width": 0.1, "height": 0.5, "depth": 0.1, "color": 0x0000ff } }
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
               units.scale.y = 2;
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






 