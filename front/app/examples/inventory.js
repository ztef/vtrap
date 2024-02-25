
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import {vi_3DSceneRenderer ,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
import { vi_HiperBoard } from '../viOne/view/vi_hiperboard.js';

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
            "load":"shot"
         },

         {
         "collection":"families",
         "collectionName" : "FAMILIES",
         "load":"shot"
        },
         
   
        {
         "collection":"products",
         "collectionName" : "PRODUCTS",
         "load":"shot"
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

//renderer.focus(0,0,0,100);


var hb = new vi_HiperBoard(renderer);
var levelsArray;
var familiesArray;



controller.addObserver('','allCollectionsLoaded',(wh)=>{

         let warehouses = objectModel.getUniqueFieldValues('warehouses', 'name');
         levelsArray = [warehouses.length];
         
         let families = objectModel.getUniqueFieldValues('families', 'family');
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
         
         hb.drawLabels('.0',warehouses, -30);
         hb.drawLabels('0.0',families, 0);
         hb.drawLabels('1.0',families, 0);

         console.log("Mascara :", hb.mask);


         

});





 