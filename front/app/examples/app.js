
import { vi_HiperCircle} from '../viOne/view/vi_hipercircle.js';
import { vi_geometry_factory } from '../viOne/view/vi_geometry_factory.js';
import {vi_3DSceneRenderer, vi_MapFactory ,vi_WindowFormater, vi_ObjectModel, vi_RemoteListenerFactory, vi_ObjectGridView, vi_Controller, vi_DataSource} from '../viOne/all.js';
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
      "apiKey": "AIzaSyDbr_Xm9PUO6972WLR-M-pQYJDmAwoYhUc",
      "authDomain": "visualsimulator-94cfb.firebaseapp.com",
      "databaseURL": "https://visualsimulator-94cfb-default-rtdb.firebaseio.com",
      "projectId": "visualsimulator-94cfb",
      "storageBucket": "visualsimulator-94cfb.appspot.com",
      "messagingSenderId": "336212786843",
      "appId": "1:336212786843:web:dcaf3ff686282c0ab6503e"
    },"collections" : [

         {
            "collection":"objeto",
            "collectionName" : "OBJETO",
            "loadType":"suscription"
         },
         {
            "collection":"objetos",
            "collectionName" : "OBJETOS",
            "geoField": "record.geom",
            "loadType":"suscription"

         },

      ]
    }


//filtro inicial :    
objectModel.setFilter('objetos','tipo','==', 'sucursales');

const dbDataSource = new vi_DataSource('Firebase', config);


 // Formatea div de objetos para que sea una ventana :
 windowFormater.formatWindow("#objeto_div","TIPO DE OBJETO",500,350);
 windowFormater.positionDiv("objeto_div",10,50);

 windowFormater.formatWindow("#objetos_div","OBJETOS",500,350);
 windowFormater.positionDiv("objetos_div",10,50);

 windowFormater.formatWindow("#graphics","3D",500,350);
 windowFormater.positionDiv("graphics",10,50);

 const objetoView = new vi_ObjectGridView('objeto','objeto_div',controller,
 ()=>{
    return "<th>ID</th><th>Tipo</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.id}</td><td>${data.fields.nombre}</td>`;
 });

 const objetosView = new vi_ObjectGridView('objetos','objetos_div',controller,
 ()=>{
    return "<th>ID</th><th>Nombre</th>";
 },
 (id,collection,data)=>{
    return `<td>${data.fields.id}</td><td>${data.fields.nombre}</td>`;
 });
     
 const dbRemoteListener = remoteListenerFactory.createRemoteListener(dbDataSource,objectModel);


 controller.addObserver('objeto',"objectSelected",filterObjects);
      



function filterObjects(domain, event, data){

      let objeto = objectModel.readObject(domain, data.id); 

      objectModel.setFilter('objetos','tipo','==', objeto.data.fields.id);


      windowFormater.setWindowTitle("#objetos_div", objeto.data.fields.nombre);

}


// MAPA

// Crea un Factory de Mapas
const mapFactory = new vi_MapFactory();

// Crea un mapa 
const map = mapFactory.createMap("Cesium", controller, ['objetos']);

// Formatea el contendor de mapa como ventana
windowFormater.formatWindow("#map_div","Mapa",500,350);

map.loadMap('map_div').then(()=>{

   var altura=65400;
   var radio=500;	


   map.addObjectGeometry('objetos', [
      {
         offset: {x:0, y:0, z:3500},
         cylinder : {
           length : altura,
            topRadius :  radio,
            bottomRadius : radio,
            material : map.MapLib.Color.fromCssColorString("#0000FF"),
            clampToGround: true,
         
      }},
   ]);

});
